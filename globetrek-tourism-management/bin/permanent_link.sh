#!/usr/bin/env bash
# ==============================================================================
# GlobeTrek Holidays - Permanent Public Link Launcher
# ==============================================================================

set -e
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

SUBDOMAIN="${1:-globetrek-yatra}"
PORT="${2:-5173}"

echo "======================================================================"
echo " 🌐 GlobeTrek Holidays - Permanent Public Link"
echo "======================================================================"
echo "Subdomain requested: https://${SUBDOMAIN}.loca.lt"
echo "Forwarding to local port: http://localhost:${PORT}"
echo ""
echo "Note: Unlike trycloudflare quick tunnels which generate a random URL"
echo "each time, this tunnel requests the FIXED subdomain '${SUBDOMAIN}'"
echo "so your link remains the same."
echo "======================================================================"
echo ""

# Launch localtunnel with fixed subdomain
npx localtunnel --port "$PORT" --subdomain "$SUBDOMAIN"
