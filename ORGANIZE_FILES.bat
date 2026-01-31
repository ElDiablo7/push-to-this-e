@echo off
REM ===============================================
REM  GRACE-X FILM EDITION v7.0
REM  File Organization Script
REM ===============================================

title GRACE-X FILM EDITION - File Organization

echo.
echo ========================================================
echo   🎬 GRACE-X FILM EDITION v7.0
echo   Organizing Files into Proper Folders
echo ========================================================
echo.

cd /d "%~dp0"

REM ===============================================
REM Move Documentation Files
REM ===============================================
echo [STEP 1/4] Moving documentation files...

move /Y "BOOT_GUIDE.md" "documentation\" >nul 2>&1
move /Y "BOOT_SCREEN_README.md" "documentation\" >nul 2>&1
move /Y "BRAIN_CONNECTION_STATUS.md" "documentation\" >nul 2>&1
move /Y "BRAIN_UPDATE_INSTRUCTIONS.md" "documentation\" >nul 2>&1
move /Y "BRAIN_WIRING_AUDIT_3RD_JAN.md" "documentation\" >nul 2>&1
move /Y "BRAIN_WIRING_COMPLETE_AUDIT.md" "documentation\" >nul 2>&1
move /Y "BULLETPROOF_AUDIT_JAN7.md" "documentation\" >nul 2>&1
move /Y "CHANGELOG_v6.4.1.md" "documentation\" >nul 2>&1
move /Y "CHANGELOG_v6.5.0.md" "documentation\" >nul 2>&1
move /Y "DEFINITIVE_AUDIT_JAN4.md" "documentation\" >nul 2>&1
move /Y "DEPLOYMENT_READY_JAN_10.md" "documentation\" >nul 2>&1
move /Y "DEPLOYMENT.md" "documentation\" >nul 2>&1
move /Y "DIRECTORY_STRUCTURE.md" "documentation\" >nul 2>&1
move /Y "FIRST_TIME_SETUP.md" "documentation\" >nul 2>&1
move /Y "FORGE_FIXED_JAN29.md" "documentation\" >nul 2>&1
move /Y "FORGE_MODULE_AUDIT_AND_PATCHES_JAN29.md" "documentation\" >nul 2>&1
move /Y "FREE_SPORTS_API_GUIDE.md" "documentation\" >nul 2>&1
move /Y "FRONTEND_UPGRADE_GUIDE.md" "documentation\" >nul 2>&1
move /Y "FULL_SYSTEM_AUDIT_PATCH_JAN4.md" "documentation\" >nul 2>&1
move /Y "GALVANIZED_FEATURES.md" "documentation\" >nul 2>&1
move /Y "GRACEX_SYSTEM_SUMMARY.md" "documentation\" >nul 2>&1
move /Y "LASER_DOCUMENTATION.md" "documentation\" >nul 2>&1
move /Y "POLISH_DOCUMENTATION.md" "documentation\" >nul 2>&1
move /Y "QUICK_SETUP_FREE_TIERS.md" "documentation\" >nul 2>&1
move /Y "QUICKSTART.md" "documentation\" >nul 2>&1
move /Y "README_FIXES.md" "documentation\" >nul 2>&1
move /Y "README_SPORT_UPGRADE.md" "documentation\" >nul 2>&1
move /Y "SECURITY_AUDIT_REPORT_JAN29_2026.md" "documentation\" >nul 2>&1
move /Y "SETUP_SONNET4.md" "documentation\" >nul 2>&1
move /Y "SPORT_CHANGELOG.md" "documentation\" >nul 2>&1
move /Y "SPORT_MODULE_V7_UPGRADE_GUIDE.md" "documentation\" >nul 2>&1
move /Y "SPORT_QUICK_START.md" "documentation\" >nul 2>&1
move /Y "SPORT_README.md" "documentation\" >nul 2>&1
move /Y "TITAN_AUDIT_REPORT_2025_01_01.md" "documentation\" >nul 2>&1
move /Y "ULTIMATE_EDITION_README.md" "documentation\" >nul 2>&1
move /Y "VOICE_REFERENCE_v6.4.1.md" "documentation\" >nul 2>&1
move /Y "BATCH_FILES_GUIDE.md" "documentation\" >nul 2>&1

echo [OK] Documentation files moved

REM ===============================================
REM Move Old HTML Files
REM ===============================================
echo [STEP 2/4] Moving old HTML files...

move /Y "index_clean.html" "archive\old_html_files\" >nul 2>&1
move /Y "index_old_backup.html" "archive\old_html_files\" >nul 2>&1
move /Y "index_PATCHED.html" "archive\old_html_files\" >nul 2>&1
move /Y "index_v7.1_backup.html" "archive\old_html_files\" >nul 2>&1
move /Y "start.html" "archive\old_html_files\" >nul 2>&1
move /Y "CONNECTION_TEST.html" "archive\old_html_files\" >nul 2>&1
move /Y "CORE2_LAUNCH.html" "archive\old_html_files\" >nul 2>&1
move /Y "SYSTEM_TEST.html" "archive\old_html_files\" >nul 2>&1

echo [OK] Old HTML files archived

REM ===============================================
REM Move Patch/Upgrade Files
REM ===============================================
echo [STEP 3/4] Moving patches and upgrade files...

move /Y "apply_patches.sh" "archive\patches_and_upgrades\" >nul 2>&1
move /Y "cleanup.sh" "archive\patches_and_upgrades\" >nul 2>&1
move /Y "START_GALVANIZED.sh" "archive\patches_and_upgrades\" >nul 2>&1
move /Y "START.sh" "archive\patches_and_upgrades\" >nul 2>&1
move /Y "STOP.sh" "archive\patches_and_upgrades\" >nul 2>&1
move /Y "install_sport_upgrade.sh" "archive\patches_and_upgrades\" >nul 2>&1
move /Y "dev-tools.js" "archive\patches_and_upgrades\" >nul 2>&1
move /Y "upgrade_files" "archive\patches_and_upgrades\" >nul 2>&1

echo [OK] Patches and upgrades archived

REM ===============================================
REM Move Environment Template Files
REM ===============================================
echo [STEP 4/4] Moving config templates...

move /Y "env.template" "config\" >nul 2>&1
move /Y "BIG_ZAC.env.TXT" "config\" >nul 2>&1
move /Y "SPORT MODULE MASTER DOC.txt" "documentation\" >nul 2>&1

echo [OK] Config files organized

echo.
echo ========================================================
echo   ✅ FILE ORGANIZATION COMPLETE
echo ========================================================
echo.
echo Folders organized:
echo   - documentation\ (All .md files)
echo   - archive\old_html_files\ (Old HTML backups)
echo   - archive\patches_and_upgrades\ (Old upgrade files)
echo   - config\ (Configuration templates)
echo   - OLD_BATCH_FILES\ (Old batch scripts)
echo.
echo Root folder is now clean!
echo.
pause
