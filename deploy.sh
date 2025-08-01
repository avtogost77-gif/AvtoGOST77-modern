#!/bin/bash

# NextGen Logistics Deploy Script
echo "🚀 Starting NextGen Logistics deployment..."

# Server details
SERVER="193.160.208.183"
USER="root"
PASSWORD="bar21!@"
TARGET_DIR="/var/www/wwwroot/avtogost77"

echo "📋 Preparing files for deployment..."

# Create deployment package
tar -czf nextgen-deploy.tar.gz dist/ package.json tsconfig.json src/ NEXTGEN_LOGISTICS_README.md

echo "✅ Files packaged successfully"

# Note: Manual steps needed due to environment limitations
echo "📝 Manual deployment steps:"
echo "1. Copy files to server: scp nextgen-deploy.tar.gz root@$SERVER:~/"
echo "2. SSH to server: ssh root@$SERVER"
echo "3. Extract: tar -xzf nextgen-deploy.tar.gz"
echo "4. Move to target: mv dist/* $TARGET_DIR/"
echo "5. Set permissions: chmod -R 755 $TARGET_DIR"
echo "6. Test: curl http://localhost"

echo "🎯 Deployment package ready: nextgen-deploy.tar.gz"