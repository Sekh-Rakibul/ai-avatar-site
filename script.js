document.getElementById("avatarForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const imageInput = document.getElementById("imageInput").files[0];
  const resultImage = document.getElementById("resultImage");
  const resultSection = document.getElementById("resultSection");

  if (!imageInput) {
    alert("Please upload an image.");
    return;
  }

  resultSection.style.display = "block";
  resultImage.src = "";
  resultImage.alt = "Generating avatar...";

  const reader = new FileReader();
  reader.onloadend = async function () {
    const base64Image = reader.result.split(",")[1];

    // 🔐 Replicate API Call
    const replicateResponse = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": "Token r8_AbGlKrrgY15ksfxhmKUssdJL4Jy9hQP2g51hw"
, // 👈 Replace with your real key
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: "f7bd87d911acfe6955c4f9d7062701f0c3bce3a80a8f37dd18e9fa19c6c9cf0d", // face-to-painting
        input: {
          image: "data:image/jpeg;base64," + base64Image
        }
      })
    });

    const replicateData = await replicateResponse.json();

    if (replicateData?.urls?.get) {
      // Wait for result to complete
      let finalUrl = "";
      while (!finalUrl) {
        const statusRes = await fetch(replicateData.urls.get, {
          headers: { "Authorization": "Token YOUR_API_KEY_HERE" }
        });
        const statusData = await statusRes.json();
        if (statusData?.status === "succeeded") {
          finalUrl = statusData.output;
        } else if (statusData?.status === "failed") {
          break;
        }
        await new Promise((res) => setTimeout(res, 2000)); // Wait 2s
      }

      if (finalUrl) {
        resultImage.src = finalUrl;
        resultImage.alt = "Generated Avatar";
      } else {
        resultImage.alt = "Failed to generate avatar.";
      }
    } else {
      resultImage.alt = "Error: No response from Replicate.";
    }
  };
  reader.readAsDataURL(imageInput);
});
