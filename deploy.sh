#!/bin/bash
# Redeploy script for Next.js app (web.durpalla.com)
# Usage: sudo bash /usr/local/bin/redeploy-web-durpalla.sh

APP_DIR="/var/www/html/web.durpalla.com"
SERVICE="next-web-durpalla"
USER="nginx"

echo "🚀 Redeploying Next.js app at $APP_DIR ..."
echo "-----------------------------------------"

# 1. Stop running service
echo "🛑 Stopping existing service..."
systemctl stop "$SERVICE"

# 2. Ensure correct ownership
echo "🔧 Fixing permissions..."
chown -R $USER:$USER "$APP_DIR"

# 3. Remove old build & lock conflicts
echo "🧹 Cleaning old build and lock files..."
rm -rf "$APP_DIR/.next"
rm -f "$APP_DIR/package-lock.json"

# 4. Install dependencies
echo "📦 Installing dependencies..."
sudo -u $USER bash -lc "cd $APP_DIR && yarn install --frozen-lockfile"

# 5. Build the app
echo "🏗️ Building the project..."
sudo -u $USER bash -lc "cd $APP_DIR && yarn build"

# 6. Restart service
echo "🔁 Restarting systemd service..."
systemctl daemon-reload
systemctl enable --now "$SERVICE"
systemctl restart "$SERVICE"

# 7. Check service status
echo "✅ Service status:"
systemctl status "$SERVICE" --no-pager

echo "🎉 Redeploy complete!"
