# Rojgar UI contract

Direction **A — shared chrome, role accent.** One surface system for all three
portals; role color is an accent only (primary CTA, active tab, chip/avatar
accent, 3px header rule). Semantic color means status, never decoration.

## Tokens (src/theme.ts is the only file with hex literals)

| Layer | Use | Cut |
| --- | --- | --- |
| Brand | emerald primary, white surfaces, slate text | full blue/purple screen themes |
| Role accent | customer blue · worker emerald · coop purple | re-theming whole surfaces |
| Status | success / warning / danger / info + light tints via `statusTone()` | per-file badge hex maps |
| Type | 11 · 13 · 15 · 18 · 24 — weights 500 / 700 / 800 | 9–10px body, weight 900, UPPERCASE spam |
| Radius | control 10 · card 14 · sheet 20 · pill full (status only) | ad-hoc 9/12/16/24 per file |
| Elevation | 1px border; one soft shadow on cards/hero only | shadows on chips, tabs, nested boxes |
| Spacing | 4-base · screen 16 · section gap 20 · card pad 16 | per-screen snowflake padding |

## Do

- Hex / spacing / radius / type only via `theme.ts` exports.
- Compose from `src/ui` primitives; extend there, not in the screen.
- One primary CTA and at most one hero treatment per screen.
- Pills for live status and filters only; everything else is type.
- Hierarchy from type scale + whitespace, not nested tinted boxes.
- Body text ≥ 13px; meta ≥ 11px for timestamps/IDs only.

## Don't

- Nested cards (inner content = divider or one tinted row).
- Shadow on non-interactive chrome.
- Decorative icon-per-bullet, glow blobs, radar rings, sparkle noise.
- New UPPERCASE micro-label styles.
- Local status→hex switches — call `statusTone()`.
- Font sizes under 11px for anything a user must read.

## Verify

```bash
npm run check:hex   # fails if hex literals appear outside theme.ts / assets
npx tsc --noEmit
```
