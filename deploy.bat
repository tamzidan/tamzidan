@echo off
REM ============================================
REM Laravel Production Deployment Script (Windows)
REM ============================================
REM Jalankan script ini SEBELUM upload ke hosting
REM ============================================

echo.
echo ============================================
echo    Laravel Production Build
echo ============================================
echo.

REM Step 1: Install dependencies
echo [1/5] Installing production dependencies...
call composer install --optimize-autoloader --no-dev
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Composer install failed!
    pause
    exit /b 1
)
echo DONE: Composer dependencies installed
echo.

REM Step 2: Build frontend assets
echo [2/5] Building frontend assets...
call npm install
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend build failed!
    pause
    exit /b 1
)
echo DONE: Frontend assets built
echo.

REM Step 3: Clear all caches
echo [3/5] Clearing caches...
call php artisan config:clear
call php artisan cache:clear
call php artisan view:clear
call php artisan route:clear
echo DONE: Caches cleared
echo.

REM Step 4: Optimize for production
echo [4/5] Optimizing for production...
call php artisan config:cache
call php artisan route:cache
call php artisan view:cache
echo DONE: Optimization complete
echo.

REM Step 5: Create deployment info
echo [5/5] Creating deployment info...
echo Deployed at: %DATE% %TIME% > public\deploy-info.txt
echo DONE: Deployment info created
echo.

echo ============================================
echo    Production build complete!
echo ============================================
echo.
echo Next steps:
echo   1. Review DEPLOYMENT-GUIDE.md
echo   2. Copy .env.production to server as .env
echo   3. Update .env with hosting credentials
echo   4. Upload project to hosting
echo   5. Run: php artisan key:generate
echo   6. Run: php artisan migrate --force
echo   7. Run: php artisan storage:link
echo.
echo Ready to deploy!
echo.
pause
