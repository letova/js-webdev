function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    dropArea.classList.add('highlight');
}
  
function unhighlight(e) {
    dropArea.classList.remove('highlight');
}

function initializeProgress(numFiles) {
    progressBar.value = 0;
    uploadProgress = [];

    for(let i = numFiles; i > 0; i--) {
        uploadProgress.push(0);
    }
}

function updateProgress(fileNumber, percent) {
    uploadProgress[fileNumber] = percent;
    let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;
    progressBar.value = total;
}

function previewFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function() {
      let img = document.createElement('img');
      img.src = reader.result;
      document.getElementById('gallery').appendChild(img);
    };
}

function uploadFile(file, i) {
    const url = 'http://letova2w.beget.tech/'; // url для загрузки файлов
    let xhr = new XMLHttpRequest();
    let formData = new FormData();
    xhr.open('POST', url, true)

    xhr.upload.addEventListener("progress", function(e) {
        updateProgress(i, (e.loaded * 100.0 / e.total) || 100)
    })

    xhr.addEventListener('readystatechange', function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        // Готово. Информируем пользователя
      }
      else if (xhr.readyState == 4 && xhr.status != 200) {
        // Ошибка. Информируем пользователя
      }
    })
    formData.append('file', file);
    xhr.send(formData);
}

function handleFiles(files) {
    files = [...files];
    initializeProgress(files.length);
    files.forEach(uploadFile);
    files.forEach(previewFile);
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}


const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('drop', handleDrop, false);

const eventActions = {
    'dragenter': [preventDefaults, highlight], 
    'dragover': [preventDefaults, highlight], 
    'dragleave': [preventDefaults, unhighlight], 
    'drop': [preventDefaults, unhighlight]
};

const eventsList = Object.keys(eventActions);

eventsList.forEach((event) => {
    eventActions[event].forEach(action => dropArea.addEventListener(event, action, false));
});

const progressBar = document.getElementById('progress-bar');
let uploadProgress = [];