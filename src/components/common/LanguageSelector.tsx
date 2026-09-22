import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { Globe, Check, ChevronDown } from 'lucide-react-native';
import { Language } from '../../types';

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
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Globe size={14} color="#0d9488" />
        <Text style={styles.triggerText}>
          {compact ? activeLang.short : `${activeLang.native}`}
        </Text>
        <ChevronDown
          size={12}
          color="#64748b"
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
                {isSelected && <Check size={14} color="#0d9488" />}
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.8)',
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
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
    marginTop: 8,
    width: 176,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    paddingVertical: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
  },
  menuHeader: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  menuHeaderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  langOptionSelected: {
    backgroundColor: '#f0fdfa',
  },
  langLabels: {
    flexDirection: 'column',
  },
  langNative: {
    fontSize: 12,
    fontWeight: '500',
    color: '#334155',
  },
  langNativeSelected: {
    color: '#115e59',
    fontWeight: '600',
  },
  langLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
});