const domain = "https://link-shrinker-gc27.onrender.com";

function togglePasswordVisibility(inputId, button) {
  const input = document.getElementById(inputId);
  if (input.type === "password") {
    input.type = "text";
    button.textContent = "🙈";
  } else {
    input.type = "password";
    button.textContent = "👁️";
  }
}

document
  .getElementById("signup-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
      const response = await fetch(`${domain}/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.status == 201) {
        window.location.href = "./login.html";
      } else {
        const res = await response.json();
        alert(res.msg);
      }
    } catch (error) {
      alert(error);
    }
  });
