
export function UploadAppJs(filename, desc, special_desc, prc) {
    const elem = document.getElementById("file-upload");

    // Get the selected file from the input element
    var file = elem.files[0];

    var progressVisDiv = document.getElementById("upload-pb");
    var progressElem = document.getElementById("upload-progress");

    const fName = file.name;
    const lastDot = fName.lastIndexOf('.');
    const ext = fName.substring(lastDot + 1);

    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: 'https://localhost:7247/files',
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
            filename: filename,
            extension: ext,
            description: desc,
            spec_desc: special_desc,
            price: String(prc),
            category_name: document.getElementById("select-category")
        },
        onBeforeRequest: (req) => {
            // So it adds auth cookie to request
            const xhr = req.getUnderlyingObject()
            xhr.withCredentials = true 
            progressVisDiv.className = "upload-pb-show";
        },
        onError: function (error) {
            console.log('Failed because: ' + error)
        },
        onProgress: function (bytesUploaded, bytesTotal) {
            var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
            progressElem.style.width = `${percentage}%`;
            progressElem.ariaValueNow = percentage;
        },
        onSuccess: function () {
            progressVisDiv.className = "upload-pb-hide";
            var myModal = document.getElementById('upload_success-modal');
            myModal.style.display = 'block';
        },
        onAfterResponse: function (req, res) {
            var url = req.getURL()
            var value = res.getHeader("AppId")
            if (value != null) {
                // Upload an image of an app
                var formData = new FormData();
                formData.append("file", document.getElementById("appImageInput").files[0]);

                var xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open("POST", `https://localhost:7247/api/Apps/UpdateAppImage?appId=${value}`);
                xhr.send(formData);
            }
            console.log(`Request for ${url} responded with ${value}`)
        }
    })

    // Check if there are any previous uploads to continue.
    upload.findPreviousUploads().then(function (previousUploads) {
        // Found previous uploads so we select the first one.
        if (previousUploads.length) {
            upload.resumeFromPreviousUpload(previousUploads[0])
        }

        // Start the upload
        upload.start()
    })
}