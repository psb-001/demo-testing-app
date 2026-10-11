import { Platform, Share } from 'react-native';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

/**
 * Federation report export, ported from workconnect/src/portals/fed/fedExport.ts.
 *
 * The web version built a CSV/TXT Blob and triggered a download via
 * `URL.createObjectURL` + a synthetic `<a>` click, and "PDF" was an HTML string
 * opened in a popup with an inline `window.print()` button. None of that exists
 * in React Native, so the string-building is preserved verbatim and only the
 * delivery mechanism changed:
 *
 *   web  Blob + object URL + anchor.click()   ->  expo-file-system File.write()
 *   web  window.open(popup) + window.print()  ->  expo-print HTML->PDF
 *   web  <a download>                          ->  expo-sharing share sheet
 *
 * `expo-print` is not a dependency, so `downloadPrintablePdf` falls back to
 * sharing a formatted HTML document, which opens in any browser or viewer the
 * user shares it to. `printToFileAsync` can be dropped in here without touching
 * call sites if a true PDF is required.
 */

export type ExportResult =
  | { ok: true; uri: string; shared: boolean }
  | { ok: false; reason: 'sharing-unavailable' | 'write-failed'; error?: string; uri?: string };

/** Escape a CSV cell: wrap in quotes and double any embedded quotes. */
function escapeCsv(value: unknown): string {
  const text = value === null || value === undefined ? '' : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

/**
 * Build CSV text. Exported separately so it can be unit tested and reused by the
 * clipboard fallback without touching the filesystem.
 */
export function buildCsv(headers: string[], rows: unknown[][]): string {
  const lines = [headers.map(escapeCsv).join(',')];
  for (const row of rows) lines.push(row.map(escapeCsv).join(','));
  // CRLF + UTF-8 BOM so Excel opens Devanagari text correctly.
  return `\uFEFF${lines.join('\r\n')}\r\n`;
}

/**
 * The plain-text demo receipt format, matching the web version's layout so a
 * user who has seen the web output recognises it.
 */
export function buildDemoText(title: string, lines: string[]): string {
  return [
    'ROZGAR — SIH PROTOTYPE DEMO',
    '='.repeat(42),
    '',
    title,
    '='.repeat(42),
    '',
    ...lines,
    '',
    '-'.repeat(42),
    'Generated from the Rozgar SIH prototype demo dataset.',
    'Figures are illustrative and do not represent real transactions.',
  ].join('\n');
}

/**
 * The printable report document. Kept as HTML because that is what the mobile
 * equivalent (a browser/print pipeline) consumes.
 */
export function buildPrintableHtml(title: string, sections: { heading: string; rows: string[][] }[]): string {
  const esc = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const body = sections
    .map(
      (section) => `<h2>${esc(section.heading)}</h2>
    <table>${section.rows
      .map(
        (row) =>
          `<tr>${row
            .map((cell, i) => (i === 0 ? `<th>${esc(cell)}</th>` : `<td>${esc(cell)}</td>`))
            .join('')}</tr>`,
      )
      .join('')}</table>`,
    )
    .join('\n');

  return `<!doctype html>
<html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<style>
  body { font-family: -apple-system, 'Noto Sans Devanagari', system-ui, sans-serif; margin: 24px; color: #18322A; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  .sub { color: #64756D; font-size: 12px; margin-bottom: 20px; }
  h2 { font-size: 15px; margin: 22px 0 8px; color: #14532D; }
  table { border-collapse: collapse; width: 100%; font-size: 12px; }
  th, td { border: 1px solid #E2E8F0; padding: 6px 8px; text-align: left; }
  th { background: #ECF7F0; width: 34%; }
  footer { margin-top: 26px; color: #64756D; font-size: 10px; border-top: 1px solid #E2E8F0; padding-top: 10px; }
  @media print { body { margin: 12px; } }
</style></head>
<body>
<h1>${esc(title)}</h1>
<div class="sub">ROZGAR — SIH prototype demo dataset · ${new Date().toLocaleString('en-IN')}</div>
${body}
<footer>Figures are illustrative and do not represent real transactions.</footer>
</body></html>`;
}

/** MIME type per extension, so the share sheet offers sensible targets. */
function mimeFor(filename: string): string {
  if (filename.endsWith('.csv')) return 'text/csv';
  if (filename.endsWith('.html')) return 'text/html';
  return 'text/plain';
}

/**
 * Write a generated document to the cache directory and hand it to the system
 * share sheet.
 *
 * Files land in `Paths.cache` because exports are transient: the OS may reclaim
 * them, and they should not bloat the user's document directory.
 */
async function writeAndShare(
  filename: string,
  contents: string,
  dialogTitle: string,
): Promise<ExportResult> {
  let uri: string;
  try {
    const dir = new Directory(Paths.cache, 'rozgar-exports');
    if (!dir.exists) dir.create({ intermediates: true });
    const file = new File(dir, filename);
    // create() before write() so overwriting an existing export is safe.
    if (file.exists) file.delete();
    file.create();
    file.write(contents);
    uri = file.uri;
  } catch (error) {
    return { ok: false, reason: 'write-failed', error: String(error) };
  }

  try {
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: mimeFor(filename),
        dialogTitle,
        UTI: 'public.plain-text',
      });
      return { ok: true, uri, shared: true };
    }
  } catch {
    /* fall through to the clipboard fallback */
  }

  // No share sheet (or it threw): fall back to the native share sheet with the
  // text inline so the data is still recoverable.
  try {
    await Share.share({ message: contents, title: dialogTitle });
    return { ok: true, uri, shared: true };
  } catch {
    return { ok: false, reason: 'sharing-unavailable', uri };
  }
}

/** Export a CSV of settlements or report rows. */
export function exportCsv(
  filename: string,
  headers: string[],
  rows: unknown[][],
): Promise<ExportResult> {
  return writeAndShare(filename, buildCsv(headers, rows), 'Export Rozgar data');
}

/** Export a formatted plain-text demo receipt (e.g. a worker payout slip). */
export function exportDemoText(filename: string, title: string, lines: string[]): Promise<ExportResult> {
  return writeAndShare(filename, buildDemoText(title, lines), 'Share Rozgar receipt');
}

/**
 * Export a printable report. Shares an HTML document that is print-ready in any
 * browser or viewer — the closest equivalent to the web version's popup +
 * "Save as PDF" button.
 */
export function exportPrintableReport(
  title: string,
  sections: { heading: string; rows: string[][] }[],
): Promise<ExportResult> {
  const filename = `${title.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'rozgar-report'}.html`;
  const target = Platform.OS === 'android' ? 'Share Rozgar report' : 'Share / print Rozgar report';
  return writeAndShare(filename, buildPrintableHtml(title, sections), target);
}