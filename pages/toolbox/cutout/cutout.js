// pages/index/index.js
const app = getApp(); // 确保能够访问全局变量

Page({
    data: {
        imageSrc: '',
        resultImageSrc: '',
        loading: false,
        loadProgress: 0,
        bgColor: '',
        title: '',
    },

    onLoad(options) {
        // 页面已经准备好，可以执行一些额外的初始化操作
        const {title, color} = options;
        // 动态设置 bgColor 和 title
        this.setData({
            bgColor: `bg-gradual-${color}`,
            title: title
        });
    },

    chooseImage: function () {
        const that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                const tempFilePaths = res.tempFilePaths;
                const filePath = tempFilePaths[0];
                wx.getFileSystemManager().getFileInfo({
                    filePath,
                    success(info) {
                        // 这里只能获取文件大小，不能获取文件类型
                        const maxSize = 10 * 1024 * 1024; // 10MB
                        if (info.size > maxSize) {
                            wx.showToast({
                                title: '文件大小超过10MB',
                                icon: 'none'
                            });
                            return;
                        }
                        that.setData({
                            imageSrc: filePath
                        });
                    }
                });
            }
        });
    },

    removeBg: function () {
        const that = this;
        if (!this.data.imageSrc) {
            wx.showToast({
                title: '请先选择图片',
                icon: 'none'
            });
            return;
        }

        this.setData({loading: true, loadProgress: 0});

        wx.uploadFile({
            url: app.globalData.API_BASE_URL + app.globalData.API_ENDPOINTS.MINIO.REMOVE_BG,
            filePath: this.data.imageSrc,
            name: 'file',
            success(res) {
                const data = JSON.parse(res.data);
                if (data.code === 200) {
                    that.setData({
                        resultImageSrc: data.data,
                        loading: false,
                        loadProgress: 100
                    });
                } else {
                    wx.showToast({
                        title: '图片处理失败',
                        icon: 'none'
                    });
                    that.setData({loading: false, loadProgress: 0});
                }
            },
            fail() {
                wx.showToast({
                    title: '请求失败',
                    icon: 'none'
                });
                that.setData({loading: false, loadProgress: 0});
            }
        });
    }
})
