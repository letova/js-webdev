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

function initializeProgress(numfiles) {
    progressBar.value = 0;
    filesDone = 0;
    filesToDo = numfiles;
}

function progressDone() {
    filesDone++;
    progressBar.value = filesDone / filesToDo * 100;
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

function uploadFile(file) {
    const url = 'http://letova2w.beget.tech/'; // url для загрузки файлов
    let formData = new FormData();
    formData.append('file', file);
    fetch(url, {
      method: 'POST',
      body: formData
    })
    .then((progressDone) => {  /*Готово. Информируем пользователя*/  })
    .catch(() => {  /*Ошибка. Информируем пользователя*/  })
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
let filesDone = 0,
    filesToDo = 0;
