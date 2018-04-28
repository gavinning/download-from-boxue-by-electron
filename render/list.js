const { ipcRenderer } = require('electron')
const config = require('../config')

// 加载视频列表
ipcRenderer.on('tryGetViodeList', () => {
    let videos = config.videolist.content($)

    console.log(videos)
    // 发送视频列表给home窗口
    ipcRenderer.send('videolist', Array.isArray(videos) ? videos : [])
})