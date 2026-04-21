# 🎨 Fix App Icon - Native Android

## ❌ Problem:
App install karne ke baad default round Expo icon dikha raha hai, custom logo nahi dikha raha.

## 🔍 Root Cause:
Android native folder me WebP format me default icons hain. EAS build ne app.json se icons generate nahi kiye.

## ✅ Solution:

### Method 1: Regenerate Native Icons (Recommended)

```bash
# Step 1: Clean Android folder icons
npx expo prebuild --clean

# Step 2: This will regenerate icons from app.json
# Icons will be created in all mipmap folders
```

### Method 2: Manual Icon Generation

Use online tool to generate all sizes:
https://easyappicon.com/
https://appicon.co/

Upload your logo.png and download Android icons.

### Method 3: Use expo-icon CLI

```bash
# Install
npm install -g @expo/icon-builder

# Generate icons
expo-icon --foreground ./assets/logo.png --background "#ffffff"
```

---

## 🎯 Required Icon Sizes:

Android needs icons in multiple resolutions:

```
mipmap-mdpi/     48x48   (1x)
mipmap-hdpi/     72x72   (1.5x)
mipmap-xhdpi/    96x96   (2x)
mipmap-xxhdpi/   144x144 (3x)
mipmap-xxxhdpi/  192x192 (4x)
```

Each folder needs:
- ic_launcher.png (square icon)
- ic_launcher_round.png (round icon)
- ic_launcher_foreground.png (adaptive foreground)

---

## 🔧 Quick Fix (Easiest):

### Step 1: Update app.json

Make sure icon paths are correct:

```json
{
  "android": {
    "icon": "./assets/icon.png",
    "adaptiveIcon": {
      "foregroundImage": "./assets/adaptive-icon.png",
      "backgroundColor": "#ffffff"
    }
  }
}
```

### Step 2: Regenerate with Prebuild

```bash
npx expo prebuild --clean
```

This will:
- Delete old WebP icons
- Generate new PNG icons from your logo
- Create all required sizes
- Update AndroidManifest.xml

### Step 3: Rebuild APK

```bash
eas build --platform android --profile preview
```

---

## 🎨 Icon Design Tips:

### For Best Results:

1. **Icon.png (1024x1024):**
   - Square format
   - Can have background color
   - Used for iOS and fallback

2. **Adaptive-icon.png (1024x1024):**
   - Transparent background (PNG with alpha)
   - Logo in center 66% (safe zone)
   - Android will add background color
   - Can be shaped (circle, square, squircle)

3. **Background Color:**
   - Set in app.json: `"backgroundColor": "#ffffff"`
   - Shows behind adaptive icon
   - Should complement logo

---

## ⚠️ Common Mistakes:

### ❌ Wrong:
- Logo too close to edges
- No transparency in adaptive icon
- Wrong file format (JPEG instead of PNG)
- Icon too small (less than 1024x1024)

### ✅ Right:
- Logo centered in safe zone (66%)
- PNG with transparency
- 1024x1024 resolution
- High quality, no blur

---

## 🚀 Complete Fix Steps:

### Step 1: Verify Icon Files

```bash
# Check if files exist
ls -la assets/icon.png
ls -la assets/adaptive-icon.png
```

### Step 2: Clean and Regenerate

```bash
# Clean native folders
npx expo prebuild --clean

# This regenerates everything
```

### Step 3: Check Generated Icons

```bash
# Check if icons were generated
ls android/app/src/main/res/mipmap-hdpi/
ls android/app/src/main/res/mipmap-xhdpi/
ls android/app/src/main/res/mipmap-xxhdpi/
```

Should see:
- ic_launcher.png
- ic_launcher_round.png
- ic_launcher_foreground.png

### Step 4: Rebuild APK

```bash
eas build --platform android --profile preview
```

### Step 5: Install and Test

1. Uninstall old app
2. Install new APK
3. Check home screen icon
4. Should show custom logo! ✅

---

## 🔍 Debug: Check What Icon is Being Used

### In Android Studio:

1. Open `android` folder in Android Studio
2. Navigate to `res/mipmap-*` folders
3. Check if custom icons are there
4. If WebP files exist, delete them
5. Add PNG files manually

### Manual Icon Placement:

If prebuild doesn't work, manually copy icons:

```bash
# Copy to all mipmap folders
cp custom-icons/ic_launcher.png android/app/src/main/res/mipmap-hdpi/
cp custom-icons/ic_launcher.png android/app/src/main/res/mipmap-xhdpi/
# ... repeat for all folders
```

---

## 💡 Alternative: Use Icon Generator Tool

### Online Tools:

1. **EasyAppIcon.com:**
   - Upload logo.png
   - Select Android
   - Download zip
   - Extract to res folders

2. **AppIcon.co:**
   - Upload 1024x1024 PNG
   - Generate all sizes
   - Download and replace

3. **MakeAppIcon.com:**
   - Free icon generator
   - Supports adaptive icons
   - Generates all sizes

---

## 🎯 Expected Result:

After fix:
- ✅ Home screen shows custom logo
- ✅ App drawer shows custom logo
- ✅ Recent apps shows custom logo
- ✅ No default Expo icon
- ✅ Adaptive icon works (circle/square/squircle)

---

## 📝 Checklist:

- [ ] Icon files exist (icon.png, adaptive-icon.png)
- [ ] Files are 1024x1024 PNG
- [ ] Adaptive icon has transparency
- [ ] app.json configured correctly
- [ ] Run `npx expo prebuild --clean`
- [ ] Check generated icons in mipmap folders
- [ ] Rebuild APK with EAS
- [ ] Uninstall old app
- [ ] Install new APK
- [ ] Verify icon on home screen

---

## 🚀 Quick Command:

```bash
# One command to fix everything
npx expo prebuild --clean && eas build --platform android --profile preview
```

This will:
1. Clean native folders
2. Regenerate icons from app.json
3. Build new APK with correct icons

---

**Try this and let me know if icon appears!** 🎨
