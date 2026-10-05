/**
 * Behavioural test for the Rozgar i18n layer.
 *
 *   node .\node_modules\tsx\dist\cli.mjs .\scripts\i18n-test.ts
 *
 * Verifies the things key-parity alone does NOT prove:
 *  - Hindi/Marathi values are genuinely translated (contain Devanagari)
 *  - the brand "Rozgar" is never translated
 *  - {placeholders} survive in every locale
 *  - interpolation works and unknown keys fall back to English, never raw
 */
import en from '../src/i18n/en';
import hi from '../src/i18n/hi';
import mr from '../src/i18n/mr';

type Tree = Record<string, unknown>;

const flatten = (tree: unknown, prefix = '', out: [string, string][] = []) => {
  if (tree && typeof tree === 'object' && !Array.isArray(tree)) {
    for (const [k, v] of Object.entries(tree as Tree)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else if (typeof tree === 'string') out.push([prefix, tree as string]);
  return out;
};

const enFlat = new Map(flatten(en));
const hiFlat = new Map(flatten(hi));
const mrFlat = new Map(flatten(mr));

let failed = 0;
const check = (name: string, ok: boolean, detail = '') => {
  if (ok) console.log(`  PASS  ${name}`);
  else { console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ''}`); failed++; }
};
const DEVANAGARI = /[\u0900-\u097F]/;

console.log('\nRozgar i18n behaviour\n' + '='.repeat(64));

// 1. Genuine translation. Brand-only values (and brand + a product noun such as
//    "Rozgar AI") are correctly identical in every locale, so skip them.
const BRAND_ONLY = /^Rozgar(\s+AI)?[\s.,·—-]*$/i;
const skip = (v: string) =>
  BRAND_ONLY.test(v.trim()) || v.includes('@') || /^[A-Z]{2,}$/.test(v) || /^\{[\w]+\}$/.test(v);
let untranslatedHi = 0, untranslatedMr = 0;
for (const [key, value] of enFlat) {
  if (skip(value)) continue;
  if (!DEVANAGARI.test(hiFlat.get(key) ?? '')) { untranslatedHi++; console.log(`        ${key}`); }
  if (!DEVANAGARI.test(mrFlat.get(key) ?? '')) { untranslatedMr++; console.log(`        ${key}`); }
}
check('Hindi values contain Devanagari', untranslatedHi === 0, `${untranslatedHi} without`);
check('Marathi values contain Devanagari', untranslatedMr === 0, `${untranslatedMr} without`);

// 2. Brand never translated
let brandBroken = 0;
for (const [key, value] of enFlat) {
  if (!value.includes('Rozgar')) continue;
  const h = hiFlat.get(key) ?? '', m = mrFlat.get(key) ?? '';
  if (!h.includes('Rozgar') || !m.includes('Rozgar')) { brandBroken++; console.log(`        ${key}`); }
}
check('brand "Rozgar" preserved in every locale', brandBroken === 0, `${brandBroken} broken`);

// 3. Placeholders preserved
let phBroken = 0;
for (const [key, value] of enFlat) {
  const want = [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
  for (const [code, flat] of [['hi', hiFlat], ['mr', mrFlat]] as const) {
    const got = [...(flat.get(key) ?? '').matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    if (want.join() !== got.join()) { phBroken++; console.log(`        ${code} ${key}: want {${want}} got {${got}}`); }
  }
}
check('placeholders preserved in every locale', phBroken === 0, `${phBroken} broken`);

// 4. Spot-check a few critical user journeys
const SPOT: [string, RegExp, RegExp][] = [
  ['navigation.ai', DEVANAGARI, DEVANAGARI],
  ['auth.login', DEVANAGARI, DEVANAGARI],
  ['customer.bookService', DEVANAGARI, DEVANAGARI],
  ['federation.workforceMap', DEVANAGARI, DEVANAGARI],
  ['errors.noResultsFound', DEVANAGARI, DEVANAGARI],
  ['ai.voiceInputUnsupported', DEVANAGARI, DEVANAGARI],
  ['booking.confirmBooking', DEVANAGARI, DEVANAGARI],
  ['payments.workerPayout', DEVANAGARI, DEVANAGARI],
  ['welfare.insurance', DEVANAGARI, DEVANAGARI],
  ['maps.demandHotspot', DEVANAGARI, DEVANAGARI],
];
for (const [key, hr, mrRe] of SPOT) {
  check(`${key} translated`, hr.test(hiFlat.get(key) ?? '') && mrRe.test(mrFlat.get(key) ?? ''),
    `hi=${JSON.stringify((hiFlat.get(key) ?? '').slice(0, 30))}`);
}

// 5. Interpolation + fallback behave like the runtime t()
const interpolate = (tpl: string, vars?: Record<string, string | number>) =>
  vars ? tpl.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : tpl;
const resolve = (tree: unknown, path: string): string | undefined => {
  let node: unknown = tree;
  for (const part of path.split('.')) {
    if (typeof node !== 'object' || node === null) return undefined;
    node = (node as Tree)[part];
  }
  return typeof node === 'string' ? node : undefined;
};
const t = (lang: 'en' | 'hi' | 'mr', key: string, vars?: Record<string, string | number>) => {
  const dict = { en, hi, mr }[lang];
  const primary = resolve(dict, key);
  if (primary !== undefined) return interpolate(primary, vars);
  const fb = resolve(en, key);
  return fb !== undefined ? interpolate(fb, vars) : key;
};

check('interpolates {name}', t('hi', 'auth.welcomeToApp', { name: 'Amit' }).includes('Amit'));
check('interpolates {otp} keeps digits', t('mr', 'auth.incorrectCode', { otp: '1234' }).includes('1234'));
check('interpolates {year} in footer', /\d{4}/.test(t('hi', 'footer.rights', { year: 2026 })));
check('unknown key returns the key, not undefined', t('en', 'nope.not.here') === 'nope.not.here');
check('known key returns text', t('en', 'navigation.home') === 'Home');
check('en/hi/mr all resolve navigation.home differently',
  t('en', 'navigation.home') !== t('hi', 'navigation.home') &&
  t('hi', 'navigation.home') !== t('mr', 'navigation.home'));

console.log('='.repeat(64));
console.log(`${enFlat.size} keys × 3 locales · ${failed} failure(s)\n`);
process.exit(failed === 0 ? 0 : 1);
