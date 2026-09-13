// popup.js - X Smart Cleaner Pro Controller v2.0.0

const I18N = {
  fa: {
    tagline: "پالایشگر هوشمند، ایمن و محلی توییتر",
    checking: "بررسی اتصال...",
    connected: "متصل به مرورگر",
    offline_msg: "لطفاً وارد x.com شوید",
    tab_dashboard: "داشبورد",
    tab_candidates: "لیست انتخابی",
    tab_history: "تاریخچه",
    tab_rules: "قوانین ایمنی",
    stat_scanned: "بررسی‌شده",
    stat_scanned_hint: "کل اسکن",
    stat_nonfollowers: "بدون فالوبک",
    stat_nonfollowers_hint: "واجد شرایط",
    stat_protected: "محافظت‌شده",
    stat_protected_hint: "متقابل / وایت‌لیست",
    label_batch: "سقف پارت:",
    label_speed: "سرعت و تاخیر:",
    speed_safe: "ایمن (۴-۸.۵s)",
    speed_stealth: "نامحسوس (۸-۱۵s)",
    speed_fast: "سریع (۲.۵-۴.۵s)",
    opt_all: "تمام موارد",
    deep_scan_label: "اسکرول عمیق و خودکار صفحه (Deep Auto-Scroll)",
    processing: "در حال پردازش...",
    btn_scan: "۱. اسکن لیست",
    btn_backup: "پشتیبان CSV",
    btn_unfollow: "۲. شروع آنفالو",
    btn_stop: "توقف",
    console_title: "📋 لاگ زنده فرآیند",
    clear: "پاک‌سازی",
    ready_hint: "منتظر شروع اسکن... تب Following در x.com را باز کنید.",
    select_all: "انتخاب همه",
    deselect_all: "لغو همه",
    selected_count: "انتخاب‌شده",
    no_candidates: "ابتدا در تب داشبورد دکمه «اسکن لیست» را بزنید.",
    history_title: "سابقه آنفالوهای انجام‌شده با این افزونه",
    clear_history: "پاک‌سازی تاریخچه",
    no_history: "هنوز هیچ اکانتی آنفالو نشده است.",
    rules_title: "🛡️ قوانین هوشمند محافظت از اکانت‌ها",
    rule_fame: "فیلتر شهرت (Follower Count):",
    fame_20k: "حفظ اکانت‌های بالای ۲۰,۰۰۰ فالور (پیشنهادی)",
    fame_10k: "حفظ اکانت‌های بالای ۱۰,۰۰۰ فالور",
    fame_50k: "حفظ اکانت‌های بالای ۵۰,۰۰۰ فالور",
    fame_0: "بدون فیلتر شهرت",
    rule_verified: "محافظت خودکار از اکانت‌های تیک آبی / رسمی",
    rule_bio: "کلمات کلیدی محافظت بایو (با کاما جدا کنید):",
    rule_bio_hint: "اگر بایوی اکانت شامل این کلمات باشد، هرگز آنفالو نمی‌شود.",
    rule_whitelist: "لیست سفید دائمی (آیدی‌ها را با کاما جدا کنید):",
    auto_save: "ذخیره خودکار",
    footer_privacy: "۱۰۰٪ محلی در مرورگر — بدون ارسال کوکی یا پسورد به سرور",
    refollow_btn: "فالو مجدد",
    refollowed_btn: "✓ فالو شد"
  },
  en: {
    tagline: "Smart, secure & local X/Twitter cleaner",
    checking: "Checking connection...",
    connected: "Connected to browser",
    offline_msg: "Please open x.com",
    tab_dashboard: "Dashboard",
    tab_candidates: "Candidates",
    tab_history: "History",
    tab_rules: "Safety Rules",
    stat_scanned: "Scanned",
    stat_scanned_hint: "Total checked",
    stat_nonfollowers: "Non-Followers",
    stat_nonfollowers_hint: "Eligible",
    stat_protected: "Protected",
    stat_protected_hint: "Mutual / Whitelist",
    label_batch: "Batch size:",
    label_speed: "Speed profile:",
    speed_safe: "Safe (4-8.5s)",
    speed_stealth: "Stealth (8-15s)",
    speed_fast: "Fast (2.5-4.5s)",
    opt_all: "All items",
    deep_scan_label: "Deep continuous auto-scroll",
    processing: "Processing...",
    btn_scan: "1. Scan Following",
    btn_backup: "Backup CSV",
    btn_unfollow: "2. Start Unfollow",
    btn_stop: "Stop",
    console_title: "📋 Live Execution Log",
    clear: "Clear",
    ready_hint: "Ready. Open x.com/*/following and click Scan.",
    select_all: "Select All",
    deselect_all: "Deselect All",
    selected_count: "selected",
    no_candidates: "No candidates yet. Click 'Scan Following' in Dashboard.",
    history_title: "Accounts unfollowed with this extension",
    clear_history: "Clear History",
    no_history: "No unfollow history recorded yet.",
    rules_title: "🛡️ Smart Account Protection Rules",
    rule_fame: "Fame Filter (Follower Count):",
    fame_20k: "Keep accounts with > 20,000 followers (Recommended)",
    fame_10k: "Keep accounts with > 10,000 followers",
    fame_50k: "Keep accounts with > 50,000 followers",
    fame_0: "No fame filter",
    rule_verified: "Protect Verified & Blue Checkmark Accounts",
    rule_bio: "Bio Protection Keywords (comma-separated):",
    rule_bio_hint: "Accounts with matching bio keywords will never be unfollowed.",
    rule_whitelist: "Permanent Custom Whitelist (handles):",
    auto_save: "Auto Saved",
    footer_privacy: "100% Client-Side — No passwords or cookies sent to any server",
    refollow_btn: "Re-Follow",
    refollowed_btn: "✓ Followed"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let currentLang = "fa";
  let activeTabId = null;
  let isRunning = false;
  let shouldStop = false;
  let scannedCandidates = [];
  let selectedUsernames = new Set();
  let unfollowHistory = [];

  // Elements
  const rootHtml = document.getElementById("root-html");
  const btnLang = document.getElementById("btn-lang");
  const langLabel = document.getElementById("lang-label");
  const statusPill = document.getElementById("status-pill");
  const userHandleEl = document.getElementById("user-handle");

  const statFollowing = document.getElementById("stat-following");
  const statNonFollowers = document.getElementById("stat-non-followers");
  const statProtected = document.getElementById("stat-protected");

  const batchSelect = document.getElementById("batch-select");
  const delaySelect = document.getElementById("delay-select");
  const deepScanToggle = document.getElementById("deep-scan-toggle");
  const thresholdSelect = document.getElementById("threshold-select");
  const protectVerifiedToggle = document.getElementById("protect-verified-toggle");
  const bioKeywordsInput = document.getElementById("bio-keywords-input");
  const whitelistInput = document.getElementById("whitelist-input");

  const btnScan = document.getElementById("btn-scan");
  const btnExport = document.getElementById("btn-export");
  const btnUnfollow = document.getElementById("btn-unfollow");
  const btnStop = document.getElementById("btn-stop");
  const btnClearLog = document.getElementById("btn-clear-log");

  const progressContainer = document.getElementById("progress-container");
  const progressText = document.getElementById("progress-text");
  const progressPercent = document.getElementById("progress-percent");
  const progressFill = document.getElementById("progress-fill");

  const consoleLogs = document.getElementById("console-logs");
  const candidatesContainer = document.getElementById("candidates-container");
  const candidateSearch = document.getElementById("candidate-search");
  const btnSelectAll = document.getElementById("btn-select-all");
  const btnDeselectAll = document.getElementById("btn-deselect-all");
  const selectedCounter = document.getElementById("selected-counter");
  const badgeListCount = document.getElementById("badge-list-count");

  const historyContainer = document.getElementById("history-container");
  const btnClearHistory = document.getElementById("btn-clear-history");
  const badgeHistoryCount = document.getElementById("badge-history-count");

  // Apply Language & Direction
  function applyLanguage(lang) {
    currentLang = lang;
    rootHtml.setAttribute("lang", lang);
    rootHtml.setAttribute("dir", lang === "fa" ? "rtl" : "ltr");
    langLabel.innerText = lang === "fa" ? "EN" : "FA";

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (I18N[lang] && I18N[lang][key]) {
        el.innerText = I18N[lang][key];
      }
    });

    updateCounterDisplay();
  }

  btnLang.addEventListener("click", () => {
    const nextLang = currentLang === "fa" ? "en" : "fa";
    applyLanguage(nextLang);
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ appLang: nextLang });
    }
  });

  // Logger
  function log(msg, type = "normal") {
    const time = new Date().toLocaleTimeString(currentLang === 'fa' ? 'fa-IR' : 'en-US', { hour12: false });
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.innerText = `[${time}] ${msg}`;
    consoleLogs.appendChild(line);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  btnClearLog.addEventListener("click", () => {
    consoleLogs.innerHTML = "";
    log(currentLang === "fa" ? "لاگ‌ها پاک شدند." : "Logs cleared.", "text-muted");
  });

  // Tab Navigation
  document.querySelectorAll(".nav-tab").forEach(tabBtn => {
    tabBtn.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      tabBtn.classList.add("active");
      const target = tabBtn.getAttribute("data-tab");
      const targetEl = document.getElementById(target);
      if (targetEl) targetEl.classList.add("active");
    });
  });

  // Load saved settings
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get([
      "appLang", "customWhitelist", "bioKeywords", "threshold", "delayMode", "batchSize", "protectVerified", "unfollowHistory"
    ], (res) => {
      if (res.appLang) applyLanguage(res.appLang);
      if (res.customWhitelist) whitelistInput.value = res.customWhitelist;
      if (res.bioKeywords) bioKeywordsInput.value = res.bioKeywords;
      if (res.threshold) thresholdSelect.value = res.threshold;
      if (res.delayMode) delaySelect.value = res.delayMode;
      if (res.batchSize) batchSelect.value = res.batchSize;
      if (res.protectVerified !== undefined) protectVerifiedToggle.checked = res.protectVerified;
      if (res.unfollowHistory) {
        unfollowHistory = res.unfollowHistory;
        renderHistory();
      }
    });

    // Auto-save listeners
    whitelistInput.addEventListener("input", () => chrome.storage.local.set({ customWhitelist: whitelistInput.value }));
    bioKeywordsInput.addEventListener("input", () => chrome.storage.local.set({ bioKeywords: bioKeywordsInput.value }));
    thresholdSelect.addEventListener("change", () => chrome.storage.local.set({ threshold: thresholdSelect.value }));
    delaySelect.addEventListener("change", () => chrome.storage.local.set({ delayMode: delaySelect.value }));
    batchSelect.addEventListener("change", () => chrome.storage.local.set({ batchSize: batchSelect.value }));
    protectVerifiedToggle.addEventListener("change", () => chrome.storage.local.set({ protectVerified: protectVerifiedToggle.checked }));
  }

  // Connection check
  async function initConnection() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || (!tab.url.includes("x.com") && !tab.url.includes("twitter.com"))) {
        statusPill.className = "status-pill offline";
        userHandleEl.innerText = I18N[currentLang].offline_msg;
        btnScan.disabled = true;
        return;
      }

      activeTabId = tab.id;
      chrome.tabs.sendMessage(activeTabId, { action: "PING" }, (res) => {
        if (chrome.runtime.lastError || !res || !res.ok) {
          statusPill.className = "status-pill offline";
          userHandleEl.innerText = "Refresh x.com page";
          btnScan.disabled = true;
        } else {
          statusPill.className = "status-pill online";
          const user = res.user || "Connected";
          userHandleEl.innerText = user.startsWith("@") ? user : `@${user}`;
          btnScan.disabled = false;
        }
      });
    } catch (err) {
      log(`Error: ${err.message}`, "error");
    }
  }

  initConnection();

  // Delays
  function getDelay() {
    const mode = delaySelect.value;
    if (mode === "fast") return Math.random() * 2000 + 2500;
    if (mode === "stealth") return Math.random() * 7000 + 8000;
    return Math.random() * 4500 + 4000;
  }
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Render Checklist
  function renderCandidates(filterText = "") {
    candidatesContainer.innerHTML = "";
    const query = filterText.trim().toLowerCase();

    const filtered = scannedCandidates.filter(item => {
      const u = item.username.toLowerCase();
      const n = (item.displayName || "").toLowerCase();
      return u.includes(query) || n.includes(query);
    });

    if (filtered.length === 0) {
      const p = document.createElement("div");
      p.className = "empty-placeholder";
      p.innerText = filterText 
        ? (currentLang === "fa" ? "هیچ کاربری با این نام یافت نشد." : "No matching users found.")
        : I18N[currentLang].no_candidates;
      candidatesContainer.appendChild(p);
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement("div");
      card.className = "user-item-card";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = selectedUsernames.has(item.username.toLowerCase());
      cb.addEventListener("change", () => {
        if (cb.checked) selectedUsernames.add(item.username.toLowerCase());
        else selectedUsernames.delete(item.username.toLowerCase());
        updateCounterDisplay();
      });

      // Avatar
      let avatarEl;
      if (item.avatarUrl) {
        avatarEl = document.createElement("img");
        avatarEl.src = item.avatarUrl;
        avatarEl.className = "user-avatar";
      } else {
        avatarEl = document.createElement("div");
        avatarEl.className = "user-avatar-placeholder";
        avatarEl.innerText = (item.displayName || item.username)[0].toUpperCase();
      }

      // Details
      const info = document.createElement("div");
      info.className = "user-info";

      const top = document.createElement("div");
      top.className = "user-info-top";

      const name = document.createElement("span");
      name.className = "user-display-name";
      name.innerText = item.displayName || item.username;

      top.appendChild(name);
      if (item.isVerified) {
        const v = document.createElement("span");
        v.className = "verified-icon";
        v.innerText = "✓";
        top.appendChild(v);
      }

      const handle = document.createElement("span");
      handle.className = "user-screen-name";
      handle.innerText = `@${item.username}`;

      info.appendChild(top);
      info.appendChild(handle);
      if (item.bio) {
        const bio = document.createElement("span");
        bio.className = "user-bio";
        bio.innerText = item.bio;
        info.appendChild(bio);
      }

      card.appendChild(cb);
      card.appendChild(avatarEl);
      card.appendChild(info);
      candidatesContainer.appendChild(card);
    });

    updateCounterDisplay();
  }

  function updateCounterDisplay() {
    const total = scannedCandidates.length;
    const selected = selectedUsernames.size;
    selectedCounter.innerText = `${selected} / ${total} ${I18N[currentLang].selected_count}`;

    if (total > 0) {
      badgeListCount.innerText = total;
      badgeListCount.classList.remove("hidden");
    } else {
      badgeListCount.classList.add("hidden");
    }
  }

  candidateSearch.addEventListener("input", () => {
    renderCandidates(candidateSearch.value);
  });

  btnSelectAll.addEventListener("click", () => {
    scannedCandidates.forEach(u => selectedUsernames.add(u.username.toLowerCase()));
    renderCandidates(candidateSearch.value);
  });

  btnDeselectAll.addEventListener("click", () => {
    selectedUsernames.clear();
    renderCandidates(candidateSearch.value);
  });

  // Render History
  function renderHistory() {
    historyContainer.innerHTML = "";
    if (unfollowHistory.length === 0) {
      const p = document.createElement("div");
      p.className = "empty-placeholder";
      p.innerText = I18N[currentLang].no_history;
      historyContainer.appendChild(p);
      badgeHistoryCount.classList.add("hidden");
      return;
    }

    badgeHistoryCount.innerText = unfollowHistory.length;
    badgeHistoryCount.classList.remove("hidden");

    unfollowHistory.slice().reverse().forEach(item => {
      const row = document.createElement("div");
      row.className = "history-item";

      const left = document.createElement("div");
      left.style.display = "flex";
      left.style.flexDirection = "column";

      const name = document.createElement("span");
      name.style.fontWeight = "700";
      name.innerText = `@${item.username}`;

      const time = document.createElement("span");
      time.className = "history-time";
      time.innerText = item.date || "";

      left.appendChild(name);
      left.appendChild(time);

      const btnUndo = document.createElement("button");
      btnUndo.className = "undo-btn";
      btnUndo.innerText = I18N[currentLang].refollow_btn;

      btnUndo.addEventListener("click", () => {
        if (!activeTabId) return;
        btnUndo.disabled = true;
        btnUndo.innerText = "...";
        chrome.tabs.sendMessage(activeTabId, { action: "REFOLLOW_USER", username: item.username }, (res) => {
          if (res && res.ok) {
            btnUndo.className = "undo-btn done";
            btnUndo.innerText = I18N[currentLang].refollowed_btn;
            log(`✓ Followed @${item.username} back!`, "success");
          } else {
            btnUndo.disabled = false;
            btnUndo.innerText = I18N[currentLang].refollow_btn;
            log(`Failed to refollow: ${res ? res.error : 'Unknown'}`, "error");
          }
        });
      });

      row.appendChild(left);
      row.appendChild(btnUndo);
      historyContainer.appendChild(row);
    });
  }

  btnClearHistory.addEventListener("click", () => {
    unfollowHistory = [];
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ unfollowHistory: [] });
    }
    renderHistory();
  });

  // 1. Scan logic
  btnScan.addEventListener("click", async () => {
    if (!activeTabId) return;

    const isDeep = deepScanToggle.checked;
    log(currentLang === "fa" ? `🔍 شروع اسکن ${isDeep ? 'عمیق' : 'صفحه'}...` : `🔍 Starting ${isDeep ? 'deep' : 'page'} scan...`, "normal");

    btnScan.disabled = true;
    btnUnfollow.disabled = true;
    btnExport.disabled = true;
    progressContainer.classList.remove("hidden");
    progressFill.style.width = "20%";
    progressPercent.innerText = "20%";
    progressText.innerText = I18N[currentLang].processing;

    const customWhitelist = whitelistInput.value.toLowerCase().split(",").map(s => s.trim().replace(/^@/, '')).filter(Boolean);
    const bioKeywords = bioKeywordsInput.value.toLowerCase().split(",").map(s => s.trim()).filter(Boolean);
    const protectVerified = protectVerifiedToggle.checked;
    const maxBatch = parseInt(batchSelect.value, 10);
    const targetScanCount = maxBatch > 500 ? 500 : Math.max(maxBatch * 2, 100);

    chrome.tabs.sendMessage(activeTabId, { action: "SCAN_DOM_PAGE", deepScan: isDeep, maxTarget: targetScanCount }, (res) => {
      progressFill.style.width = "100%";
      progressPercent.innerText = "100%";
      btnScan.disabled = false;

      if (!res || !res.ok) {
        log(currentLang === "fa" ? "اسکن ناموفق بود یا در تب Following نیستید." : "Scan failed or not on Following page.", "error");
        return;
      }

      const items = res.items || [];
      statFollowing.innerText = items.length;

      let nonFollowers = [];
      let protectedCount = 0;

      for (const item of items) {
        const u = item.username.toLowerCase();
        const bio = (item.bio || "").toLowerCase();
        const isCustomProtected = customWhitelist.includes(u);
        const hasProtectedBio = bioKeywords.some(kw => bio.includes(kw));
        const isVerifiedProtected = protectVerified && item.isVerified;

        if (item.followsYou || isCustomProtected || hasProtectedBio || isVerifiedProtected) {
          protectedCount++;
        } else {
          nonFollowers.push(item);
        }
      }

      statNonFollowers.innerText = nonFollowers.length;
      statProtected.innerText = protectedCount;
      scannedCandidates = nonFollowers;
      
      // Auto select all eligible
      selectedUsernames.clear();
      scannedCandidates.forEach(u => selectedUsernames.add(u.username.toLowerCase()));

      renderCandidates();

      log(currentLang === "fa" 
        ? `✓ اسکن پایان یافت: ${items.length} اکانت (${nonFollowers.length} بدون‌بک)` 
        : `✓ Scan complete: ${items.length} scanned (${nonFollowers.length} non-followers)`, "success");

      if (nonFollowers.length > 0) {
        btnUnfollow.disabled = false;
        btnExport.disabled = false;
      }
    });
  });

  // 2. Export Backup
  btnExport.addEventListener("click", () => {
    if (scannedCandidates.length === 0) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    let csv = "\uFEFFUsername,Display Name,Follows You,Verified,Bio,Scan Date\n";
    scannedCandidates.forEach(item => {
      const name = (item.displayName || "").replace(/"/g, '""');
      const bio = (item.bio || "").replace(/"/g, '""');
      csv += `"${item.username}","${name}","No","${item.isVerified ? 'Yes' : 'No'}","${bio}","${dateStr}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `x_non_followers_v2_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    log(`CSV Backup exported (${scannedCandidates.length} accounts).`, "success");
  });

  // 3. Unfollow logic
  btnUnfollow.addEventListener("click", async () => {
    const targetList = scannedCandidates.filter(item => selectedUsernames.has(item.username.toLowerCase()));
    if (targetList.length === 0) {
      log(currentLang === "fa" ? "هیچ اکانتی تیک نخورده است." : "No accounts selected in Candidates tab.", "warn");
      return;
    }

    const maxBatch = parseInt(batchSelect.value, 10);
    const runBatch = targetList.slice(0, maxBatch);

    log(`🚀 Starting safe unfollow batch for ${runBatch.length} accounts...`, "success");
    isRunning = true;
    shouldStop = false;

    btnScan.disabled = true;
    btnExport.disabled = true;
    btnUnfollow.classList.add("hidden");
    btnStop.classList.remove("hidden");
    btnStop.disabled = false;
    progressContainer.classList.remove("hidden");

    let completed = 0;
    let errors = 0;

    for (let i = 0; i < runBatch.length; i++) {
      if (shouldStop) {
        log("⏹ Stopped by user.", "warn");
        break;
      }

      const user = runBatch[i];
      const pct = Math.round(((i + 1) / runBatch.length) * 100);
      progressFill.style.width = `${pct}%`;
      progressPercent.innerText = `${pct}%`;
      progressText.innerText = `[${i + 1}/${runBatch.length}] @${user.username}`;

      log(`[${i + 1}/${runBatch.length}] Unfollowing @${user.username}...`, "normal");

      const res = await new Promise(resolve => {
        chrome.tabs.sendMessage(activeTabId, { action: "UNFOLLOW_USER", username: user.username }, resolve);
      });

      if (res && res.ok) {
        completed++;
        log(`✓ Unfollowed @${user.username} [${res.method}]`, "success");

        // Record in history
        unfollowHistory.push({
          username: user.username,
          displayName: user.displayName,
          date: new Date().toLocaleString()
        });
        if (chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ unfollowHistory });
        }

        selectedUsernames.delete(user.username.toLowerCase());
      } else {
        errors++;
        log(`✗ Failed @${user.username}: ${(res && res.error) || 'Unknown'}`, "error");
      }

      if (i < runBatch.length - 1 && !shouldStop) {
        const delay = getDelay();
        log(`Wait ${(delay / 1000).toFixed(1)}s (human delay)...`, "text-muted");
        await sleep(delay);
      }
    }

    isRunning = false;
    btnScan.disabled = false;
    btnExport.disabled = false;
    btnUnfollow.classList.remove("hidden");
    btnStop.classList.add("hidden");

    // Remove unfollowed from candidates
    scannedCandidates = scannedCandidates.filter(c => selectedUsernames.has(c.username.toLowerCase()));
    statNonFollowers.innerText = scannedCandidates.length;

    renderCandidates();
    renderHistory();

    log(`🎉 Batch finished! Unfollowed: ${completed}, Errors: ${errors}`, "success");
  });

  btnStop.addEventListener("click", () => {
    shouldStop = true;
    btnStop.disabled = true;
    log("Stopping safely...", "warn");
    if (activeTabId) chrome.tabs.sendMessage(activeTabId, { action: "STOP_DEEP_SCAN" });
  });
});
