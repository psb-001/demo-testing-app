import React, { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FED_NOTICES, type FedNotice } from '../fedData';
import {
  ActBtn,
  Card2,
  Chip,
  FedScreen,
  RecordCard,
  RecordList,
  Row,
  ScreenHeader,
  SectionTitle,
  type AlertTone,
} from '../fedUI';
import { useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Federation Notifications — ported from
 * workconnect/src/portals/fed/screens/Notifications.tsx.
 *
 * On the web this screen was reachable but absent from the `nav` array, so it
 * only appeared via the shell's bell or the dashboard's "All notifications"
 * button. It is registered in the mobile nav (see fedStore.FED_TABS), which is
 * why it is reachable directly.
 */

const ALERT_TONE_COLOR: Record<AlertTone, string> = {
  danger: colors.danger,
  warn: colors.alert,
  info: '#1D4E89',
  success: colors.cta,
};

type Filter = 'all' | 'unread' | 'updated';

export const FederationNotifications: React.FC = () => {
  const { go, readNotices, markNoticeRead, showToast } = useFedStore();
  const t = useFedT();
  const [filter, setFilter] = useState<Filter>('all');

  const unreadCount = FED_NOTICES.filter((n) => !readNotices.includes(n.id)).length;

  const visible = useMemo(() => {
    const list = [...FED_NOTICES];
    if (filter === 'unread') return list.filter((n) => !readNotices.includes(n.id));
    if (filter === 'updated') {
      // Danger-first, matching the web "updated" sort.
      return list.sort((a, b) => toneRank(a) - toneRank(b));
    }
    return list;
  }, [filter, readNotices]);

  const open = (notice: FedNotice) => {
    markNoticeRead(notice.id);
    go(notice.tab);
  };

  const markAll = () => {
    FED_NOTICES.forEach((n) => markNoticeRead(n.id));
    showToast('All federation notifications marked as read.');
  };

  return (
    <FedScreen>
      <ScreenHeader
        title={t('notifications')}
        subtitle="Operational alerts from across the federation network."
        action={<ActBtn label="Mark all read" tone="ghost" onPress={markAll} />}
      />

      <Row wrap>
        <Chip active={filter === 'all'} onPress={() => setFilter('all')}>All · {FED_NOTICES.length}</Chip>
        <Chip active={filter === 'unread'} onPress={() => setFilter('unread')} count={unreadCount}>Unread</Chip>
        <Chip active={filter === 'updated'} onPress={() => setFilter('updated')}>Needs attention</Chip>
      </Row>

      <RecordList isEmpty={visible.length === 0} emptyLabel="You are all caught up">
        {visible.map((notice) => {
          const read = readNotices.includes(notice.id);
          return (
            <RecordCard
              key={notice.id}
              title={notice.title}
              subtitle={notice.time}
              onPress={() => open(notice)}
              leading={
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: read ? '#CBD5E1' : ALERT_TONE_COLOR[notice.tone] },
                  ]}
                />
              }
              trailing={
                read ? null : <Text style={styles.unreadLabel}>NEW</Text>
              }
              fields={[{ label: 'Alert', value: notice.body }]}
            />
          );
        })}
      </RecordList>

      <Card2 style={{ gap: 8 }}>
        <SectionTitle>About these alerts</SectionTitle>
        <Text style={styles.about}>
          Federation alerts are raised from member society reporting: demand spikes that exceed available
          workforce, welfare enrollment gaps, expiring certifications, and emergency dispatch volume.
          Tap any alert to jump to the operational area that needs action.
        </Text>
        <View style={styles.legendRow}>
          {(['danger', 'warn', 'info', 'success'] as AlertTone[]).map((tone) => (
            <View key={tone} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: ALERT_TONE_COLOR[tone] }]} />
              <Text style={styles.legendText}>{tone}</Text>
            </View>
          ))}
        </View>
      </Card2>
    </FedScreen>
  );
};

/** Danger first, then warn, info, success. */
function toneRank(notice: FedNotice): number {
  return ['danger', 'warn', 'info', 'success'].indexOf(notice.tone);
}

const styles = StyleSheet.create({
  dot: { width: 9, height: 9, borderRadius: 5, marginTop: 5 },
  unreadLabel: { color: colors.danger, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 },
  about: { color: colors.sage, fontSize: 11, lineHeight: 16 },
  legendRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 9, height: 9, borderRadius: 5 },
  legendText: { color: colors.sage, fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
});