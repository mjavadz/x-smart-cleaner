// background.js - X Smart Cleaner Pro Background Service Worker v2.1.0

let currentTask = null;
let isExecuting = false;
let shouldStop = false;

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

// Main background unfollow runner loop
async function runUnfollowBatch() {
  if (isExecuting || !currentTask) return;
  isExecuting = true;
  shouldStop = false;

  const { targetList, delayMode, tabId } = currentTask;
  console.log(`[X Smart Cleaner Background] Starting batch for ${targetList.length} users on tab ${tabId}`);

  while (currentTask.currentIndex < targetList.length) {
    if (shouldStop) {
      currentTask.isRunning = false;
      currentTask.status = "stopped";
      await saveTaskState();
      broadcast({ action: "TASK_STOPPED", state: currentTask });
      break;
    }

    const user = targetList[currentTask.currentIndex];
    currentTask.currentUsername = user.username;
    currentTask.currentPercent = Math.round(((currentTask.currentIndex + 1) / targetList.length) * 100);
    await saveTaskState();

    broadcast({ action: "TASK_PROGRESS", state: currentTask });

    // Send unfollow message to content script
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
    if (result && result.error && (result.error.includes("429") || result.error.includes("Rate limit"))) {
      currentTask.isRunning = false;
      currentTask.status = "rate_limited";
      await saveTaskState();
      showNotification(
        "هشدار محدودیت توییتر (Rate Limit)",
        "توییتر خطای ۴۲۹ صادر کرد. جهت حفظ امنیت اکانت، عملیات متوقف و وارد استراحت شد."
      );
      broadcast({ action: "TASK_RATE_LIMITED", state: currentTask });
      break;
    }

    if (result && result.ok) {
      currentTask.completed++;
      currentTask.logs.push({
        type: "success",
        time: new Date().toLocaleTimeString(),
        text: `✓ Unfollowed @${user.username} [${result.method || 'API'}]`
      });

      // Append to unfollow history
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
    } else {
      currentTask.errors++;
      currentTask.logs.push({
        type: "error",
        time: new Date().toLocaleTimeString(),
        text: `✗ Failed @${user.username}: ${result ? result.error : 'Unknown'}`
      });
    }

    // Keep logs manageable
    if (currentTask.logs.length > 80) {
      currentTask.logs = currentTask.logs.slice(-80);
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

  // Finished all items
  if (currentTask && currentTask.currentIndex >= targetList.length) {
    currentTask.isRunning = false;
    currentTask.status = "completed";
    await saveTaskState();

    showNotification(
      "پالایشگر هوشمند توییتر | تکمیل شد",
      `عملیات با موفقیت به پایان رسید! تعداد ${currentTask.completed} اکانت آنفالو شدند (خطا: ${currentTask.errors}).`
    );

    broadcast({ action: "TASK_COMPLETED", state: currentTask });
  }

  isExecuting = false;
}

// Runtime Message Listener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "START_BACKGROUND_UNFOLLOW") {
    const { targetList, delayMode, tabId } = request;
    shouldStop = false;
    currentTask = {
      isRunning: true,
      status: "running",
      tabId: tabId,
      targetList: targetList,
      delayMode: delayMode || "safe",
      currentIndex: 0,
      completed: 0,
      errors: 0,
      currentUsername: targetList[0] ? targetList[0].username : "",
      currentPercent: 0,
      startedAt: Date.now(),
      logs: [{
        type: "normal",
        time: new Date().toLocaleTimeString(),
        text: `🚀 Background task initiated for ${targetList.length} accounts...`
      }]
    };

    saveTaskState().then(() => {
      runUnfollowBatch();
      sendResponse({ ok: true, state: currentTask });
    });
    return true;
  }

  if (request.action === "STOP_BACKGROUND_UNFOLLOW") {
    shouldStop = true;
    if (currentTask) {
      currentTask.isRunning = false;
      currentTask.status = "stopping";
      saveTaskState();
    }
    sendResponse({ ok: true });
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
    chrome.storage.local.remove("activeUnfollowTask", () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});
