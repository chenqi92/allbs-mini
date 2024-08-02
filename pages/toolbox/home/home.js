// pages/toolbox/home/home.js
Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        elements: [
            {
                title: '文件预览',
                name: 'filePreview',
                color: 'purple',
                icon: 'read',
                model: 'basics',
                show: true,
            },
            {
                title: '练单词',
                name: 'wordGuessing',
                color: 'mauve',
                icon: 'formfill',
                model: 'toolbox',
                show: false,
            },
            {
                title: '扯绳子',
                name: 'pullTheRope',
                color: 'pink',
                icon: 'magic',
                model: 'game',
                show: false,
            },
            {title: '丑丑头像', name: 'uglyAvatar', color: 'olive', icon: 'album', model: 'toolbox', show: true,},
        ],
    },
})
