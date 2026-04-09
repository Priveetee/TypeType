#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
COMPOSE_FILE="${COMPOSE_FILE:-${ROOT_DIR}/docker-compose.yml}"
ENV_FILE="${ROOT_DIR}/.env"

KEY_ID="${DOWNLOADER_S3_ACCESS_KEY:-GK111111111111111111111111}"
SECRET_KEY="${DOWNLOADER_S3_SECRET_KEY:-1111111111111111111111111111111111111111111111111111111111111111}"
BUCKET_NAME="${DOWNLOADER_S3_BUCKET:-typetype-downloads}"

export DOWNLOADER_S3_ACCESS_KEY="${KEY_ID}"
export DOWNLOADER_S3_SECRET_KEY="${SECRET_KEY}"

if [[ ! -f "${ENV_FILE}" ]]; then
  if [[ -f "${ROOT_DIR}/.env.example" ]]; then
    echo "[garage-bootstrap] .env missing, creating it from .env.example"
    cp "${ROOT_DIR}/.env.example" "${ENV_FILE}"
  else
    echo "[garage-bootstrap] writing minimal .env for compose..."
    cat > "${ENV_FILE}" <<EOF
DOWNLOADER_S3_ACCESS_KEY=${KEY_ID}
DOWNLOADER_S3_SECRET_KEY=${SECRET_KEY}
EOF
  fi
fi

compose() {
  docker compose -f "${COMPOSE_FILE}" "$@"
}

garage_exec() {
  compose exec -T garage /garage -c /etc/garage.toml "$@"
}

echo "[garage-bootstrap] starting garage service if needed..."
compose up -d garage >/dev/null

echo "[garage-bootstrap] waiting for garage service..."
for _ in $(seq 1 60); do
  if garage_exec status >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! garage_exec status >/dev/null 2>&1; then
  echo "[garage-bootstrap] garage service did not become ready in time" >&2
  exit 1
fi

status_output="$(garage_exec status || true)"
if [[ "${status_output}" == *"NO ROLE ASSIGNED"* ]]; then
  node_line="$(garage_exec node id)"
  node_line="${node_line%%$'\n'*}"
  node_id="${node_line%@*}"

  layout_output="$(garage_exec layout show || true)"
  marker="Current cluster layout version: "
  if [[ "${layout_output}" == *"${marker}"* ]]; then
    current_version="${layout_output#*${marker}}"
    current_version="${current_version%%$'\n'*}"
  else
    current_version="0"
  fi
  if [[ -z "${current_version}" ]]; then
    current_version="0"
  fi
  next_version="$((current_version + 1))"

  echo "[garage-bootstrap] assigning node role and applying layout v${next_version}"
  garage_exec layout assign -z dc1 -c 20GB "${node_id}"
  garage_exec layout apply --version "${next_version}"
fi

if ! garage_exec bucket info "${BUCKET_NAME}" >/dev/null 2>&1; then
  echo "[garage-bootstrap] creating bucket ${BUCKET_NAME}"
  garage_exec bucket create "${BUCKET_NAME}" >/dev/null
fi

if ! garage_exec key info "${KEY_ID}" >/dev/null 2>&1; then
  echo "[garage-bootstrap] importing access key ${KEY_ID}"
  garage_exec key import --yes -n typetype-downloader "${KEY_ID}" "${SECRET_KEY}" >/dev/null
fi

echo "[garage-bootstrap] ensuring bucket permissions"
garage_exec bucket allow --read --write --owner --key "${KEY_ID}" "${BUCKET_NAME}" >/dev/null

echo "[garage-bootstrap] done"
