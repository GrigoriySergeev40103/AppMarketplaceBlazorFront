var currentUpload;

export function UploadAppJs(filename, desc, special_desc, prc) {
    if (currentUpload != null) {
        return;
    }

    const elem = document.getElementById("file-upload");

    // Get the selected file from the input element
    var file = elem.files[0];

    var progressVisDiv = document.getElementById("upload-pb");
    var progressElem = document.getElementById("upload-progress");

    const fName = file.name;
    const lastDot = fName.lastIndexOf('.');
    const ext = fName.substring(lastDot + 1);

    // Create a new tus upload
    currentUpload = new tus.Upload(file, {
        endpoint: 'https://localhost:7247/files',
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
            filename: filename,
            extension: ext,
            description: desc,
            spec_desc: special_desc,
            price: String(prc),
            category_name: document.getElementById("select-category").value
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

            currentUpload = null;
        },
        onAfterResponse: function (req, res) {
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
        }
    })

    const icon = document.getElementById("upload-pause-btn");

    // remove possible previously registred handler?(i don't actually know js pepeLaugh)
    icon.removeEventListener("click", pauseUnpauseClick);
    icon.addEventListener("click", pauseUnpauseClick);

    // Check if there are any previous uploads to continue.
    currentUpload.findPreviousUploads().then(function (previousUploads) {
        // previousUploads is an array containing details about the previously started uploads.
        // The objects in the array have following properties:
        // - size: The upload's size in bytes
        // - metadata: The metadata associated with the upload during its creation
        // - creationTime: The timestamp when the upload was created

        // We ask the end user if they want to resume one of those uploads or start a new one.
        var chosenUpload = askToResumeUpload(previousUploads);

        // If an upload has been chosen to be resumed, instruct the upload object to do so.
        if (chosenUpload) {
            currentUpload.resumeFromPreviousUpload(chosenUpload);
        }

        // Finally start the upload requests.
        currentUpload.start();
    })
}

// Open a dialog box to the user where they can select whether they want to resume an upload
// or instead create a new one.
function askToResumeUpload(previousUploads) {
    if (previousUploads.length === 0) return null;

    var text = "You tried to upload this file previously at these times:\n\n";
    previousUploads.forEach((previousUpload, index) => {
        text += "[" + index + "] " + previousUpload.creationTime + "\n";
    });
    text += "\nEnter the corresponding number to resume an upload or press Cancel to start a new upload";

    var answer = prompt(text);
    var index = parseInt(answer, 10);

    if (!isNaN(index) && previousUploads[index]) {
        return previousUploads[index];
    }
}

function startOrResumeUpload(upload) {
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

function pauseUnpauseClick (evt) {
    if (evt.currentTarget.className == "fas fa-pause fa-5x") {
        currentUpload.abort();
        evt.currentTarget.className = "fas fa-play fa-5x";
    } else {
        currentUpload.start();
        evt.currentTarget.className = "fas fa-pause fa-5x";
    }
}