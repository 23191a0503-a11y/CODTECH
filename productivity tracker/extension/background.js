let currentTab = "";
let startTime = Date.now();

const API = "http://localhost:5000";

function isValidUrl(url) {
  return url && url.startsWith("http");
}

// send data
async function sendData(url, timeSpent) {
  if (!isValidUrl(url)) return;

  const productiveSites = [
    "github.com",
    "stackoverflow.com",
    "leetcode.com"
  ];

  const productive = productiveSites.some(site =>
    url.includes(site)
  );

  try {
    await fetch(`${API}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        website: url,
        timeSpent,
        productive,
        date: new Date()
      })
    });

    console.log("Sent:", url, timeSpent);
  } catch (err) {
    console.log("Error:", err);
  }
}

// FIX: better tab detection
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);

    if (currentTab) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      await sendData(currentTab, timeSpent);
    }

    currentTab = tab.url;
    startTime = Date.now();
  } catch (e) {
    console.log("Tab error:", e);
  }
});

// FIX: URL update tracking
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.url) {
    currentTab = changeInfo.url;
    startTime = Date.now();
  }
});