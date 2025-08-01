#!/bin/bash
TARGET_DIR="/var/www/wwwroot/avtogost77"

echo "🧹 Cleaning target directory..."
rm -rf $TARGET_DIR/*

echo "📁 Creating directories..."
mkdir -p $TARGET_DIR/css
mkdir -p $TARGET_DIR/js
mkdir -p $TARGET_DIR/js/services
mkdir -p $TARGET_DIR/js/types

echo "📄 Files to upload:"
ls -la /tmp/nextgen-files/

echo "📤 Copying files..."
cp -r /tmp/nextgen-files/* $TARGET_DIR/

echo "🔧 Setting permissions..."
chmod -R 755 $TARGET_DIR
chown -R www-data:www-data $TARGET_DIR

echo "✅ Deployment complete!"
echo "🌐 Testing..."
curl -I http://localhost/ || echo "Web server may need restart"

ls -la $TARGET_DIR
