const app = getApp(); // 确保能够访问全局变量
const API = app.globalData.API_ENDPOINTS.MINIO;

Page({
    data: {
        imageSrc: '',
        resultImageSrc: '',
        loading: false,
        bgColor: '',
        title: '',
        buttonDisabled: false,
        modalName: '',
    },

    onLoad(options) {
        // 页面已经准备好，可以执行一些额外的初始化操作
        const { title, color } = options;
        // 动态设置 bgColor 和 title
        this.setData({
            bgColor: `bg-gradual-${color}`,
            title: title
        });
    },

    showModal(e) {
        if(this.data.loading) {
            return;
        }
        this.setData({
            modalName: e.currentTarget.dataset.target
        });
    },

    hideModal(e) {
        this.setData({
            modalName: ''
        });
    },

    chooseImageFromChat() {
        const that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            success(res) {
                const tempFilePaths = res.tempFiles;
                const filePath = tempFilePaths[0].path;
                wx.getFileSystemManager().getFileInfo({
                    filePath,
                    success(info) {
                        const maxSize = 10 * 1024 * 1024; // 10MB
                        if (info.size > maxSize) {
                            wx.showToast({
                                title: '文件大小超过10MB',
                                icon: 'none'
                            });
                            return;
                        }
                        that.setData({
                            imageSrc: filePath,
                            buttonDisabled: false, // 重新上传图片后，启用按钮
                        });
                    }
                });
                that.hideModal();
            }
        });
    },

    chooseImageFromAlbum() {
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
                        const maxSize = 10 * 1024 * 1024; // 10MB
                        if (info.size > maxSize) {
                            wx.showToast({
                                title: '文件大小超过10MB',
                                icon: 'none'
                            });
                            return;
                        }
                        that.setData({
                            imageSrc: filePath,
                            buttonDisabled: false, // 重新上传图片后，启用按钮
                        });
                    }
                });
                that.hideModal();
            }
        });
    },

    removeBg() {
        const that = this;
        if (!this.data.imageSrc) {
            wx.showToast({
                title: '请先选择图片',
                icon: 'none'
            });
            return;
        }

        this.setData({
            loading: true,
            buttonDisabled: true,
        });

        wx.uploadFile({
            url: app.globalData.API_BASE_URL + API.REMOVE_BG,
            filePath: this.data.imageSrc,
            name: 'file',
            header: {
                'Content-Type': 'application/json'
            },
            success(res) {
                const data = JSON.parse(res.data);
                if (data.ok) {
                    const url = data.data;
                    that.setData({
                        resultImageSrc: url,
                        loading: false,
                    });
                } else {
                    wx.showToast({
                        title: '图片处理失败',
                        icon: 'none'
                    });
                    that.setData({
                        loading: false,
                        buttonDisabled: false,
                    });
                }
            },
            fail() {
                wx.showToast({
                    title: '请求失败',
                    icon: 'none'
                });
                that.setData({
                    loading: false,
                    buttonDisabled: false,
                });
            }
        });
    },

    downloadImage() {
        const that = this;
        if (!this.data.resultImageSrc) {
            wx.showToast({
                title: '没有可下载的图片',
                icon: 'none'
            });
            return;
        }

        const fileName = app.utils.extractFileNameFromUrl(this.data.resultImageSrc);

        wx.downloadFile({
            url: this.data.resultImageSrc,
            filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
            success(res) {
                if (res.statusCode === 200) {
                    const tempFilePath = res.filePath;
                    wx.saveImageToPhotosAlbum({
                        filePath: tempFilePath,
                        success() {
                            wx.showToast({
                                title: '图片下载成功',
                                icon: 'success'
                            });
                        },
                        fail() {
                            wx.showToast({
                                title: '保存图片失败',
                                icon: 'none'
                            });
                        }
                    });
                } else {
                    wx.showToast({
                        title: '下载图片失败',
                        icon: 'none'
                    });
                }
            },
            fail() {
                wx.showToast({
                    title: '请求下载失败',
                    icon: 'none'
                });
            }
        });
    }
});
