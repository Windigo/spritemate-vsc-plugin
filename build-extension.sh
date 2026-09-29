#!/usr/bin/env bash
# Bouwt spritemate en pakt het als VS Code-extensie (.vsix).
#
# spritemate/ is een git-submodule die naar een exacte commit van
# github.com/Esshahn/spritemate wijst. "Updaten" = de submodule naar een
# nieuwere commit zetten en opnieuw bouwen.
#
# Gebruik:
#   ./build-extension.sh
#
# Updaten naar een nieuwe spritemate-versie:
#   (cd spritemate && git fetch origin && git checkout main)
#   git add spritemate
#   git commit -m "Update spritemate naar <versie>"
#   ./build-extension.sh
set -euo pipefail
cd "$(dirname "$0")"

echo "==> Updaten spritemate-submodule..."
git submodule update --init --recursive

echo "==> Bouwen spritemate (npm ci + build)..."
(cd spritemate && npm ci && npm run build)

echo "==> Kopiëren spritemate/dist -> media/"
rm -rf media
cp -R spritemate/dist media

echo "==> Packagen VSIX..."
npx --yes @vscode/vsce@latest package

echo ""
echo "Klaar: spritemate-*.vsix staat in deze map."
