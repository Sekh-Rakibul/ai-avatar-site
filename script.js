document.getElementById("avatarForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const promptInput = document.getElementById("promptInput");
  const resultImage = document.getElementById("resultImage");
  const resultSection = document.getElementById("resultSection");

  const prompt = promptInput.value.trim();
  if (!prompt) {
    alert("Please enter a prompt.");
    return;
  }

  resultSection.style.display = "block";
  resultImage.src = "";
  resultImage.alt = "Generating avatar...";

  try {
    const response = await fetch("https://nodejs-replicate-proxy-server.earthiancoder.replit.dev/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    if (data && data.image) {
      resultImage.src = data.image;
      resultImage.alt = "Generated Avatar";
    } else {
      resultImage.alt = "Failed to generate avatar.";
    }
  } catch (err) {
    console.error("Error:", err);
    resultImage.alt = "Error: Failed to fetch avatar.";
  }
});
