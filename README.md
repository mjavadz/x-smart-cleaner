# 🛡️ X Smart Cleaner Pro (پالایشگر هوشمند و ایمن توییتر)

[![Version](https://img.shields.io/badge/version-2.3.0-blue.svg)](https://github.com/mjavadz/x-smart-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: Zero-Knowledge](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen.svg)](#-privacy--security-امنیت)
[![i18n: Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20Persian-orange.svg)](#-bilingual-support)

A high-performance, open-source, and 100% local Chromium extension (Chrome, Brave, Edge, Arc) to **safely identify and unfollow non-followers on X (Twitter)** with Daily Safety Limits, 1-Click Whitelist, Ghost/Egg Account Detection, Simulation Mode (Dry Run), Smart 429 Cooldown Shield, Background Service Worker execution, and real GraphQL follower extraction.

افزونه‌ای مدرن، متن‌باز و کاملاً محلی برای مرورگرهای کرومیوم جهت **شناسایی و آنفالوی ایمن اکانت‌های بدون بک در توییتر** با سقف ایمن روزانه (۲۴ ساعته)، افزودن ۱-کلیکه به لیست سفید از داخل جدول، تشخیص هوشمند اکانت‌های فاقد عکس و مرده (Ghost/Egg)، حالت شبیه‌سازی بدون ریسک (Dry Run)، سپر هوشمند استراحت در برابر لیمیت توییتر (Smart 429 Cooldown Shield)، اجرای نامحدود در پس‌زمینه (Service Worker) و تاریخچه بازگردانی ۱-کلیکه.

---

## 🚀 What's New in v2.3.0 (ویژگی‌های جدید نسخه ۲.۳.۰)

- 🛡️ **1-Click Whitelist from Candidate List (افزودن سریع به لیست سفید):**
  - در کنار هر اکانت در تب «لیست انتخابی»، دکمه‌ی سریع `🛡️` اضافه شد تا با یک کلیک بتوانید دوستان یا افراد مهم را برای همیشه به وایت‌لیست اضافه و فوراً از فهرست کاندیداها حذف کنید.

- ⏱️ **24-Hour Daily Safety Quota (سقف ایمنی ۲۴ ساعته و توقف خودکار):**
  - شمارنده زنده و نوار پیشرفت مصرف روزانه در داشبورد (`آنفالوهای امروز: X / Y`).
  - امکان تنظیم سقف روزانه (۵۰، ۱۰۰ پیشنهادی، ۱۵۰ یا نامحدود).
  - سیستم با پر شدن سقف روزانه جهت پیشگیری ۱۰۰٪ از لیمیت اکانت، فرآیند را به طور خودکار متوقف و تا روز بعد محافظت می‌کند.

- 🥚 **Ghost & Default Avatar Account Detector (تشخیص اکانت‌های مرده و فاقد عکس):**
  - شناسایی هوشمند اکانت‌های دارای آواتار پیش‌فرض توییتر (تخم‌مرغی/بدون عکس) یا صفر توییت با بج اختصاصی `🥚 بی‌عکس`.
  - دکمه جدید در نوار ابزار: `فقط بدون عکس‌ها (🥚)` برای پاک‌سازی اولویت‌دار و مطمئن اکانت‌های هرز و مرده.

- 📂 **Import / Export Whitelist (خروجی و بارگذاری فایل لیست سفید):**
  - دانلود لیست سفید در قالب فایل متنی و امکان بارگذاری مستقیم لیست‌های حجیم با ۱ کلیک بدون نیاز به تایپ دستی.

- 🧪 **Simulation Mode (Dry Run):** ارزیابی ایمن معیارها و خروجی گزارش CSV بدون آنفالوی واقعی.
- 🛡️ **Smart 429 Cooldown Shield:** توقف هوشمند و ادامه خودکار پس از استراحت در صورت لیمیت موقت توییتر.
- ⚙️ **Background Service Worker Execution:** اجرای نامحدود در پس‌زمینه بدون نیاز به باز بودن پاپ‌آپ.

---

## 📸 Architecture & Views / ساختار تب‌ها

| Tab | Feature | ویژگی |
|---|---|---|
| ⚡️ **Dashboard** | Daily Quota Tracker, Simulation Mode, Smart 429 Shield, Background Worker, Bento stats | سقف مصرف ۲۴ ساعته، حالت شبیه‌سازی، سپر ۴۲۹، اجرای پس‌زمینه |
| 📋 **Candidates** | 1-Click Whitelist, Ghost/Egg filter, Real follower badges (`👥 K/M`), Searchable checklist | وایت‌لیست سریع، فیلتر اکانت‌های مرده، بج فالوور واقعی |
| 📜 **History** | Persistent timestamped logs with 1-click Re-Follow | تاریخچه دائمی با امکان بازگردانی ۱-کلیکه |
| 🛡️ **Safety Rules** | Whitelist Export/Import, GraphQL fame threshold (>20k), Verified shield, Bio keywords | خروجی/ورودی فایل وایت‌لیست، فیلتر شهرت و بایو |

---

## 💻 Quick Installation (راهنمای نصب سریع)

### Method 1: Pre-packaged ZIP (Recommended)
1. Download the latest **[x-smart-cleaner-v2.3.0.zip](https://github.com/mjavadz/x-smart-cleaner/releases/tag/v2.3.0)** from Releases.
2. Unzip the downloaded archive.
3. Open your browser and navigate to `chrome://extensions/`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the unzipped directory.
6. Pin **X Smart Cleaner Pro** in your toolbar and use it directly on `x.com/*/following`.

### روش اول: دانلود فایل فشرده آماده
۱. فایل فشرده نسخه جدید را از بخش **[Releases](https://github.com/mjavadz/x-smart-cleaner/releases/tag/v2.3.0)** دانلود و اکسترکت کنید.  
۲. در مرورگر به آدرس `chrome://extensions/` بروید.  
۳. گزینه **Developer mode (حالت توسعه‌دهنده)** را از گوشه بالا فعال کنید.  
۴. روی دکمه **Load unpacked** کلیک کرده و پوشه اکسترکت‌شده را انتخاب نمایید.  
۵. افزونه را در نوار ابزار پین کنید و در صفحه `x.com/*/following` اجرا کنید.

---

## 🔒 Privacy & Security (امنیت و حریم خصوصی)

- **Zero-Knowledge Architecture:** کلیه فرآیندها به صورت ۱۰۰٪ محلی درون مرورگر کاربر اجرا می‌شوند.
- **بدون دیتابیس خارجی:** هیچ توکن، کوکی، رمز عبور یا دیتای کاربر به هیچ سرور خارجی ارسال نمی‌شود.
- **سورس کاملاً شفاف:** کدها به صورت متن‌باز و قابل بازرسی منتشر شده‌اند.

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
