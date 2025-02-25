const domain = "https://link-shrinker-gc27.onrender.com";

async function checkUserAuthentication() {
  try {
    const response = await fetch(`${domain}/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status == 200) {
        const data = await response.json();
        console.log(data);
        document.getElementById("user-name").textContent = data.name[0];
    } else {
      window.location.href = "./login.html";
    }
  } catch (error) {
    window.location.href = "./login.html";
  }
}

checkUserAuthentication();
