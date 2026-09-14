// background.js - X Smart Cleaner Pro Background Service Worker v2.3.0

let currentTask = null;
let isExecuting = false;
let shouldStop = false;
let cooldownInterval = null;

// Helper: Human randomized delay
function calculateDelay(mode) {
  if (mode === "fast") return Math.random() * 2000 + 2500; // 2.5 - 4.5s
  if (mode === "stealth") return Math.random() * 7000 + 8000; // 8.0 - 15.0s
  return Math.random() * 4500 + 4000; // 4.0 - 8.5s (Safe default)
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Broadcast message to open popups
function broadcast(message) {
  chrome.runtime.sendMessage(message).catch(() => {
    // Popup might be closed, which is completely fine
  });
}

// Show native desktop notification
function showNotification(title, message) {
  try {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: title,
      message: message,
      priority: 2
    });
  } catch (e) {
    console.warn("Notification failed:", e);
  }
}

// Save task state to storage
async function saveTaskState() {
  if (!currentTask) {
    await chrome.storage.local.remove("activeUnfollowTask");
    return;
  }
  await chrome.storage.local.set({ activeUnfollowTask: currentTask });
}

// Daily Quota Tracking (24-hour cycle)
async function getDailyQuotaState() {
  const data = await chrome.storage.local.get(["dailyQuota", "todayUnfollowCount", "lastQuotaDate"]);
  const todayStr = new Date().toISOString().slice(0, 10);
  let count = data.todayUnfollowCount || 0;
  if (data.lastQuotaDate !== todayStr) {
    count = 0;
    await chrome.storage.local.set({ todayUnfollowCount: 0, lastQuotaDate: todayStr });
  }
  const quota = data.dailyQuota !== undefined ? parseInt(data.dailyQuota, 10) : 100;
  return { count, quota, todayStr };
}

async function incrementDailyCount() {
  const { count, quota, todayStr } = await getDailyQuotaState();
  const newCount = count + 1;
  await chrome.storage.local.set({ todayUnfollowCount: newCount, lastQuotaDate: todayStr });
  return { count: newCount, quota };
}

// Handle Smart Cooldown (Item 3)
async function startSmartCooldown(seconds = 900) {
  if (!currentTask) return;

  currentTask.status = "in_cooldown";
  currentTask.cooldownRemaining = seconds;
  currentTask.cooldownTotal = seconds;
  currentTask.cooldownUntil = Date.now() + (seconds * 1000);

  currentTask.logs.push({
    type: "warn",
    time: new Date().toLocaleTimeString(),
    text: `🛡️ [سپر هوشمند ۴۲۹] توییتر درخواست استراحت داد. ورود به کول‌داون ${Math.round(seconds / 60)} دقیقه‌ای...`
  });

  await saveTaskState();
  broadcast({ action: "TASK_COOLDOWN_STARTED", state: currentTask });

  showNotification(
    "⚠️ سپر ایمنی توییتر (Rate Limit 429)",
    `توییتر خطای ۴۲۹ صادر کرد. سیستم وارد استراحت ${Math.round(seconds / 60)} دقیقه‌ای شد تا اکانت در امنیت ۱۰۰٪ بماند و سپس خودکار ادامه می‌یابد.`
  );

  // Clear existing interval if any
  if (cooldownInterval) clearInterval(cooldownInterval);

  cooldownInterval = setInterval(async () => {
    if (!currentTask || currentTask.status !== "in_cooldown" || shouldStop) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
      return;
    }

    const remaining = Math.max(0, Math.round((currentTask.cooldownUntil - Date.now()) / 1000));
    currentTask.cooldownRemaining = remaining;

    broadcast({ 
      action: "TASK_COOLDOWN_TICK", 
      remaining: remaining, 
      total: currentTask.cooldownTotal,
      state: currentTask 
    });

    if (remaining <= 0) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;

      currentTask.status = "running";
      currentTask.logs.push({
        type: "success",
        time: new Date().toLocaleTimeString(),
        text: `⏳ دوره استراحت سپری شد. ادامه خودکار فرآیند...`
      });

      showNotification(
        "پایان زمان استراحت توییتر",
        "فرآیند پالایش پس از سپری شدن دوره ایمنی به صورت خودکار از سر گرفته شد."
      );

      await saveTaskState();
      broadcast({ action: "TASK_COOLDOWN_ENDED", state: currentTask });
      runUnfollowBatch();
    }
  }, 1000);
}

