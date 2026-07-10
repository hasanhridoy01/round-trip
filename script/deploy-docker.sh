#!/usr/bin/env bash
# Build (optional) and deploy durpalla-web Docker container on this host.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
IMAGE="${IMAGE:-durpalla-web:local}"
APP_PORT="${APP_PORT:-4000}"
CONTAINER_NAME="${CONTAINER_NAME:-durpalla-web}"
BUILD="${BUILD:-0}"
SETUP_NGINX="${SETUP_NGINX:-1}"
NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL:-https://apigw.durpalla.com/api/v1}"

if [[ "$BUILD" == "1" ]]; then
  echo "Building ${IMAGE}..."
  docker build \
    --build-arg NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL}" \
    -t "${IMAGE}" \
    "${ROOT}"
fi

echo "Stopping existing ${CONTAINER_NAME} (if any)..."
docker rm -f "${CONTAINER_NAME}" >/dev/null 2>&1 || true

echo "Starting ${CONTAINER_NAME} on port ${APP_PORT}..."
docker run -d --name "${CONTAINER_NAME}" --restart unless-stopped \
  --network host \
  --log-opt max-size=20m \
  --log-opt max-file=2 \
  -e PORT="${APP_PORT}" \
  -e HOSTNAME=0.0.0.0 \
  -e NODE_ENV=production \
  -e NEXT_PUBLIC_API_BASE_URL="${NEXT_PUBLIC_API_BASE_URL}" \
  "${IMAGE}"

echo "Waiting for health check..."
HEALTH_URL="http://127.0.0.1:${APP_PORT}/"
HTTP_CODE="000"
for i in $(seq 1 30); do
  if ! docker inspect -f '{{.State.Running}}' "${CONTAINER_NAME}" 2>/dev/null | grep -q true; then
    echo "Container not running (attempt ${i}/30)..."
    sleep 2
    continue
  fi

  HTTP_CODE="$(curl -sS -o /dev/null -w '%{http_code}' --connect-timeout 5 "${HEALTH_URL}" 2>/dev/null || echo 000)"
  if [[ "${HTTP_CODE}" -ge 200 && "${HTTP_CODE}" -lt 400 ]]; then
    echo "Healthy (HTTP ${HTTP_CODE})"
    break
  fi

  echo "Waiting (attempt ${i}/30, HTTP ${HTTP_CODE})..."
  if [[ "$i" -eq 30 ]]; then
    echo "ERROR: health check failed"
    docker logs "${CONTAINER_NAME}" --tail 40 2>&1 || true
    exit 1
  fi
  sleep 2
done

if [[ "$SETUP_NGINX" == "1" ]]; then
  if [[ -f /opt/durpalla-apigw/docker/nginx/assets-and-apigw.host-network.conf ]]; then
    bash "${ROOT}/script/setup-assets-cdn-nginx.sh"
  elif [[ -x "${ROOT}/script/setup-host-nginx.sh" ]]; then
    bash "${ROOT}/script/setup-host-nginx.sh"
  fi
fi

echo "Deploy complete on $(hostname)."
