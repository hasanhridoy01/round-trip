#!/bin/bash
set -euo pipefail

APP_DIR="/var/www/html/web.durpalla.com"
SERVICE="next-durpalla"
USER="nginx"
PORT="4000"
NODE_BIN="$(command -v node || echo /usr/bin/node)"

echo "🚀 Redeploying $APP_DIR (service: $SERVICE) ..."

# 0) Ensure service exists; if not, create it
if [ ! -f "/etc/systemd/system/${SERVICE}.service" ]; then
  echo "🧩 Creating systemd unit ${SERVICE}.service ..."
  cat <<EOF | sudo tee /etc/systemd/system/${SERVICE}.service >/dev/null
[Unit]
Description=Next.js - web.durpalla.com
After=network.target

[Service]
Type=simple
User=${USER}
WorkingDirectory=${APP_DIR}

Environment=NODE_ENV=production
Environment=HOST=127.0.0.1
Environment=PORT=${PORT}
Environment=PATH=/usr/local/bin:/usr/bin:/bin

ExecStart=${NODE_BIN} ./node_modules/next/dist/bin/next start -p ${PORT} -H 127.0.0.1
Restart=always
RestartSec=3
NoNewPrivileges=true
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF
  sudo systemctl daemon-reload
  sudo systemctl enable --now "${SERVICE}" || true
fi

echo "🛑 Stopping ${SERVICE} (if running) ..."
sudo systemctl stop "${SERVICE}" || true

echo "🔧 Fixing ownership ..."
sudo chown -R "${USER}:${USER}" "${APP_DIR}"

echo "🧹 Cleaning old build and lock conflicts ..."
sudo rm -rf "${APP_DIR}/.next"
sudo rm -f "${APP_DIR}/package-lock.json"

echo "📦 Installing dependencies (yarn) ..."
sudo -u "${USER}" bash -lc "cd '${APP_DIR}' && yarn install --frozen-lockfile"

echo "🏗️ Building the app ..."
sudo -u "${USER}" bash -lc "cd '${APP_DIR}' && yarn build"

echo "🔁 Starting ${SERVICE} ..."
sudo systemctl daemon-reload
sudo systemctl restart "${SERVICE}"

echo "✅ Service status:"
sudo systemctl status "${SERVICE}" --no-pager || true

echo "🩺 Health check:"
curl -i "http://127.0.0.1:${PORT}/" || true

echo "🎉 Redeploy complete."