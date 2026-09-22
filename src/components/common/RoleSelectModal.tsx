import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { User, Wrench, Building2, CheckCircle2 } from 'lucide-react-native';
import { UserRole } from '../../types';
import { AppLanguage, mobileTranslations } from '../../data/mobileTranslations';
import { AppModal, Badge, Button } from '../../ui';
import {
  colors,
  radius,
  spacing,
  fontSize,
  cardShadow,
  roleAccent,
  roleAccentLight,
} from '../../theme';

interface RoleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentLang?: AppLanguage;
}

const isWeb = Platform.OS === 'web';

export const RoleSelectModal: React.FC<RoleSelectModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onSelectRole,
  currentLang = 'en',
}) => {
  const t = mobileTranslations[currentLang];

  useEffect(() => {
    if (!isOpen || !isWeb) return;
    const dom = globalThis as any;
    const handleKeyDown = (e: any) => {
      if (e.key === 'Escape') onClose();
    };
    dom.window.addEventListener('keydown', handleKeyDown);
    return () => dom.window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tipText =
    currentLang === 'hi'
      ? 'अनुभव युक्ति: ग्राहक पोर्टल में बुकिंग बनाएं, उसे स्वीकारने के लिए कारीगर में बदलें, और प्रेषण देखने के लिए सहकारी में जाएं!'
      : currentLang === 'mr'
      ? 'मार्गदर्शक टीप: ग्राहक पोर्टलवर बुकिंग तयार करा, स्वीकारण्यासाठी कामगार वर जा, आणि वाटप पाहण्यासाठी सहकारी पोर्टलवर जा!'
      : 'Platform Tip: Create a booking in Customer, switch to Worker to accept it, and switch to Cooperative to oversee the dispatch!';

  const continueBtnText =
    currentLang === 'hi'
      ? 'वर्तमान पोर्टल पर जारी रखें'
      : currentLang === 'mr'
      ? 'सध्याच्या पोर्टलवर सुरू ठेवा'
      : 'Continue in Current View';

  const roles: {
    id: UserRole;
    title: string;
    subtitle: string;
    accountName: string;
    description: string;
    badge: string;
  }[] = [
    {
      id: 'customer',
      title: t.roleSelect.customerTitle,
      subtitle: t.roleSelect.customerSub,
      accountName:
        currentLang === 'hi'
          ? 'पूजा शर्मा (कोथरूड, पुणे)'
          : currentLang === 'mr'
          ? 'पूजा शर्मा (कोथरूड, पुणे)'
          : 'Pooja Sharma (Kothrud, Pune)',
      description: t.roleSelect.customerDesc,
      badge:
        currentRole === 'customer'
          ? t.roleSelect.activeBadge
          : currentLang === 'hi'
          ? 'निवासी खाता'
          : currentLang === 'mr'
          ? 'रहिवासी खाते'
          : 'Resident Account',
    },
    {
      id: 'worker',
      title: t.roleSelect.workerTitle,
      subtitle: t.roleSelect.workerSub,
      accountName:
        currentLang === 'hi'
          ? 'रमेश जाधव (मुख्य इलेक्ट्रीशियन)'
          : currentLang === 'mr'
          ? 'रमेश जाधव (मुख्य इलेक्ट्रिशियन)'
          : 'Ramesh Jadhav (Master Electrician)',
      description: t.roleSelect.workerDesc,
      badge:
        currentRole === 'worker'
          ? t.roleSelect.activeBadge
          : currentLang === 'hi'
          ? 'पुणे सेंट्रल सदस्य'
          : currentLang === 'mr'
          ? 'पुणे सेंट्रल सदस्य'
          : 'Pune Central Member',
    },
    {
      id: 'cooperative',
      title: t.roleSelect.coopTitle,
      subtitle: t.roleSelect.coopSub,
      accountName: t.cooperative.overview.societyName,
      description: t.roleSelect.coopDesc,
      badge:
        currentRole === 'cooperative'
          ? t.roleSelect.activeBadge
          : currentLang === 'hi'
          ? 'वार्ड हब प्रशासन'
          : currentLang === 'mr'
          ? 'वॉर्ड हब प्रशासन'
          : 'Ward Hub Admin',
    },
  ];

  const roleIcon = (id: UserRole) => {
    const c = roleAccent[id];
    if (id === 'customer') return <User size={24} color={c} />;
    if (id === 'worker') return <Wrench size={24} color={c} />;
    return <Building2 size={24} color={c} />;
  };

  return (
    <AppModal
      visible={isOpen}
      onClose={onClose}
      title={t.roleSelect.title}
      subtitle={t.roleSelect.subtitle}
    >
      <View style={styles.body}>
        <View style={styles.tip}>
          <Text style={styles.tipText}>{tipText}</Text>
        </View>

        {roles.map((r) => {
          const isSelected = currentRole === r.id;
          const accent = roleAccent[r.id];
          return (
            <Pressable
              key={r.id}
              onPress={() => {
                onSelectRole(r.id);
                onClose();
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.roleCard,
                isSelected && {
                  backgroundColor: roleAccentLight[r.id],
                  borderColor: accent,
                },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.roleIconBox, isSelected && { backgroundColor: colors.surface }]}>
                {roleIcon(r.id)}
              </View>

              <View style={styles.roleBody}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleTitle} numberOfLines={1}>
                    {r.title}
                  </Text>
                  <Badge
                    color={isSelected ? accent : colors.slate600}
                    bg={isSelected ? colors.surface : colors.slate100}
                    border
                  >
                    {r.badge}
                  </Badge>
                </View>
                <Text style={[styles.roleAccount, { color: accent }]} numberOfLines={1}>
                  {r.accountName}
                </Text>
                <Text style={styles.roleSubtitle} numberOfLines={1}>
                  {r.subtitle}
                </Text>
                <Text style={styles.roleDesc}>{r.description}</Text>
              </View>

              {isSelected && (
                <View style={styles.roleCheck}>
                  <CheckCircle2 size={20} color={accent} />
                </View>
              )}
            </Pressable>
          );
        })}

        <Button block color={colors.slate900} onPress={onClose}>
          {continueBtnText}
        </Button>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  body: {
    gap: spacing.md,
  },
  tip: {
    padding: spacing.lg,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
  },
  tipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.card,
    borderWidth: 1.5,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    ...cardShadow,
  },
  pressed: {
    opacity: 0.9,
  },
  roleIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.slate50,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBody: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  roleTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    color: colors.textPrimary,
    flexShrink: 1,
    minWidth: 0,
  },
  roleAccount: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    marginTop: 2,
  },
  roleSubtitle: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 1,
  },
  roleDesc: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 16,
  },
  roleCheck: {
    alignSelf: 'center',
  },
});
