#!/usr/bin/env bash
set -euo pipefail

REPO="Priveetee/TypeType"
REF="main"
INSTALL_DIR="${HOME}/typetype-stack"
START_STACK=1
SOURCE_DIR=""

usage() {
  cat <<'EOF'
TypeType one-line installer (end-user friendly)

Usage:
  bash install-stack.sh [options]

Options:
  --ref <git-ref>       Git ref to download (default: main)
  --dir <path>          Install directory (default: ~/typetype-stack)
  --download-only       Download/update files only, do not start Docker
  --source-dir <path>   Copy files from a local repo path (advanced)
  -h, --help            Show this help

Safety:
  This installer is intentionally interactive (prompts + confirmations).
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --ref)
      REF="$2"
      shift 2
      ;;
    --dir)
      INSTALL_DIR="$2"
      shift 2
      ;;
    --download-only)
      START_STACK=0
      shift
      ;;
    --source-dir)
      SOURCE_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[install] Missing required command: $1" >&2
    echo "[install] Please install Docker + Docker Compose first." >&2
    echo "[install] Docs: https://docs.docker.com/get-docker/" >&2
    exit 1
  fi
}

require_tty() {
  if [[ ! -r /dev/tty ]]; then
    echo "[install] Interactive mode requires a terminal (/dev/tty)." >&2
    echo "[install] Download the script first and run it directly:" >&2
    echo "[install]   curl -fsSL https://raw.githubusercontent.com/${REPO}/${REF}/scripts/install-stack.sh -o install-stack.sh" >&2
    echo "[install]   bash install-stack.sh" >&2
    exit 1
  fi
}

prompt_tty() {
  local out_var="$1"
  local label="$2"
  local default_value="$3"
  local value=""

  read -r -p "${label} [${default_value}]: " value < /dev/tty
  if [[ -z "${value}" ]]; then
    value="${default_value}"
  fi
  printf -v "${out_var}" '%s' "${value}"
}

confirm_tty() {
  local label="$1"
  local answer=""
  read -r -p "${label} [y/N]: " answer < /dev/tty
  [[ "${answer}" =~ ^[Yy]$ ]]
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

fetch_file() {
  local relative_path="$1"
  local out_path="$2"

  mkdir -p "$(dirname "${out_path}")"

  if [[ -n "${SOURCE_DIR}" ]]; then
    cp "${SOURCE_DIR}/${relative_path}" "${out_path}"
  else
    local base_url="https://raw.githubusercontent.com/${REPO}/${REF}"
    curl -fsSL "${base_url}/${relative_path}" -o "${out_path}"
  fi
}

need_cmd curl
need_cmd docker
require_tty

if ! docker compose version >/dev/null 2>&1; then
  echo "[install] docker compose is required (Docker Compose v2)." >&2
  echo "[install] Please install Docker Desktop / Docker Engine with Compose plugin." >&2
  echo "[install] Docs: https://docs.docker.com/compose/install/" >&2
  exit 1
fi

INSTALL_DIR="${INSTALL_DIR/#\~/$HOME}"
mkdir -p "${INSTALL_DIR}"

echo "[install] Installing TypeType stack files into: ${INSTALL_DIR}"

fetch_file "docker-compose.yml" "${INSTALL_DIR}/docker-compose.yml"
fetch_file "nginx.conf" "${INSTALL_DIR}/nginx.conf"
fetch_file "garage.toml" "${INSTALL_DIR}/garage.toml"
fetch_file ".env.example" "${INSTALL_DIR}/.env.example"
fetch_file "scripts/bootstrap-garage.sh" "${INSTALL_DIR}/scripts/bootstrap-garage.sh"
fetch_file "scripts/setup-stack.sh" "${INSTALL_DIR}/scripts/setup-stack.sh"

chmod +x "${INSTALL_DIR}/scripts/bootstrap-garage.sh"
chmod +x "${INSTALL_DIR}/scripts/setup-stack.sh"

if [[ ! -f "${INSTALL_DIR}/.env" ]]; then
  cp "${INSTALL_DIR}/.env.example" "${INSTALL_DIR}/.env"
  echo "[install] Created ${INSTALL_DIR}/.env from .env.example"
fi

current_origins="$(grep '^ALLOWED_ORIGINS=' "${INSTALL_DIR}/.env" | cut -d= -f2- || true)"
default_origins="${current_origins:-http://localhost:8082,http://localhost:5173}"
prompt_tty input_origins "ALLOWED_ORIGINS" "${default_origins}"
if grep -q '^ALLOWED_ORIGINS=' "${INSTALL_DIR}/.env"; then
  sed -i "s|^ALLOWED_ORIGINS=.*$|ALLOWED_ORIGINS=${input_origins}|" "${INSTALL_DIR}/.env"
else
  printf '\nALLOWED_ORIGINS=%s\n' "${input_origins}" >> "${INSTALL_DIR}/.env"
fi

if [[ ${START_STACK} -eq 0 ]]; then
  echo "[install] Download-only complete."
  echo "[install] Next step: cd ${INSTALL_DIR} && ./scripts/setup-stack.sh"
  exit 0
fi

if ! confirm_tty "Proceed with Docker pull + startup in ${INSTALL_DIR}?"; then
  echo "[install] Cancelled by user."
  exit 1
fi

echo "[install] Checking required ports (8080, 8081, 8082)..."
for port in 8080 8081 8082; do
  if ! require_free_port "${port}"; then
    echo "[install] Port ${port} is already in use." >&2
    echo "[install] Stop the conflicting service, or edit port mappings in ${INSTALL_DIR}/docker-compose.yml, then re-run." >&2
    exit 1
  fi
done

echo "[install] Pulling Docker images..."
docker compose -f "${INSTALL_DIR}/docker-compose.yml" --env-file "${INSTALL_DIR}/.env" pull

echo "[install] Starting stack..."
docker compose -f "${INSTALL_DIR}/docker-compose.yml" --env-file "${INSTALL_DIR}/.env" up -d

echo "[install] Bootstrapping Garage..."
(
  cd "${INSTALL_DIR}"
  ./scripts/bootstrap-garage.sh
)

echo "[install] Service status:"
docker compose -f "${INSTALL_DIR}/docker-compose.yml" --env-file "${INSTALL_DIR}/.env" ps

echo
echo "Done. Open http://localhost:8082"
echo "Install directory: ${INSTALL_DIR}"
