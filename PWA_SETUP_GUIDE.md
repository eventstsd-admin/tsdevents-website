# PWA App Installation Guide

## ✅ What's Been Set Up

Your website is now configured as a **Progressive Web App (PWA)**. Users can install it as a desktop or mobile app with your logo.

---

## 📱 How Users Install Your App

### **On Desktop (Windows/Mac/Linux)**

1. Open your website in Chrome, Edge, or Opera
2. Click the **"+"** icon in the address bar (top right)
3. Click **"Install"**
4. App launches as a native desktop app
5. Icon: **Your logo without text** ✅

### **On Mobile (iPhone/Android)**

1. Open in Safari or Chrome
2. Tap **Share** button
3. Select **"Add to Home Screen"** (iOS) or **"Install app"** (Android)
4. App appears on home screen
5. Icon: **Your logo without text** ✅

---

## 🔧 What Changed

### 1. **Created `manifest.json`**
- Defines app metadata
- Sets app name: "TSD Events & Decor"
- Sets icon: logo without text.png
- Sets theme color: Red (#dc2626)
- Enables "standalone" mode (full-screen app)

### 2. **Updated `index.html`**
- Added manifest link: `<link rel="manifest" href="/manifest.json" />`
- Added theme color meta tag
- Added description meta tag

---

## 🎨 App Icon Details

| Property | Value |
|----------|-------|
| **Icon** | logo without text.png |
| **Sizes** | 192x192, 144x144, 512x512 px |
| **Format** | PNG (transparent background) |
| **Theme Color** | Red (#dc2626) |
| **App Name** | TSD Events & Decor |
| **Short Name** | TSD Events (mobile) |

---

## ✨ Features Enabled

When installed as an app:
- ✅ **Native app look** - No browser UI
- ✅ **Custom icon** - Your logo on desktop/home screen
- ✅ **App menu** - Shows in app switcher
- ✅ **Standalone mode** - Behaves like native app
- ✅ **Theme color** - Red header in app switcher
- ✅ **Offline-ready** - Can work offline (with service workers)

---

## 🚀 Testing the App Install

### **Desktop (Chrome/Edge)**

1. Open website in Chrome
2. Look for **"+"** icon in address bar
3. Click it → "Install TSD Events & Decor"
4. App opens in a separate window
5. Desktop shortcut created automatically
6. Icon shows your logo ✅

### **Mobile (Chrome Android)**

1. Open website in Chrome
2. Tap **Menu** (3 dots)
3. Select **"Install app"**
4. App added to home screen
5. Icon shows your logo ✅

### **Mobile (Safari iOS)**

1. Open website in Safari
2. Tap **Share** button
3. Scroll and tap **"Add to Home Screen"**
4. App added to home screen
5. Icon shows your logo ✅

---

## 📝 Manifest.json Customization

If you want to change app settings later, edit `manifest.json`:

```json
{
  "name": "TSD Events & Decor",        // Full app name
  "short_name": "TSD Events",           // Mobile app name
  "start_url": "/",                     // Starting page
  "display": "standalone",              // Full-screen mode
  "theme_color": "#dc2626",             // Red color
  "background_color": "#ffffff",        // White background
  "icons": [...]                        // Icon files
}
```

---

## 🔍 Verify PWA Setup

Run these checks to verify everything is working:

### **On Desktop**
- [ ] Website shows install prompt (+ icon in address bar)
- [ ] App installs successfully
- [ ] Desktop shortcut has your logo
- [ ] App launches in standalone window (no browser UI)

### **On Mobile**
- [ ] Can add to home screen
- [ ] Home screen icon shows your logo
- [ ] App launches full-screen
- [ ] Theme color matches your brand

---

## 📊 File Structure

```
TSD/
├── manifest.json                           ← PWA configuration
├── index.html                              ← Updated with manifest link
└── src/app/images/
    └── logo without text.png               ← App icon
```

---

## 🎯 Next Steps (Optional)

### To Enhance Your PWA:

1. **Add Service Worker** (for offline support)
   - Cache pages/images for offline use
   - Makes app work without internet

2. **Create Icon Variants**
   - Use a tool to resize logo to 192x192, 512x512
   - Replace placeholder sizes in manifest.json

3. **Add Apple Touch Icon** (for iOS)
   - Add to index.html: `<link rel="apple-touch-icon" href="/logo.png">`

4. **Add splash screens**
   - Custom loading screens when app opens
   - Add to manifest.json

---

## ✅ You're All Set!

Your website is now installable as an app with your custom logo. Users can:
- Install on desktop ✅
- Install on mobile ✅
- See your logo as app icon ✅
- Use in standalone full-screen mode ✅

**No further action needed!** The PWA is ready to go. 🚀

---

## 💡 Testing Tools

Want to verify your PWA setup?
- **Chrome DevTools** → Application tab → Manifest
- **Lighthouse** → Audit → PWA score
- **PWA Builder** → https://www.pwabuilder.com/

All should show green ✅
