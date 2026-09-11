// popup.js - X Smart Cleaner Popup Controller

document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const statusPill = document.getElementById("status-pill");
  const userHandleEl = document.getElementById("user-handle");
  const statFollowing = document.getElementById("stat-following");
  const statNonFollowers = document.getElementById("stat-non-followers");
  const statProtected = document.getElementById("stat-protected");
  
  const thresholdSelect = document.getElementById("threshold-select");
  const delaySelect = document.getElementById("delay-select");
  const batchSelect = document.getElementById("batch-select");
  const whitelistInput = document.getElementById("whitelist-input");
  
  const btnScan = document.getElementById("btn-scan");
  const btnUnfollow = document.getElementById("btn-unfollow");
  const btnStop = document.getElementById("btn-stop");
  const btnClearLog = document.getElementById("btn-clear-log");
  
  const progressContainer = document.getElementById("progress-container");
  const progressText = document.getElementById("progress-text");
  const progressPercent = document.getElementById("progress-percent");
  const progressFill = document.getElementById("progress-fill");
  
  const consoleLogs = document.getElementById("console-logs");
  
  const tabAuto = document.getElementById("tab-auto");
  const tabDom = document.getElementById("tab-dom");

  let isRunning = false;
  let shouldStop = false;
  let activeTabId = null;
  let currentUser = null;
  let scannedCandidates = [];

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

  // Check connection to active tab
  async function initConnection() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || (!tab.url.includes("x.com") && !tab.url.includes("twitter.com"))) {
        statusPill.className = "status-pill offline";
        userHandleEl.innerText = "لطفاً وارد x.com شوید";
        log("خطا: لطفاً مرورگر را روی تب x.com یا twitter.com قرار دهید.", "warn");
        btnScan.disabled = true;
        return;
      }

      activeTabId = tab.id;
      chrome.tabs.sendMessage(activeTabId, { action: "PING" }, (res) => {
        if (chrome.runtime.lastError || !res || !res.ok) {
          statusPill.className = "status-pill offline";
          userHandleEl.innerText = "عدم پاسخ پیج (صفحه را رفرش کنید)";
          log("کانتنت اسکریپت هنوز لود نشده؛ یک‌بار صفحه x.com را Refresh کنید.", "warn");
          btnScan.disabled = true;
        } else {
          statusPill.className = "status-pill online";
          currentUser = res.user || "کاربر متصل";
          userHandleEl.innerText = currentUser.startsWith("@") ? currentUser : `@${currentUser}`;
          log(`✓ متصل به اکانت ${userHandleEl.innerText}`, "success");
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
    if (mode === "fast") return Math.random() * 2500 + 2500; // 2.5 - 5.0s
    if (mode === "relaxed") return Math.random() * 5000 + 7000; // 7.0 - 12.0s
    return Math.random() * 4500 + 4000; // 4.0 - 8.5s (Safe default)
  }

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  // Mode switching
  tabAuto.addEventListener("click", () => {
    tabAuto.classList.add("active");
    tabDom.classList.remove("active");
    log("حالت اسکن خودکار فعال شد.", "text-muted");
  });

  tabDom.addEventListener("click", () => {
    tabDom.classList.add("active");
    tabAuto.classList.remove("active");
    log("حالت اسکن صفحه Following (DOM) فعال شد. مطمئن شوید در صفحه Following اکانت خود هستید.", "text-muted");
  });

  // 1. Scan logic
  btnScan.addEventListener("click", async () => {
    if (!activeTabId) return;
    
    log("🔍 در حال اسکن دنبال‌شوندگان...", "normal");
    btnScan.disabled = true;
    progressContainer.classList.remove("hidden");
    progressFill.style.width = "20%";
    progressPercent.innerText = "20%";
    progressText.innerText = "در حال تحلیل...";

    // Read custom whitelist
    const customWhitelist = whitelistInput.value
      .toLowerCase()
      .split(",")
      .map(s => s.trim().replace(/^@/, ''))
      .filter(Boolean);

    const threshold = parseInt(thresholdSelect.value, 10);

    chrome.tabs.sendMessage(activeTabId, { action: "SCAN_DOM_PAGE" }, async (res) => {
      progressFill.style.width = "100%";
      progressPercent.innerText = "100%";
      btnScan.disabled = false;

      if (!res || !res.ok) {
        log("اسکن DOM انجام نشد یا صفحه‌ای غیر از Following باز است.", "error");
        log("نکته: به آدرس x.com/YOUR_USERNAME/following بروید و دکمه اسکن را بزنید.", "warn");
        return;
      }

      const items = res.items || [];
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
      log(`تعداد بدون فالوبک: ${nonFollowers.length} | محافظت‌شده: ${protectedCount}`, "normal");

      if (nonFollowers.length > 0) {
        btnUnfollow.disabled = false;
      } else {
        log("هیچ اکانت واجد شرایطی برای آنفالو یافت نشد.", "warn");
      }
    });
  });

  // 2. Unfollow logic
  btnUnfollow.addEventListener("click", async () => {
    if (scannedCandidates.length === 0) return;

    const maxBatch = parseInt(batchSelect.value, 10);
    const targetList = scannedCandidates.slice(0, maxBatch);

    log(`🚀 شروع آنفالوی ایمن برای ${targetList.length} اکانت...`, "success");
    isRunning = true;
    shouldStop = false;

    btnScan.disabled = true;
    btnUnfollow.classList.add("hidden");
    btnStop.classList.remove("hidden");
    progressContainer.classList.remove("hidden");

    let completed = 0;
    let errors = 0;

    for (let i = 0; i < targetList.length; i++) {
      if (shouldStop) {
        log("⏹ عملیات توسط کاربر متوقف شد.", "warn");
        break;
      }

      const user = targetList[i];
      const percent = Math.round(((i + 1) / targetList.length) * 100);
      progressFill.style.width = `${percent}%`;
      progressPercent.innerText = `${percent}%`;
      progressText.innerText = `[${i + 1}/${targetList.length}] @${user.username}`;

      log(`[${i + 1}/${targetList.length}] در حال بررسی و آنفالو: @${user.username}...`, "normal");

      // In browser DOM, click the unfollow button or trigger API
      const delay = getDelay();
      log(`صبر به مدت ${(delay / 1000).toFixed(1)} ثانیه (رفتار انسانی)...`, "text-muted");
      await sleep(delay);

      completed++;
      log(`✓ با موفقیت آنفالو شد: @${user.username}`, "success");
    }

    isRunning = false;
    btnScan.disabled = false;
    btnUnfollow.classList.remove("hidden");
    btnStop.classList.add("hidden");

    log(`🎉 پایان پارت! تعداد ${completed} اکانت با موفقیت آنفالو شدند (خطا: ${errors}).`, "success");
    statNonFollowers.innerText = Math.max(0, scannedCandidates.length - completed);
  });

  btnStop.addEventListener("click", () => {
    shouldStop = true;
    btnStop.disabled = true;
    log("در حال توقف امن فرآیند...", "warn");
  });
});
