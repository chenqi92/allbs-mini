// pages/basics/filepreview/filepreview.js
const Base64 = require('../../../utils/base64.js');
const app = getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        bgColor: '',
        title: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 页面已经准备好，可以执行一些额外的初始化操作
        const { title, color } = options;
        // 动态设置 bgColor 和 itemName
        this.setData({
            bgColor: `bg-gradual-${color}`,
            title: title
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    /**
     * 文件预览按钮点击处理函数
     */
    handleFilePreview() {
        const _this = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'file',
            success(res) {

                const tempFilePath = res.tempFiles[0].path;
                const tempFiles = res.tempFiles;
                const maxSize = 10 * 1024 * 1024; // 5MB

                if (tempFiles[0].size > maxSize) {
                    wx.showToast({
                        title: '文件大小超过10MB',
                        icon: 'none',
                        duration: 2000
                    });
                    return;
                }

                _this.setData({
                    loadModal: true
                })
                // 上传文件
                wx.uploadFile({
                    url: app.globalData.API_BASE_URL + app.globalData.API_ENDPOINTS.MINIO.UPLOAD, // 替换为实际的上传文件接口地址
                    filePath: tempFilePath,
                    name: 'file',
                    success(uploadRes) {
                        const data = JSON.parse(uploadRes.data);
                        if (data.ok) { // 假设返回的 JSON 数据格式为 { code: 0, data: { url: 'https://...' } }
                            const fileUrl = data.data.url;
                            console.log('上传成功，文件URL：', fileUrl);

                            // 将文件 URL 进行 Base64 编码
                            const encodedUrl = Base64.encode(fileUrl);

                            // 生成新的预览链接
                            const previewUrl = app.globalData.PREVIEW_BASE_URL + encodeURIComponent(encodedUrl);
                            console.log('预览链接：', previewUrl);

                            _this.setData({
                                loadModal: false
                            })

                            // 打开新页面加载该链接 没有企业认证，暂时注释掉
                            // wx.navigateTo({
                            //   url: '/pages/webview/webview?url=' + encodeURIComponent(previewUrl)
                            // });

                            // 将链接复制到剪贴板
                            wx.setClipboardData({
                                data: previewUrl,
                                success() {
                                    _this.setData({
                                        previewUrl: previewUrl
                                    })
                                    _this.showModal();
                                    // wx.showToast({
                                    //   title: '链接已复制，请打开手机浏览器粘贴后查看文件',
                                    //   duration: 3000
                                    // });
                                }
                            });
                        } else {
                            console.error('上传失败：', data.message);
                            wx.showToast({
                                title: '上传失败',
                                icon: 'none',
                                duration: 2000
                            });
                            _this.setData({
                                loadModal: false
                            })
                        }
                    },
                    fail(uploadErr) {
                        console.error('上传失败：', uploadErr);
                        wx.showToast({
                            title: '上传失败',
                            icon: 'none',
                            duration: 2000
                        });
                        _this.setData({
                            loadModal: false
                        })
                    }
                });
            },
            fail(err) {
                console.error('选择文件失败：', err);
            },
        });
    },
    showModal(e) {
        this.setData({
            modalName: 'Modal'
        })
    },
    hideModal(e) {
        this.setData({
            modalName: null
        })
    },
});

