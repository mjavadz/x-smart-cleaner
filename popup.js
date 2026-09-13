// popup.js - X Smart Cleaner Popup Controller v1.1.0

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const statusPill = document.getElementById("status-pill");
  const userHandleEl = document.getElementById("user-handle");
  const statFollowing = document.getElementById("stat-following");
  const statNonFollowers = document.getElementById("stat-non-followers");
  const statProtected = document.getElementById("stat-protected");
  
  const thresholdSelect = document.getElementById("threshold-select");
  const delaySelect = document.getElementById("delay-select");
  const batchSelect = document.getElementById("batch-select");
  const deepScanToggle = document.getElementById("deep-scan-toggle");
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

  let isRunning = false;
  let shouldStop = false;
  let activeTabId = null;
  let currentUser = null;
  let scannedCandidates = [];
  let allScannedItems = [];

  // Logger helper
  function log(msg, type = "normal") {
    const time = new Date().toLocaleTimeString('fa-IR', { hour12: false });
    const line = document.createElement("div");
    line.className = `log-line ${type}`;
    line.innerText = `[${time}] ${msg}`;
    consoleLogs.appendChild(line);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
  }

  btnClearLog.addEventListener("click", () => {
    consoleLogs.innerHTML = "";
    log("لاگ‌ها پاک‌سازی شدند.", "text-muted");
  });

  // Load saved settings from Chrome storage
  if (chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(["customWhitelist", "threshold", "delayMode", "batchSize"], (res) => {
      if (res.customWhitelist) whitelistInput.value = res.customWhitelist;
      if (res.threshold) thresholdSelect.value = res.threshold;
      if (res.delayMode) delaySelect.value = res.delayMode;
      if (res.batchSize) batchSelect.value = res.batchSize;
    });

    whitelistInput.addEventListener("input", () => {
      chrome.storage.local.set({ customWhitelist: whitelistInput.value });
    });
    thresholdSelect.addEventListener("change", () => {
      chrome.storage.local.set({ threshold: thresholdSelect.value });
    });
    delaySelect.addEventListener("change", () => {
      chrome.storage.local.set({ delayMode: delaySelect.value });
    });
    batchSelect.addEventListener("change", () => {
      chrome.storage.local.set({ batchSize: batchSelect.value });
    });
  }

  // Check connection to active tab
  async function initConnection() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || (!tab.url.includes("x.com") && !tab.url.includes("twitter.com"))) {
        statusPill.className = "status-pill offline";
        userHandleEl.innerText = "لطفاً وارد x.com شوید";
        log("خطا: تب فعال مرورگر صفحه x.com نیست.", "warn");
        btnScan.disabled = true;
        return;
      }

      activeTabId = tab.id;
      chrome.tabs.sendMessage(activeTabId, { action: "PING" }, (res) => {
        if (chrome.runtime.lastError || !res || !res.ok) {
          statusPill.className = "status-pill offline";
          userHandleEl.innerText = "عدم پاسخ پیج (صفحه را Refresh کنید)";
          log("کانتنت اسکریپت هنوز لود نشده؛ یک‌بار صفحه x.com را Refresh کنید.", "warn");
          btnScan.disabled = true;
        } else {
          statusPill.className = "status-pill online";
          currentUser = res.user || "کاربر لاگین";
          userHandleEl.innerText = currentUser.startsWith("@") ? currentUser : `@${currentUser}`;
          log(`✓ ارتباط امن با مرورگر برقرار است (${userHandleEl.innerText})`, "success");
          btnScan.disabled = false;
        }
      });
    } catch (err) {
      log(`خطا در بررسی تب: ${err.message}`, "error");
    }
  }

  initConnection();

  // Helper delays
  function getDelay() {
    const mode = delaySelect.value;
    if (mode === "fast") return Math.random() * 2000 + 2500; // 2.5 - 4.5s
    if (mode === "stealth") return Math.random() * 7000 + 8000; // 8.0 - 15.0s (Ultra safe)
    return Math.random() * 4500 + 4000; // 4.0 - 8.5s (Safe default)
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // 1. Scan logic
  btnScan.addEventListener("click", async () => {
    if (!activeTabId) return;
    
    const isDeep = deepScanToggle.checked;
    log(`🔍 شروع اسکن ${isDeep ? 'عمیق و خودکار' : 'صفحه فعلی'}...`, "normal");
    
    btnScan.disabled = true;
    btnUnfollow.disabled = true;
    btnExport.disabled = true;
    progressContainer.classList.remove("hidden");
    progressFill.style.width = "15%";
    progressPercent.innerText = "15%";
    progressText.innerText = isDeep ? "در حال پیمایش و واکشی اکانت‌ها..." : "در حال تحلیل...";

    const customWhitelist = whitelistInput.value
      .toLowerCase()
      .split(",")
      .map(s => s.trim().replace(/^@/, ''))
      .filter(Boolean);

    const maxBatch = parseInt(batchSelect.value, 10);
    const targetScanCount = maxBatch > 500 ? 500 : Math.max(maxBatch * 2, 100);

    chrome.tabs.sendMessage(activeTabId, { action: "SCAN_DOM_PAGE", deepScan: isDeep, maxTarget: targetScanCount }, async (res) => {
      progressFill.style.width = "100%";
      progressPercent.innerText = "100%";
      btnScan.disabled = false;

      if (!res || !res.ok) {
        log("اسکن ناموفق بود یا در صفحه‌ای غیر از Following هستید.", "error");
        log("راهنما: به آدرس x.com/YOUR_USERNAME/following بروید و دکمه اسکن را بزنید.", "warn");
        return;
      }

      const items = res.items || [];
      allScannedItems = items;
      statFollowing.innerText = items.length;

      let nonFollowers = [];
      let protectedCount = 0;

      for (const item of items) {
        const u = item.username.toLowerCase();
        const isCustomProtected = customWhitelist.includes(u);
        
        if (item.followsYou) {
          protectedCount++;
        } else if (isCustomProtected) {
          protectedCount++;
        } else {
          nonFollowers.push(item);
        }
      }

      statNonFollowers.innerText = nonFollowers.length;
      statProtected.innerText = protectedCount;
      scannedCandidates = nonFollowers;

      log(`✓ اسکن پایان یافت: ${items.length} اکانت بررسی شد.`, "success");
      log(`شناسایی بدون فالوبک: ${nonFollowers.length} نفر | محافظت‌شده: ${protectedCount} نفر`, "normal");

      if (nonFollowers.length > 0) {
        btnUnfollow.disabled = false;
        btnExport.disabled = false;
        log("💡 پیشنهاد: قبل از شروع آنفالو، می‌توانید با دکمه «پشتیبان CSV» یک بکاپ ذخیره کنید.", "text-muted");
      } else {
        log("هیچ اکانت بدون بکی برای آنفالو یافت نشد.", "warn");
      }
    });
  });

  // 2. Export CSV Backup
  btnExport.addEventListener("click", () => {
    if (scannedCandidates.length === 0) return;

    const dateStr = new Date().toISOString().slice(0, 10);
    let csvContent = "\uFEFFUsername,Display Name,Follows You,Profile URL,Scan Date\n";

    scannedCandidates.forEach(item => {
      const name = (item.displayName || item.username).replace(/"/g, '""');
      csvContent += `"${item.username}","${name}","No","https://x.com/${item.username}","${dateStr}"\n`;
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `x_non_followers_backup_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    log(`📥 فایل پشتیبان با موفقیت دانلود شد (${scannedCandidates.length} اکانت).`, "success");
  });

  // 3. Unfollow logic
  btnUnfollow.addEventListener("click", async () => {
    if (scannedCandidates.length === 0) return;

    const maxBatch = parseInt(batchSelect.value, 10);
    const targetList = scannedCandidates.slice(0, maxBatch);

    log(`🚀 شروع آنفالوی خودکار و ایمن برای ${targetList.length} اکانت...`, "success");
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

    for (let i = 0; i < targetList.length; i++) {
      if (shouldStop) {
        log("⏹ عملیات توسط کاربر با موفقیت متوقف شد.", "warn");
        break;
      }

      const user = targetList[i];
      const percent = Math.round(((i + 1) / targetList.length) * 100);
      progressFill.style.width = `${percent}%`;
      progressPercent.innerText = `${percent}%`;
      progressText.innerText = `[${i + 1}/${targetList.length}] @${user.username}`;

      log(`[${i + 1}/${targetList.length}] اقدام به آنفالو: @${user.username}...`, "normal");

      // Execute via content script
      const res = await new Promise(resolve => {
        chrome.tabs.sendMessage(activeTabId, { action: "UNFOLLOW_USER", username: user.username }, resolve);
      });

      if (res && res.ok) {
        completed++;
        log(`✓ آنفالو شد (@${user.username}) [${res.method}]`, "success");
      } else {
        errors++;
        log(`✗ خطا در آنفالوی @${user.username}: ${(res && res.error) || 'نامشخص'}`, "error");
      }

      // Human randomized delay between unfollows
      if (i < targetList.length - 1 && !shouldStop) {
        const delay = getDelay();
        log(`صبر به مدت ${(delay / 1000).toFixed(1)} ثانیه جهت رعایت سقف ایمنی...`, "text-muted");
        await sleep(delay);
      }
    }

    isRunning = false;
    btnScan.disabled = false;
    btnExport.disabled = false;
    btnUnfollow.classList.remove("hidden");
    btnStop.classList.add("hidden");

    log(`🎉 پایان پارت! تعداد ${completed} اکانت آنفالو شدند (خطاها: ${errors}).`, "success");
    
    // Update local remaining candidates
    scannedCandidates = scannedCandidates.slice(completed);
    statNonFollowers.innerText = scannedCandidates.length;
    if (scannedCandidates.length === 0) {
      btnUnfollow.disabled = true;
    }
  });

  btnStop.addEventListener("click", () => {
    shouldStop = true;
    btnStop.disabled = true;
    log("درخواست توقف ارسال شد؛ پس از اتمام مورد جاری عملیات متوقف می‌شود...", "warn");
    if (activeTabId) {
      chrome.tabs.sendMessage(activeTabId, { action: "STOP_DEEP_SCAN" });
    }
  });
});
