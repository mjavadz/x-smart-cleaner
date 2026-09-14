# Privacy Policy for X Smart Cleaner Pro

**Last Updated:** September 2026  
**Developer:** Mohammad J. ([@mjavadz](https://github.com/mjavadz))  
**Repository:** [https://github.com/mjavadz/x-smart-cleaner](https://github.com/mjavadz/x-smart-cleaner)

---

## 1. Overview and Core Philosophy (Zero-Knowledge)

**X Smart Cleaner Pro** is an open-source, 100% client-side Chromium extension engineered to help users safely review and manage their following list on X (formerly Twitter).

Our core privacy commitment is absolute: **We do not collect, store, transmit, sell, or monitor any personal user data, cookies, authentication tokens, or browsing history.** Everything executes strictly inside your local browser instance.

---

## 2. Information We DO NOT Collect

* **No Credentials or Passwords:** The extension never asks for, captures, or transmits your X/Twitter password, authentication cookies (`auth_token`, `ct0`), or session tokens.
* **No Remote Telemetry or Tracking:** The extension contains zero analytics SDKs (no Google Analytics, no Mixpanel, no trackers, no external beacons).
* **No External Servers:** There are no backend servers or databases associated with this extension. All network requests for Twitter actions are made directly between your browser and official Twitter/X APIs (`https://x.com/*`).
* **No Third-Party Sharing:** Since we never collect your data, we have nothing to sell, rent, or transfer to any third party.

---

## 3. Local Data Storage (`chrome.storage.local`)

The extension uses Chrome's built-in local storage (`chrome.storage.local`) solely on your machine to save your user preferences:

1. **Language Preference (`appLang`):** Persian (`fa`) or English (`en`).
2. **Safety Settings:**
   * Whitelist handles you choose to protect.
   * Bio keywords you specify.
   * Follower count threshold and verified account protection toggles.
3. **Execution History (`unfollowHistory`):** A timestamped record of accounts you unfollowed using this extension, stored strictly on your computer so you can review them or perform a 1-click Re-Follow.
4. **Active Task State (`activeUnfollowTask`):** Keeps track of background progress and rate-limit cooldown timers.

*Note: This data is stored locally in your browser sandbox and is automatically purged if you uninstall the extension or click "Clear History" inside the extension popup.*

---

## 4. Explanation of Browser Permissions

Under Google's **Minimum Permissions Policy**, X Smart Cleaner Pro requests only the permissions strictly necessary for its functionality:

| Permission | Technical Reason |
| :--- | :--- |
| `storage` | Required to save your safety rules (whitelist, keywords), language preference, and local unfollow history on your machine. |
| `activeTab` | Allows the extension to inspect your active following page on `x.com` only when you explicitly interact with the extension. |
| `scripting` | Required to execute the content scanner that extracts visible profiles and calculates non-followers. |
| `notifications` | Used to send a native desktop alert when a background batch completes or when Twitter issues a temporary 429 rate-limit cooldown. |
| `alarms` | Used to manage the background countdown timer during smart rate-limit cooldowns. |
| `host_permissions` (`https://x.com/*`, `https://twitter.com/*`) | Strictly scoped to Twitter/X web domains to allow the content script to detect following status and execute safe API requests. |

---

## 5. Third-Party Web Services

This extension interacts solely with official endpoints of **X (Twitter)** under the user's active session. We are not affiliated with, endorsed by, or sponsored by X Corp. Users are advised to operate the tool in accordance with Twitter's Terms of Service and automated action policies.

---

## 6. Open Source Verification

The entire source code of X Smart Cleaner Pro is public and open-source under the MIT License at:  
👉 **[https://github.com/mjavadz/x-smart-cleaner](https://github.com/mjavadz/x-smart-cleaner)**

Anyone can audit the source code to verify that no network requests are sent outside of official X/Twitter endpoints.

---

## 7. Contact

If you have questions or feedback regarding this Privacy Policy or the extension, please open an issue on GitHub:  
- **GitHub Issues:** [https://github.com/mjavadz/x-smart-cleaner/issues](https://github.com/mjavadz/x-smart-cleaner/issues)
