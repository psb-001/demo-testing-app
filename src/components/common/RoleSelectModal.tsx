import React, { useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Platform } from 'react-native';
import { md3 } from '../../theme';
import { Host, BottomSheet } from '@expo/ui';
import { X, User, Wrench, Building2, CheckCircle2, Sparkles } from 'lucide-react-native';
import { UserRole } from '../../types';
import { AppLanguage, mobileTranslations } from '../../data/mobileTranslations';
import { Button } from '../../ui';

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
    icon: React.ReactNode;
    color: string;
    borderColor: string;
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
      icon: <User size={24} color={md3.colors.secondary} />,
      color: md3.colors.secondaryContainer,
      borderColor: md3.colors.secondary,
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
      icon: <Wrench size={24} color={md3.colors.primary} />,
      color: md3.colors.primaryContainer,
      borderColor: md3.colors.primary,
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
      icon: <Building2 size={24} color={md3.colors.tertiary} />,
      color: md3.colors.tertiaryContainer,
      borderColor: md3.colors.tertiary,
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

  return (
    <Host>
      <BottomSheet
        isPresented={isOpen}
        onDismiss={onClose}
        containerColor="#ffffff"
        contentPadding={0}
      >
        <View style={styles.sheet}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIconBox}>
                <Sparkles size={16} color="#5eead4" />
              </View>
              <View>
                <Text style={styles.headerTitle}>{t.roleSelect.title}</Text>
                <Text style={styles.headerSubtitle}>{t.roleSelect.subtitle}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} style={styles.headerClose}>
              <X size={20} color="#94a3b8" />
            </Pressable>
          </View>

          {/* Demo Guide Callout */}
          <View style={styles.tip}>
            <Text style={styles.tipText}>{tipText}</Text>
          </View>

          {/* Role Cards List */}
          <ScrollView
            style={[styles.rolesScroll, { maxHeight: 420 }]}
            contentContainerStyle={styles.rolesContent}
            showsVerticalScrollIndicator={false}
          >
            {roles.map((r) => {
              const isSelected = currentRole === r.id;
              return (
                <Pressable
                  key={r.id}
                  onPress={() => {
                    onSelectRole(r.id);
                    onClose();
                  }}
                  style={({ pressed }) => [
                    styles.roleCard,
                    {
                      backgroundColor: isSelected ? r.color : '#ffffff',
                      borderColor: isSelected ? r.borderColor : '#e2e8f0',
                    },
                    isSelected && styles.roleCardSelected,
                    pressed && styles.roleCardPressed,
                  ]}
                >
                  <View style={styles.roleIconBox}>{r.icon}</View>

                  <View style={styles.roleBody}>
                    <View style={styles.roleTitleRow}>
                      <Text style={styles.roleTitle} numberOfLines={1}>
                        {r.title}
                      </Text>
                      <Text style={styles.roleBadge} numberOfLines={1}>
                        {r.badge}
                      </Text>
                    </View>
                    <Text style={styles.roleAccount} numberOfLines={1}>
                      {r.accountName}
                    </Text>
                    <Text style={styles.roleDesc}>{r.description}</Text>
                  </View>

                  {isSelected && (
                    <View style={styles.roleCheck}>
                      <CheckCircle2 size={20} color="#0f766e" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Bottom footer button */}
          <View style={styles.footer}>
            <Button
              color="#0f766e"
              block
              onPress={onClose}
              textStyle={styles.continueText}
            >
              {continueBtnText}
            </Button>
          </View>
        </View>
      </BottomSheet>
    </Host>
  );
};

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#042f2e',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: 'rgba(20,184,166,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: 20,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#cbd5e1',
  },
  headerClose: {
    padding: 4,
    borderRadius: 999,
  },
  tip: {
    padding: 16,
    backgroundColor: 'rgba(240,253,250,0.7)',
    borderBottomWidth: 1,
    borderBottomColor: '#ccfbf1',
  },
  tipText: {
    fontSize: 12,
    color: '#042f2e',
    lineHeight: 18,
  },
  rolesScroll: {
    flexShrink: 1,
  },
  rolesContent: {
    padding: 16,
    gap: 12,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 2,
  },
  roleCardSelected: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  roleCardPressed: {
    opacity: 0.9,
  },
  roleIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    gap: 4,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    flexShrink: 1,
    minWidth: 0,
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    color: '#334155',
    flexShrink: 0,
    overflow: 'hidden',
  },
  roleAccount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#115e59',
    marginTop: 2,
  },
  roleDesc: {
    fontSize: 11,
    color: '#475569',
    marginTop: 4,
    lineHeight: 16,
  },
  roleCheck: {
    alignSelf: 'center',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#f8fafc',
    alignItems: 'flex-end',
  },
  continueText: {
    fontSize: 14,
    fontWeight: '700',
  },
});