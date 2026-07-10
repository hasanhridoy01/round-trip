#!/usr/bin/env bash
# Install host nginx site for web.durpalla.com (proxy to durpalla-web on 4000).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UPSTREAM_SRC="${ROOT}/docker/nginx/web-upstream.conf"
SITE_SRC="${ROOT}/docker/nginx/web.durpalla.com.conf"
SITE_NAME="${NGINX_SITE_NAME:-web.durpalla.com}"
SITES_AVAILABLE="${NGINX_SITES_AVAILABLE:-/etc/nginx/sites-available}"
SITES_ENABLED="${NGINX_SITES_ENABLED:-/etc/nginx/sites-enabled}"
CONF_D="${NGINX_CONF_D:-/etc/nginx/conf.d}"

if [[ ! -f "$UPSTREAM_SRC" ]] || [[ ! -f "$SITE_SRC" ]]; then
  echo "ERROR: Missing nginx configs under $ROOT/docker/nginx/" >&2
  exit 1
fi

echo "Installing upstream -> ${CONF_D}/web-upstream.conf"
sudo cp "$UPSTREAM_SRC" "${CONF_D}/web-upstream.conf"

echo "Installing site -> ${SITES_AVAILABLE}/${SITE_NAME}"
sudo cp "$SITE_SRC" "${SITES_AVAILABLE}/${SITE_NAME}"

if [[ -L "${SITES_ENABLED}/${SITE_NAME}" ]] || [[ -e "${SITES_ENABLED}/${SITE_NAME}" ]]; then
  sudo rm -f "${SITES_ENABLED}/${SITE_NAME}"
fi
sudo ln -s "${SITES_AVAILABLE}/${SITE_NAME}" "${SITES_ENABLED}/${SITE_NAME}"

echo "Checking durpalla-web responds on 4000..."
if curl -fsS "http://127.0.0.1:4000/" >/dev/null 2>&1; then
  echo "  OK 127.0.0.1:4000"
else
  echo "  WARN 127.0.0.1:4000 not responding — ensure durpalla-web is running:"
  echo "       docker ps --filter name=durpalla-web"
  echo "       docker logs durpalla-web --tail 50"
fi

sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "Done. Test:"
echo "  curl -H 'Host: web.durpalla.com' http://127.0.0.1/"
echo ""
echo "For HTTPS:"
echo "  sudo certbot --nginx -d web.durpalla.com"
