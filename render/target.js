const { ipcRenderer } = require('electron')

window.onload = () => {
    ipcRenderer.send('single', {
        url: location.href,
        // 视频真实地址
        target: $('a.u-btn-teal').attr('href')
    })
}