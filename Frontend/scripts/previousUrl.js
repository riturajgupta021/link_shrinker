const domain = "https://link-shrinker-gc27.onrender.com";

async function getPreviousUrls() {
  try {
      const response = await fetch(`${domain}/geturls`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
    console.log(response);
    if (response.status == 200) {
        const data = await response.json();
        document.getElementById("user-name").textContent = data.name[0];
        console.log(data.urls);
        updateUrlsGrid(data.urls);
    } else {
        alert("Error on fetching Urls's");
    }
  } catch (error) {
    console.log(error.message);
  }
}

getPreviousUrls();

const truncateUrl = (url, maxLength = 25) => {
  return url.length > maxLength ? `${url.slice(0, maxLength)}...` : url;
};

// Function to copy URL
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert("Copied to clipboard!");
  });
};

function updateUrlsGrid(urls) {
  const urlsGrid = document.getElementById("urlsGrid");
  urlsGrid.innerHTML = "";

  if (urls.length == 0) {
    urlsGrid.innerHTML = `<p class="col-span-full text-gray-500 text-sm text-center" id="noUrlsText">No URLs generated yet. Start shortening URLs above!</p>`;
  } else {
    urls.forEach(({ title, longUrl, shortUrl }) => {
      const urlCard = document.createElement("div");
      urlCard.classList.add(
        "border",
        "border-gray-300",
        "rounded-lg",
        "p-4",
        "shadow-sm",
        "bg-white"
      );

      urlCard.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800">${title}</h3>
            <p class="text-sm text-gray-500 mt-2">
              <strong>Long URL:</strong> 
              <span>${truncateUrl(longUrl)}</span>
            </p>
            <p class="text-sm text-gray-500 mt-2 flex items-center">
              <strong>Short URL:</strong> 
              <span class="ml-1 text-blue-500">${truncateUrl(shortUrl)}</span>
              <button 
                class="ml-2 bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition text-xs" 
                onclick="copyToClipboard('${shortUrl}')">Copy
              </button>
            </p>
          `;
      urlsGrid.appendChild(urlCard);
    });
  }
}
