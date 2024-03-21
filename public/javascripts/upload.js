const form = document.querySelector("form"),
  fileInput = document.querySelector(".file-input"),
  progressArea = document.querySelector(".progress-area"),
  uploadedArea = document.querySelector(".uploaded-area");

form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  let file = target.files[0];
  if (file) {
    let fileName = file.name;
    if (fileName.length >= 12) {
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName, file);
  }
}

async function uploadFile(name, file) {
  try {
    let formData = new FormData();
    formData.append('photos', file);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/upload");
    xhr.upload.addEventListener("progress", ({ loaded, total }) => {
      let fileLoaded = Math.floor((loaded / total) * 100);
      let fileSize;
      (total < 1024) ? fileSize = total + " B" :
        (total < 1024 * 1024) ? fileSize = (total / 1024).toFixed(2) + " KB" :
          fileSize = (total / (1024 * 1024)).toFixed(2) + " MB";
      let progressHTML = `<li class="row">
                            <i class="fas fa-file-alt"></i>
                            <div class="content">
                              <div class="details">
                                <span class="name">${name} • Uploading</span>
                                <span class="percent">${fileLoaded}%</span>
                                <span class="size">${fileSize}</span>
                              </div>
                              <div class="progress-bar">
                                <div class="progress" style="width: ${fileLoaded}%"></div>
                              </div>
                            </div>
                          </li>`;
      uploadedArea.classList.add("onprogress");
      progressArea.innerHTML = progressHTML;
    });

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const photoUrls = JSON.parse(xhr.responseText);
        progressArea.innerHTML = "";
        photoUrls.forEach(photoUrl => {
          let uploadedHTML = `<li class="row">
                                <div class="content upload">
                                  <i class="fas fa-file-alt"></i>
                                  <div class="details">
                                    <span class="name">${name} • Uploaded</span>
                                    <a href="${photoUrl}" target="_blank" rel="noopener noreferrer">Cloudinary Link</a>
                                  </div>
                                </div>
                                <i class="fas fa-check"></i>
                              </li>`;
          uploadedArea.classList.remove("onprogress");
          uploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML);
        });
      }
    };

    xhr.send(formData);
  } catch (error) {
    console.error('Upload failed:', error);
    // Handle error here
  }
}
