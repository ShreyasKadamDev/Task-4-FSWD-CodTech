// Initialize or load existing data on startup
let activeTab = null;
let startTime = Date.now();
let websiteData = {};

// Load saved data when the extension starts
chrome.storage.local.get("websiteData", (result) => {
  websiteData = result.websiteData || {};
});

// Track tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (!tab.url || !isValidHttpUrl(tab.url)) return;
    
    // Save time spent on the previous tab
    if (activeTab) {
      const timeSpent = Date.now() - startTime;
      const domain = new URL(activeTab.url).hostname;
      websiteData[domain] = (websiteData[domain] || 0) + timeSpent;
    }

    // Update active tab
    activeTab = tab;
    startTime = Date.now();
  });
});

// Track URL changes in the same tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    if (!isValidHttpUrl(changeInfo.url)) return;
    
    // Save time spent on the old URL
    if (activeTab) {
      const timeSpent = Date.now() - startTime;
      const domain = new URL(activeTab.url).hostname;
      websiteData[domain] = (websiteData[domain] || 0) + timeSpent;
    }

    // Update active tab
    activeTab = tab;
    startTime = Date.now();
  }
});

// Save data to storage every 30 seconds
chrome.alarms.create("saveData", { periodInMinutes: 0.5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "saveData") {
    chrome.storage.local.set({ websiteData });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getData") {
      chrome.storage.local.get("websiteData", (data) => {
        sendResponse(data);
      });
      return true; // Required for async response
    }
  });


function isValidHttpUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}
