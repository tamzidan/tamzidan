# ✅ Upload Checklist

## 📦 File & Folder yang WAJIB Di-Upload

### ✅ Folder Utama Laravel (Upload ke `/home/username/laravel-app/`)

```
✅ app/                      (Semua code aplikasi)
✅ bootstrap/                (Bootstrap Laravel)
   ✅ cache/                 (Kosongkan isinya, cukup folder)
✅ config/                   (Konfigurasi)
✅ database/                 (Migrations, seeders, factories)
   ✅ migrations/
   ✅ seeders/
   ✅ factories/
✅ public/                   (Assets & entry point - lihat detail di bawah)
✅ resources/                (Views, JS, CSS source)
   ✅ js/
   ✅ views/
   ✅ css/
✅ routes/                   (Route definitions)
   ✅ web.php
   ✅ api.php
   ✅ console.php
✅ storage/                  (File storage & cache - lihat detail di bawah)
✅ artisan                   (CLI tool)
✅ composer.json
✅ composer.lock
✅ package.json              (Optional, untuk build di server)
✅ package-lock.json         (Optional)
✅ vite.config.js            (Optional)
```

### ✅ Folder public/ (Pindah ke `/home/username/public_html/`)

```
✅ public/build/             (Frontend assets yang sudah di-build)
   ✅ assets/                (JS, CSS compiled)
   ✅ manifest.json
✅ public/index.php          (Entry point Laravel)
✅ public/.htaccess          (Apache config)
✅ public/favicon.ico        (Optional)
✅ public/robots.txt         (Optional)
```

### ✅ Folder storage/ (Permissions PENTING!)

```
✅ storage/app/
   ✅ public/                (File uploads - KOSONGKAN dulu!)
      ✅ comments/           (Hapus isi, biarkan folder)
      ✅ portfolios/         (Hapus isi, biarkan folder)
      ✅ certificates/       (Hapus isi, biarkan folder)
✅ storage/framework/
   ✅ cache/                 (Kosongkan)
   ✅ sessions/              (Kosongkan)
   ✅ views/                 (Kosongkan)
✅ storage/logs/             (Kosongkan, atau hapus isi .log)
```

---

## ❌ File & Folder yang JANGAN Di-Upload

```
❌ node_modules/            (Terlalu besar, install ulang jika perlu)
❌ vendor/                  (Install via composer di server)
❌ .env                     (Buat baru di server dengan .env.production)
❌ .env.backup
❌ .git/                    (Opsional, bisa di-upload jika pakai Git di server)
❌ .vscode/
❌ .idea/
❌ .fleet/
❌ tests/                   (Opsional, tidak diperlukan di production)
❌ .phpunit.result.cache
❌ npm-debug.log
❌ yarn-error.log
❌ storage/logs/*.log       (Hapus file log lama)
❌ storage/app/public/*     (Hapus file upload lokal)
```

---

## 🔐 File yang Perlu Dikonfigurasi Ulang di Server

### 1. `.env` (PENTING!)
- ✅ Copy `.env.production` ke server
- ✅ Rename menjadi `.env`
- ✅ Edit dengan kredensial hosting:
  ```env
  APP_ENV=production
  APP_DEBUG=false
  APP_URL=https://yourdomain.com
  DB_HOST=localhost
  DB_DATABASE=your_database_name
  DB_USERNAME=your_database_user
  DB_PASSWORD=your_database_password
  ```
- ✅ Generate key: `php artisan key:generate`

### 2. `public_html/index.php`
- ✅ Update path ke Laravel:
  ```php
  require __DIR__.'/../laravel-app/vendor/autoload.php';
  (require_once __DIR__.'/../laravel-app/bootstrap/app.php')
  ```

### 3. Permissions
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### 4. Symlink
```bash
php artisan storage:link
```

---

## 📊 Estimasi Ukuran Upload

Jika sudah di-compress (ZIP):
```
📦 Total size (tanpa vendor & node_modules):
   - app/                ~5 MB
   - public/build/       ~2 MB
   - resources/          ~10 MB
   - storage/ (empty)    ~1 MB
   - Other files         ~2 MB
   ═══════════════════════════
   TOTAL                 ~20 MB

💡 Dengan vendor/ (jika tidak install via composer):
   TOTAL                 ~50-80 MB
```

---

## 🚀 Metode Upload yang Disarankan

### 🥇 Metode 1: Git (Paling Efisien)
```bash
# Di server via SSH:
git clone https://github.com/your-repo.git laravel-app
cd laravel-app
composer install --no-dev
npm run build  # Jika server support Node.js
```

**Kelebihan:**
- Update mudah (git pull)
- Tidak perlu upload manual
- History lengkap

**Kekurangan:**
- Butuh SSH access
- Repository harus public/private accessible

### 🥈 Metode 2: ZIP Upload via cPanel
```bash
# Di lokal:
1. Jalankan deploy.bat
2. Compress folder menjadi ZIP (kecuali vendor, node_modules)
3. Upload ZIP ke cPanel File Manager
4. Extract di server
5. composer install --no-dev
```

**Kelebihan:**
- Tidak butuh SSH
- User-friendly
- Cocok untuk shared hosting

**Kekurangan:**
- Update manual setiap kali
- Upload bisa lama jika koneksi lambat

### 🥉 Metode 3: FTP/SFTP (FileZilla)
```
1. Connect via FileZilla
2. Upload folder satu per satu
3. Monitor progress
```

**Kelebihan:**
- Resume jika terputus
- Selective upload (hanya file yang berubah)

**Kekurangan:**
- Paling lambat
- Bisa error jika banyak file kecil

---

## ✅ Pre-Upload Checklist

Sebelum upload, pastikan:

- [ ] Sudah run `deploy.bat` atau `deploy.sh`
- [ ] Frontend assets sudah di-build (`public/build/` exists)
- [ ] `composer.lock` ter-update
- [ ] File `.env.production` sudah disiapkan
- [ ] Storage folder sudah di-clear dari file lokal
- [ ] Logs sudah di-clear
- [ ] Database sudah di-export (jika ada data penting)
- [ ] Backup project lokal

---

## ✅ Post-Upload Checklist

Setelah upload, lakukan:

- [ ] Copy `.env.production` → `.env`
- [ ] Edit `.env` dengan kredensial hosting
- [ ] Run: `composer install --no-dev` (jika belum)
- [ ] Run: `php artisan key:generate`
- [ ] Run: `php artisan storage:link`
- [ ] Run: `php artisan migrate --force`
- [ ] Set permissions: `chmod -R 775 storage bootstrap/cache`
- [ ] Test website: `https://yourdomain.com`
- [ ] Test admin login
- [ ] Test upload foto/gambar
- [ ] Check browser console untuk error
- [ ] Matikan debug: `APP_DEBUG=false`

---

## 🆘 Quick Troubleshooting

### Error 500
```bash
# Enable debug sementara
APP_DEBUG=true

# Check log
tail -f storage/logs/laravel.log

# Clear cache
php artisan config:clear
php artisan cache:clear
```

### Assets not loading
```bash
# Re-build
npm run build

# Re-upload public/build/
```

### Permission denied
```bash
chmod -R 775 storage
chmod -R 775 bootstrap/cache
```

### Storage link broken
```bash
rm public_html/storage
php artisan storage:link
```

---

**✅ Siap upload? Ikuti DEPLOYMENT-GUIDE.md untuk langkah detail!**
