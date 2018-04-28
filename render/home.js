const path = require('path')
const $ = require('jquery')
const electron = require('electron')
const remote = electron.remote
const ipcMain = remote.ipcMain
const BrowserWindow = remote.BrowserWindow

// 创建列表窗口
// 加载视频列表
// 这里登录，获取session
function createListWindow() {
    let win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: false,
            allowRunningInsecureContent: false,
            preload: path.resolve('./render/list.js')
        }
    })
    win.on('close', () => win = null)
    win.loadURL('https://boxueio.com/series/rxswift-101')
    win.show()
    return win
}

// 创建视频窗口
// 加载视频详情页 拿到视频详细信息
function createVideoWindow() {
    let win = new BrowserWindow({
        width: 600,
        height: 400,
        show: false,
        webPreferences: {
            webSecurity: false,
            nodeIntegration: false,
            allowRunningInsecureContent: false,
            preload: path.resolve('./render/target.js')
        }
    })
    win.on('close', () => win = null)
    return win
}

// 创建可下载视频列表
function createSpiderList(list) {
    let spider = $('.list-spider')
    let ul = $('<ul></ul>')
    list.forEach(item => {
        ul.append($(`<li>${item.title}: <span style="color:#1f8af1">${item.url}</span></li>`))
    })
    spider.html(ul)
}
熊
// 获取视频详情
// 包括title和url
function getVideo(win, urls) {
    var arr = urls.slice(0, 3)

    return function () {
        if (arr.length === 0) {
            return
        }

        let url = arr.shift()
        win.loadURL(url)
    }
}

window.onload = () => {
    let list = createListWindow()
    let target = createVideoWindow()
    let getList = $('#getList')
    let running = $('#running')
    let videos, fetchVideo

    ipcMain.on('videolist', function (event, list) {
        // 创建可视列表
        createSpiderList(list)
        // 创建提取视频详情函数
        fetchVideo = getVideo(target, list)
    })

    ipcMain.on('single', (event, args) => {
        console.log(args)
        fetchVideo()
    })

    // 尝试获取视频列表
    // 列表加载完成时 方可成功
    getList.on('click', () => list.webContents.send('tryGetViodeList'))

    running.on('click', () => {
        if(!videos) {
            return
        }
        fetchVideo()
    })
}


