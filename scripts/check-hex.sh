#!/bin/sh
# Guardrail: hex color literals may only live in src/theme.ts.
# Screens and primitives must use theme tokens (colors/statusTone/roleAccent).
set -eu

matches=$(rg --no-filename -o '#[0-9a-fA-F]{3,8}\b' src -g '!theme.ts' || true)

if [ -n "$matches" ]; then
  count=$(printf '%s\n' "$matches" | wc -l | tr -d ' ')
  echo "check-hex FAILED: $count hex literal(s) outside src/theme.ts"
  rg -c '#[0-9a-fA-F]{3,8}\b' src -g '!theme.ts' || true
  exit 1
fi

echo "check-hex OK: no hex literals outside src/theme.ts"
