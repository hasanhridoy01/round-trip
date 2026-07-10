#!/usr/bin/env bash
# Add web.durpalla.com to assets-cdn nginx on .94 (no host nginx).
set -euo pipefail

CONF="${ASSETS_NGINX_CONF:-/opt/durpalla-apigw/docker/nginx/assets-and-apigw.host-network.conf}"
CONTAINER="${ASSETS_CDN_CONTAINER:-assets-cdn}"

if [[ ! -f "$CONF" ]]; then
  echo "ERROR: $CONF not found" >&2
  exit 1
fi

if grep -q 'server_name web.durpalla.com' "$CONF"; then
  echo "web.durpalla.com already present in $CONF"
else
  cat >>"$CONF" <<'EOF'

upstream web_durpalla {
    server 127.0.0.1:4000 max_fails=3 fail_timeout=30s;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name web.durpalla.com;

    client_max_body_size 32M;

    access_log /var/log/nginx/web.durpalla.com.access.log;
    error_log /var/log/nginx/web.durpalla.com.error.log warn;

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://web_durpalla;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_set_header Upgrade $http_upgrade;
        proxy_connect_timeout 10s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
        proxy_buffering on;
    }
}
EOF
  echo "Appended web.durpalla.com to $CONF"
fi

docker exec "$CONTAINER" nginx -t
docker exec "$CONTAINER" nginx -s reload
echo "Reloaded $CONTAINER"
