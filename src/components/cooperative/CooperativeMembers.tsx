import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Linking } from 'react-native';
import { Worker } from '../../types';
import {
  UserPlus,
  Search,
  Phone,
  Star,
  ShieldCheck,
  MapPin
} from 'lucide-react-native';
import { Badge, Button, Card, Chip, AppModal, EmptyState, TextField, Title, Subtitle, ToneBadge } from '../../ui';
import { AppLanguage, mobileTranslations, getLocalizedTrade } from '../../data/mobileTranslations';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface CooperativeMembersProps {
  members: Worker[];
  onAddMember: (newMember: Omit<Worker, 'id'>) => void;
  currentLang?: AppLanguage;
}

const accent = roleAccent.cooperative;

export const CooperativeMembers: React.FC<CooperativeMembersProps> = ({
  members,
  onAddMember,
  currentLang = 'en'
}) => {
  const [search, setSearch] = useState('');
  const [filterTrade, setFilterTrade] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = mobileTranslations[currentLang];

  const [name, setName] = useState('');
  const [primaryTrade, setPrimaryTrade] = useState('electrician');
  const [primaryTradeLabel, setPrimaryTradeLabel] = useState('Electrician');
  const [phone, setPhone] = useState('+91 98220 ');
  const [locality, setLocality] = useState('Kothrud, Pune');
  const [baseVisitFee, setBaseVisitFee] = useState(299);

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                          m.locality.toLowerCase().includes(search.toLowerCase());
    const matchesTrade = filterTrade === 'all' || m.primaryTrade.toLowerCase() === filterTrade.toLowerCase();
    return matchesSearch && matchesTrade;
  });

  const handleSubmitNewMember = () => {
    if (!name.trim()) return;

    onAddMember({
      name: name.trim(),
      primaryTrade,
      primaryTradeLabel: primaryTradeLabel || primaryTrade,
      phone,
      rating: 5.0,
      reviewsCount: 1,
      completedJobs: 0,
      distanceKm: 0.8,
      etaMinutes: 10,
      baseVisitFee: Number(baseVisitFee),
      workerPayoutPercent: 88,
      cooperativeRole: 'Co-op Worker-Owner',
      cooperativeSociety: 'Pune Central Electricians Cooperative Society Ltd.',
      wardHub: 'Kothrud Ward Hub #12',
      memberSince: '2026',
      languages: ['Marathi', 'Hindi'],
      shortBio: 'Newly enrolled certified member of Pune Central Electricians Co-op Society.',
      locality,
      skills: [primaryTradeLabel, 'Safety Certified', 'Co-op Trained'],
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      availability: 'available'
    });

    setName('');
    setIsModalOpen(false);
  };

  const labelMap: Record<string, string> = {
    electrician: 'Master Electrician',
    plumber: 'Sanitary Plumber',
    carpenter: 'Furniture Carpenter',
    cleaning: 'Deep Cleaning Specialist',
    appliance: 'Appliance Technician'
  };

  const tradeOptions: { key: string; label: string }[] = [
    { key: 'electrician', label: getLocalizedTrade('electrician', currentLang) },
    { key: 'plumber', label: getLocalizedTrade('plumber', currentLang) },
    { key: 'carpenter', label: getLocalizedTrade('carpenter', currentLang) },
    { key: 'cleaning', label: getLocalizedTrade('cleaning', currentLang) },
    { key: 'appliance', label: getLocalizedTrade('appliances', currentLang) }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <View style={styles.headerTitleRow}>
            <Title style={styles.headerTitle}>{t.cooperative.members.title}</Title>
            <Badge color={colors.slate700} bg={colors.slate100}>
              {members.length}
            </Badge>
          </View>
          <Subtitle>{t.cooperative.members.subtitle}</Subtitle>
        </View>

        <Button color={accent} onPress={() => setIsModalOpen(true)}>
          <View style={styles.enrollBtnInner}>
            <UserPlus size={14} color={colors.white} />
            <Text style={styles.enrollBtnText}>{t.cooperative.members.enrollWorkerBtn}</Text>
          </View>
        </Button>
      </View>

      <View style={styles.searchFilterWrap}>
        <View style={styles.searchWrap}>
          <Search size={16} color={colors.textMuted} />
          <TextField
            value={search}
            onChangeText={setSearch}
            placeholder={t.cooperative.members.searchPlaceholder}
            style={styles.searchField}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          {['all', 'electrician', 'plumber', 'carpenter', 'cleaning', 'appliance'].map((tradeKey) => (
            <Chip
              key={tradeKey}
              label={getLocalizedTrade(tradeKey, currentLang)}
              selected={filterTrade === tradeKey}
              color={accent}
              onPress={() => setFilterTrade(tradeKey)}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.memberList}>
        {filteredMembers.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Search size={32} color={colors.slate300} />}
              title={t.cooperative.members.searchPlaceholder}
            />
          </Card>
        ) : (
          filteredMembers.map((member) => (
            <Card key={member.id} style={styles.memberCard}>
              <View style={styles.memberTop}>
                <View style={styles.avatarBlock}>
                  <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={styles.memberInfo}>
                  <View style={styles.memberNameRow}>
                    <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>
                    <ToneBadge
                      tone={
                        member.availability === 'available'
                          ? { fg: colors.successFg, bg: colors.successLight }
                          : { fg: colors.neutralFg, bg: colors.slate100 }
                      }
                      label={member.availability === 'available' ? t.cooperative.members.activeShift : t.cooperative.members.offShift}
                    />
                  </View>

                  <Text style={styles.memberTrade}>
                    {getLocalizedTrade(member.primaryTrade, currentLang)}
                  </Text>

                  <View style={styles.memberMetaRow}>
                    <View style={styles.ratingRow}>
                      <Star size={12} color={colors.amber} fill={colors.amber} />
                      <Text style={styles.memberRating}>{member.rating} ({member.reviewsCount})</Text>
                    </View>
                    <Text style={styles.memberMetaDot}>•</Text>
                    <Text style={styles.memberJobs}>{t.cooperative.members.jobsDone.replace('{count}', String(member.completedJobs))}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.memberDetailStrip}>
                <View style={styles.localityGroup}>
                  <MapPin size={14} color={colors.textMuted} />
                  <Text style={styles.localityText}>{member.locality}</Text>
                </View>
                <View style={styles.feeGroup}>
                  <Text style={styles.baseVisitLabel}>{t.cooperative.members.baseVisit}</Text>
                  <Text style={styles.baseVisitValue}>₹{member.baseVisitFee}</Text>
                </View>
              </View>

              <View style={styles.memberBottomRow}>
                <View style={styles.shareholderRow}>
                  <ShieldCheck size={14} color={colors.success} />
                  <Text style={styles.shareholderText}>
                    {t.cooperative.members.equalShareholder}
                  </Text>
                </View>
                {member.phone && (
                  <Pressable
                    onPress={() => Linking.openURL(`tel:${member.phone}`)}
                    style={({ pressed }) => [styles.callBtn, pressed && styles.pressed]}
                  >
                    <Phone size={12} color={colors.slate700} />
                    <Text style={styles.callText}>
                      {currentLang === 'hi' ? 'कॉल करें' : currentLang === 'mr' ? 'कॉल करा' : 'Call Member'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </Card>
          ))
        )}
      </View>

      <AppModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t.cooperative.members.addModalTitle}
      >
        <View style={styles.modalForm}>
          <TextField
            label={t.cooperative.members.fullName}
            value={name}
            onChangeText={setName}
            placeholder="e.g., Santosh Patil"
          />

          <View>
            <Text style={styles.fieldLabel}>{t.cooperative.members.trade}</Text>
            <View style={styles.tradeChips}>
              {tradeOptions.map((opt) => (
                <Chip
                  key={opt.key}
                  label={opt.label}
                  selected={primaryTrade === opt.key}
                  color={accent}
                  onPress={() => {
                    setPrimaryTrade(opt.key);
                    setPrimaryTradeLabel(labelMap[opt.key] || 'Specialist');
                  }}
                  style={styles.tradeChip}
                />
              ))}
            </View>
          </View>

          <TextField
            label={t.cooperative.members.locality}
            value={locality}
            onChangeText={setLocality}
          />

          <View style={styles.modalFieldRow}>
            <View style={styles.modalFieldHalf}>
              <TextField
                label={t.cooperative.members.phone}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.modalFieldHalf}>
              <TextField
                label={t.cooperative.members.baseFee}
                value={String(baseVisitFee)}
                onChangeText={(text) => setBaseVisitFee(Number(text))}
                keyboardType="numeric"
              />
            </View>
          </View>

          <View style={styles.shareNotice}>
            <Text style={styles.shareNoticeText}>{t.cooperative.members.shareNotice}</Text>
          </View>

          <View style={styles.modalActions}>
            <Button
              variant="outline"
              color={colors.slate700}
              style={styles.modalActionFlex}
              onPress={() => setIsModalOpen(false)}
            >
              {t.cooperative.members.cancelBtn}
            </Button>
            <Button
              color={accent}
              style={styles.modalActionFlex}
              onPress={handleSubmitNewMember}
            >
              {t.cooperative.members.confirmBtn}
            </Button>
          </View>
        </View>
      </AppModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  pressed: {
    opacity: 0.85,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerTextWrap: {
    flexShrink: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: fontSize.sm,
  },
  enrollBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  enrollBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.white,
  },
  searchFilterWrap: {
    gap: spacing.sm,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchField: {
    flex: 1,
  },
  filterChips: {
    gap: 6,
    paddingBottom: spacing.xs,
  },
  memberList: {
    gap: spacing.md,
  },
  memberCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  memberTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  avatarBlock: {
    width: 48,
    height: 48,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.purpleLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    color: accent,
  },
  memberInfo: {
    flex: 1,
    minWidth: 0,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  memberName: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    flexShrink: 1,
  },
  memberTrade: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  memberMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  memberRating: {
    fontSize: fontSize.xs,
    color: colors.warningFg,
    fontWeight: '700',
  },
  memberMetaDot: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  memberJobs: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  memberDetailStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  localityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  localityText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    flexShrink: 1,
  },
  feeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  baseVisitLabel: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
  },
  baseVisitValue: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.emeraldDark,
  },
  memberBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  shareholderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flexShrink: 1,
  },
  shareholderText: {
    fontSize: fontSize.xs,
    color: colors.emeraldDark,
    fontWeight: '500',
    flexShrink: 1,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: 32,
  },
  callText: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    fontWeight: '700',
  },
  modalForm: {
    gap: spacing.md,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  tradeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tradeChip: {
    marginBottom: spacing.xs,
  },
  modalFieldRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modalFieldHalf: {
    flex: 1,
    minWidth: 0,
  },
  shareNotice: {
    backgroundColor: colors.purpleLight,
    padding: spacing.sm,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shareNoticeText: {
    fontSize: fontSize.xs,
    color: colors.purpleDark,
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingTop: spacing.sm,
  },
  modalActionFlex: {
    flex: 1,
  },
});
