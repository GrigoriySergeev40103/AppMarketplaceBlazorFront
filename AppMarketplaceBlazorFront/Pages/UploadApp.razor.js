export function UploadAppJs(filename, desc, special_desc, prc) {
    const elem = document.getElementById("file-upload");

    // Get the selected file from the input element
    var file = elem.files[0]

    // Create a new tus upload
    var upload = new tus.Upload(file, {
        endpoint: 'https://localhost:7247/files',
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
            filename: filename,
            description: desc,
            spec_desc: special_desc,
            price: String(prc),
            category_id: String(document.getElementById("select-category").value)
        },
        onBeforeRequest: (req) => {
            // So it adds auth cookie to request
            const xhr = req.getUnderlyingObject()
            xhr.withCredentials = true 
        },
        onError: function (error) {
            console.log('Failed because: ' + error)
        },
        onProgress: function (bytesUploaded, bytesTotal) {
            var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
            console.log(bytesUploaded, bytesTotal, percentage + '%')
        },
        onSuccess: function () {
            console.log('Download %s from %s', upload.file.name, upload.url)
        },
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