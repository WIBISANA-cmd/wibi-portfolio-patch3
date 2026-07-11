#!/bin/sh
set -eu

cat >/usr/share/nginx/html/runtime-config.js <<EOF
window.__APP_CONFIG__ = {
  VITE_SANITY_PROJECT_ID: "${VITE_SANITY_PROJECT_ID:-}",
  VITE_SANITY_DATASET: "${VITE_SANITY_DATASET:-production}",
  VITE_SANITY_API_VERSION: "${VITE_SANITY_API_VERSION:-2024-10-01}"
};
EOF
