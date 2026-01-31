# 🎬 GRACE-X FILM EDITION v7.0 - Batch Files Guide

## ✅ LATEST VERSION - USE THESE

### **START_FILM_EDITION.bat** (PRIMARY STARTER)
**This is the main file you should use!**

What it does:
1. ✅ Shows cache clearing instructions
2. ✅ Kills all old server instances (ports 3000 & 8080)
3. ✅ Checks/installs dependencies
4. ✅ Starts backend server (Port 3000)
5. ✅ Starts frontend server (Port 8080)
6. ✅ Opens browser automatically
7. ✅ Shows clear status messages

**How to use:**
- Double-click `START_FILM_EDITION.bat`
- Wait for "FILM EDITION ACTIVE 🎬" message
- Browser opens automatically at http://localhost:8080
- Leave the window open while using GRACE-X
- Close the window or press Ctrl+C to stop

---

### **STOP_FILM_EDITION.bat** (SHUTDOWN)
**Use this to stop all servers cleanly**

What it does:
1. ✅ Kills all processes on port 3000 (Backend)
2. ✅ Kills all processes on port 8080 (Frontend)
3. ✅ Closes any remaining GRACE-X windows

**How to use:**
- Double-click `STOP_FILM_EDITION.bat`
- Waits for confirmation
- All servers stopped

---

## 📂 OLD BATCH FILES (DO NOT USE)

All old batch files have been moved to the `OLD_BATCH_FILES\` folder:

- ❌ `START.bat` - Old generic starter
- ❌ `START_GALVANIZED.bat` - Old GALVANIZED v6.5.1 version
- ❌ `START_NO_ADMIN.bat` - Old no-admin version
- ❌ `START_BACKEND_ONLY.bat` - Old backend-only version
- ❌ `STOP.bat` - Old stop script
- ❌ `cleanup.bat` - Old cleanup script
- ❌ `apply_patches.bat` - Old patch applier
- ❌ `install_sport_upgrade.bat` - Old sport installer

**These are kept for reference only. Use the NEW FILM EDITION files!**

---

## 🎯 QUICK START

1. **First Time Setup:**
   - Make sure Node.js is installed
   - Double-click `START_FILM_EDITION.bat`
   - Wait for automatic dependency installation
   - Browser opens when ready

2. **Regular Use:**
   - Double-click `START_FILM_EDITION.bat`
   - Wait for "FILM EDITION ACTIVE 🎬"
   - Use GRACE-X in your browser
   - Close the batch window when done

3. **Troubleshooting:**
   - If ports are busy, run `STOP_FILM_EDITION.bat` first
   - Then run `START_FILM_EDITION.bat` again
   - Clear browser cache (Ctrl+Shift+Delete) if UI doesn't update

---

## 🔧 What Gets Killed on Startup

The `START_FILM_EDITION.bat` script automatically kills:
- Any process using port 3000 (backend)
- Any process using port 8080 (frontend)
- Any GRACE-X titled windows
- Any http-server processes

This ensures clean startup every time!

---

## 📊 Status Messages

### Good Messages (Everything Working):
```
[OK] Old servers killed
[OK] Backend dependencies found
[OK] Backend starting on http://localhost:3000
[OK] Opening browser at http://localhost:8080
```

### Error Messages (Need Action):
```
[FAIL] Dependency installation failed!
  - Check your internet connection
  - Try running as Administrator

[KILL] Terminating PID XXXX
  - Normal - just killing old servers
  - Not an error!
```

---

## 💡 Tips

**Cache Issues?**
- Use Incognito/Private mode
- Or press Ctrl+Shift+Delete to clear cache

**Port Already in Use?**
- Run `STOP_FILM_EDITION.bat` first
- Then start again

**Dependencies Not Installing?**
- Check internet connection
- Run `cd server && npm install` manually
- Make sure Node.js is installed

---

## 🎬 FILM EDITION FEATURES

This version includes:
- 17 Active Modules (TradeLink removed)
- Core Control Panel (enhanced)
- Cinema boot screen
- Film production branding
- Clean startup with auto-cleanup

---

**© 2026 Zac Crockett**  
**GRACE-X FILM EDITION v7.0**  
**AI PRO FILM PRODUCTION SUITE**

🎬 Use `START_FILM_EDITION.bat` - It's the latest!
