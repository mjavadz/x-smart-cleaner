# 🛡️ X Smart Cleaner Pro (پالایشگر هوشمند و ایمن توییتر)

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/mjavadz/x-smart-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: Zero-Knowledge](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen.svg)](#-privacy--security-امنیت)
[![i18n: Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20Persian-orange.svg)](#-bilingual-support)

A clean, open-source, and 100% local Chromium extension (Chrome, Brave, Edge, Arc) to **safely identify and unfollow non-followers on X (Twitter)** with smart protection filters, interactive checklist, 1-click undo history, and anti-spam randomized human delays.

افزونه‌ای مدرن، متن‌باز و کاملاً محلی برای مرورگرهای کرومیوم جهت **شناسایی و آنفالوی ایمن اکانت‌های بدون بک در توییتر** با چک‌لیست تعاملی، تاریخچه و بازگردانی ۱-کلیکه، محافظت از تیک آبی، کلمات کلیدی بایو و فواصل تصادفی رفتار انسانی.

---

## 🚀 What's New in v2.0.0 (نسخه ۲.۰.۰)
- 🌐 **Full Bilingual Support (EN / FA):** One-click toggle between English and Persian (RTL/LTR dynamic adaptation).
- 📋 **Interactive Candidate Checklist:** Inspect all non-followers with avatar, name, handle, and verification badge. Search, filter, and manually check/uncheck users before unfollowing.
- 📜 **History & 1-Click Undo (Re-Follow):** Dedicated history tab tracking every unfollowed account with a 1-click "Re-Follow" button in case of mistakes.
- 🛡️ **Verified & Bio Protection:**
  - Automatically shield verified accounts (Blue checkmark & Organizations).
  - Bio keyword protection (protect any user with keywords like `dev`, `crypto`, `music`, etc.).
- 📥 **CSV Backup Export:** Instant Excel/CSV backup export of non-followers with full details.
- 📜 **Deep Auto-Scroll:** Hands-free background continuous DOM harvesting for large following lists.
- ⏱ **Adaptive Speed Profiles:**
  - **Stealth Mode:** 8.0 – 15.0s randomized human delay.
  - **Safe Standard:** 4.0 – 8.5s randomized delay (battle-tested across 1,300+ unfollows with 0 shadowbans).
  - **Fast Mode:** 2.5 – 4.5s.
- 🔄 **Zero-Knowledge Architecture:** 100% client-side execution in your browser session; no tokens, cookies, or passwords ever leave your machine.

---

## 📸 Overview / پیش‌نمایش

| Tab | Feature | ویژگی |
|---|---|---|
| ⚡️ **Dashboard** | Bento stats, quick speed controls, deep scan toggle, live terminal console | آمار بنتو، انتخاب سرعت، اسکرول عمیق، لاگ زنده |
| 📋 **Candidates** | Searchable checklist, avatars, bulk select/deselect | چک‌لیست انتخابی، جستجوی زنده، آواتارها |
| 📜 **History** | Unfollow logs with timestamp & 1-click Re-Follow | ثبت سابقه با تاریخ و دکمه بازگردانی (فالو مجدد) |
| 🛡️ **Safety Rules** | Follower threshold, Verified shield, Bio keyword filter, Whitelist | فیلتر فالور، محافظت تیک آبی، کلمات کلیدی بایو |

---

## 💻 Quick Installation (نصب در کمتر از ۱ دقیقه)

### Method 1: Pre-packaged ZIP (Recommended)
1. Download the latest **[x-smart-cleaner-v2.0.0.zip](https://github.com/mjavadz/x-smart-cleaner/releases/tag/v2.0.0)** from Releases.
2. Unzip the downloaded file.
3. Open your browser and navigate to:
   ```text
   chrome://extensions/
   ```
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the unzipped directory.
6. The extension is installed and ready in your toolbar!

### روش اول: دانلود فایل فشرده آماده
۱. فایل زیپ نسخه ۲ را از بخش **[Releases](https://github.com/mjavadz/x-smart-cleaner/releases/tag/v2.0.0)** دانلود و اکسترکت کنید.  
۲. در مرورگر به آدرس `chrome://extensions/` بروید.  
۳. گزینه **Developer mode** در بالا سمت راست را فعال کنید.  
۴. روی دکمه **Load unpacked** بزنید و پوشه افزونه را انتخاب کنید.  

---

### Method 2: Git Clone
```bash
git clone https://github.com/mjavadz/x-smart-cleaner.git
```
Then load the folder unpacked in `chrome://extensions/`.

---

## 📖 How to Use (راهنمای استفاده)
1. Open your Twitter/X Following page in a browser tab:  
   `https://x.com/YOUR_USERNAME/following`
2. Click the extension icon in your toolbar (status indicator turns green).
3. Set your batch size and speed profile in Dashboard.
4. Click **"1. Scan Following"**.
5. *(Optional)* Switch to the **Candidates** tab to uncheck any specific accounts or use **"Backup CSV"** to save a spreadsheet.
6. Click **"2. Start Unfollow"** and watch the live progress.

---

## 🔒 Privacy & Security (امنیت و حریم خصوصی)
Unlike typical unfollow tools:
* ❌ Never asks for username, password, or login credentials.
* ❌ Never uses external backend servers.
* ❌ Never makes simultaneous burst requests that trigger Twitter's anti-bot locks.
* ✅ Runs purely inside your own browser window using your existing session.
* ✅ Fully auditable open-source code.

---

## 📜 License
Released under the open-source **[MIT License](LICENSE)**.  
Made with ☕ by [@entheogenous](https://x.com/entheogenous).
