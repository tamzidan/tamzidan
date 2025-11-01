# 🚀 Panduan Upload ke Hosting

## 📋 Daftar Isi
1. [Persiapan Sebelum Upload](#1-persiapan-sebelum-upload)
2. [Optimisasi Project](#2-optimisasi-project)
3. [Upload ke Hosting](#3-upload-ke-hosting)
4. [Konfigurasi di Hosting](#4-konfigurasi-di-hosting)
5. [Setup Database](#5-setup-database)
6. [Final Testing](#6-final-testing)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Persiapan Sebelum Upload

### ✅ Requirements Hosting
Pastikan hosting Anda memiliki:
- **PHP >= 8.2**
- **MySQL/MariaDB**
- **Composer** (biasanya sudah ada)
- **Node.js & NPM** (opsional, untuk build di server)
- **SSH Access** (recommended)

### ✅ File yang Perlu Disiapkan
```bash
# Di komputer lokal, jalankan:
cd C:\change\personal-website-laravel

# 1. Build production assets
npm run build

# 2. Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 3. Install dependencies production only
composer install --optimize-autoloader --no-dev
```

---

## 2. Optimisasi Project

### A. Update .gitignore (Jika pakai Git)
Pastikan file `.gitignore` sudah benar:
```
/node_modules
/public/hot
/public/build
/public/storage
/storage/*.key
/vendor
.env
.env.backup
.env.production
.phpunit.result.cache
Homestead.json
Homestead.yaml
auth.json
npm-debug.log
yarn-error.log
/.fleet
/.idea
/.vscode
```

### B. Buat ZIP untuk Upload Manual (Jika tidak pakai Git)
**File/Folder yang HARUS di-upload:**
```
✅ app/
✅ bootstrap/
✅ config/
✅ database/
✅ public/
✅ resources/
✅ routes/
✅ storage/
✅ .htaccess (di public/)
✅ artisan
✅ composer.json
✅ composer.lock
✅ package.json (optional)
```

**File/Folder yang JANGAN di-upload:**
```
❌ node_modules/
❌ vendor/ (akan di-install via composer)
❌ .env (buat baru di server)
❌ storage/logs/* (clear dulu)
❌ .git/ (opsional)
```

---

## 3. Upload ke Hosting

### 🔹 Metode 1: Via cPanel File Manager (Paling Mudah)

1. **Login ke cPanel** hosting Anda

2. **Buat folder di luar public_html** (recommended)
   ```
   /home/username/laravel-app/
   ```

3. **Upload ZIP file** ke folder tersebut

4. **Extract** file ZIP

5. **Pindahkan isi folder public ke public_html**
   ```
   Struktur akhir:

   /home/username/
   ├── laravel-app/          ← Folder utama Laravel
   │   ├── app/
   │   ├── bootstrap/
   │   ├── config/
   │   ├── database/
   │   ├── resources/
   │   ├── routes/
   │   ├── storage/
   │   ├── vendor/
   │   └── artisan
   │
   └── public_html/          ← Document Root
       ├── build/            ← Dari public/build
       ├── storage/          ← Symlink
       ├── index.php         ← Dari public/index.php
       ├── .htaccess         ← Dari public/.htaccess
       └── favicon.ico
   ```

### 🔹 Metode 2: Via Git & SSH (Recommended untuk Update)

```bash
# 1. SSH ke server
ssh username@your-server.com

# 2. Clone repository (jika pakai Git)
cd /home/username
git clone https://github.com/your-repo/personal-website-laravel.git laravel-app
cd laravel-app

# 3. Install dependencies
composer install --optimize-autoloader --no-dev

# 4. Build assets (jika Node.js tersedia di server)
npm install
npm run build

# Atau upload folder public/build yang sudah di-build lokal
```

---

## 4. Konfigurasi di Hosting

### A. Edit index.php di public_html

File: `/home/username/public_html/index.php`

**PENTING:** Update path ke Laravel app

```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../laravel-app/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../laravel-app/vendor/autoload.php';

// Bootstrap Laravel and handle the request...
(require_once __DIR__.'/../laravel-app/bootstrap/app.php')
    ->handleRequest(Request::capture());
```

**Ganti `/laravel-app/` dengan nama folder Anda!**

### B. Setup File .env di Server

1. **Copy template .env.production ke server**
   ```bash
   # Via SSH
   cd /home/username/laravel-app
   cp .env.production .env
   ```

2. **Edit .env dengan kredensial hosting**
   ```bash
   nano .env
   # Atau edit via cPanel File Manager
   ```

3. **Update nilai-nilai berikut:**
   ```env
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_HOST=localhost
   DB_DATABASE=nama_database_dari_hosting
   DB_USERNAME=user_database_dari_hosting
   DB_PASSWORD=password_database_dari_hosting

   SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
   SESSION_DOMAIN=.yourdomain.com
   ```

4. **Generate Application Key**
   ```bash
   php artisan key:generate
   ```

### C. Set Permissions (PENTING!)

```bash
# Via SSH
cd /home/username/laravel-app

# Set ownership (jika pakai SSH dengan sudo)
sudo chown -R www-data:www-data storage bootstrap/cache

# Set permissions
chmod -R 775 storage bootstrap/cache

# Atau via cPanel:
# File Manager → Pilih folder storage → Change Permissions → 755
```

### D. Create Storage Symlink

```bash
# Via SSH
cd /home/username/laravel-app
php artisan storage:link

# Ini akan membuat symlink:
# /home/username/public_html/storage -> /home/username/laravel-app/storage/app/public
```

**Jika error "symlink exists"**, hapus dulu:
```bash
rm /home/username/public_html/storage
php artisan storage:link
```

---

## 5. Setup Database

### A. Buat Database di cPanel

1. Login ke **cPanel**
2. Buka **MySQL Databases**
3. **Create Database:**
   - Nama: `username_portfolio`
4. **Create User:**
   - Username: `username_portfolio`
   - Password: (generate strong password)
5. **Add User to Database:**
   - Pilih user dan database
   - Grant ALL PRIVILEGES

### B. Import Database atau Run Migration

**Opsi 1: Import SQL (Jika ada data lokal)**
```bash
# Export dari lokal
mysqldump -u root personal_website_laravel > backup.sql

# Upload backup.sql ke server
# Import via phpMyAdmin atau SSH:
mysql -u username_portfolio -p database_name < backup.sql
```

**Opsi 2: Run Migration (Fresh install)**
```bash
# Via SSH
cd /home/username/laravel-app

# Run migrations
php artisan migrate --force

# Seed data (optional)
php artisan db:seed --force
```

### C. Buat User Admin

```bash
# Via SSH
cd /home/username/laravel-app
php artisan tinker

# Di tinker prompt:
use App\Models\User;
User::create([
    'name' => 'Admin',
    'email' => 'admin@yourdomain.com',
    'password' => bcrypt('your-secure-password-here')
]);
exit
```

---

## 6. Final Testing

### ✅ Checklist Testing

1. **Test Homepage**
   - Buka `https://yourdomain.com`
   - Pastikan tampilan normal (bukan error 500)

2. **Test Static Assets**
   - Periksa apakah CSS/JS ter-load (inspect browser console)
   - Periksa apakah fonts ter-load

3. **Test Upload Images**
   - Upload foto di comment
   - Upload gambar di portfolio (admin)
   - Cek apakah muncul di `/storage/...`

4. **Test Admin Login**
   - Buka `https://yourdomain.com`
   - Klik Admin Panel / Login
   - Login dengan kredensial yang dibuat

5. **Test Database Connection**
   - Submit contact form
   - Post comment
   - Tambah portfolio (admin)

6. **Test API Endpoints**
   - Buka console browser (F12)
   - Periksa network tab
   - Pastikan tidak ada error 404/500

---

## 7. Troubleshooting

### ❌ Error: 500 Internal Server Error

**Solusi:**
```bash
# 1. Enable debug mode sementara
# Edit .env:
APP_DEBUG=true

# 2. Periksa log
tail -f storage/logs/laravel.log

# 3. Clear cache
php artisan config:clear
php artisan cache:clear
php artisan view:clear

# 4. Matikan debug lagi!
APP_DEBUG=false
```

### ❌ Error: Symlink storage not found

**Solusi:**
```bash
# Hapus symlink lama
rm /home/username/public_html/storage

# Buat symlink baru
cd /home/username/laravel-app
php artisan storage:link
```

### ❌ Error: Permission denied

**Solusi:**
```bash
# Set permissions
chmod -R 775 storage
chmod -R 775 bootstrap/cache

# Jika masih error, coba 777 (tidak recommended):
chmod -R 777 storage
chmod -R 777 bootstrap/cache
```

### ❌ Error: CSRF token mismatch

**Solusi:**
```env
# Edit .env
SESSION_DOMAIN=.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com

# Clear cache
php artisan config:clear
```

### ❌ Error: Mix manifest not found

**Solusi:**
```bash
# Build ulang assets
npm run build

# Upload folder public/build ke server
```

### ❌ Error: Class not found

**Solusi:**
```bash
# Dump autoload
composer dump-autoload

# Atau reinstall
composer install --optimize-autoloader --no-dev
```

---

## 🎉 Selesai!

Website Anda sekarang sudah live di production!

### 📝 Maintenance Tips

1. **Backup Regular**
   - Database: Setiap minggu via cPanel
   - Files: Setiap deploy baru

2. **Monitor Logs**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **Update Deployment (Jika pakai Git)**
   ```bash
   cd /home/username/laravel-app
   git pull origin main
   composer install --no-dev
   npm run build
   php artisan migrate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

4. **Security**
   - Jangan expose `.env`
   - Gunakan HTTPS (SSL)
   - Update Laravel secara regular
   - Ubah password admin secara berkala

---

## 📞 Support

Jika ada masalah:
1. Periksa `storage/logs/laravel.log`
2. Periksa error log hosting (cPanel → Error Log)
3. Test dengan `APP_DEBUG=true` (jangan lupa matikan lagi!)

**Good luck! 🚀**
