# Chrome Web Store Submission Guide & Copy-Paste Listing

این راهنما حاوی تمام متن‌ها، فرم‌ها، توجیه‌های دسترسی (Permission Justifications) و اطلاعاتی است که در پنل توسعه‌دهندگان گوگل کروم (**Chrome Web Store Developer Dashboard**) باید کپی و پیست کنید.

---

## ۱. اطلاعات اصلی فروشگاه (Product Details)

### نام افزونه (Extension Name):
* **Max 45 chars:**
```text
X Smart Cleaner Pro - Unfollow & Mutual Finder
```

### توضیح کوتاه (Summary / Short Description):
* **Max 132 chars (انگلیسی):**
```text
Safely find and clean non-followers on X (Twitter) with background worker, 429 shield, dry run simulation & 1-click re-follow.
```
* **نسخه فارسی (اختیاری در صورت انتخاب زبان پیش‌فرض فارسی):**
```text
پالایشگر هوشمند و ایمن توییتر: شناسایی اکانت‌های بدون بک، اجرای پس‌زمینه، سپر استراحت ۴۲۹ و بازگردانی ۱-کلیکه.
```

### دسته‌بندی (Category):
* **Primary Category:** `Productivity` (بهره‌وری) یا `Social & Communication` (ارتباطات و شبکه‌های اجتماعی)

### زبان پیش‌فرض (Default Language):
* `English` (توصیه می‌شود جهت پذیرش سریع‌تر در استور جهانی)

---

## ۲. متن کامل معرفی (Detailed Description)

```text
X Smart Cleaner Pro is an advanced, 100% client-side Chromium extension designed to help you safely audit and clean your Following list on X (formerly Twitter).

Built on Manifest V3 with a strict Zero-Knowledge architecture, this tool runs entirely inside your browser sandbox. No passwords, session cookies, or tokens are ever collected or sent to external servers.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ KEY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡️ Background Service Worker Execution:
No need to keep the popup window open. Trigger your cleanup batch and continue browsing or watching videos; the background service worker handles execution and alerts you with a native desktop notification when done.

🧪 Risk-Free Simulation Mode (Dry Run):
Test and preview your cleanup candidates before unfollowing anyone. Run a 100% safe simulation and export a detailed CSV report to inspect who matches your criteria.

🛡️ Smart 429 Cooldown Shield:
If Twitter issues a temporary rate limit (HTTP 429), the extension instantly pauses, protects your account, and activates an automatic 15-minute cooldown timer with auto-resume.

👥 Real GraphQL Follower Data & Fame Filter:
Directly parses Twitter's native GraphQL responses to accurately detect true follower counts. Protect high-value and authoritative accounts (e.g. >20k followers) from accidental removal.

📋 Interactive Candidate Checklist:
Search by name or handle, inspect verified badges, review bios, and selectively choose who to keep or unfollow.

📜 History & 1-Click Re-Follow (Undo):
Accidentally unfollowed someone? Every action is saved to your local timestamped history, allowing you to re-follow them with a single click.

📥 CSV Backup Export:
Export your entire candidate list to an Excel/CSV file with full user metrics before taking any action.

🌐 Full Bilingual Support:
Seamlessly switch between English and Persian (فارسی) with native RTL/LTR layout adaptation.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 PRIVACY & SECURITY COMMITMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Zero-Knowledge: 100% of the logic runs locally in your browser.
• Zero Telemetry: No analytics, no tracking, and no external databases.
• Direct Communication: All requests are made directly between your browser and official x.com endpoints.
• Open Source: Fully open-source and auditable on GitHub: https://github.com/mjavadz/x-smart-cleaner

Disclaimer: This extension is an independent open-source project and is not affiliated with, sponsored by, or endorsed by X Corp. / Twitter.
```

---

## ۳. برگه حریم خصوصی و توجیه دسترسی‌ها (Privacy Practices Tab)

گوگل برای هر دسترسی که در `manifest.json` تعریف شده است، از شما یک توضیح (Justification) می‌خواهد. این متن‌های دقیق و تاییدشده را عیناً در فیلدهای مربوطه وارد کنید:

### Single Purpose Description (توضیح هدف تک‌منظوره):
```text
The single purpose of this extension is to help users manage and clean their following list on X (Twitter) by identifying non-followers, providing safe filtering, and executing automated batch unfollows locally.
```

### Permission Justifications (توجیه دسترسی‌های سیستم):

1. **`storage`:**
```text
Used solely to store user preferences (language, custom whitelist, bio keywords, follower threshold), task progress, and local unfollow history on the user's device.
```

2. **`activeTab`:**
```text
Used to interact with the active x.com/following tab when the user opens the extension and initiates a scan or cleanup.
```

3. **`scripting`:**
```text
Required to inject content scripts into the active x.com page to detect non-followers and listen for GraphQL responses.
```

4. **`notifications`:**
```text
Used to display native desktop notifications when a background unfollow batch completes or when a rate-limit cooldown is triggered.
```

5. **`alarms`:**
```text
Used to manage the background countdown timer and schedule automatic resumption during rate-limit cooldowns.
```

### Host Permissions Justification (`https://x.com/*`, `https://twitter.com/*`):
```text
The extension operates strictly on X/Twitter web domains to read following relationships, identify mutuals vs non-followers, and execute safe unfollow/re-follow API requests.
```

### چک‌باکس‌های جمع‌آوری دیتا (Data Usage):
* در پاسخ به سؤال *"Does your extension collect or transmit user data?"*  
  گزینه **`No, I am not collecting or using user data`** را انتخاب کنید (تمام تیک‌های دیتای کاربری را خالی بگذارید).
* تیک تأییدیه **Limited Use Policy** را فعال کنید.

---

## ۴. آدرس وب و لینک سیاست حریم خصوصی (Privacy Policy URL)

* **Privacy Policy URL:**
```text
https://github.com/mjavadz/x-smart-cleaner/blob/main/PRIVACY.md
```
*(یا آدرس گیتهاب‌پیجز مخزن)*

* **Support / Contact URL:**
```text
https://github.com/mjavadz/x-smart-cleaner/issues
```
