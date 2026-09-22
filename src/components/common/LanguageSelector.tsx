import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Globe, Check, ChevronDown } from 'lucide-react-native';
import { Language } from '../../types';
import { colors, radius, spacing, fontSize, containerShadow } from '../../theme';

interface LanguageSelectorProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  compact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang,
  onLanguageChange,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<any>(null);

  const languages = [
    { code: 'en' as Language, label: 'English', native: 'English', short: 'EN' },
    { code: 'hi' as Language, label: 'Hindi', native: 'हिंदी', short: 'हिं' },
    { code: 'mr' as Language, label: 'Marathi', native: 'मराठी', short: 'मरा' },
  ];

  const activeLang = languages.find(l => l.code === currentLang) || languages[0];

  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    if (!isWeb) return;
    const dom = globalThis as any;
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    dom.document.addEventListener('mousedown', handleClickOutside);
    return () => dom.document.removeEventListener('mousedown', handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.root} ref={dropdownRef}>
      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        accessibilityRole="button"
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Globe size={14} color={colors.emerald} />
        <Text style={styles.triggerText}>
          {compact ? activeLang.short : `${activeLang.native}`}
        </Text>
        <ChevronDown
          size={12}
          color={colors.textSecondary}
          style={isOpen ? styles.chevronOpen : undefined}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.menu}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuHeaderText}>Select Language</Text>
          </View>
          {languages.map((lang) => {
            const isSelected = lang.code === currentLang;
            return (
              <Pressable
                key={lang.code}
                onPress={() => {
                  onLanguageChange(lang.code);
                  setIsOpen(false);
                }}
                style={({ pressed }) => [
                  styles.langOption,
                  isSelected && styles.langOptionSelected,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.langLabels}>
                  <Text style={[styles.langNative, isSelected && styles.langNativeSelected]}>
                    {lang.native}
                  </Text>
                  <Text style={styles.langLabel}>{lang.label}</Text>
                </View>
                {isSelected && <Check size={14} color={colors.emerald} />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    alignSelf: 'flex-start',
    zIndex: 50,
    elevation: 50,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.slate100,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 32,
  },
  triggerText: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    color: colors.slate800,
  },
  chevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  pressed: {
    opacity: 0.82,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: spacing.sm,
    width: 176,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    ...containerShadow,
  },
  menuHeader: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  menuHeaderText: {
    fontSize: fontSize.xs,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.control,
    minHeight: 44,
  },
  langOptionSelected: {
    backgroundColor: colors.emeraldLight,
  },
  langLabels: {
    flexDirection: 'column',
  },
  langNative: {
    fontSize: fontSize.xs,
    fontWeight: '500',
    color: colors.slate700,
  },
  langNativeSelected: {
    color: colors.emeraldDark,
    fontWeight: '700',
  },
  langLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
});
