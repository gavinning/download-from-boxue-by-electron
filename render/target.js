const { ipcRenderer } = require('electron')

window.onload = () => {
    ipcRenderer.send('single', {
        // 页面地址
        // 用于数组合并依据
        // 视频列表页采集时已有 title, url 字段的数组对象
        // 此时返回视频真实地址时同时返回url
        // 就可以以此为依据进行合并
        url: location.href,
        // 视频真实地址
        target: $('a.u-btn-teal').attr('href')
    })
}