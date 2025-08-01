#!/bin/bash

echo "🚀 NextGen Logistics Simple Deploy"

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist directory not found. Please build the project first."
    exit 1
fi

echo "📋 Creating deployment files..."

# Create a simple upload script for server
cat > upload_to_server.sh << 'EOF'
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
EOF

# Create file structure for upload
mkdir -p upload_package
cp -r dist/* upload_package/

echo "✅ Upload package created in 'upload_package' directory"
echo ""
echo "📝 Manual deployment steps:"
echo "1. Connect to server: ssh root@193.160.208.183"
echo "2. Password: bar21!@"
echo "3. Run these commands on server:"
echo ""
echo "   mkdir -p /tmp/nextgen-files"
echo "   # Upload files via SCP or copy-paste method"
echo ""
echo "4. Then run: bash upload_to_server.sh"
echo ""
echo "🎯 Ready for deployment!"