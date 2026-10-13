#!/usr/bin/env bash
# ==============================================================================
# GlobeTrek Holidays - 1-Click GitHub Repository Upload Helper
# ==============================================================================

set -e
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$PROJECT_ROOT"

echo "======================================================================"
echo " 🚀 GlobeTrek Holidays - Push to GitHub Helper"
echo "======================================================================"

REPO_INPUT="${1:-https://github.com/jashwanthsappidi23-hub/tourism-package-travel-booking-management-system.git}"

if [[ "$REPO_INPUT" =~ ^(https://|git@) ]]; then
    REMOTE_URL="$REPO_INPUT"
else
    REMOTE_URL="https://github.com/${REPO_INPUT}/tourism-package-travel-booking-management-system.git"
fi

echo ""
echo "Setting remote origin to: $REMOTE_URL"

git branch -M main

if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$REMOTE_URL"
else
    git remote add origin "$REMOTE_URL"
fi

echo "Staging all project files..."
git add .

if ! git diff --cached --quiet; then
    git commit -m "feat: complete MakeMyTrip tourism management system with 3NF relational database"
fi

echo ""
echo "Pushing main branch to GitHub..."
echo "Running: git push -u origin main"
git push -u origin main

echo ""
echo "======================================================================"
echo " ✓ Repository successfully uploaded to GitHub!"
echo "======================================================================"

