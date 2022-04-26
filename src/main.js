const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require('electron');
const path = require('path');
let id = 0;

function createWindow() {
    const win = new BrowserWindow({
        width: 310,
        height: 230,
        show: false,
        titleBarStyle: 'hidden',
        autoHideMenuBar: true,
        resizable: false,
        maximizable: false,
        transparent: true, 
        frame: false,
        icon: path.join(__dirname, 'assets/app-icon.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        }
    });

    win.loadFile(path.join(__dirname, 'index.html'));
    win.once('ready-to-show', () => {
        win.show();
    })

    ipcMain.once('close-app', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    ipcMain.on('minimize-app', () => {
        win.minimize();
    });

    ipcMain.on('toggle-supervisor', (shouldStart) => {
        if (shouldStart) {
            id = powerSaveBlocker.start('prevent-display-sleep');
        } else {
            powerSaveBlocker.stop(id);
        }
    });

}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
