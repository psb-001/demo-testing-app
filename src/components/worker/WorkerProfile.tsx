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
import { AppModal, Badge, Button, Card, PrimaryButton, Section, SectionTitle, StatBox } from '../../ui';
import { colors, radius, spacing, fontSize, roleAccent } from '../../theme';

interface WorkerProfileProps {
  onResetData: () => void;
  currentLang?: AppLanguage;
}

const accent = roleAccent.worker;

export const WorkerProfile: React.FC<WorkerProfileProps> = ({ onResetData, currentLang = 'en' }) => {
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const t = mobileTranslations[currentLang];

  const activeLabel = currentLang === 'hi' ? 'सक्रिय' : currentLang === 'mr' ? 'सक्रिय' : 'Active';

  const protections =
    currentLang === 'hi'
      ? ['₹5,00,000 स्वास्थ्य एवं दुर्घटना सुरक्षा', 'औजार बीमा एवं टूट-फूट कोष', 'लोकतांत्रिक परिषद विवाद सुरक्षा']
      : currentLang === 'mr'
      ? ['₹5,00,000 आरोग्य व अपघात संरक्षण', 'साहित्य विमा व नुकसान भरपाई निधी', 'लोकशाही परिषद तक्रार संरक्षण']
      : ['₹5,00,000 Health & Accident Cover', 'Tool Insurance & Breakage Fund', 'Democratic Council Dispute Protection'];

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
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
              <Badge color={colors.successFg} bg={colors.successLight}>
                {t.worker.profile.coopOwner}
              </Badge>
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

        <View style={styles.availabilityBox}>
          <View>
            <View style={styles.availabilityStatusRow}>
              <View style={[styles.statusDot, { backgroundColor: isAvailable ? colors.success : colors.textMuted }]} />
              <Text style={styles.availabilityStatus}>{t.worker.profile.availabilityStatus}</Text>
            </View>
            <Text style={styles.availabilitySub}>
              {isAvailable ? t.worker.profile.receivingRequests : t.worker.profile.pausedStatus}
            </Text>
          </View>

          <Pressable
            onPress={() => setIsAvailable(!isAvailable)}
            hitSlop={8}
            accessibilityRole="switch"
            accessibilityState={{ checked: isAvailable }}
          >
            {isAvailable ? (
              <ToggleRight size={36} color={accent} fill={colors.emeraldLight} />
            ) : (
              <ToggleLeft size={36} color={colors.textMuted} />
            )}
          </Pressable>
        </View>
      </Card>

      <Card style={styles.membershipCard}>
        <View style={styles.sectionHeader}>
          <Building2 size={16} color={accent} />
          <SectionTitle>{t.worker.profile.governanceOverview}</SectionTitle>
        </View>

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
              <Text style={styles.votingStrong}>{activeLabel}</Text>
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatBox label={t.worker.profile.directTakeHome} value="88.0%" color={colors.textPrimary} />
          <StatBox
            label={
              currentLang === 'hi'
                ? 'Q2 सहकारी लाभांश'
                : currentLang === 'mr'
                ? 'Q2 सहकारी लाभांश'
                : 'Q2 Co-op Dividend'
            }
            value="₹4,200"
            color={accent}
          />
        </View>
      </Card>

      <Card style={styles.protectionCard}>
        <View style={styles.sectionHeader}>
          <ShieldCheck size={16} color={accent} />
          <SectionTitle>{t.worker.profile.welfarePool}</SectionTitle>
        </View>

        <View style={styles.protectionList}>
          {protections.map((label) => (
            <View key={label} style={styles.protectionRow}>
              <View style={styles.protectionLabelWrap}>
                <CheckCircle size={14} color={accent} />
                <Text style={styles.protectionText}>{label}</Text>
              </View>
              <Badge color={colors.emeraldDark} bg={colors.emeraldLight}>
                {activeLabel}
              </Badge>
            </View>
          ))}
        </View>
      </Card>

      <Card style={styles.helpCard}>
        <Button
          block
          variant="soft"
          color={accent}
          onPress={() => setShowHelpModal(true)}
        >
          <View style={styles.helpBtnInner}>
            <LifeBuoy size={16} color={accent} />
            <Text style={styles.helpBtnText}>
              {currentLang === 'hi'
                ? 'वार्ड समन्वयक आपातकालीन हेल्पलाइन'
                : currentLang === 'mr'
                ? 'वॉर्ड समन्वयक आपत्कालीन हेल्पलाइन'
                : 'Ward Dispatcher Emergency Helpline'}
            </Text>
          </View>
        </Button>

        <Pressable onPress={onResetData} style={({ pressed }) => [pressed && styles.pressedDim]}>
          <Text style={styles.resetBtnText}>{t.worker.profile.resetAppDemo}</Text>
        </Pressable>
      </Card>

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
        <PrimaryButton
          label={t.common.close}
          color={colors.slate900}
          onPress={() => setShowHelpModal(false)}
        />
      </AppModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.lg,
  },
  profileCard: {
    gap: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: accent,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: accent,
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
    fontSize: fontSize.lg,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  roleText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  memberIdText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  availabilityBox: {
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
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
    borderRadius: radius.full,
  },
  availabilityStatus: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
  },
  availabilitySub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  membershipCard: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  societyBox: {
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: radius.control,
    padding: spacing.md,
    gap: spacing.xs,
  },
  societyName: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  societyReg: {
    fontSize: fontSize.xs,
    color: colors.successFg,
  },
  votingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.success,
    paddingTop: spacing.sm,
    gap: spacing.sm,
  },
  votingText: {
    fontSize: fontSize.xs,
    color: colors.emeraldDark,
    flexShrink: 1,
  },
  votingStrong: {
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  protectionCard: {
    gap: spacing.sm,
  },
  protectionList: {
    gap: spacing.sm,
  },
  protectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    backgroundColor: colors.slate50,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  protectionLabelWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  protectionText: {
    fontSize: fontSize.xs,
    color: colors.slate700,
    fontWeight: '500',
    flexShrink: 1,
  },
  helpCard: {
    gap: spacing.sm,
  },
  helpBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  helpBtnText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: accent,
  },
  resetBtnText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: spacing.sm,
    fontWeight: '500',
  },
  modalDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  officerBox: {
    backgroundColor: colors.slate50,
    padding: spacing.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
    marginVertical: spacing.md,
  },
  officerName: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.slate800,
  },
  officerPhone: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  officerHours: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  pressedDim: {
    opacity: 0.7,
  },
});
