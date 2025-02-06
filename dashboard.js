document.addEventListener("DOMContentLoaded", () => {
    chrome.storage.local.get("websiteData", (result) => {
      const websiteData = result.websiteData || {};
      const domains = Object.keys(websiteData);
      const times = Object.values(websiteData).map(ms => Math.round(ms / 60000)); // Convert to minutes
  
      // Create the chart
      const ctx = document.getElementById("chart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: domains,
          datasets: [{
            label: "Time Spent (minutes)",
            data: times,
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => `${value}m`
              }
            }
          }
        }
      });
    });
  });