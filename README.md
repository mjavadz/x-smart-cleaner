# 🛡️ X Smart Cleaner Pro (پالایشگر هوشمند و ایمن توییتر)

[![Version](https://img.shields.io/badge/version-2.1.0-blue.svg)](https://github.com/mjavadz/x-smart-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: Zero-Knowledge](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen.svg)](#-privacy--security-امنیت)
[![i18n: Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20Persian-orange.svg)](#-bilingual-support)

A high-performance, open-source, and 100% local Chromium extension (Chrome, Brave, Edge, Arc) to **safely identify and unfollow non-followers on X (Twitter)** with Background Service Worker execution, real GraphQL follower extraction, interactive candidate checklist, 1-click undo history, and anti-spam randomized human delays.

افزونه‌ای مدرن، متن‌باز و کاملاً محلی برای مرورگرهای کرومیوم جهت **شناسایی و آنفالوی ایمن اکانت‌های بدون بک در توییتر** با قابلیت اجرای نامحدود در پس‌زمینه (Service Worker)، واکشی دقیق تعداد فالوورها بر مبنای وب‌سرویس‌های GraphQL توییتر، چک‌لیست تعاملی، تاریخچه و بازگردانی ۱-کلیکه، و فواصل تصادفی رفتار انسانی.

---

## 🚀 What's New in v2.1.0 (تغییرات نسخه ۲.۱.۰)

- ⚙️ **Background Service Worker Execution (اجرای کامل در پس‌زمینه):**
  - عملیات آنفالو به موتور پس‌زمینه (`background.js`) منتقل شد. اکنون می‌توانید پس از فشردن دکمه «شروع»، با خیال راحت پنجره پاپ‌آپ افزونه را ببندید یا به کارهای دیگر بپردازید.
  - پس از پایان پارت، اعلان رسمی دسکتاپ (Chrome Desktop Notification) نمایش داده می‌شود.
- 📊 **Accurate Follower Extraction via GraphQL & Batch API (دیتای واقعی فالوورها):**
  - شنودگر سبک و ایمن جهت استخراج داده‌های وب‌سرویس داخلی توییتر (`/graphql/` و `/users/lookup`).
  - فیلتر شهرت (حفظ اکانت‌های بالای ۲۰,۰۰۰ فالور) اکنون بر مبنای **تعداد دقیق و واقعی فالوورها در سرور توییتر** کار می‌کند.
  - نمایش نشانگر زنده تعداد فالوورها (مانند `👥 215M` یا `👥 12.4K`) در کنار هر کاربر در تب لیست انتخابی.
- 🚨 **Smart 429 Rate-Limit Cooldown (سپر استراحت هوشمند):**
  - در صورت دریافت خطای ۴۲۹ (محدودیت موقت توییتر)، فرآیند جهت حفظ امنیت اکانت فوراً متوقف و هشدار داده می‌شود.
- 🌐 **Full Bilingual Support (EN / FA):** جابجایی ۱-کلیکه زبان با چیدمان پویای راست‌چین و چپ‌چین.
- 📋 **Interactive Candidate Checklist:** جستجوی زنده، آواتارها، نشان تیک آبی، و انتخاب دستی پیش از آنفالو.
- 📜 **History & 1-Click Undo (Re-Follow):** سابقه تمام آنفالوها با دکمه فالوی مجدد فوری در صورت نیاز.
- 📥 **CSV Backup Export:** دانلود فایل اکسل/CSV حاوی تمامی جزئیات پیش از شروع پاک‌سازی.

---

## 📸 Architecture & Views / ساختار تب‌ها

| Tab | Feature | ویژگی |
|---|---|---|
| ⚡️ **Dashboard** | Background worker trigger, Bento stats, speed profiles, live terminal logs | اجرای پس‌زمینه، آمار بنتو، سرعت انسانی، لاگ زنده |
| 📋 **Candidates** | Real follower count badge (`👥 K/M`), searchable checklist, bulk select/deselect | بج تعداد فالوور واقعی، جستجو و چک‌لیست انتخابی |
| 📜 **History** | Persistent timestamped logs with 1-click Re-Follow | تاریخچه دائمی با امکان بازگردانی ۱-کلیکه |
| 🛡️ **Safety Rules** | Real GraphQL fame threshold (>20k), Verified badge shield, Bio keyword filter | فیلتر دقیق فالوور، محافظت تیک آبی و کلمات کلیدی بایو |

---

## 💻 Quick Installation (راهنمای نصب سریع)

### Method 1: Pre-packaged ZIP (Recommended)
1. Download the latest **[x-smart-cleaner-v2.1.0.zip](https://github.com/mjavadz/x-smart-cleaner/releases/tag/v2.1.0)** from Releases.
2. Unzip the downloaded file.
3. Open your browser and navigate to:
   ```text
   chrome://extensions/
   ```
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the unzipped directory.
6. The extension is installed and ready in your toolbar!

### روش اول: دانلود فایل فشرده آماده
۱. فایل فشرده نسخه جدید را از بخش **[Releases](https://github.com/mjavadz/x-smart-cleaner/releases/tag/v2.1.0)** دانلود و اکسترکت کنید.  
۲. در مرورگر به آدرس `chrome://extensions/` بروید.  
۳. گزینه **Developer mode (حالت توسعه‌دهنده)** را فعال کنید.  
۴. روی دکمه **Load unpacked** کلیک کرده و پوشه افزونه را انتخاب کنید.  

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
2. Click the extension icon in your toolbar (status turns green).
3. Set your batch size and speed profile in Dashboard.
4. Click **"1. Scan Following"** (Deep Auto-Scroll will harvest and query exact follower counts).
5. *(Optional)* Switch to the **Candidates** tab to uncheck any specific accounts or use **"Backup CSV"** to save a spreadsheet.
6. Click **"2. Start in Background"** — you can freely close the popup; the background service worker handles the rest and sends a notification upon completion!

---

## 🔒 Privacy & Security (امنیت و حریم خصوصی)
Unlike typical commercial unfollow apps:
* ❌ Never asks for username, password, or auth tokens.
* ❌ Never contacts any external server or telemetry service.
* ❌ Never makes simultaneous burst requests that trigger Twitter's anti-bot locks.
* ✅ Runs 100% locally inside your browser using your natural session.
* ✅ Fully auditable open-source code.

---

## 📜 License
Released under the open-source **[MIT License](LICENSE)**.  
Made with ☕ by [@entheogenous](https://x.com/entheogenous).
