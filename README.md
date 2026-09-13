# 🛡️ X Smart Cleaner Pro (پالایشگر هوشمند و ایمن توییتر)

[![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)](https://github.com/mjavadz/x-smart-cleaner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Privacy: Zero-Knowledge](https://img.shields.io/badge/Privacy-100%25%20Local-brightgreen.svg)](#-privacy--security-امنیت)
[![i18n: Bilingual](https://img.shields.io/badge/i18n-English%20%7C%20Persian-orange.svg)](#-bilingual-support)

A high-performance, open-source, and 100% local Chromium extension (Chrome, Brave, Edge, Arc) to **safely identify and unfollow non-followers on X (Twitter)** with Simulation Mode (Dry Run), Smart Rate-Limit Cooldown Shield (429), Background Service Worker execution, real GraphQL follower extraction, interactive candidate checklist, and 1-click undo history.

افزونه‌ای مدرن، متن‌باز و کاملاً محلی برای مرورگرهای کرومیوم جهت **شناسایی و آنفالوی ایمن اکانت‌های بدون بک در توییتر** با حالت شبیه‌سازی بدون ریسک (Dry Run)، سپر هوشمند استراحت در برابر لیمیت توییتر (Smart 429 Cooldown Shield)، اجرای نامحدود در پس‌زمینه (Service Worker)، واکشی دقیق تعداد فالوورها (GraphQL)، چک‌لیست انتخابی و تاریخچه بازگردانی ۱-کلیکه.

---

## 🚀 What's New in v2.2.0 (ویژگی‌های جدید نسخه ۲.۲.۰)

- 🧪 **Simulation Mode / Dry Run (حالت شبیه‌سازی ۱۰۰٪ امن و بدون ریسک):**
  - امکان اجرای کامل چرخه اسکن و ارزیابی بدون اینکه حتی ۱ اکانت واقعاً آنفالو شود.
  - مناسب برای اعتبارسنجی فیلترها و بررسی لیست کاندیداها قبل از اقدام واقعی.
  - **خروجی گزارش آزمایشی (Export Simulation CSV):** دانلود مستقیم فایل اکسل/CSV حاوی لیست کاربران شناسایی‌شده، تعداد فالوور، وضعیت تیک آبی و دلیل تطابق.

- 🛡️ **Smart Cooldown & Rate-Limit Shield (سپر هوشمند استراحت ۴۲۹):**
  - محافظت فعال از اکانت در صورت اعمال محدودیت موقت از سوی توییتر (HTTP 429).
  - ورود خودکار به دوره استراحت ۱۵ دقیقه‌ای همراه با شمارش معکوس زنده در پاپ‌آپ و اعلان دسکتاپ.
  - **ادامه خودکار (Auto-Resume):** فرآیند پس از اتمام دوره استراحت، به طور خودکار از سر گرفته می‌شود بدون اینکه پیشرفت از دست برود.
  - دکمه‌های کنترل دستی شامل «ادامه فوری» و «افزایش زمان استراحت (+۱۰ دقیقه)».

- ⚙️ **Background Service Worker Execution (اجرای نامحدود در پس‌زمینه):**
  - بدون نیاز به باز نگه داشتن پنجره افزونه؛ پاپ‌آپ را ببندید و به کارهای دیگر برسید.
  - ارسال نوتیفیکیشن سیستمی دسکتاپ در پایان کار.

- 📊 **Accurate Follower Extraction via GraphQL:**
  - فیلتر هوشمند شهرت (حفظ اکانت‌های بالای ۲۰k فالور) بر مبنای تعداد فالوورهای ۱۰۰٪ واقعی سرور توییتر.

- 🌐 **Full Bilingual Support (EN / FA):** جابجایی ۱-کلیکه زبان و جهت نوشتار (RTL/LTR).
- 📜 **History & 1-Click Undo (Re-Follow):** سابقه تمام آنفالوها با دکمه فالوی مجدد فوری.

---

## 📸 Architecture & Views / ساختار تب‌ها

| Tab | Feature | ویژگی |
|---|---|---|
| ⚡️ **Dashboard** | Simulation Mode (Dry Run), Smart 429 Cooldown Banner, Background Worker trigger, Bento stats | حالت شبیه‌سازی، سپر استراحت ۴۲۹، اجرای پس‌زمینه، آمار بنتو |
| 📋 **Candidates** | Real follower count badge (`👥 K/M`), searchable checklist, bulk select/deselect | بج تعداد فالوور واقعی، جستجو و چک‌لیست انتخابی |
| 📜 **History** | Persistent timestamped logs with 1-click Re-Follow | تاریخچه دائمی با امکان بازگردانی ۱-کلیکه |
| 🛡️ **Safety Rules** | Real GraphQL fame threshold (>20k), Verified badge shield, Bio keyword filter | فیلتر دقیق فالوور، محافظت تیک آبی و کلمات کلیدی بایو |

---

## 💻 Quick Installation (راهنمای نصب سریع)

### Method 1: Pre-packaged ZIP (Recommended)
1. Download the latest **[x-smart-cleaner-v2.2.0.zip](https://github.com/mjavadz/x-smart-cleaner/releases/tag/v2.2.0)** from Releases.
2. Unzip the downloaded archive.
3. Open your browser and navigate to `chrome://extensions/`.
4. Enable **Developer mode** in the top-right corner.
5. Click **Load unpacked** and select the unzipped directory.
6. Pin **X Smart Cleaner Pro** in your toolbar and use it directly on `x.com/*/following`.

### روش اول: دانلود فایل فشرده آماده
۱. فایل فشرده نسخه جدید را از بخش **[Releases](https://github.com/mjavadz/x-smart-cleaner/releases/tag/v2.2.0)** دانلود و اکسترکت کنید.  
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
