#!/usr/bin/env bash
set -euo pipefail

# Smoke test script for Payments and Assets
# Usage: from the api/ folder: ./scripts/smoke.sh
# Optional env overrides:
# BASE_URL, EMAIL, PASSWORD

BASE_URL="${BASE_URL:-http://localhost:3001}"
EMAIL="${EMAIL:-admin@example.com}"
PASSWORD="${PASSWORD:-senha123}"

echo "Using BASE_URL=$BASE_URL, EMAIL=$EMAIL"

echo "== LOGIN =="
RESP=$(curl -s -X POST "$BASE_URL/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

echo "Login response: $RESP"

TOKEN=$(printf "%s" "$RESP" | node -e "let s='';process.stdin.on('data',d=>s+=d);process.stdin.on('end',()=>{try{const o=JSON.parse(s); console.log(o.token||'');}catch(e){process.exit(1)}})") || true

if [ -z "$TOKEN" ]; then
  echo "ERROR: no token returned. Aborting."
  exit 1
fi

echo "Token obtained."

# Prepare temp files
TMP_PDF="/tmp/xflow_test_invoice.pdf"
TMP_IMG="/tmp/xflow_test_image.jpg"
echo "Fake Invoice PDF" > "$TMP_PDF"
# create small JPEG header so sharp/js will treat as image
printf "\xFF\xD8\xFF\xE0" > "$TMP_IMG" || true

echo "== CREATE PAYMENT (with file upload) =="
curl -s -X POST "$BASE_URL/api/v1/payments" \
  -H "Authorization: Bearer $TOKEN" \
  -F "amount=123.45" \
  -F "dueDate=2026-02-28T00:00:00.000Z" \
  -F "category=Contas" \
  -F "file=@${TMP_PDF};type=application/pdf" \
  -w "\nHTTP_CODE:%{http_code}\n"

echo "\n== LIST PAYMENTS =="
curl -s -X GET "$BASE_URL/api/v1/payments" -H "Authorization: Bearer $TOKEN" -w "\nHTTP_CODE:%{http_code}\n"

echo "\n== CREATE ASSET (with invoice upload) =="
curl -s -X POST "$BASE_URL/api/v1/assets" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Avell Ion A50" \
  -F "type=Notebook" \
  -F "serialNumber=SN123" \
  -F "purchaseDate=2026-02-01" \
  -F "value=7500" \
  -F "file=@${TMP_PDF};type=application/pdf" \
  -w "\nHTTP_CODE:%{http_code}\n"

echo "\n== LIST ASSETS =="
curl -s -X GET "$BASE_URL/api/v1/assets" -H "Authorization: Bearer $TOKEN" -w "\nHTTP_CODE:%{http_code}\n"

echo "\nSmoke tests finished."
