document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("websiteData", (data) => {
      if (chrome.runtime.lastError) {
        console.error("Storage error:", chrome.runtime.lastError);
        return;
      }
  
      const websiteData = data.websiteData || {};
      displayData(websiteData);
    });
  });
  
  function displayData(websiteData) {
    const container = document.getElementById("data-container"); // Ensure this exists in `popup.html`
    container.innerHTML = ""; // Clear previous data
  
    if (Object.keys(websiteData).length === 0) {
      container.innerHTML = "<p>No data recorded yet.</p>";
      return;
    }
  
    for (let domain in websiteData) {
      const timeSpent = (websiteData[domain] / 1000).toFixed(1); // Convert ms to seconds
      const entry = document.createElement("p");
      entry.textContent = `${domain}: ${timeSpent} sec`;
      container.appendChild(entry);
    }
  }
   document.getElementById("openDashboard").addEventListener("click", () => {
    chrome.runtime.getURL("dashboard/dashboard.html"); // Get the URL of the dashboard
    chrome.tabs.create({ url: chrome.runtime.getURL("dashboard/dashboard.html") });
     
  });
  
    