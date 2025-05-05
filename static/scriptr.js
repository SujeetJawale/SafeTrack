const form = document.getElementById("zoneForm");
const loader = document.getElementById("loader");
const buildingImage = document.getElementById("building-image");
const gridImage = document.getElementById("grid-image");
const gridOverlay = document.getElementById("grid-overlay");
const zonesText = document.getElementById("zonesText");

const choiceSelect = document.getElementById("choice");
const uploadSection = document.getElementById("upload-section");
const addressSection = document.getElementById("address-section");
const addressInput = document.getElementById("addressInput");
const imageUpload = document.getElementById("imageUpload");

// Show/Hide fields based on user choice
choiceSelect.addEventListener("change", function () {
  if (choiceSelect.value === "upload") {
    uploadSection.style.display = "block";
    addressSection.style.display = "none";
    imageUpload.required = true;
    addressInput.required = false;
  } else if (choiceSelect.value === "address") {
    uploadSection.style.display = "none";
    addressSection.style.display = "block";
    addressInput.required = true;
    imageUpload.required = false;
  } else {
    uploadSection.style.display = "none";
    addressSection.style.display = "none";
  }
});

var crsr = document.querySelector("#cursor");

document.addEventListener("mousemove", function (dets) {
  crsr.style.left = dets.x - 20 + "px";
  crsr.style.top = dets.y - 20 + "px";
});

// Full submission flow
form.addEventListener("submit", function (e) {
  e.preventDefault();

  loader.style.display = "flex";
  form.style.display = "none";

  setTimeout(() => {
    loader.style.display = "none";

    if (choiceSelect.value === "upload") {
      const file = imageUpload.files[0];
      const imageURL = URL.createObjectURL(file);
      buildingImage.src = imageURL;
      buildingImage.style.display = "block";

      // Animate building image
      gsap.from(buildingImage, {
        duration: 1,
        opacity: 0,
        onComplete: () => {
          // After showing building image, show loader again
          setTimeout(() => {
            buildingImage.style.display = "none";
            loader.style.display = "flex";

            setTimeout(() => {
              loader.style.display = "none";
              showGridOverlay(imageURL);
            }, 2000); // 2 seconds loading before grid
          }, 2000); // 2 seconds showing building image
        },
      });
    } else {
      // If address is selected, simple flow
      setTimeout(() => {
        loader.style.display = "none";
        window.location.href = "/explore";
      }, 2000);
    }
  }, 2000); // First loader duration
});

// Show grid overlay function
function showGridOverlay(imageURL) {
  gridImage.src = imageURL;
  gridImage.style.display = "block";

  for (let i = 1; i < 30; i++) {
    const vLine = document.createElement("div");
    vLine.className = "grid-line grid-vertical";
    vLine.style.left = `${(i * 100) / 30}%`;
    gridOverlay.appendChild(vLine);

    const hLine = document.createElement("div");
    hLine.className = "grid-line grid-horizontal";
    hLine.style.top = `${(i * 100) / 30}%`;
    gridOverlay.appendChild(hLine);
  }

  gsap.from("#grid-overlay", { opacity: 0, duration: 1 });

  // After showing grids, again loading and redirect
  setTimeout(() => {
    gridImage.style.display = "none";
    gridOverlay.style.display = "none";
    loader.style.display = "flex";

    setTimeout(() => {
      loader.style.display = "none";
      window.location.href = "/explore";
    }, 2000); // Loading before redirect
  }, 3000); // Time to display grid
}
