const path = require('path')
const url = require('url')
const electron = require('electron')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

var mainWindow

function init() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800
    })

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    mainWindow.on('closed', () => mainWindow = null)
}

app.on('ready', init)
app.on('activate', () => mainWindow !== null || init())
app.on('window-all-closed', () => process.platform === 'darwin' || app.quit())
