#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env"

DEFAULT_ALLOWED_ORIGINS="http://localhost:8082,http://localhost:5173"
DEFAULT_DATABASE_URL="jdbc:postgresql://postgres:5432/typetype"
DEFAULT_DATABASE_USER="typetype"
DEFAULT_DATABASE_PASSWORD="typetype"
DEFAULT_DRAGONFLY_URL="redis://dragonfly:6379"
DEFAULT_GITHUB_REPO="Priveetee/TypeType-Server"
DEFAULT_GITHUB_ISSUE_TEMPLATE="bug_report_backend.md"
DEFAULT_DOWNLOADER_S3_ACCESS_KEY=""
DEFAULT_DOWNLOADER_S3_SECRET_KEY=""

generate_hex() {
  local bytes="$1"
  if command -v openssl >/dev/null 2>&1; then
    openssl rand -hex "${bytes}"
    return
  fi

  python3 - "${bytes}" <<'PY'
import secrets
import sys

print(secrets.token_hex(int(sys.argv[1])))
PY
}

generate_downloader_access_key() {
  printf 'GK%s' "$(generate_hex 12)"
}

generate_downloader_secret_key() {
  generate_hex 32
}

ensure_generated_secrets() {
  if [[ -z "${DEFAULT_DOWNLOADER_S3_ACCESS_KEY}" ]]; then
    DEFAULT_DOWNLOADER_S3_ACCESS_KEY="$(generate_downloader_access_key)"
  fi
  if [[ -z "${DEFAULT_DOWNLOADER_S3_SECRET_KEY}" ]]; then
    DEFAULT_DOWNLOADER_S3_SECRET_KEY="$(generate_downloader_secret_key)"
  fi
}

require_free_port() {
  local port="$1"
  python3 - <<PY
import socket, sys
port = int(${port})
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
try:
    s.bind(("0.0.0.0", port))
except OSError:
    sys.exit(1)
finally:
    s.close()
sys.exit(0)
PY
}

prompt_value() {
  local out_var="$1"
  local label="$2"
  local default_value="$3"
  local value=""

  read -r -p "${label} [${default_value}]: " value
  if [[ -z "${value}" ]]; then
    value="${default_value}"
  fi
  printf -v "${out_var}" '%s' "${value}"
}

echo "TypeType interactive setup"
echo

ensure_generated_secrets

if [[ -f "${ENV_FILE}" ]]; then
  read -r -p ".env already exists. Overwrite it? [y/N]: " overwrite
  if [[ ! "${overwrite}" =~ ^[Yy]$ ]]; then
    echo "Keeping existing .env"
  else
    echo "Rebuilding .env with prompted values..."
    prompt_value ALLOWED_ORIGINS "ALLOWED_ORIGINS" "${DEFAULT_ALLOWED_ORIGINS}"
    prompt_value DATABASE_URL "DATABASE_URL" "${DEFAULT_DATABASE_URL}"
    prompt_value DATABASE_USER "DATABASE_USER" "${DEFAULT_DATABASE_USER}"
    prompt_value DATABASE_PASSWORD "DATABASE_PASSWORD" "${DEFAULT_DATABASE_PASSWORD}"
    prompt_value DRAGONFLY_URL "DRAGONFLY_URL" "${DEFAULT_DRAGONFLY_URL}"
    prompt_value GITHUB_REPO "GITHUB_REPO" "${DEFAULT_GITHUB_REPO}"
    prompt_value GITHUB_ISSUE_TEMPLATE "GITHUB_ISSUE_TEMPLATE" "${DEFAULT_GITHUB_ISSUE_TEMPLATE}"
    prompt_value DOWNLOADER_S3_ACCESS_KEY "DOWNLOADER_S3_ACCESS_KEY" "${DEFAULT_DOWNLOADER_S3_ACCESS_KEY}"
    prompt_value DOWNLOADER_S3_SECRET_KEY "DOWNLOADER_S3_SECRET_KEY" "${DEFAULT_DOWNLOADER_S3_SECRET_KEY}"

    cat > "${ENV_FILE}" <<EOF
ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
DATABASE_URL=${DATABASE_URL}
DATABASE_USER=${DATABASE_USER}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DRAGONFLY_URL=${DRAGONFLY_URL}
GITHUB_REPO=${GITHUB_REPO}
GITHUB_ISSUE_TEMPLATE=${GITHUB_ISSUE_TEMPLATE}
DOWNLOADER_S3_ACCESS_KEY=${DOWNLOADER_S3_ACCESS_KEY}
DOWNLOADER_S3_SECRET_KEY=${DOWNLOADER_S3_SECRET_KEY}
EOF
  fi
else
  echo "No .env found. Let's create one."
  prompt_value ALLOWED_ORIGINS "ALLOWED_ORIGINS" "${DEFAULT_ALLOWED_ORIGINS}"
  prompt_value DATABASE_URL "DATABASE_URL" "${DEFAULT_DATABASE_URL}"
  prompt_value DATABASE_USER "DATABASE_USER" "${DEFAULT_DATABASE_USER}"
  prompt_value DATABASE_PASSWORD "DATABASE_PASSWORD" "${DEFAULT_DATABASE_PASSWORD}"
  prompt_value DRAGONFLY_URL "DRAGONFLY_URL" "${DEFAULT_DRAGONFLY_URL}"
  prompt_value GITHUB_REPO "GITHUB_REPO" "${DEFAULT_GITHUB_REPO}"
  prompt_value GITHUB_ISSUE_TEMPLATE "GITHUB_ISSUE_TEMPLATE" "${DEFAULT_GITHUB_ISSUE_TEMPLATE}"
  prompt_value DOWNLOADER_S3_ACCESS_KEY "DOWNLOADER_S3_ACCESS_KEY" "${DEFAULT_DOWNLOADER_S3_ACCESS_KEY}"
  prompt_value DOWNLOADER_S3_SECRET_KEY "DOWNLOADER_S3_SECRET_KEY" "${DEFAULT_DOWNLOADER_S3_SECRET_KEY}"

  cat > "${ENV_FILE}" <<EOF
ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
DATABASE_URL=${DATABASE_URL}
DATABASE_USER=${DATABASE_USER}
DATABASE_PASSWORD=${DATABASE_PASSWORD}
DRAGONFLY_URL=${DRAGONFLY_URL}
GITHUB_REPO=${GITHUB_REPO}
GITHUB_ISSUE_TEMPLATE=${GITHUB_ISSUE_TEMPLATE}
DOWNLOADER_S3_ACCESS_KEY=${DOWNLOADER_S3_ACCESS_KEY}
DOWNLOADER_S3_SECRET_KEY=${DOWNLOADER_S3_SECRET_KEY}
EOF
fi

cd "${ROOT_DIR}"

if [[ "${SKIP_PORT_CHECK:-0}" != "1" ]]; then
  echo "[setup] Checking required ports..."
  for port in 8080 8081 8082; do
    if ! require_free_port "${port}"; then
      echo "[setup] Port ${port} is already in use."
      echo "[setup] Stop the conflicting container/service, or edit docker-compose.yml ports, then re-run."
      echo "[setup] Tip: set SKIP_PORT_CHECK=1 to bypass this check."
      exit 1
    fi
  done
fi

echo
echo "[setup] Pulling images..."
docker compose pull

echo "[setup] Starting services..."
docker compose up -d

echo "[setup] Bootstrapping Garage for downloader..."
"${ROOT_DIR}/scripts/bootstrap-garage.sh"

echo "[setup] Current service status:"
docker compose ps

echo
echo "Done. Open http://localhost:8082"
