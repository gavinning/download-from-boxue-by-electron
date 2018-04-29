const { ipcRenderer } = require('electron')
const config = require('../config')

// 加载视频列表
ipcRenderer.on('tryGetViodeList', () => {
    // 从配置文件调用获取视频列表的方法
    // 简单的dom查询方法
    let videos = config.videolist.content($)
    let title = $('.g-color-white.g-font-weight-200.g-mb-50').text()

    console.log(videos)
    // 发送视频列表给home窗口
    ipcRenderer.send('videolist', Array.isArray(videos) ? videos : [], title)
})