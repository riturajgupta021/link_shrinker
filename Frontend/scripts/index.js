
document.getElementById("urlForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const longUrl = document.getElementById("longUrl").value;
  const title = document.getElementById("title").value || "Untitled";
  console.log(longUrl);
  try {
    const response = await fetch(`${domain}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ longUrl, title }),
    });

    if (response.status == 201) {
      const data = await response.json();
      const shortUrl = data.shortUrl;
      displayShortUrl(shortUrl);
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    alert(error.message);
  }

  document.getElementById("longUrl").value = "";
  document.getElementById("title").value = "";
});

function displayShortUrl(shortUrl) {
  document.getElementById("container").classList.add("hidden");
  document.getElementById("short-container").classList.remove("hidden");

  document.getElementById("short-container").innerHTML = `
          <h2 class="text-2xl font-semibold mb-4 text-gray-800">Generated Short URL</h2>
          <div class="flex gap-4">
            <input type="text" 
              class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200" 
              id="short-url"
              value=${shortUrl} readonly>
          
            <button 
              onclick="copyShortUrl()"
              class="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >Copy</button>
          </div>
        `;
}

function copyShortUrl() {
  const shortUrlInput = document.getElementById("short-url");
  shortUrlInput.select(); // Select the text in the input
  shortUrlInput.setSelectionRange(0, 99999); // For mobile devices
  navigator.clipboard
    .writeText(shortUrlInput.value) // Copy to clipboard
    .then(() => {
      alert("Short URL copied to clipboard!");
      document.getElementById("container").classList.remove("hidden");
      document.getElementById("short-container").classList.add("hidden");
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}
