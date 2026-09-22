import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import {
  ShieldCheck,
  Building2,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
  LifeBuoy,
} from 'lucide-react-native';
import { AppLanguage, mobileTranslations } from '../../data/mobileTranslations';
import { AppModal } from '../../ui';

interface WorkerProfileProps {
  onResetData: () => void;
  currentLang?: AppLanguage;
}

export const WorkerProfile: React.FC<WorkerProfileProps> = ({ onResetData, currentLang = 'en' }) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const t = mobileTranslations[currentLang];

  return (
    <View style={styles.container}>
      {/* Profile Header Card */}
      <View style={styles.card}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
            }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {currentLang === 'hi' ? 'रमेश जाधव' : currentLang === 'mr' ? 'रमेश जाधव' : 'Ramesh Jadhav'}
              </Text>
              <View style={styles.coopOwnerBadge}>
                <ShieldCheck size={12} color="#059669" />
                <Text style={styles.coopOwnerBadgeText}>{t.worker.profile.coopOwner}</Text>
              </View>
            </View>
            <Text style={styles.roleText}>
              {currentLang === 'hi'
                ? 'प्रमाणित मुख्य इलेक्ट्रीशियन'
                : currentLang === 'mr'
                ? 'प्रमाणित मुख्य इलेक्ट्रिशियन'
                : 'Certified Master Electrician'}
            </Text>
            <Text style={styles.memberIdText}>{t.worker.profile.memberId}</Text>
          </View>
        </View>

        {/* Availability Switch */}
        <View style={styles.availabilityBox}>
          <View>
            <View style={styles.availabilityStatusRow}>
              <View style={[styles.statusDot, isAvailable ? styles.statusDotOn : styles.statusDotOff]} />
              <Text style={styles.availabilityStatus}>{t.worker.profile.availabilityStatus}</Text>
            </View>
            <Text style={styles.availabilitySub}>
              {isAvailable ? t.worker.profile.receivingRequests : t.worker.profile.pausedStatus}
            </Text>
          </View>

          <Pressable onPress={() => setIsAvailable(!isAvailable)} hitSlop={8}>
            {isAvailable ? (
              <ToggleRight size={36} color="#059669" fill="#d1fae5" />
            ) : (
              <ToggleLeft size={36} color="#94a3b8" />
            )}
          </Pressable>
        </View>
      </View>

      {/* Cooperative Membership Details */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Building2 size={16} color="#059669" />
          <Text style={styles.sectionHeaderText}>{t.worker.profile.governanceOverview}</Text>
        </View>

        <View style={styles.membershipContent}>
          <View style={styles.societyBox}>
            <Text style={styles.societyName}>{t.cooperative.overview.societyName}</Text>
            <Text style={styles.societyReg}>
              {t.cooperative.overview.regNumber} • {t.worker.profile.wardArea}
            </Text>
            <View style={styles.votingRow}>
              <Text style={styles.votingText}>
                {currentLang === 'hi'
                  ? 'स्वामित्व मतदान अधिकार: '
                  : currentLang === 'mr'
                  ? 'मालकी मतदान हक्क: '
                  : 'Ownership Voting Rights: '}
                <Text style={styles.votingStrong}>
                  {currentLang === 'hi'
                    ? '100 शेयर्स (श्रेणी अ)'
                    : currentLang === 'mr'
                    ? '100 शेअर्स (श्रेणी अ)'
                    : '100 Shares (Tier A)'}
                </Text>
              </Text>
              <Text style={styles.votingText}>
                {currentLang === 'hi'
                  ? 'लाभांश हिस्सा: '
                  : currentLang === 'mr'
                  ? 'नफा हिस्सा: '
                  : 'Profit Share: '}
                <Text style={styles.votingStrong}>
                  {currentLang === 'hi' ? 'सक्रिय' : currentLang === 'mr' ? 'सक्रिय' : 'Active'}
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValueDark}>88.0%</Text>
              <Text style={styles.statLabel}>{t.worker.profile.directTakeHome}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValueEmerald}>₹4,200</Text>
              <Text style={styles.statLabel}>
                {currentLang === 'hi'
                  ? 'Q2 सहकारी लाभांश'
                  : currentLang === 'mr'
                  ? 'Q2 सहकारी लाभांश'
                  : 'Q2 Co-op Dividend'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Worker Social Protections */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <ShieldCheck size={16} color="#059669" />
          <Text style={styles.sectionHeaderText}>{t.worker.profile.welfarePool}</Text>
        </View>

        <View style={styles.protectionList}>
          <View style={styles.protectionRow}>
            <View style={styles.protectionLabelWrap}>
              <CheckCircle size={14} color="#059669" />
              <Text style={styles.protectionText}>
                {currentLang === 'hi'
                  ? '₹5,00,000 स्वास्थ्य एवं दुर्घटना सुरक्षा'
                  : currentLang === 'mr'
                  ? '₹5,00,000 आरोग्य व अपघात संरक्षण'
                  : '₹5,00,000 Health & Accident Cover'}
              </Text>
            </View>
            <Text style={styles.activeBadge}>
              {currentLang === 'hi' ? 'सक्रिय' : currentLang === 'mr' ? 'सक्रिय' : 'Active'}
            </Text>
          </View>
          <View style={styles.protectionRow}>
            <View style={styles.protectionLabelWrap}>
              <CheckCircle size={14} color="#059669" />
              <Text style={styles.protectionText}>
                {currentLang === 'hi'
                  ? 'औजार बीमा एवं टूट-फूट कोष'
                  : currentLang === 'mr'
                  ? 'साहित्य विमा व नुकसान भरपाई निधी'
                  : 'Tool Insurance & Breakage Fund'}
              </Text>
            </View>
            <Text style={styles.activeBadge}>
              {currentLang === 'hi' ? 'सक्रिय' : currentLang === 'mr' ? 'सक्रिय' : 'Active'}
            </Text>
          </View>
          <View style={styles.protectionRow}>
            <View style={styles.protectionLabelWrap}>
              <CheckCircle size={14} color="#059669" />
              <Text style={styles.protectionText}>
                {currentLang === 'hi'
                  ? 'लोकतांत्रिक परिषद विवाद सुरक्षा'
                  : currentLang === 'mr'
                  ? 'लोकशाही परिषद तक्रार संरक्षण'
                  : 'Democratic Council Dispute Protection'}
              </Text>
            </View>
            <Text style={styles.activeBadge}>
              {currentLang === 'hi' ? 'सक्रिय' : currentLang === 'mr' ? 'सक्रिय' : 'Active'}
            </Text>
          </View>
        </View>
      </View>

      {/* Help & Contact Options */}
      <View style={styles.helpCard}>
        <Pressable
          onPress={() => setShowHelpModal(true)}
          style={({ pressed }) => [styles.helpBtn, pressed && styles.pressedDim]}
        >
          <LifeBuoy size={16} color="#059669" />
          <Text style={styles.helpBtnText}>
            {currentLang === 'hi'
              ? 'वार्ड समन्वयक आपातकालीन हेल्पलाइन'
              : currentLang === 'mr'
              ? 'वॉर्ड समन्वयक आपत्कालीन हेल्पलाइन'
              : 'Ward Dispatcher Emergency Helpline'}
          </Text>
        </Pressable>

        <Pressable onPress={onResetData} style={({ pressed }) => [pressed && styles.pressedDim]}>
          <Text style={styles.resetBtnText}>{t.worker.profile.resetAppDemo}</Text>
        </Pressable>
      </View>

      {/* Dispatch Help Modal */}
      <AppModal
        visible={showHelpModal}
        onClose={() => setShowHelpModal(false)}
        title={
          currentLang === 'hi'
            ? 'वार्ड 14 प्रेषण कार्यालय'
            : currentLang === 'mr'
            ? 'वॉर्ड 14 प्रेषण कार्यालय'
            : 'Ward 14 Dispatch Office'
        }
      >
        <Text style={styles.modalDesc}>
          {currentLang === 'hi'
            ? 'यदि कार्यस्थल पर सुरक्षा संबंधी समस्या, ग्राहक विवाद या वाहन खराबी हो, तो तुरंत कोथरूड सहकारी केंद्र अधिकारी से संपर्क करें:'
            : currentLang === 'mr'
            ? 'कामाच्या ठिकाणी सुरक्षा समस्या, ग्राहक वाद किंवा वाहन बिघाड झाल्यास, कोथरूड सहकारी केंद्र अधिकाऱ्याशी त्वरित संपर्क साधा:'
            : 'If you experience on-site safety issues, difficult customer disputes, or vehicle breakdowns, call the Kothrud Cooperative Hub officer immediately:'}
        </Text>
        <View style={styles.officerBox}>
          <Text style={styles.officerName}>
            {currentLang === 'hi'
              ? 'अधिकारी: आनंद शिंदे'
              : currentLang === 'mr'
              ? 'अधिकारी: आनंद शिंदे'
              : 'Officer: Anand Shinde'}
          </Text>
          <Text style={styles.officerPhone}>+91 98220 99881</Text>
          <Text style={styles.officerHours}>
            {currentLang === 'hi'
              ? 'प्रतिदिन सुबह 7:00 से रात 10:00 तक उपलब्ध'
              : currentLang === 'mr'
              ? 'दररोज सकाळी 7:00 ते रात्री 10:00 पर्यंत उपलब्ध'
              : 'Available 7:00 AM - 10:00 PM Daily'}
          </Text>
        </View>
        <Pressable
          onPress={() => setShowHelpModal(false)}
          style={({ pressed }) => [styles.modalCloseBtn, pressed && styles.pressedDim]}
        >
          <Text style={styles.modalCloseBtnText}>{t.common.close}</Text>
        </Pressable>
      </AppModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#059669',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  coopOwnerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  coopOwnerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#065f46',
  },
  roleText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
  },
  memberIdText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  availabilityBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  statusDotOn: {
    backgroundColor: '#10b981',
  },
  statusDotOff: {
    backgroundColor: '#94a3b8',
  },
  availabilityStatus: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  availabilitySub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  membershipContent: {
    gap: 8,
  },
  societyBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: 'rgba(167,243,208,0.6)',
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  societyName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#022c22',
  },
  societyReg: {
    fontSize: 11,
    color: '#065f46',
  },
  votingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 11,
    color: '#047857',
    borderTopWidth: 1,
    borderTopColor: 'rgba(167,243,208,0.6)',
    paddingTop: 8,
    gap: 8,
  },
  votingText: {
    fontSize: 11,
    color: '#047857',
    flexShrink: 1,
  },
  votingStrong: {
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    alignItems: 'center',
    minWidth: 0,
  },
  statValueDark: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  statValueEmerald: {
    fontSize: 14,
    fontWeight: '800',
    color: '#059669',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
    textAlign: 'center',
  },
  protectionList: {
    gap: 8,
  },
  protectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 8,
  },
  protectionLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  protectionText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    flexShrink: 1,
  },
  activeBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    flexShrink: 0,
  },
  helpCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  helpBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  resetBtnText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 8,
    fontWeight: '500',
  },
  modalDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  officerBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 4,
    marginTop: 12,
  },
  officerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
  },
  officerPhone: {
    fontSize: 12,
    color: '#475569',
  },
  officerHours: {
    fontSize: 10,
    color: '#94a3b8',
  },
  modalCloseBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  modalCloseBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  pressedDim: {
    opacity: 0.7,
  },
});