document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("avatarForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const prompt = document.getElementById("promptInput").value;
    const resultImage = document.getElementById("resultImage");
    const resultSection = document.getElementById("resultSection");

    if (!prompt) {
      alert("Please enter a prompt!");
      return;
    }

    resultSection.style.display = "block";
    resultImage.src = "";
    resultImage.alt = "Generating...";

    try {
      const response = await fetch("https://api.replicate.com/v1/predictions", {
        method: "POST",
        headers: {
          "Authorization": "Token r8_AbGlKrrgY15ksfxhmKUssdJL4Jy9hQP2g51hw",  // Your key
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          version: "17f6ceac404b4d1692ba829f4fef4ce44e212afe",  // Realistic Vision v5
          input: {
            prompt: prompt,
            width: 512,
            height: 512
          }
        })
      });

      const data = await response.json();

      if (data?.urls?.get) {
        let finalUrl = "";
        while (!finalUrl) {
          const statusRes = await fetch(data.urls.get, {
            headers: { "Authorization": "Token r8_AbGlKrrgY15ksfxhmKUssdJL4Jy9hQP2g51hw" }
          });
          const statusData = await statusRes.json();

          if (statusData?.status === "succeeded") {
            finalUrl = statusData.output[0];
          } else if (statusData?.status === "failed") {
            break;
          }
          await new Promise((res) => setTimeout(res, 2000));
        }

        if (finalUrl) {
          resultImage.src = finalUrl;
          resultImage.alt = "Generated Avatar";
        } else {
          resultImage.alt = "Failed to generate image.";
        }
      } else {
        resultImage.alt = "No response from Replicate.";
      }
    } catch (error) {
      resultImage.alt = "Error: " + error.message;
    }
  });
});
