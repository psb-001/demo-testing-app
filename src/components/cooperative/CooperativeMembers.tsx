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
import { Card, TextField, Chip, AppModal } from '../../ui';
import { AppLanguage, mobileTranslations, getLocalizedTrade } from '../../data/mobileTranslations';

interface CooperativeMembersProps {
  members: Worker[];
  onAddMember: (newMember: Omit<Worker, 'id'>) => void;
  currentLang?: AppLanguage;
}

export const CooperativeMembers: React.FC<CooperativeMembersProps> = ({
  members,
  onAddMember,
  currentLang = 'en'
}) => {
  const [search, setSearch] = useState('');
  const [filterTrade, setFilterTrade] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = mobileTranslations[currentLang];

  // Form State
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
      {/* Header & Add Button */}
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>{t.cooperative.members.title}</Text>
            <Text style={styles.headerCount}>{members.length}</Text>
          </View>
          <Text style={styles.headerSubtitle}>{t.cooperative.members.subtitle}</Text>
        </View>

        <Pressable
          onPress={() => setIsModalOpen(true)}
          style={styles.enrollBtn}
        >
          <UserPlus size={14} color="#ffffff" />
          <Text style={styles.enrollBtnText}>{t.cooperative.members.enrollWorkerBtn}</Text>
        </Pressable>
      </View>

      {/* Search and Trade Filter */}
      <View style={styles.searchFilterWrap}>
        <View style={styles.searchWrap}>
          <View style={styles.searchIconWrap} pointerEvents="none">
            <Search size={16} color="#94a3b8" />
          </View>
          <TextField
            value={search}
            onChangeText={setSearch}
            placeholder={t.cooperative.members.searchPlaceholder}
            inputStyle={styles.searchInput}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterChips}>
          {['all', 'electrician', 'plumber', 'carpenter', 'cleaning', 'appliance'].map((tradeKey) => (
            <Chip
              key={tradeKey}
              label={getLocalizedTrade(tradeKey, currentLang)}
              selected={filterTrade === tradeKey}
              color="#7c3aed"
              onPress={() => setFilterTrade(tradeKey)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Member Cards */}
      <View style={styles.memberList}>
        {filteredMembers.map((member) => (
          <Card key={member.id} style={styles.memberCard}>
            <View style={styles.memberTop}>
              <View style={styles.avatarBlock}>
                <Text style={styles.avatarText}>{member.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.memberInfo}>
                <View style={styles.memberNameRow}>
                  <Text style={styles.memberName} numberOfLines={1}>{member.name}</Text>
                  <Text style={[
                    styles.availabilityBadge,
                    member.availability === 'available' ? styles.availabilityOn : styles.availabilityOff
                  ]}>
                    {member.availability === 'available' ? t.cooperative.members.activeShift : t.cooperative.members.offShift}
                  </Text>
                </View>

                <Text style={styles.memberTrade}>
                  {getLocalizedTrade(member.primaryTrade, currentLang)}
                </Text>

                <View style={styles.memberMetaRow}>
                  <Text style={styles.memberRating}>
                    <Star size={12} color="#f59e0b" fill="#f59e0b" />
                    {' '}{member.rating} ({member.reviewsCount})
                  </Text>
                  <Text style={styles.memberMetaDot}>•</Text>
                  <Text style={styles.memberJobs}>{t.cooperative.members.jobsDone.replace('{count}', String(member.completedJobs))}</Text>
                </View>
              </View>
            </View>

            <View style={styles.memberDetailStrip}>
              <View style={styles.localityGroup}>
                <MapPin size={14} color="#94a3b8" />
                <Text style={styles.localityText}>{member.locality}</Text>
              </View>
              <View style={styles.feeGroup}>
                <Text style={styles.baseVisitLabel}>{t.cooperative.members.baseVisit}</Text>
                <Text style={styles.baseVisitValue}>₹{member.baseVisitFee}</Text>
              </View>
            </View>

            <View style={styles.memberBottomRow}>
              <Text style={styles.shareholderText}>
                <ShieldCheck size={14} color="#059669" /> {t.cooperative.members.equalShareholder}
              </Text>
              {member.phone && (
                <Pressable onPress={() => Linking.openURL(`tel:${member.phone}`)}>
                  <Text style={styles.callText}>
                    <Phone size={12} color="#334155" /> {currentLang === 'hi' ? 'कॉल करें' : currentLang === 'mr' ? 'कॉल करा' : 'Call Member'}
                  </Text>
                </Pressable>
              )}
            </View>
          </Card>
        ))}
      </View>

      {/* Enroll Member Modal */}
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
                  color="#059669"
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
            <Pressable
              onPress={() => setIsModalOpen(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelBtnText}>{t.cooperative.members.cancelBtn}</Text>
            </Pressable>
            <Pressable
              onPress={handleSubmitNewMember}
              style={styles.confirmBtn}
            >
              <Text style={styles.confirmBtnText}>{t.cooperative.members.confirmBtn}</Text>
            </Pressable>
          </View>
        </View>
      </AppModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
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
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerCount: {
    fontSize: 12,
    backgroundColor: '#f1f5f9',
    color: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    fontWeight: '700',
    overflow: 'hidden',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  enrollBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  enrollBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  searchFilterWrap: {
    gap: 8,
  },
  searchWrap: {
    position: 'relative',
  },
  searchIconWrap: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 2,
  },
  searchInput: {
    paddingLeft: 36,
  },
  filterChips: {
    gap: 6,
    paddingBottom: 4,
  },
  memberList: {
    gap: 12,
  },
  memberCard: {
    padding: 14,
    gap: 10,
  },
  memberTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatarBlock: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7c3aed',
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
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flexShrink: 1,
  },
  availabilityBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    overflow: 'hidden',
  },
  availabilityOn: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  availabilityOff: {
    backgroundColor: '#f1f5f9',
    color: '#475569',
  },
  memberTrade: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  memberMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  memberRating: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: '700',
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberMetaDot: {
    fontSize: 12,
    color: '#475569',
  },
  memberJobs: {
    fontSize: 12,
    color: '#475569',
  },
  memberDetailStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 8,
  },
  localityGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  localityText: {
    fontSize: 12,
    color: '#475569',
    flexShrink: 1,
  },
  feeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  baseVisitLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  baseVisitValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
  },
  memberBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    gap: 8,
  },
  shareholderText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '500',
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  callText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '700',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalForm: {
    gap: 12,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  tradeChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tradeChip: {
    marginBottom: 4,
  },
  modalFieldRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modalFieldHalf: {
    flex: 1,
    minWidth: 0,
  },
  shareNotice: {
    backgroundColor: '#f5f3ff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
  },
  shareNoticeText: {
    fontSize: 11,
    color: '#581c87',
    lineHeight: 16,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  confirmBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
});