function download(url, name) {
    fetch(url).then(res => res.blob().then(blob => {
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        var filename = name;
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    }))
}

function getName() {
    let episode = $('.m-0.g-color-gray-dark-v1').text().replace('Episode ', '')
    let desc = $('.text-muted.text-line-through').text() || $('.g-mt-15.h1.g-color-gray-dark-v1').text()

    return episode + '-' + desc
}

// $('a.u-btn-teal').click(function () {
//     let name = getName()
//     download(this.href, name)
//     console.log('Download', name, 'by', this.href)
//     return false
// })

const { ipcRenderer } = require('electron')

window.onload = () => {
    ipcRenderer.send('single', getName())
}