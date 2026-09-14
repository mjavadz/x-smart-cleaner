// content.js - X Smart Cleaner Pro Content Script v2.1.0

const BEARER = "AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA";

let deepScanActive = false;
const userMetadataCache = new Map(); // username.toLowerCase() -> { followersCount, followingCount, ... }

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
  return match ? decodeURIComponent(match[3]) : null;
}

// Format numbers nicely (e.g. 15400 -> 15.4K, 1200000 -> 1.2M)
function formatNumber(num) {
  if (num === null || num === undefined) return "—";
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

// Inject in-page network hook to intercept Twitter's GraphQL responses
function injectNetworkInterceptor() {
  const scriptContent = `
    (function() {
      if (window._xSmartCleanerInjected) return;
      window._xSmartCleanerInjected = true;

      function extractUsersFromObject(obj, results = []) {
        if (!obj || typeof obj !== 'object') return results;
        
        // Match Twitter user legacy format
        if (obj.screen_name && (obj.followers_count !== undefined || obj.friends_count !== undefined)) {
          const img = obj.profile_image_url_https || obj.profile_image_url || '';
          const isDefaultImg = !!obj.default_profile_image || img.includes('default_profile_images');
          results.push({
            screen_name: obj.screen_name,
            name: obj.name,
            followers_count: obj.followers_count || 0,
            friends_count: obj.friends_count || 0,
            statuses_count: obj.statuses_count || 0,
            is_default_avatar: isDefaultImg,
            followed_by: !!obj.followed_by,
            following: !!obj.following,
            verified: !!obj.verified || !!obj.is_blue_verified,
            description: obj.description || ''
          });
        }

        for (const key of Object.keys(obj)) {
          try {
            if (obj[key] && typeof obj[key] === 'object') {
              extractUsersFromObject(obj[key], results);
            }
          } catch (e) {}
        }
        return results;
      }

      // Hook fetch
      const originalFetch = window.fetch;
      window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        try {
          const url = args[0] ? args[0].toString() : '';
          if (url.includes('/graphql/') || url.includes('/users/') || url.includes('/Following')) {
            const clone = response.clone();
            clone.json().then(data => {
              const users = extractUsersFromObject(data);
              if (users.length > 0) {
                window.postMessage({ type: 'X_SMART_CLEANER_USERS_DISCOVERED', users }, '*');
              }
            }).catch(() => {});
          }
        } catch (e) {}
        return response;
      };
    })();
  `;

  const scriptEl = document.createElement("script");
  scriptEl.textContent = scriptContent;
  (document.head || document.documentElement).appendChild(scriptEl);
  scriptEl.remove();
}

injectNetworkInterceptor();

// Listen to messages from the in-page interceptor
window.addEventListener("message", (event) => {
  if (event.source !== window || !event.data) return;
  if (event.data.type === "X_SMART_CLEANER_USERS_DISCOVERED" && Array.isArray(event.data.users)) {
    for (const u of event.data.users) {
      if (u.screen_name) {
        userMetadataCache.set(u.screen_name.toLowerCase(), {
          followersCount: u.followers_count,
          followingCount: u.friends_count,
          statusesCount: u.statuses_count,
          isDefaultAvatar: !!u.is_default_avatar,
          followedBy: u.followed_by,
          following: u.following,
          isVerified: u.verified,
          bio: u.description
        });
      }
    }
  }
});

// Batch enrich usernames with accurate follower counts via Twitter internal API
async function enrichUsersWithFollowersCount(usernames) {
  const ct0 = getCookie("ct0");
  if (!ct0 || usernames.length === 0) return;

  // Filter those not in cache
  const missing = usernames.filter(u => !userMetadataCache.has(u.toLowerCase()));
  if (missing.length === 0) return;

  // Batch in chunks of 100
  for (let i = 0; i < missing.length; i += 100) {
    const chunk = missing.slice(i, i + 100);
    try {
      const url = `https://x.com/i/api/1.1/users/lookup.json?screen_name=${encodeURIComponent(chunk.join(','))}&include_entities=false`;
      const resp = await fetch(url, {
        method: "GET",
        headers: {
          "authorization": `Bearer ${BEARER}`,
          "x-csrf-token": ct0,
          "x-twitter-active-user": "yes",
          "x-twitter-auth-type": "OAuth2Session"
        }
      });

      if (resp.ok) {
        const data = await resp.json();
        for (const u of data) {
          if (u.screen_name) {
            const img = u.profile_image_url_https || u.profile_image_url || '';
            const isDef = !!u.default_profile_image || img.includes('default_profile_images');
            userMetadataCache.set(u.screen_name.toLowerCase(), {
              followersCount: u.followers_count || 0,
              followingCount: u.friends_count || 0,
              statusesCount: u.statuses_count || 0,
              isDefaultAvatar: isDef,
              followedBy: !!u.followed_by,
              following: !!u.following,
              isVerified: !!u.verified || !!u.is_blue_verified,
              bio: u.description || ''
            });
          }
        }
      }
    } catch (e) {
      console.warn("[X Smart Cleaner] Batch lookup notice:", e);
    }
  }
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
    if (response.status === 429) {
      throw new Error(`429 Rate limit: Twitter API rate limit reached. Cool down needed.`);
    }
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

// Extract rich user data from visible cells & enrich from cache
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
    
    // Bio description
    const textNodes = cell.querySelectorAll('div[dir="auto"]');
    let bio = "";
    if (textNodes.length > 2) {
      bio = textNodes[textNodes.length - 1].innerText || "";
    }

    const btn = cell.querySelector('button[aria-label*="Following"], button[aria-label*="دنبال می‌کنید"], [data-testid$="-unfollow"]');
    
    // Retrieve cached metadata (followers count, etc.)
    const meta = userMetadataCache.get(username.toLowerCase()) || {};
    const followersCount = meta.followersCount !== undefined ? meta.followersCount : null;
    const isDefaultAvatar = (avatarUrl && avatarUrl.includes("default_profile_images")) || !!meta.isDefaultAvatar;
    const isGhost = isDefaultAvatar || (meta.statusesCount === 0);

    if (username && !username.includes("/")) {
      list.push({
        username,
        displayName,
        avatarUrl,
        isVerified: isVerified || !!meta.isVerified,
        bio: bio || meta.bio || "",
        followersCount: followersCount,
        formattedFollowers: formatNumber(followersCount),
        isDefaultAvatar: isDefaultAvatar,
        isGhost: isGhost,
        followsYou: followsYou || !!meta.followedBy,
        canUnfollow: !!btn
      });
    }
  }
  return list;
}

