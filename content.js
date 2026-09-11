// content.js - X Smart Cleaner Content Script

const BEARER = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? match[3] : null;
}

// Get current logged-in user handle from DOM or account settings
function getCurrentUser() {
  const accountBtn = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"]');
  if (accountBtn) {
    const text = accountBtn.innerText || '';
    const handleMatch = text.match(/@([A-Za-z0-9_]+)/);
    if (handleMatch) return handleMatch[1];
  }
  return null;
}

// Unfollow a user by ID using Twitter's internal API
async function unfollowUserById(userId) {
  const ct0 = getCookie("ct0");
  if (!ct0) throw new Error("ct0 cookie not found. Please ensure you are logged in.");

  const response = await fetch("https://x.com/i/api/1.1/friendships/destroy.json", {
    method: "POST",
    headers: {
      "authorization": `Bearer ${BEARER}`,
      "x-csrf-token": ct0,
      "x-twitter-active-user": "yes",
      "x-twitter-auth-type": "OAuth2Session",
      "content-type": "application/x-www-form-urlencoded"
    },
    body: `user_id=${encodeURIComponent(userId)}`
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API Error ${response.status}: ${errText.slice(0, 100)}`);
  }
  return await response.json();
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    const user = getCurrentUser();
    const ct0 = getCookie("ct0");
    sendResponse({ ok: true, user, hasAuth: !!ct0 });
    return true;
  }

  if (request.action === "UNFOLLOW_USER") {
    unfollowUserById(request.userId)
      .then(res => sendResponse({ ok: true, result: res }))
      .catch(err => sendResponse({ ok: false, error: err.message }));
    return true;
  }

  if (request.action === "SCAN_DOM_PAGE") {
    // Scan current visible cells on https://x.com/*/following
    const cells = Array.from(document.querySelectorAll('[data-testid="UserCell"]'));
    const results = [];

    for (const cell of cells) {
      const text = cell.innerText || "";
      const followsYou = text.includes("Follows you") || text.includes("شما را دنبال می‌کند");
      const userLink = cell.querySelector('a[href^="/"]');
      const href = userLink ? userLink.getAttribute("href") : "";
      const username = href ? href.replace(/^\//, '').split('/')[0] : "";
      
      // Look for unfollow button
      const btn = cell.querySelector('button[aria-label*="Following"], button[aria-label*="دنبال می‌کنید"]');
      
      if (username) {
        results.push({
          username,
          followsYou,
          canUnfollow: !!btn
        });
      }
    }

    sendResponse({ ok: true, count: results.length, items: results });
    return true;
  }
});
