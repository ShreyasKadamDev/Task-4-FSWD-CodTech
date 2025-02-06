const productiveWebsites = ["github.com", "stackoverflow.com", "leetcode.com", "youtube.com"];
const unproductiveWebsites = ["facebook.com", "twitter.com", "instagram.com"];

function classifyWebsite(url) {
  const domain = new URL(url).hostname;
  if (productiveWebsites.includes(domain)) return "productive";
  if (unproductiveWebsites.includes(domain)) return "unproductive";
  return "neutral";
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "classifyWebsite") {
    sendResponse({ classification: classifyWebsite(window.location.href) });
  }
});
