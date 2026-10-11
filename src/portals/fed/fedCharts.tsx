import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { colors } from '../../theme/theme';

/**
 * Federation charts, ported from workconnect/src/portals/fed/fedCharts.tsx.
 *
 * The web version was hand-rolled SVG + CSS specifically to avoid a charting
 * dependency, and that is preserved here: `react-native-svg` maps the SVG
 * elements 1:1 (Svg/Path/Circle/Line/Text/Defs/LinearGradient/Stop), while the
 * bar-based charts that were plain `<div>`s with percentage widths are now
 * `View`s with flex widths — no chart library either way.
 *
 * Visual differences from the web version are deliberate mobile adaptations:
 *  - `LineChart` measures its own width via `onLayout` instead of a fixed
 *    viewBox, so it fills the card at any screen width.
 *  - `HBarList` and `GroupedBarChart` use `expo-linear-gradient`-free flat
 *    fills (the theme gradient is approximated with two adjacent Views would be
 *    noise); solid brand colours are used instead of the CSS gradient.
 *  - Label thins out more aggressively on narrow screens so ticks never overlap.
 */

/** Brand green used for primary bars and the default series colour. */
const BRAND = '#168A5B';
const BRAND_DEEP = '#0F766E';
const AMBER = '#F59E0B';

export const LineChart: React.FC<{
  points: { label: string; value: number; phase?: string }[];
  height?: number;
  colorMap?: Record<string, string>;
  valueSuffix?: string;
  /** Force a width instead of measuring. Mostly useful in tests. */
  width?: number;
}> = ({ points, height = 170, colorMap, valueSuffix = '', width: forcedWidth }) => {
  const [measured, setMeasured] = React.useState(forcedWidth ?? 0);
  const width = forcedWidth ?? measured;
  const gradientId = React.useId().replace(/:/g, '');

  if (points.length < 2) return null;

  const minValue = Math.min(...points.map((p) => p.value));
  const maxValue = Math.max(...points.map((p) => p.value));
  const range = maxValue - minValue || 1;
  const pad = 12;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2 - 14;
  const x = (i: number) => pad + (i / (points.length - 1)) * innerW;
  const y = (v: number) => pad + innerH - ((v - minValue) / range) * innerH;
  const defaultColor = BRAND;

  // Each segment is coloured by the phase of the point it arrives at, matching
  // the web chart so historical/current/predicted runs stay distinct.
  const segments = points.slice(0, -1).map((point, i) => {
    const next = points[i + 1];
    const color = colorMap?.[next.phase ?? point.phase ?? 'default'] ?? defaultColor;
    return { i, d: `M${x(i)},${y(point.value)} L${x(i + 1)},${y(next.value)}`, color };
  });

  const area =
    points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`)
      .join(' ') +
    ` L${x(points.length - 1).toFixed(1)},${(pad + innerH).toFixed(1)} L${pad.toFixed(1)},${(pad + innerH).toFixed(1)} Z`;

  // Thin labels so they never collide on a narrow phone.
  const tickEvery = Math.max(1, Math.ceil(points.length / (width < 300 ? 4 : 7)));
  const lastIndex = points.length - 1;

  const body = (
    <Svg
      width={width || undefined}
      height={height}
      accessibilityLabel={`Trend from ${minValue}${valueSuffix} to ${maxValue}${valueSuffix}`}
      accessibilityRole="image"
    >
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={BRAND} stopOpacity={0.18} />
          <Stop offset="100%" stopColor={BRAND} stopOpacity={0.02} />
        </LinearGradient>
      </Defs>
      {[0.25, 0.5, 0.75, 1].map((ratio) => (
        <Line
          key={ratio}
          x1={pad}
          x2={Math.max(pad, width - pad)}
          y1={pad + innerH * ratio}
          y2={pad + innerH * ratio}
          stroke="#E8EEEA"
          strokeWidth={1}
        />
      ))}
      <Path d={area} fill={`url(#${gradientId})`} />
      {segments.map((segment) => (
        <Path
          key={segment.i}
          d={segment.d}
          fill="none"
          stroke={segment.color}
          strokeWidth={2.4}
          strokeLinecap="round"
        />
      ))}
      {points.map((p, i) => {
        const phase = colorMap?.[p.phase ?? 'default'] ?? defaultColor;
        return (
          <Circle
            key={`${p.label}-${i}`}
            cx={x(i)}
            cy={y(p.value)}
            r={i === lastIndex ? 4 : 2.7}
            fill={phase}
            stroke="#fff"
            strokeWidth={1.3}
          />
        );
      })}
      {points.map((p, i) =>
        i % tickEvery === 0 || i === lastIndex ? (
          <SvgText
            key={`t-${i}`}
            x={x(i)}
            y={height - 1}
            fontSize={9}
            fill="#94A3B8"
            textAnchor={i === lastIndex ? 'end' : i === 0 ? 'start' : 'middle'}
          >
            {p.label}
          </SvgText>
        ) : null,
      )}
    </Svg>
  );

  if (width) return body;
  return (
    <View onLayout={(e) => setMeasured(e.nativeEvent.layout.width)}>
      {width ? body : <View style={{ height }} />}
    </View>
  );
};

