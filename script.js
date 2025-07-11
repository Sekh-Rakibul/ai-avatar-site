document.getElementById("avatarForm").addEventListener("submit", function(e) {
	e.preventDefault();
	const imageInput = document.getElementById("imageInput").files[0];
	const style = document.getElementById("styleSelect").value;

	if (!imageInput) {
		alert("Please upload an image.");
		return;
	}

	const reader = new FileReader();
	reader.onloadend = function () {
		const base64Image = reader.result.split(",")[1];

		// Placeholder: Replace with actual HuggingFace or Replicate API call
		// For now, simulate result
		setTimeout(() => {
			document.getElementById("resultImage").src = "https://placekitten.com/300/300";
			document.getElementById("resultSection").style.display = "block";
		}, 2000);
	};
	reader.readAsDataURL(imageInput);
});
