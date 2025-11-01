#!/bin/bash

# ============================================
# Laravel Production Deployment Script
# ============================================
# Jalankan script ini SEBELUM upload ke hosting
# ============================================

echo "🚀 Starting Laravel Production Build..."
echo ""

# Step 1: Install dependencies
echo "📦 Installing production dependencies..."
composer install --optimize-autoloader --no-dev
if [ $? -ne 0 ]; then
    echo "❌ Composer install failed!"
    exit 1
fi
echo "✅ Composer dependencies installed"
echo ""

# Step 2: Build frontend assets
echo "🎨 Building frontend assets..."
npm install
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi
echo "✅ Frontend assets built"
echo ""

# Step 3: Clear all caches
echo "🧹 Clearing caches..."
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear
echo "✅ Caches cleared"
echo ""

# Step 4: Optimize for production
echo "⚡ Optimizing for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "✅ Optimization complete"
echo ""

# Step 5: Create deployment info
echo "📝 Creating deployment info..."
DEPLOY_DATE=$(date +"%Y-%m-%d %H:%M:%S")
echo "Deployed at: $DEPLOY_DATE" > public/deploy-info.txt
echo "✅ Deployment info created"
echo ""

echo "✅ Production build complete!"
echo ""
echo "📋 Next steps:"
echo "   1. Review DEPLOYMENT-GUIDE.md"
echo "   2. Copy .env.production to server as .env"
echo "   3. Update .env with hosting credentials"
echo "   4. Upload project to hosting"
echo "   5. Run: php artisan key:generate"
echo "   6. Run: php artisan migrate --force"
echo "   7. Run: php artisan storage:link"
echo ""
echo "🎉 Ready to deploy!"