export const HBarList: React.FC<{
  rows: { label: string; value: number; max?: number; right?: string; tone?: string }[];
  /** Bar fill colour; defaults to the brand green. */
  barColor?: string;
}> = ({ rows, barColor = BRAND }) => {
  const fallbackMax = Math.max(...rows.map((x) => x.value)) || 1;
  return (
    <View>
      {rows.map((r) => {
        const max = r.max ?? fallbackMax;
        const pct = Math.min(100, (r.value / (max || 1)) * 100);
        return (
          <View key={r.label} style={styles.hbarBlock}>
            <View style={styles.hbarHeader}>
              <Text style={styles.hbarLabel} numberOfLines={1}>{r.label}</Text>
              <Text style={styles.hbarValue}>{r.right ?? `${r.value}`}</Text>
            </View>
            <View style={styles.hbarTrack}>
              <View
                style={[styles.hbarFill, { width: `${pct}%`, backgroundColor: r.tone ?? barColor }]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

/**
 * Two bars per row (e.g. expected demand vs available workforce) with a signed
 * gap on the right. A positive gap (surplus) is green, a shortfall red.
 */
export const GroupedBarChart: React.FC<{
  rows: { label: string; primary: number; secondary: number; primaryLabel: string; secondaryLabel: string }[];
}> = ({ rows }) => {
  const max = Math.max(...rows.flatMap((r) => [r.primary, r.secondary]), 1);
  return (
    <View accessibilityLabel="Demand and available workforce comparison" accessibilityRole="image">
      {rows.map((row) => {
        const diff = row.primary - row.secondary;
        const shortage = diff > 0;
        return (
          <View key={row.label} style={styles.groupedRow}>
            <View style={styles.groupedBars}>
              <Text style={styles.groupedLabel} numberOfLines={1}>{row.label}</Text>
              <View style={styles.groupedTrack}>
                <View style={styles.groupedMetaRow}>
                  <Text style={styles.groupedMetaLabel}>{row.primaryLabel}</Text>
                  <View style={styles.groupedTrackInner}>
                    <View style={[styles.groupedFill, { width: `${(row.primary / max) * 100}%`, backgroundColor: BRAND }]} />
                  </View>
                </View>
                <View style={styles.groupedMetaRow}>
                  <Text style={styles.groupedMetaLabel}>{row.secondaryLabel}</Text>
                  <View style={styles.groupedTrackInner}>
                    <View style={[styles.groupedFill, { width: `${(row.secondary / max) * 100}%`, backgroundColor: AMBER }]} />
                  </View>
                </View>
              </View>
              <Text style={[styles.groupedGap, shortage ? styles.groupedGapShort : styles.groupedGapSurplus]}>
                {shortage ? `−${diff}` : `+${row.secondary - row.primary}`}
              </Text>
            </View>
          </View>
        );
      })}
      <View style={styles.legendRow}>
        <LegendRow items={[{ color: BRAND, label: 'Expected demand' }, { color: AMBER, label: 'Available workers' }]} />
      </View>
    </View>
  );
};

/** Proportional ring, used for welfare coverage. */
export const Donut: React.FC<{ pct: number; size?: number; color?: string; label?: string }> = ({
  pct,
  size = 110,
  color = BRAND,
  label,
}) => {
  const r = 40;
  const c = 2 * Math.PI * r;
  const filled = Math.min(100, Math.max(0, pct));
  const ring = (
    <Svg width={size} height={size} viewBox="0 0 100 100" accessibilityLabel={`${filled}%`} accessibilityRole="image">
      <Circle cx="50" cy="50" r={r} fill="none" stroke="#E6F3EC" strokeWidth={11} />
      <Circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={11}
        strokeLinecap="round"
        strokeDasharray={`${(filled / 100) * c} ${c}`}
        transform="rotate(-90 50 50)"
      />
      <SvgText x="50" y="55" fontSize={17} fontWeight="800" fill={colors.ink} textAnchor="middle">
        {`${filled}%`}
      </SvgText>
    </Svg>
  );
  if (!label) return ring;
  return (
    <View style={styles.donutRow}>
      {ring}
      <Text style={styles.donutLabel}>{label}</Text>
    </View>
  );
};

export const LegendRow: React.FC<{ items: { color: string; label: string }[] }> = ({ items }) => (
  <View style={styles.legendWrap}>
    {items.map((l) => (
      <View key={l.label} style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: l.color }]} />
        <Text style={styles.legendText}>{l.label}</Text>
      </View>
    ))}
  </View>
);

/**
 * Single stacked bar (e.g. the 92 / 6 / 2 worker-payout split, or verification
 * states per trade). Segments are proportional to `value`.
 */
export const StackedBar: React.FC<{
  segments: { label: string; value: number; color: string }[];
  total?: number;
  height?: number;
  showLabels?: boolean;
}> = ({ segments, total, height = 10, showLabels = false }) => {
  const sum = total ?? (segments.reduce((acc, s) => acc + s.value, 0) || 1);
  return (
    <View>
      <View style={[styles.stackTrack, { height, borderRadius: height / 2 }]}>
        {segments.map((s, i) => (
          <View
            key={s.label}
            style={{
              width: `${Math.max(0, (s.value / sum) * 100)}%`,
              backgroundColor: s.color,
              borderTopLeftRadius: i === 0 ? height / 2 : 0,
              borderBottomLeftRadius: i === 0 ? height / 2 : 0,
              borderTopRightRadius: i === segments.length - 1 ? height / 2 : 0,
              borderBottomRightRadius: i === segments.length - 1 ? height / 2 : 0,
            }}
          />
        ))}
      </View>
      {showLabels ? (
        <View style={styles.legendWrap}>
          {segments.map((s) => (
            <View key={s.label} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: s.color }]} />
              <Text style={styles.legendText}>
                {s.label} {Math.round((s.value / sum) * 100)}%
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

export const CHART_COLORS = { brand: BRAND, brandDeep: BRAND_DEEP, amber: AMBER };

const styles = StyleSheet.create({
  hbarBlock: { marginBottom: 10 },
  hbarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  hbarLabel: { color: colors.sage, fontSize: 11, fontWeight: '700', flex: 1, marginRight: 8 },
  hbarValue: { color: colors.ink, fontSize: 11, fontWeight: '800' },
  hbarTrack: { height: 8, borderRadius: 4, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  hbarFill: { height: '100%', borderRadius: 4 },
  groupedRow: { marginBottom: 10 },
  groupedBars: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  groupedLabel: { width: 74, color: colors.ink, fontSize: 11, fontWeight: '800' },
  groupedTrack: { flex: 1, gap: 4 },
  groupedMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  groupedMetaLabel: { width: 46, color: colors.sage, fontSize: 8, fontWeight: '700' },
  groupedTrackInner: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#F1F5F9', overflow: 'hidden' },
  groupedFill: { height: '100%', borderRadius: 4 },
  groupedGap: { width: 42, textAlign: 'right', fontSize: 11, fontWeight: '900' },
  groupedGapShort: { color: colors.danger },
  groupedGapSurplus: { color: BRAND },
  legendRow: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 8, marginTop: 2 },
  legendWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: colors.sage, fontSize: 10, fontWeight: '600' },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  donutLabel: { color: colors.sage, fontSize: 11, fontWeight: '700', flex: 1, lineHeight: 16 },
  stackTrack: { flexDirection: 'row', overflow: 'hidden', backgroundColor: '#F1F5F9' },
});