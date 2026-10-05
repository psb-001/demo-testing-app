/**
 * Translation completeness + structure check (development tooling).
 *
 *   npm run i18n:check
 *
 * Three kinds of problem are reported:
 *  1. Missing    — a key present in English but absent from a locale.
 *  2. Untranslated — a locale still holds the English string verbatim.
 *  3. Structure  — a leaf sits at the top level instead of inside a
 *     namespace, or an unknown namespace exists. A cross-locale diff cannot
 *     catch this: a misplaced key is wrong in all three files at once, so all
 *     locales agree with each other and look complete.
 *
 * The runtime in src/i18n/index.tsx independently falls back to English and
 * warns in development; this script is the batch view of the same problems.
 */
import en from '../src/i18n/en';
import hi from '../src/i18n/hi';
import mr from '../src/i18n/mr';

/** Flatten a nested tree into dotted key paths. */
function flatten(tree: unknown, prefix = '', out = new Map<string, string>()) {
  if (tree && typeof tree === 'object' && !Array.isArray(tree)) {
    for (const [key, value] of Object.entries(tree as Record<string, unknown>)) {
      flatten(value, prefix ? `${prefix}.${key}` : key, out);
    }
  } else if (typeof tree === 'string') {
    out.set(prefix, tree as string);
  }
  return out;
}

const enFlat = flatten(en);
const locales: Record<string, unknown> = { hi, mr };

/** "Rozgar" and pure placeholders legitimately stay identical across locales. */
const isBrandOnly = (value: string) => /^Rozgar[\s.,·—-]*$/i.test(value.trim());

/** The namespaces the product is allowed to define at the top level. */
const KNOWN_NAMESPACES = new Set([
  'common', 'navigation', 'auth', 'customer', 'worker', 'cooperative',
  'federation', 'booking', 'payments', 'welfare', 'maps', 'ai',
  'notifications', 'errors', 'settings', 'home', 'services', 'hero',
  'language', 'meta', 'footer',
]);

let structuralErrors = 0;
for (const [code, tree] of [['en', en], ...Object.entries(locales)] as const) {
  for (const [key, value] of Object.entries(tree as Record<string, unknown>)) {
    if (typeof value === 'string') {
      structuralErrors++;
      console.log(`\n  [${code}] STRUCTURE: "${key}" is a top-level leaf, not a namespace.`);
      console.log(`      It belongs inside one (e.g. auth.${key}) — all three locales share the mistake.`);
    } else if (!KNOWN_NAMESPACES.has(key)) {
      structuralErrors++;
      console.log(`\n  [${code}] STRUCTURE: unknown namespace "${key}".`);
    }
  }
}

let totalMissing = 0;

console.log(`\nRozgar i18n completeness — ${enFlat.size} English keys\n${'='.repeat(58)}`);

for (const [code, tree] of Object.entries(locales)) {
  const flat = flatten(tree);
  const missing: string[] = [];
  const untranslated: string[] = [];

  for (const [key, english] of enFlat) {
    const value = flat.get(key);
    if (value === undefined) missing.push(key);
    else if (value === english && !isBrandOnly(english) && !/^\{[\w]+\}$/.test(english)) {
      untranslated.push(key);
    }
  }
  const extra = [...flat.keys()].filter((k) => !enFlat.has(k));

  totalMissing += missing.length;
  console.log(`\n[${code}] ${flat.size} keys · ${missing.length} missing · ${untranslated.length} same-as-English · ${extra.length} extra`);

  if (missing.length) {
    console.log(`\n  Missing ${code} translation:`);
    for (const key of missing) console.log(`    - ${key}`);
  }
  if (untranslated.length) {
    console.log(`\n  Still identical to English (${code}):`);
    for (const key of untranslated) console.log(`    - ${key}`);
  }
  if (extra.length) {
    console.log(`\n  Keys not present in English (${code}):`);
    for (const key of extra) console.log(`    - ${key}`);
  }
}

console.log(`\n${'='.repeat(58)}`);
if (structuralErrors) console.log(`FAIL — ${structuralErrors} structural error(s) (a key is at the wrong nesting level).\n`);
if (totalMissing) console.log(`FAIL — ${totalMissing} missing translation(s).\n`);
if (!structuralErrors && !totalMissing) {
  console.log('PASS — structure is correct and every English key has a Hindi and Marathi translation.\n');
}
process.exit(structuralErrors === 0 && totalMissing === 0 ? 0 : 1);