// Deep scroll scan with batch metadata enrichment
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

  const collectedUsers = Array.from(userMap.values());
  
  // Enrich collected users with followers counts via batch lookup
  const usernamesToEnrich = collectedUsers.map(u => u.username);
  await enrichUsersWithFollowersCount(usernamesToEnrich);

  // Update final objects with enriched counts
  for (const user of collectedUsers) {
    const meta = userMetadataCache.get(user.username.toLowerCase());
    if (meta) {
      if (meta.followersCount !== undefined) {
        user.followersCount = meta.followersCount;
        user.formattedFollowers = formatNumber(meta.followersCount);
      }
      if (meta.isVerified) user.isVerified = true;
      if (meta.followedBy) user.followsYou = true;
      if (meta.bio && !user.bio) user.bio = meta.bio;
      if (meta.isDefaultAvatar) user.isDefaultAvatar = true;
      if (user.isDefaultAvatar || meta.statusesCount === 0) user.isGhost = true;
    }
  }

  return collectedUsers;
}

// Runtime message listener
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
      const usernames = items.map(u => u.username);
      enrichUsersWithFollowersCount(usernames).then(() => {
        for (const user of items) {
          const meta = userMetadataCache.get(user.username.toLowerCase());
          if (meta && meta.followersCount !== undefined) {
            user.followersCount = meta.followersCount;
            user.formattedFollowers = formatNumber(meta.followersCount);
            if (meta.isVerified) user.isVerified = true;
            if (meta.followedBy) user.followsYou = true;
          }
        }
        sendResponse({ ok: true, count: items.length, items });
      }).catch(() => {
        sendResponse({ ok: true, count: items.length, items });
      });
      return true;
    }
  }

  if (request.action === "STOP_DEEP_SCAN") {
    deepScanActive = false;
    sendResponse({ ok: true });
    return true;
  }
});
