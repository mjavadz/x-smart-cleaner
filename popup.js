// popup.js - X Smart Cleaner Pro Controller v2.2.0

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
    simulation_label: "حالت شبیه‌سازی (Dry Run / بدون آنفالوی واقعی)",
    simulation_hint: "تست ۱۰۰٪ امن: تمام فیلترها و معیارها ارزیابی می‌شوند بدون اینکه اکانتی آنفالو شود.",
    deep_scan_label: "اسکرول عمیق و واکشی دقیق تعداد فالوورها (GraphQL)",
    processing: "در حال پردازش...",
    btn_scan: "۱. اسکن لیست",
    btn_backup: "پشتیبان CSV",
    btn_unfollow: "۲. شروع در پس‌زمینه",
    btn_simulate: "۲. شروع شبیه‌سازی (تست ایمن)",
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
    rule_fame: "فیلتر شهرت (بر مبنای فالوور واقعی GraphQL):",
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
    refollowed_btn: "✓ فالو شد",
    bg_running: "عملیات در پس‌زمینه در حال اجراست (می‌توانید این پنجره را ببندید)",
    cooldown_title: "سپر استراحت هوشمند فعال شد (۴۲۹)",
    cooldown_desc: "توییتر لیمیت موقت صادر کرد. سیستم جهت امنیت اکانت وارد استراحت شد.",
    timer_label: "زمان باقی‌مانده:",
    btn_resume_now: "ادامه فوری",
    btn_add_10m: "+۱۰ دقیقه"
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
    simulation_label: "Simulation Mode (Dry Run / No actual unfollows)",
    simulation_hint: "100% Safe test: Evaluates all candidates without unfollowing anyone on Twitter.",
    deep_scan_label: "Deep scroll & real follower fetching (GraphQL)",
    processing: "Processing...",
    btn_scan: "1. Scan Following",
    btn_backup: "Backup CSV",
    btn_unfollow: "2. Start in Background",
    btn_simulate: "2. Start Simulation (Safe Test)",
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
    rule_fame: "Fame Filter (Real GraphQL follower count):",
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
    refollowed_btn: "✓ Followed",
    bg_running: "Task running in background (safe to close this popup)",
    cooldown_title: "Smart Cooldown Shield Active (429)",
    cooldown_desc: "Twitter issued a rate limit. System is resting to keep your account 100% safe.",
    timer_label: "Time remaining:",
    btn_resume_now: "Resume Now",
    btn_add_10m: "+10 min"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  let currentLang = "fa";
  let activeTabId = null;
  let scannedCandidates = [];
  let selectedUsernames = new Set();
  let unfollowHistory = [];
  let currentSimulationReport = [];

  // Elements
  const rootHtml = document.getElementById("root-html");
  const btnLang = document.getElementById("btn-lang");
  const langLabel = document.getElementById("lang-label");
  const statusPill = document.getElementById("status-pill");
  const userHandleEl = document.getElementById("user-handle");
  const bgTaskBanner = document.getElementById("bg-task-banner");

  const statFollowing = document.getElementById("stat-following");
  const statNonFollowers = document.getElementById("stat-non-followers");
  const statProtected = document.getElementById("stat-protected");

  const batchSelect = document.getElementById("batch-select");
  const delaySelect = document.getElementById("delay-select");
  const simulationToggle = document.getElementById("simulation-toggle");
  const deepScanToggle = document.getElementById("deep-scan-toggle");
  const thresholdSelect = document.getElementById("threshold-select");
  const protectVerifiedToggle = document.getElementById("protect-verified-toggle");
  const bioKeywordsInput = document.getElementById("bio-keywords-input");
  const whitelistInput = document.getElementById("whitelist-input");

  const btnScan = document.getElementById("btn-scan");
  const btnExport = document.getElementById("btn-export");
  const btnUnfollow = document.getElementById("btn-unfollow");
  const unfollowBtnLabel = document.getElementById("unfollow-btn-label");
  const btnExportSimulation = document.getElementById("btn-export-simulation");
  const btnStop = document.getElementById("btn-stop");
  const btnClearLog = document.getElementById("btn-clear-log");

  // Item 3: Cooldown Banner Elements
  const cooldownBanner = document.getElementById("cooldown-banner");
  const cooldownCountdown = document.getElementById("cooldown-countdown");
  const btnForceResume = document.getElementById("btn-force-resume");
  const btnAddCooldown = document.getElementById("btn-add-cooldown");
  const btnStopCooldown = document.getElementById("btn-stop-cooldown");

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

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const pad = (n) => n < 10 ? '0' + n : n;
    return `${mins}:${pad(secs)}`;
  }

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

    updateUnfollowButtonState();
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

  // Update Action Button based on Simulation mode
  function updateUnfollowButtonState() {
    const isSim = simulationToggle.checked;
    if (isSim) {
      btnUnfollow.classList.add("btn-simulation");
      unfollowBtnLabel.innerText = I18N[currentLang].btn_simulate;
    } else {
      btnUnfollow.classList.remove("btn-simulation");
      unfollowBtnLabel.innerText = I18N[currentLang].btn_unfollow;
    }
  }

  simulationToggle.addEventListener("change", () => {
    updateUnfollowButtonState();
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ isSimulationMode: simulationToggle.checked });
    }
    log(
      simulationToggle.checked
        ? (currentLang === "fa" ? "🧪 حالت شبیه‌سازی فعال شد؛ هیچ اکانتی آنفالو نخواهد شد." : "🧪 Simulation Mode active; no accounts will be unfollowed.")
        : (currentLang === "fa" ? "حالت آنفالوی واقعی فعال شد." : "Real Unfollow Mode active."),
      simulationToggle.checked ? "simulation" : "normal"
    );
  });

  // Load saved settings & sync with background task
  function initSettingsAndTaskState() {
    if (chrome.storage && chrome.storage.local) {
      chrome.storage.local.get([
        "appLang", "customWhitelist", "bioKeywords", "threshold", "delayMode", 
        "batchSize", "protectVerified", "unfollowHistory", "activeUnfollowTask", "isSimulationMode"
      ], (res) => {
        if (res.appLang) applyLanguage(res.appLang);
        if (res.customWhitelist) whitelistInput.value = res.customWhitelist;
        if (res.bioKeywords) bioKeywordsInput.value = res.bioKeywords;
        if (res.threshold) thresholdSelect.value = res.threshold;
        if (res.delayMode) delaySelect.value = res.delayMode;
        if (res.batchSize) batchSelect.value = res.batchSize;
        if (res.protectVerified !== undefined) protectVerifiedToggle.checked = res.protectVerified;
        if (res.isSimulationMode !== undefined) {
          simulationToggle.checked = res.isSimulationMode;
          updateUnfollowButtonState();
        }
        if (res.unfollowHistory) {
          unfollowHistory = res.unfollowHistory;
          renderHistory();
        }
        if (res.activeUnfollowTask) {
          syncWithRunningTask(res.activeUnfollowTask);
        }
      });

      whitelistInput.addEventListener("input", () => chrome.storage.local.set({ customWhitelist: whitelistInput.value }));
      bioKeywordsInput.addEventListener("input", () => chrome.storage.local.set({ bioKeywords: bioKeywordsInput.value }));
      thresholdSelect.addEventListener("change", () => chrome.storage.local.set({ threshold: thresholdSelect.value }));
      delaySelect.addEventListener("change", () => chrome.storage.local.set({ delayMode: delaySelect.value }));
      batchSelect.addEventListener("change", () => chrome.storage.local.set({ batchSize: batchSelect.value }));
      protectVerifiedToggle.addEventListener("change", () => chrome.storage.local.set({ protectVerified: protectVerifiedToggle.checked }));
    }
  }

  initSettingsAndTaskState();

  // Sync UI with background task state
  function syncWithRunningTask(task) {
    if (!task) return;

    if (task.status === "in_cooldown") {
      cooldownBanner.classList.remove("hidden");
      cooldownCountdown.innerText = formatTime(task.cooldownRemaining || 0);
      bgTaskBanner.classList.add("hidden");
      btnScan.disabled = true;
      btnExport.disabled = true;
      btnUnfollow.classList.add("hidden");
      btnStop.classList.remove("hidden");
      btnStop.disabled = false;
    } else if (task.isRunning) {
      cooldownBanner.classList.add("hidden");
      bgTaskBanner.classList.remove("hidden");
      btnScan.disabled = true;
      btnExport.disabled = true;
      btnUnfollow.classList.add("hidden");
      btnStop.classList.remove("hidden");
      btnStop.disabled = false;

      progressContainer.classList.remove("hidden");
      progressFill.style.width = `${task.currentPercent}%`;
      progressPercent.innerText = `${task.currentPercent}%`;
      const modeTag = task.isSimulation ? "[🧪 Sim]" : "";
      progressText.innerText = `${modeTag} [${task.currentIndex + 1}/${task.targetList.length}] @${task.currentUsername}`;

      // Sync recent logs
      if (task.logs && task.logs.length > 0) {
        consoleLogs.innerHTML = "";
        task.logs.slice(-20).forEach(l => {
          const line = document.createElement("div");
          line.className = `log-line ${l.type}`;
          line.innerText = `[${l.time}] ${l.text}`;
          consoleLogs.appendChild(line);
        });
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
      }
    } else {
      cooldownBanner.classList.add("hidden");
      bgTaskBanner.classList.add("hidden");
      btnScan.disabled = false;
      btnExport.disabled = scannedCandidates.length === 0;
      btnUnfollow.classList.remove("hidden");
      btnStop.classList.add("hidden");

      if (task.simulationReport && task.simulationReport.length > 0) {
        currentSimulationReport = task.simulationReport;
        btnExportSimulation.classList.remove("hidden");
      }
    }
  }

  // Listen for messages from background service worker
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "TASK_PROGRESS" && msg.state) {
      syncWithRunningTask(msg.state);
    } else if (msg.action === "TASK_COOLDOWN_STARTED" && msg.state) {
      syncWithRunningTask(msg.state);
      log("🚨 Twitter Rate Limit (429) hit! Cooldown Shield active.", "warn");
    } else if (msg.action === "TASK_COOLDOWN_TICK") {
      cooldownCountdown.innerText = formatTime(msg.remaining);
    } else if (msg.action === "TASK_COOLDOWN_ENDED" && msg.state) {
      syncWithRunningTask(msg.state);
      log("✓ Cooldown finished! Resuming execution...", "success");
    } else if (msg.action === "TASK_COMPLETED" && msg.state) {
      syncWithRunningTask(msg.state);
      if (msg.state.isSimulation) {
        log(`🎉 Simulation finished! ${msg.state.completed} accounts evaluated safely.`, "simulation");
        if (msg.state.simulationReport && msg.state.simulationReport.length > 0) {
          currentSimulationReport = msg.state.simulationReport;
          btnExportSimulation.classList.remove("hidden");
        }
      } else {
        log(`🎉 Background task finished! ${msg.state.completed} unfollowed.`, "success");
        chrome.storage.local.get("unfollowHistory", (res) => {
          if (res.unfollowHistory) {
            unfollowHistory = res.unfollowHistory;
            renderHistory();
          }
        });
      }
    } else if (msg.action === "TASK_STOPPED" && msg.state) {
      syncWithRunningTask(msg.state);
      log("⏹ Task stopped by user.", "warn");
    }
  });

  // Cooldown Banner Controls
  btnForceResume.addEventListener("click", () => {
    log(currentLang === "fa" ? "درخواست ادامه فوری ارسال شد..." : "Sending force resume request...", "warn");
    chrome.runtime.sendMessage({ action: "FORCE_RESUME_COOLDOWN" }, (res) => {
      if (res && res.ok) {
        cooldownBanner.classList.add("hidden");
      }
    });
  });

  btnAddCooldown.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "ADD_COOLDOWN_TIME" }, (res) => {
      if (res && res.ok) {
        cooldownCountdown.innerText = formatTime(res.remaining);
        log(currentLang === "fa" ? "۱۰ دقیقه به زمان استراحت افزوده شد." : "+10 minutes added to cooldown timer.", "normal");
      }
    });
  });

  btnStopCooldown.addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "STOP_BACKGROUND_UNFOLLOW" }, () => {
      cooldownBanner.classList.add("hidden");
      btnUnfollow.classList.remove("hidden");
      btnStop.classList.add("hidden");
      log(currentLang === "fa" ? "فرآیند لغو و متوقف شد." : "Task stopped completely.", "warn");
    });
  });

  // Export Simulation CSV
  btnExportSimulation.addEventListener("click", () => {
    if (!currentSimulationReport || currentSimulationReport.length === 0) return;
    
    let csvContent = "\uFEFFUsername,Display Name,Followers Count,Is Verified,Reason,Simulated At\n";
    currentSimulationReport.forEach(item => {
      const u = `"${(item.username || '').replace(/"/g, '""')}"`;
      const d = `"${(item.displayName || '').replace(/"/g, '""')}"`;
      const f = item.followersCount || 0;
      const v = item.isVerified ? "Yes" : "No";
      const r = `"${(item.reason || '').replace(/"/g, '""')}"`;
      const t = `"${(item.simulatedAt || '').replace(/"/g, '""')}"`;
      csvContent += `${u},${d},${f},${v},${r},${t}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `x_simulation_report_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    log(currentLang === "fa" ? "گزارش شبیه‌سازی دانلود شد." : "Simulation CSV exported successfully.", "simulation");
  });

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

    filtered.forEach(user => {
      const row = document.createElement("div");
      row.className = "candidate-row";

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "candidate-cb";
      cb.checked = selectedUsernames.has(user.username.toLowerCase());
      cb.addEventListener("change", () => {
        if (cb.checked) {
          selectedUsernames.add(user.username.toLowerCase());
        } else {
          selectedUsernames.delete(user.username.toLowerCase());
        }
        updateCounterDisplay();
      });

      const info = document.createElement("div");
      info.className = "candidate-info";

      const top = document.createElement("div");
      top.className = "candidate-top";

      const name = document.createElement("span");
      name.className = "candidate-name";
      name.innerText = user.displayName || user.username;

      const handle = document.createElement("span");
      handle.className = "candidate-handle";
      handle.innerText = `@${user.username}`;

      top.appendChild(name);
      if (user.isVerified) {
        const badge = document.createElement("span");
        badge.className = "verified-badge";
        badge.innerHTML = "✓";
        badge.title = "Verified";
        top.appendChild(badge);
      }
      top.appendChild(handle);

      if (user.formattedFollowers || user.followersCount !== undefined) {
        const followers = document.createElement("span");
        followers.className = "followers-badge";
        followers.innerText = `${user.formattedFollowers || user.followersCount} ف`;
        followers.title = `${user.followersCount || 0} Followers`;
        top.appendChild(followers);
      }

      info.appendChild(top);

      if (user.bio) {
        const bio = document.createElement("div");
        bio.className = "candidate-bio";
        bio.innerText = user.bio;
        info.appendChild(bio);
      }

      row.appendChild(cb);
      row.appendChild(info);
      candidatesContainer.appendChild(row);
    });
  }

  function updateCounterDisplay() {
    selectedCounter.innerText = `${selectedUsernames.size} ${I18N[currentLang].selected_count}`;
    badgeListCount.innerText = selectedUsernames.size;
    if (selectedUsernames.size > 0) {
      badgeListCount.classList.remove("hidden");
    } else {
      badgeListCount.classList.add("hidden");
    }
    btnUnfollow.disabled = selectedUsernames.size === 0;
  }

  btnSelectAll.addEventListener("click", () => {
    scannedCandidates.forEach(c => selectedUsernames.add(c.username.toLowerCase()));
    renderCandidates(candidateSearch.value);
    updateCounterDisplay();
  });

  btnDeselectAll.addEventListener("click", () => {
    selectedUsernames.clear();
    renderCandidates(candidateSearch.value);
    updateCounterDisplay();
  });

  candidateSearch.addEventListener("input", (e) => {
    renderCandidates(e.target.value);
  });

  // Render History Tab
  function renderHistory() {
    historyContainer.innerHTML = "";
    badgeHistoryCount.innerText = unfollowHistory.length;
    if (unfollowHistory.length > 0) {
      badgeHistoryCount.classList.remove("hidden");
    } else {
      badgeHistoryCount.classList.add("hidden");
    }

    if (unfollowHistory.length === 0) {
      const p = document.createElement("div");
      p.className = "empty-placeholder";
      p.innerText = I18N[currentLang].no_history;
      historyContainer.appendChild(p);
      return;
    }

    unfollowHistory.slice().reverse().forEach(item => {
      const row = document.createElement("div");
      row.className = "history-row";

      const info = document.createElement("div");
      info.className = "history-info";

      const handle = document.createElement("span");
      handle.className = "history-handle";
      handle.innerText = `@${item.username}`;

      const date = document.createElement("span");
      date.className = "history-date";
      date.innerText = item.date;

      info.appendChild(handle);
      info.appendChild(date);

      const refollowBtn = document.createElement("button");
      refollowBtn.className = "refollow-btn";
      refollowBtn.innerText = I18N[currentLang].refollow_btn;
      refollowBtn.addEventListener("click", () => {
        refollowBtn.disabled = true;
        refollowBtn.innerText = "...";
        chrome.tabs.sendMessage(activeTabId, { action: "REFOLLOW_USER", username: item.username }, (res) => {
          if (res && res.ok) {
            refollowBtn.innerText = I18N[currentLang].refollowed_btn;
            refollowBtn.classList.add("success");
            log(`Re-followed @${item.username}`, "success");
          } else {
            refollowBtn.disabled = false;
            refollowBtn.innerText = "Error";
            log(`Failed to re-follow @${item.username}: ${res ? res.error : ''}`, "error");
          }
        });
      });

      row.appendChild(info);
      row.appendChild(refollowBtn);
      historyContainer.appendChild(row);
    });
  }

  btnClearHistory.addEventListener("click", () => {
    unfollowHistory = [];
    chrome.storage.local.set({ unfollowHistory: [] }, () => {
      renderHistory();
      log("تاریخچه آنفالو پاک‌سازی شد.", "text-muted");
    });
  });

  // 1. Scan logic
  btnScan.addEventListener("click", async () => {
    btnScan.disabled = true;
    btnExport.disabled = true;
    btnUnfollow.disabled = true;
    btnExportSimulation.classList.add("hidden");

    log(currentLang === "fa" ? "در حال واکشی و اسکرول صفحه..." : "Scanning & scrolling following page...", "normal");

    const deepScan = deepScanToggle.checked;
    const maxTarget = parseInt(batchSelect.value, 10);

    chrome.tabs.sendMessage(activeTabId, { action: "SCAN_DOM_PAGE", deepScan, maxTarget }, (res) => {
      btnScan.disabled = false;
      if (chrome.runtime.lastError || !res || !res.ok) {
        log(`Scan failed: ${chrome.runtime.lastError ? chrome.runtime.lastError.message : res.error}`, "error");
        return;
      }

      const rawItems = res.items || [];
      const threshold = parseInt(thresholdSelect.value, 10);
      const protectVerified = protectVerifiedToggle.checked;
      const bioKeywords = (bioKeywordsInput.value || "").split(",").map(k => k.trim().toLowerCase()).filter(Boolean);
      const whitelist = (whitelistInput.value || "").split(",").map(w => w.trim().toLowerCase().replace("@", "")).filter(Boolean);

      let protectedCount = 0;
      let nonFollowers = [];

      rawItems.forEach(u => {
        const username = u.username.toLowerCase();
        const bio = (u.bio || "").toLowerCase();

        // 1. Whitelist protection
        if (whitelist.includes(username)) {
          protectedCount++;
          return;
        }

        // 2. Mutual followers
        if (u.followsYou) {
          protectedCount++;
          return;
        }

        // 3. Verified badge
        if (protectVerified && u.isVerified) {
          protectedCount++;
          return;
        }

        // 4. Bio keywords
        if (bioKeywords.length > 0 && bioKeywords.some(kw => bio.includes(kw))) {
          protectedCount++;
          return;
        }

        // 5. Followers count threshold
        if (threshold > 0 && u.followersCount && u.followersCount >= threshold) {
          protectedCount++;
          return;
        }

        nonFollowers.push(u);
      });

      statFollowing.innerText = rawItems.length;
      statNonFollowers.innerText = nonFollowers.length;
      statProtected.innerText = protectedCount;

      scannedCandidates = nonFollowers;
      selectedUsernames = new Set(nonFollowers.map(u => u.username.toLowerCase()));

      renderCandidates();
      updateCounterDisplay();

      btnExport.disabled = nonFollowers.length === 0;
      btnUnfollow.disabled = nonFollowers.length === 0;

      log(currentLang === "fa"
        ? `اسکن تمام شد: ${rawItems.length} اکانت بررسی شدند، ${nonFollowers.length} کاندیدای بدون بک یافت شد (${protectedCount} اکانت محافظت شدند).`
        : `Scan complete: ${rawItems.length} checked, ${nonFollowers.length} non-followers found (${protectedCount} protected).`, "success");
    });
  });

  // 2. Export CSV Backup
  btnExport.addEventListener("click", () => {
    if (scannedCandidates.length === 0) return;

    let csvContent = "\uFEFFUsername,Display Name,Followers,Verified,Bio\n";
    scannedCandidates.forEach(u => {
      const uname = `"${u.username.replace(/"/g, '""')}"`;
      const dname = `"${(u.displayName || u.username).replace(/"/g, '""')}"`;
      const followers = u.followersCount || 0;
      const verified = u.isVerified ? "Yes" : "No";
      const bio = `"${(u.bio || "").replace(/"/g, '""')}"`;
      csvContent += `${uname},${dname},${followers},${verified},${bio}\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const dateStr = new Date().toISOString().slice(0, 10);
    a.download = `x_non_followers_v2.2_${dateStr}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    log(`CSV Backup exported (${scannedCandidates.length} accounts).`, "success");
  });

  // 3. Execution logic via Background Service Worker (Real or Simulation)
  btnUnfollow.addEventListener("click", () => {
    const targetList = scannedCandidates.filter(item => selectedUsernames.has(item.username.toLowerCase()));
    if (targetList.length === 0) {
      log(currentLang === "fa" ? "هیچ اکانتی انتخاب نشده است." : "No accounts selected in Candidates tab.", "warn");
      return;
    }

    const isSimulation = simulationToggle.checked;
    const maxBatch = parseInt(batchSelect.value, 10);
    const runBatch = targetList.slice(0, maxBatch);

    log(currentLang === "fa" 
      ? (isSimulation 
          ? `🧪 آغاز شبیه‌سازی برای ${runBatch.length} اکانت بدون اعمال تغییر در توییتر...` 
          : `🚀 ارسال ${runBatch.length} اکانت به موتور پس‌زمینه...`)
      : (isSimulation 
          ? `🧪 Starting simulation for ${runBatch.length} accounts without modifying Twitter...` 
          : `🚀 Dispatching ${runBatch.length} accounts to background engine...`), 
      isSimulation ? "simulation" : "success");

    chrome.runtime.sendMessage({
      action: "START_BACKGROUND_UNFOLLOW",
      targetList: runBatch,
      delayMode: delaySelect.value,
      isSimulation: isSimulation,
      tabId: activeTabId
    }, (res) => {
      if (res && res.ok) {
        syncWithRunningTask(res.state);
        log(currentLang === "fa" 
          ? "✓ موتور پس‌زمینه فعال شد؛ می‌توانید این پنجره را ببندید." 
          : "✓ Background engine active; you may close this popup safely.", "success");
      }
    });
  });

  // Stop background task
  btnStop.addEventListener("click", () => {
    btnStop.disabled = true;
    log(currentLang === "fa" ? "ارسال دستور توقف به موتور پس‌زمینه..." : "Sending stop request to background...", "warn");
    chrome.runtime.sendMessage({ action: "STOP_BACKGROUND_UNFOLLOW" }, () => {
      btnStop.classList.add("hidden");
      btnUnfollow.classList.remove("hidden");
      bgTaskBanner.classList.add("hidden");
      cooldownBanner.classList.add("hidden");
    });
  });
});
