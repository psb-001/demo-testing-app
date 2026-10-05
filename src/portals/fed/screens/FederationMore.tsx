import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FED_NOTICES } from '../fedData';
import {
  ActBtn,
  Card2,
  CoopDemoTag,
  FedScreen,
  Grid,
  RecordCard,
  Row,
  ScreenHeader,
  SectionTitle,
  StatusBadge,
} from '../fedUI';
import { FED_NAV_GROUPS, FED_TAB_ICON, FED_TAB_LABEL_KEY, useFedStore, useFedT } from '../fedStore';
import { colors } from '../../../theme/theme';

/**
 * Federation "More" — the mobile answer to the web portal's 14-item sidebar.
 *
 * A bottom tab bar cannot hold 15 destinations, and the web version's fallback
 * (a horizontally-scrollable bottom bar showing all 14) is unusable on a phone.
 * So the five highest-traffic destinations get real tabs and everything else is
 * grouped here using the same four nav sections as the web sidebar.
 *
 * The four primary tabs are intentionally omitted from this list.
 */
const PRIMARY_TABS = new Set(['dashboard', 'societies', 'workforce', 'jobs']);

export const FederationMore: React.FC = () => {
  const { go, readNotices } = useFedStore();
  const t = useFedT();
  const unread = FED_NOTICES.filter((n) => !readNotices.includes(n.id)).length;

  return (
    <FedScreen>
      <ScreenHeader
        title="More"
        subtitle="Every remaining federation module, grouped the same way as the desktop portal."
        tag={<CoopDemoTag />}
      />

      {FED_NAV_GROUPS.map((group) => {
        const tabs = group.tabs.filter((tab) => !PRIMARY_TABS.has(tab));
        if (tabs.length === 0) return null;
        return (
          <View key={group.id}>
            <SectionTitle>{t(group.labelKey)}</SectionTitle>
            <Grid minWidth="46%">
              {tabs.map((tab) => (
                <Card2 key={tab} style={{ gap: 7 }}>
                  <Row>
                    <View style={styles.iconWrap}>
                      <Ionicons name={FED_TAB_ICON[tab]} size={15} color={colors.forest} />
                    </View>
                    <Text style={styles.tileTitle} numberOfLines={2}>{t(FED_TAB_LABEL_KEY[tab])}</Text>
                  </Row>
                  {tab === 'notifications' && unread > 0 ? (
                    <StatusBadge value={`${unread} unread`} tone="red" />
                  ) : null}
                  <ActBtn label="Open" tone="ghost" onPress={() => go(tab)} />
                </Card2>
              ))}
            </Grid>
          </View>
        );
      })}

      <View>
        <SectionTitle hint="Tap a notice to jump to the module that needs action.">Recent alerts</SectionTitle>
        <RecordCard
          title="Open the notifications centre"
          subtitle={`${unread} unread of ${FED_NOTICES.length}`}
          onPress={() => go('notifications')}
          badge={unread > 0 ? { label: `${unread} new`, tone: 'red' } : undefined}
          fields={[
            { label: 'Highest priority', value: FED_NOTICES[0]?.title ?? '—' },
            { label: 'Raised', value: FED_NOTICES[0]?.time ?? '—' },
          ]}
        />
      </View>
    </FedScreen>
  );
};

const styles = StyleSheet.create({
  iconWrap: { width: 30, height: 30, borderRadius: 10, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  tileTitle: { color: colors.ink, fontSize: 11, fontWeight: '900', flex: 1 },
});