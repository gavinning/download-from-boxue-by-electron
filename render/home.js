const fs = require('fs')
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
function createSpiderList(list, titleText) {
    let spider = $('.list-spider')
    let ul = $('<ul></ul>')
    let title = $(`<h3>${titleText}</h3>`)
    list.forEach(item => {
        ul.append($(`<li>${item.title}: <span style="color:#1f8af1">${item.url}</span></li>`))
    })

    spider.html('')
    spider.append(title)
    spider.append(ul)
}

// 获取视频详情
// 包括title和url
function getVideo(win, list) {
    var arr = list.slice(0)

    // 采集单个视频详情
    // 采集完成后发射采集完成事件
    return function () {
        if (arr.length === 0) {
            // 发布视频信息采集完成事件
            return $(document).trigger('video.done')
        }

        let item = arr.shift()
        win.loadURL(item.url)
    }
}

window.onload = () => {
    let listWin = createListWindow()
    let targetWin = createVideoWindow()
    let msg = $('#msg')
    let getList = $('#getList')
    let running = $('#running')
    let videos, targetVideos = [], fetchVideo

    // 接收视频列表
    ipcMain.on('videolist', function (event, list, title) {
        videos = list
        // 创建可视列表
        createSpiderList(list, title)
        // 创建提取视频详情函数
        fetchVideo = getVideo(targetWin, list)
    })

    // 接收单视频信息
    ipcMain.on('single', (event, targetVideo) => {
        console.log('Get:', targetVideo.target)
        msg.text(['done', targetVideo.target].join(': '))
        // 视频信息放进视频列表等待合并
        targetVideos.push(targetVideo)
        // 递归采集下一个视频信息
        fetchVideo()
    })

    // 订阅视频信息采集完成事件
    $(document).on('video.done', () => {
        msg.text('采集完所有视频，准备写入数据')

        // 合并数据
        videos = videos.map(video => {
            let item = targetVideos.find(v => v.url == video.url)
            if (item) {
                // 添加视频下载地址
                video.target = item.target
                // title添加视频文件名后缀
                video.title += path.extname(item.target).split('?')[0]
                // title替换字符 / 为 -, 因为下载时 / 会被解析为路径
                video.title.replace(/\//g, '-')
            } 
            return video
        })

        // 下载格式数据
        let data = ''
        // 下载文件路径
        let filepath = path.resolve('./dest/list.txt')

        // 合成下载数据
        videos.forEach(video => {
            if(video.target) {
                data += `${video.target} dest/${video.title}\n`
            }
        })

        // 写入下载数据到文件
        fs.writeFile(filepath, data, 'utf8', err => {
            err ? console.log(err.message) : console.log(filepath, 'done.')
            if(err) {
                msg.text(err.message)
            }
            else{
                msg.text(['下载数据已写入: dest/list.txt', '请执行: npm run download'].join(' '))
            }
        })
    })

    // 尝试获取视频列表
    // 列表加载完成时 方可成功
    getList.on('click', () => {
        listWin.webContents.send('tryGetViodeList')
        msg.text('视频列表采集完成，可以开始采集视频数据')
    })

    // 开始采集
    running.on('click', () => {
        if(!videos) {
            return msg.text('还没有采集视频列表')
        }
        fetchVideo()
    })
}


