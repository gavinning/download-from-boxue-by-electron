module.exports = {
    videolist: {
        content: $ => {
            let arr = []
            let list = $('ul.list-unstyled').find('li.episode-list-item')

            list.each((index, li) => {
                let link = $(li).find('a.align-items-center')
                let desc = link.text().replace('FREE', '').replace(/(^\s+)|(\s)$/g, '')
                let href = link.attr('href')
                let episode = $(li).find('.text-uppercase').find('.m-0').text().replace('Episode ', '')

                arr.push({
                    title: [episode, desc].join('-'),
                    url: [location.origin, href].join('')
                })
            })
            return arr
        }
    }
}