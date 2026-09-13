// content.js - X Smart Cleaner Content Script v1.1.0

const BEARER = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

let deepScanActive = false;

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

// Get current logged-in user handle from DOM
function getCurrentUser() {
  const accountBtn = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
  if (accountBtn) {
    const text = accountBtn.innerText || '';
    const handleMatch = text.match(/@([A-Za-z0-9_]+)/);
    if (handleMatch) return handleMatch[1];
  }
  // Fallback from link in nav
  const profileLink = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
  if (profileLink) {
    const href = profileLink.getAttribute("href") || "";
    const clean = href.replace(/^\//, '').split('/')[0];
    if (clean) return clean;
  }
  return null;
}

// Unfollow via internal Twitter API v1.1
async function unfollowUserViaAPI(username, userId = null) {
  const ct0 = getCookie("ct0");
  if (!ct0) throw new Error("کوکی ct0 یافت نشد؛ مطمئن شوید در x.com لاگین هستید.");

  const bodyData = userId 
    ? `user_id=${encodeURIComponent(userId)}` 
    : `screen_name=${encodeURIComponent(username)}`;

  const response = await fetch("https://x.com/i/api/1.1/friendships/destroy.json", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${BEARER}`,
      "x-csrf-token": ct0,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "content-type": "application/x-www-form-urlencoded"
    },
    body: bodyData
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`خطای سرور توییتر (${response.status}): ${errText.slice(0, 100)}`);
  }
  return await response.json();
}

// Unfollow via simulated DOM interaction (Safe Fallback)
async function unfollowUserViaDOM(username) {
  const u = username.toLowerCase();
  const cells = Array.from(document.querySelectorAll('[data-testid="UserCell"]'));
  let targetCell = null;

  for (const cell of cells) {
    const userLink = cell.querySelector('a[href^="/"]');
    const href = userLink ? userLink.getAttribute("href") : "";
    const name = href ? href.replace(/^\//, '').split('/')[0].toLowerCase() : "";
    if (name === u) {
      targetCell = cell;
      break;
    }
  }

  if (!targetCell) {
    throw new Error(`سلول کاربری @${username} در صفحه قابل مشاهده نیست.`);
  }

  // Find Following button
  const followBtn = targetCell.querySelector('button[aria-label*="Following"], button[aria-label*="دنبال می‌کنید"], [data-testid$="-unfollow"]');
  if (!followBtn) {
    throw new Error(`دکمه فالویینگ برای @${username} پیدا نشد.`);
  }

  followBtn.click();
  await new Promise(r => setTimeout(r, 400));

  // Find confirmation dialog confirm button
  const confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]');
  if (confirmBtn) {
    confirmBtn.click();
    await new Promise(r => setTimeout(r, 400));
    return { success: true, method: "DOM" };
  }

  return { success: true, method: "DOM_DIRECT" };
}

// Helper: Scan currently visible DOM cells
function extractVisibleCells() {
  const cells = Array.from(document.querySelectorAll('[data-testid="UserCell"]'));
  const list = [];

  for (const cell of cells) {
    const text = cell.innerText || "";
    const followsYou = text.includes("Follows you") || text.includes("شما را دنبال می‌کند");
    const userLink = cell.querySelector('a[href^="/"]');
    const href = userLink ? userLink.getAttribute("href") : "";
    const username = href ? href.replace(/^\//, '').split('/')[0] : "";
    const name = (cell.querySelector('div[dir="ltr"] span') || {}).innerText || username;
    
    // Check if following button exists
    const btn = cell.querySelector('button[aria-label*="Following"], button[aria-label*="دنبال می‌کنید"], [data-testid$="-unfollow"]');
    
    if (username && !username.includes("/")) {
      list.push({
        username,
        displayName: name,
        followsYou,
        canUnfollow: !!btn
      });
    }
  }
  return list;
}

// Deep auto-scroll collector
async function deepScrollScan(maxTarget = 300, onProgress) {
  deepScanActive = true;
  const userMap = new Map();
  let noNewCount = 0;
  let lastCount = 0;

  while (deepScanActive && userMap.size < maxTarget) {
    const visible = extractVisibleCells();
    for (const item of visible) {
      if (!userMap.has(item.username.toLowerCase())) {
        userMap.set(item.username.toLowerCase(), item);
      }
    }

    if (userMap.size === lastCount) {
      noNewCount++;
      if (noNewCount >= 5) break; // End of list reached
    } else {
      noNewCount = 0;
      lastCount = userMap.size;
    }

    if (onProgress) {
      onProgress(userMap.size);
    }

    // Scroll down smoothly
    window.scrollBy({ top: 750, behavior: 'smooth' });
    await new Promise(r => setTimeout(r, 700));
  }

  deepScanActive = false;
  return Array.from(userMap.values());
}

// Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    const user = getCurrentUser();
    const ct0 = getCookie("ct0");
    sendResponse({ ok: true, user, hasAuth: !!ct0 });
    return true;
  }

  if (request.action === "UNFOLLOW_USER") {
    const { username, userId, mode } = request;
    
    // Try API first, fallback to DOM
    if (mode === "dom_only") {
      unfollowUserViaDOM(username)
        .then(res => sendResponse({ ok: true, method: "DOM", result: res }))
        .catch(err => sendResponse({ ok: false, error: err.message }));
      return true;
    }

    unfollowUserViaAPI(username, userId)
      .then(res => sendResponse({ ok: true, method: "API", result: res }))
      .catch(apiErr => {
        // Fallback to DOM click if API fails
        unfollowUserViaDOM(username)
          .then(res => sendResponse({ ok: true, method: "DOM_FALLBACK", result: res }))
          .catch(domErr => sendResponse({ ok: false, error: `API: ${apiErr.message} | DOM: ${domErr.message}` }));
      });
    return true;
  }

  if (request.action === "SCAN_DOM_PAGE") {
    const isDeep = !!request.deepScan;
    const maxTarget = request.maxTarget || 200;

    if (isDeep) {
      deepScrollScan(maxTarget)
        .then(items => sendResponse({ ok: true, count: items.length, items }))
        .catch(err => sendResponse({ ok: false, error: err.message }));
      return true;
    } else {
      const items = extractVisibleCells();
      sendResponse({ ok: true, count: items.length, items });
      return true;
    }
  }

  if (request.action === "STOP_DEEP_SCAN") {
    deepScanActive = false;
    sendResponse({ ok: true });
    return true;
  }
});
