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
            {title: '一键抠图', name: 'cutout', color: 'mauve', icon: 'picfill', model: 'toolbox', show: true,},
            {title: '丑丑头像', name: 'uglyAvatar', color: 'pink', icon: 'album', model: 'toolbox', show: true,},
            {
                title: '撕裂模拟',
                name: 'pullTheRope',
                color: 'green',
                icon: 'magic',
                model: 'game',
                show: true,
            },
            {
                title: '证件照',
                name: 'idPhoto',
                color: 'brown',
                icon: 'newsfill',
                model: 'toolbox',
                show: false,
            },
        ],
    },
})
