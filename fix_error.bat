@echo off
echo Fixing galleryPreview error...
echo.
echo Killing existing node processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Clearing npm cache...
npm cache clean --force

echo.
echo Deleting node_modules and reinstalling...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
npm install

echo.
echo Starting dev server...
echo Run: npm run dev
echo.
echo If error persists, try:
echo 1. Hard refresh browser (Ctrl+Shift+R)
echo 2. Clear browser cache
echo 3. Restart VS Code
echo.
pause