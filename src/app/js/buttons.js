const ipc = require('electron').ipcRenderer;

let isStarted = false;
let timer;
let totalSeconds = 0;


function closeApp() {
    ipc.send('close-app');
}

function minimizeApp() {
    ipc.send('minimize-app');
}

function toggleSupervisor() {
    const button = document.getElementById('toggleButton');
    if (!isStarted) {
        // start
        isStarted = true;
        button.innerHTML = 'Stop';
        timer = setInterval(countTime, 1000);
    } else {
        // stop
        totalSeconds = 0;
        isStarted = false;
        clearInterval(timer);
        document.getElementById('timer').innerHTML = '00:00:00';
        button.innerHTML = 'Start';
    }
    ipc.send('toggle-supervisor', isStarted);
}

function countTime() {
    ++totalSeconds;
    let hour = Math.floor(totalSeconds / 3600);
    let minute = Math.floor((totalSeconds - hour * 3600) / 60);
    let seconds = totalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10)
        hour = '0' + hour;
    if (minute < 10)
        minute = '0' + minute;
    if (seconds < 10)
        seconds = '0' + seconds;
    document.getElementById('timer').innerHTML = hour + ':' + minute + ':' + seconds;
}