// Main background unfollow / simulation runner loop
async function runUnfollowBatch() {
  if (isExecuting || !currentTask) return;
  isExecuting = true;
  shouldStop = false;

  const { targetList, delayMode, tabId, isSimulation } = currentTask;
  console.log(`[X Smart Cleaner Background] Running batch (sim: ${isSimulation}) for ${targetList.length} users`);

  while (currentTask.currentIndex < targetList.length) {
    if (shouldStop) {
      currentTask.isRunning = false;
      currentTask.status = "stopped";
      await saveTaskState();
      broadcast({ action: "TASK_STOPPED", state: currentTask });
      break;
    }

    // If currently paused in cooldown, suspend loop execution
    if (currentTask.status === "in_cooldown") {
      isExecuting = false;
      return;
    }

    const user = targetList[currentTask.currentIndex];
    currentTask.currentUsername = user.username;
    currentTask.currentPercent = Math.round(((currentTask.currentIndex + 1) / targetList.length) * 100);
    await saveTaskState();

    broadcast({ action: "TASK_PROGRESS", state: currentTask });

    // Item 4: Simulation Mode (Dry Run)
    if (isSimulation) {
      currentTask.completed++;
      const followersLabel = user.formattedFollowers || (user.followersCount ? user.followersCount.toLocaleString() : "۰");
      const ghostNote = user.isGhost || user.isDefaultAvatar ? " | 🥚 بی‌عکس" : "";
      
      currentTask.logs.push({
        type: "simulation",
        time: new Date().toLocaleTimeString(),
        text: `🧪 [شبیه‌سازی] @${user.username} کاندیدای حذف تشخیص داده شد (فالوور: ${followersLabel} | تیک آبی: ${user.isVerified ? 'دارد' : 'ندارد'}${ghostNote})`
      });

      // Append to simulation report
      if (!currentTask.simulationReport) currentTask.simulationReport = [];
      currentTask.simulationReport.push({
        username: user.username,
        displayName: user.displayName || user.username,
        followersCount: user.followersCount || 0,
        isVerified: !!user.isVerified,
        isGhost: !!(user.isGhost || user.isDefaultAvatar),
        reason: user.followsYou ? "متقابل" : "بدون فالوبک (Non-follower)",
        simulatedAt: new Date().toLocaleString()
      });

      currentTask.currentIndex++;
      await saveTaskState();
      broadcast({ action: "TASK_PROGRESS", state: currentTask });

      if (currentTask.currentIndex < targetList.length && !shouldStop) {
        await sleep(Math.random() * 400 + 600);
      }
      continue;
    }

    // REAL UNFOLLOW EXECUTION
    let result = null;
    try {
      result = await new Promise((resolve) => {
        chrome.tabs.sendMessage(tabId, { action: "UNFOLLOW_USER", username: user.username }, (res) => {
          if (chrome.runtime.lastError) {
            resolve({ ok: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(res || { ok: false, error: "No response from tab" });
          }
        });
      });
    } catch (err) {
      result = { ok: false, error: err.message };
    }

    // Handle 429 Rate Limit Cooldown
    if (result && result.error && (result.error.includes("429") || result.error.toLowerCase().includes("rate limit"))) {
      isExecuting = false;
      await startSmartCooldown(900); // 15 minutes default smart cooldown
      return;
    }

    if (result && result.ok) {
      currentTask.completed++;
      currentTask.logs.push({
        type: "success",
        time: new Date().toLocaleTimeString(),
        text: `✓ Unfollowed @${user.username} [${result.method || 'API'}]`
      });

      // Append to permanent unfollow history
      try {
        const stored = await chrome.storage.local.get("unfollowHistory");
        const history = stored.unfollowHistory || [];
        history.push({
          username: user.username,
          displayName: user.displayName || user.username,
          date: new Date().toLocaleString()
        });
        await chrome.storage.local.set({ unfollowHistory: history });
      } catch (e) {
        console.error("Failed to update history in storage", e);
      }

      // Feature 2: Daily Safety Quota Tracking
      const { count: todayCount, quota: dailyLimit } = await incrementDailyCount();
      currentTask.todayCount = todayCount;
      currentTask.dailyQuota = dailyLimit;

      if (dailyLimit > 0 && todayCount >= dailyLimit) {
        currentTask.isRunning = false;
        currentTask.status = "quota_reached";
        currentTask.logs.push({
          type: "warn",
          time: new Date().toLocaleTimeString(),
          text: `🛡️ [سقف روزانه] سقف ایمنی ۲۴ ساعته (${dailyLimit} اکانت) تکمیل شد. عملیات متوقف گردید.`
        });
        await saveTaskState();
        showNotification(
          "🛡️ سقف روزانه توییتر تکمیل شد",
          `تعداد ${todayCount} اکانت در ۲۴ ساعت اخیر آنفالو شدند. جهت حفظ سلامت اکانت، فرآیند متوقف شد.`
        );
        broadcast({ action: "TASK_QUOTA_REACHED", state: currentTask, todayCount, dailyLimit });
        break;
      }
    } else {
      currentTask.errors++;
      currentTask.logs.push({
        type: "error",
        time: new Date().toLocaleTimeString(),
        text: `✗ Failed @${user.username}: ${result ? result.error : 'Unknown'}`
      });
    }

    // Keep logs manageable
    if (currentTask.logs.length > 100) {
      currentTask.logs = currentTask.logs.slice(-100);
    }

    currentTask.currentIndex++;
    await saveTaskState();
    broadcast({ action: "TASK_PROGRESS", state: currentTask });

    // Wait with randomized human delay if not last item
    if (currentTask.currentIndex < targetList.length && !shouldStop) {
      const waitMs = calculateDelay(delayMode);
      await sleep(waitMs);
    }
  }

  // Finished all items in the batch
  if (currentTask && currentTask.currentIndex >= targetList.length) {
    currentTask.isRunning = false;
    currentTask.status = "completed";
    await saveTaskState();

    if (isSimulation) {
      showNotification(
        "پالایشگر هوشمند توییتر | پایان شبیه‌سازی",
        `شبیه‌سازی کامل شد! تعداد ${currentTask.completed} اکانت ارزیابی شدند. هیچ تغییری روی اکانت واقعی شما اعمال نشد.`
      );
      currentTask.logs.push({
        type: "success",
        time: new Date().toLocaleTimeString(),
        text: `🎉 پایان موفقیت‌آمیز شبیه‌سازی (${currentTask.completed} اکانت بررسی شدند). می‌توانید گزارش CSV را دانلود کنید.`
      });
    } else {
      showNotification(
        "پالایشگر هوشمند توییتر | تکمیل شد",
        `عملیات با موفقیت به پایان رسید! تعداد ${currentTask.completed} اکانت آنفالو شدند (خطا: ${currentTask.errors}).`
      );
    }

    broadcast({ action: "TASK_COMPLETED", state: currentTask });
  }

  isExecuting = false;
}

// Runtime Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_BACKGROUND_UNFOLLOW") {
    const { targetList, delayMode, tabId, isSimulation } = request;
    shouldStop = false;
    
    getDailyQuotaState().then(quotaState => {
      // Check quota prior to real run
      if (!isSimulation && quotaState.quota > 0 && quotaState.count >= quotaState.quota) {
        sendResponse({ 
          ok: false, 
          error: "daily_quota_reached", 
          todayCount: quotaState.count, 
          dailyQuota: quotaState.quota 
        });
        return;
      }

      if (cooldownInterval) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
      }

      currentTask = {
        isRunning: true,
        status: "running",
        tabId: tabId,
        targetList: targetList,
        delayMode: delayMode || "safe",
        isSimulation: !!isSimulation,
        currentIndex: 0,
        completed: 0,
        errors: 0,
        currentUsername: targetList[0] ? targetList[0].username : "",
        currentPercent: 0,
        startedAt: Date.now(),
        cooldownRemaining: 0,
        cooldownTotal: 0,
        todayCount: quotaState.count,
        dailyQuota: quotaState.quota,
        simulationReport: [],
        logs: [{
          type: isSimulation ? "simulation" : "normal",
          time: new Date().toLocaleTimeString(),
          text: isSimulation 
            ? `🧪 شبیه‌سازی بدون ریسک (Dry Run) برای ${targetList.length} اکانت آغاز شد...`
            : `🚀 فرآیند پس‌زمینه برای ${targetList.length} اکانت آغاز شد...`
        }]
      };

      saveTaskState().then(() => {
        runUnfollowBatch();
        sendResponse({ ok: true, state: currentTask });
      });
    });
    return true;
  }

  if (request.action === "STOP_BACKGROUND_UNFOLLOW") {
    shouldStop = true;
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
    }
    if (currentTask) {
      currentTask.isRunning = false;
      currentTask.status = "stopped";
      saveTaskState();
    }
    sendResponse({ ok: true });
    return true;
  }

  if (request.action === "GET_DAILY_QUOTA") {
    getDailyQuotaState().then(q => sendResponse({ ok: true, quota: q.quota, count: q.count }));
    return true;
  }

  if (request.action === "SET_DAILY_QUOTA") {
    const q = parseInt(request.dailyQuota, 10);
    chrome.storage.local.set({ dailyQuota: q }, () => {
      sendResponse({ ok: true, quota: q });
    });
    return true;
  }

  // Force Resume Cooldown immediately
  if (request.action === "FORCE_RESUME_COOLDOWN") {
    if (currentTask && currentTask.status === "in_cooldown") {
      if (cooldownInterval) {
        clearInterval(cooldownInterval);
        cooldownInterval = null;
      }
      currentTask.status = "running";
      currentTask.cooldownRemaining = 0;
      currentTask.logs.push({
        type: "warn",
        time: new Date().toLocaleTimeString(),
        text: "⚡ ادامه فوری توسط کاربر تایید شد؛ نادیده گرفتن تایمر استراحت."
      });
      saveTaskState().then(() => {
        broadcast({ action: "TASK_COOLDOWN_ENDED", state: currentTask });
        runUnfollowBatch();
        sendResponse({ ok: true, state: currentTask });
      });
      return true;
    }
    sendResponse({ ok: false });
    return true;
  }

  // Add 10 minutes to cooldown
  if (request.action === "ADD_COOLDOWN_TIME") {
    if (currentTask && currentTask.status === "in_cooldown") {
      const additionalSec = 600;
      currentTask.cooldownRemaining += additionalSec;
      currentTask.cooldownTotal += additionalSec;
      currentTask.cooldownUntil += additionalSec * 1000;
      currentTask.logs.push({
        type: "normal",
        time: new Date().toLocaleTimeString(),
        text: "⏱️ ۱۰ دقیقه به زمان استراحت هوشمند اضافه شد."
      });
      saveTaskState().then(() => {
        broadcast({ 
          action: "TASK_COOLDOWN_TICK", 
          remaining: currentTask.cooldownRemaining, 
          total: currentTask.cooldownTotal,
          state: currentTask 
        });
        sendResponse({ ok: true, remaining: currentTask.cooldownRemaining });
      });
      return true;
    }
    sendResponse({ ok: false });
    return true;
  }

  if (request.action === "GET_BACKGROUND_STATUS") {
    chrome.storage.local.get("activeUnfollowTask", (res) => {
      sendResponse({ ok: true, state: res.activeUnfollowTask || null });
    });
    return true;
  }

  if (request.action === "CLEAR_BACKGROUND_TASK") {
    currentTask = null;
    if (cooldownInterval) {
      clearInterval(cooldownInterval);
      cooldownInterval = null;
    }
    chrome.storage.local.remove("activeUnfollowTask", () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});
