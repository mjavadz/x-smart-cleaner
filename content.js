// content.js - X Smart Cleaner Pro Content Script v2.0.0

const BEARER = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

let deepScanActive = false;

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

// Get current logged-in user handle
function getCurrentUser() {
  const accountBtn = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
  if (accountBtn) {
    const text = accountBtn.innerText || '';
    const handleMatch = text.match(/@([A-Za-z0-9_]+)/);
    if (handleMatch) return handleMatch[1];
  }
  const profileLink = document.querySelector('a[data-testid="AppTabBar_Profile_Link"]');
  if (profileLink) {
    const href = profileLink.getAttribute("href") || "";
    const clean = href.replace(/^\//, '').split('/')[0];
    if (clean) return clean;
  }
  return null;
}

// Unfollow via API
async function unfollowUserViaAPI(username, userId = null) {
  const ct0 = getCookie("ct0");
  if (!ct0) throw new Error("کوکی ct0 یافت نشد؛ در x.com لاگین کنید.");

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
    throw new Error(`Twitter API error (${response.status}): ${errText.slice(0, 100)}`);
  }
  return await response.json();
}

// Re-follow (Undo) via API
async function refollowUserViaAPI(username) {
  const ct0 = getCookie("ct0");
  if (!ct0) throw new Error("کوکی ct0 یافت نشد؛ در x.com لاگین کنید.");

  const response = await fetch("https://x.com/i/api/1.1/friendships/create.json", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${BEARER}`,
      "x-csrf-token": ct0,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "content-type": "application/x-www-form-urlencoded"
    },
    body: `screen_name=${encodeURIComponent(username)}&follow=true`
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Twitter API error (${response.status}): ${errText.slice(0, 100)}`);
  }
  return await response.json();
}

// Unfollow via DOM fallback
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
    throw new Error(`اکانت @${username} در دید صفحه نیست.`);
  }

  const followBtn = targetCell.querySelector('button[aria-label*="Following"], button[aria-label*="دنبال می‌کنید"], [data-testid$="-unfollow"]');
  if (!followBtn) {
    throw new Error(`دکمه فالویینگ برای @${username} یافت نشد.`);
  }

  followBtn.click();
  await new Promise(r => setTimeout(r, 400));

  const confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]');
  if (confirmBtn) {
    confirmBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }
  return { success: true, method: "DOM" };
}

// Extract rich user data from visible cells
function extractVisibleCells() {
  const cells = Array.from(document.querySelectorAll('[data-testid="UserCell"]'));
  const list = [];

  for (const cell of cells) {
    const text = cell.innerText || "";
    const followsYou = text.includes("Follows you") || text.includes("شما را دنبال می‌کند");
    
    // Username & Profile link
    const userLink = cell.querySelector('a[href^="/"]');
    const href = userLink ? userLink.getAttribute("href") : "";
    const username = href ? href.replace(/^\//, '').split('/')[0] : "";
    
    // Display Name
    const nameEl = cell.querySelector('div[dir="ltr"] span') || cell.querySelector('span');
    const displayName = nameEl ? nameEl.innerText : username;
    
    // Avatar image URL
    const img = cell.querySelector('img[src*="profile_images"]');
    const avatarUrl = img ? img.getAttribute("src") : null;
    
    // Verified badge check
    const isVerified = !!cell.querySelector('[data-testid="icon-verified"]');
    
    // Bio description in cell
    const textNodes = cell.querySelectorAll('div[dir="auto"]');
    let bio = "";
    if (textNodes.length > 2) {
      bio = textNodes[textNodes.length - 1].innerText || "";
    }

    const btn = cell.querySelector('button[aria-label*="Following"], button[aria-label*="دنبال می‌کنید"], [data-testid$="-unfollow"]');
    
    if (username && !username.includes("/")) {
      list.push({
        username,
        displayName,
        avatarUrl,
        isVerified,
        bio,
        followsYou,
        canUnfollow: !!btn
      });
    }
  }
  return list;
}

// Deep scroll scan
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
      if (noNewCount >= 5) break;
    } else {
      noNewCount = 0;
      lastCount = userMap.size;
    }

    if (onProgress) onProgress(userMap.size);

    window.scrollBy({ top: 750, behavior: 'smooth' });
    await new Promise(r => setTimeout(r, 700));
  }

  deepScanActive = false;
  return Array.from(userMap.values());
}

// Runtime listeners
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    const user = getCurrentUser();
    const ct0 = getCookie("ct0");
    sendResponse({ ok: true, user, hasAuth: !!ct0 });
    return true;
  }

  if (request.action === "UNFOLLOW_USER") {
    const { username, userId, mode } = request;
    if (mode === "dom_only") {
      unfollowUserViaDOM(username)
        .then(res => sendResponse({ ok: true, method: "DOM", result: res }))
        .catch(err => sendResponse({ ok: false, error: err.message }));
      return true;
    }

    unfollowUserViaAPI(username, userId)
      .then(res => sendResponse({ ok: true, method: "API", result: res }))
      .catch(apiErr => {
        unfollowUserViaDOM(username)
          .then(res => sendResponse({ ok: true, method: "DOM_FALLBACK", result: res }))
          .catch(domErr => sendResponse({ ok: false, error: `API: ${apiErr.message} | DOM: ${domErr.message}` }));
      });
    return true;
  }

  if (request.action === "REFOLLOW_USER") {
    refollowUserViaAPI(request.username)
      .then(res => sendResponse({ ok: true, result: res }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
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
