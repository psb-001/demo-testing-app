/**
 * Font wiring for the Rozgar app.
 *
 * Why this exists: `App.tsx` originally injected a single global family
 * (`PlusJakartaSans_400Regular`) into `Text.defaultProps`, so every string in
 * the app rendered in Plus Jakarta Sans. That font has no Devanagari glyphs, so
 * adding trilingual support (en / hi / mr) would have rendered all Hindi and
 * Marathi copy as tofu boxes.
 *
 * Plus Jakarta Sans still reads better for Latin text, so we keep it for `en` and
 * swap to Noto Sans Devanagari for `hi`/`mr` (which also covers Latin, so
 * numbers and trade names stay consistent within a Hindi or Marathi screen).
 *
 * `applyDefaultFont` mutates `Text.defaultProps` because the codebase sets
 * weights with `fontWeight: '800'` rather than by naming a family. Rather than
 * touching ~25 screens, the default family is switched whenever the active
 * language changes.
 */
import { Text } from 'react-native';
import type { Lang } from '../i18n';

/** Regular-weight family used for each language. */
export const FONT_FAMILY: Record<Lang, string> = {
  en: 'PlusJakartaSans_400Regular',
  hi: 'NotoSansDevanagari_400Regular',
  mr: 'NotoSansDevanagari_400Regular',
};

/**
 * The family a language's glyphs require. Kept separate from `FONT_FAMILY` so
 * call sites that need an explicit family (charts, SVG <Text>, webview HTML)
 * can ask without importing the i18n types.
 */
export function fontFamilyForLang(lang: Lang | string | undefined): string {
  return lang === 'hi' || lang === 'mr' ? FONT_FAMILY.mr : FONT_FAMILY.en;
}

type TextDefaults = { defaultProps?: { style?: unknown; [key: string]: unknown } };

/**
 * Point the global `Text` default at the family required by `lang`, preserving
 * any existing default style. Safe to call repeatedly.
 */
export function applyDefaultFont(lang: Lang): void {
  const textDefaults = Text as unknown as TextDefaults;
  const currentStyle = textDefaults.defaultProps?.style;
  const inherited: unknown[] = Array.isArray(currentStyle)
    ? currentStyle
    : currentStyle
      ? [currentStyle]
      : [];
  textDefaults.defaultProps = {
    ...textDefaults.defaultProps,
    style: [{ fontFamily: FONT_FAMILY[lang] ?? FONT_FAMILY.en }, ...inherited],
  };
}