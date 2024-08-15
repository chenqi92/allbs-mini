const app = getApp();
const API = app.globalData.API_ENDPOINTS.MINIO;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ww: wx.getSystemInfoSync().windowWidth,
        wh: wx.getSystemInfoSync().windowHeight,
        zjzType: 1,//证件照类型：1-1寸 2-2寸
        isShowBottomDialog: false,//是否显示底部文件选择弹窗
        isScale: false,//是否缩放，针对小屏高度小于603
        resultImageSrc: '',
        backgroundColor: '#ffffff',  // 默认背景色
        colorPickerShow: false,
        defaultColor: {
            r: 0,
            g: 0,
            b: 255,
            a: 1
        },
        rgba: {
            r: 0,
            g: 188,
            b: 212,
            a: 1
        },
        showDownloadButton: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (this.data.wh < 603) {
            this.setData({isScale: true});
        }
    },
    //初始化裁减框
    initCroper: function (imgPath) {
        wx.showLoading({
            title: '准备中请耐心等待...',
            mask: true
        });
        const $ = this;
        const isScale = $.data.isScale;
        const w = $.toPx(isScale ? 488 * 0.9 : 488);
        const h = $.toPx(isScale ? 684 * 0.9 : 684);

        wx.uploadFile({
            url: app.globalData.API_BASE_URL + API.REMOVE_BG,
            filePath: imgPath,
            name: 'file',
            header: {
                'Content-Type': 'application/json'
            },
            success(res) {
                const data = JSON.parse(res.data);
                if (data.ok) {
                    const url = data.data;
                    const fileName = app.utils.extractFileNameFromUrl(url);

                    // 使用 wx.downloadFile 下载到临时路径
                    wx.downloadFile({
                        url: url,
                        filePath: `${wx.env.USER_DATA_PATH}/${fileName}`,
                        success: function(downloadRes) {
                            if (downloadRes.statusCode === 200) {
                                const tempFilePath = downloadRes.filePath;
                                wx.getImageInfo({
                                    src: tempFilePath,
                                    success: (imageRes) => {
                                        $.setData({ width: w, height: h, src: JSON.stringify(imageRes), showDownloadButton: true }, () => {
                                            $.loadimage();
                                            wx.hideLoading();
                                        });
                                    },
                                    fail: () => {
                                        wx.hideLoading();
                                        wx.showToast({
                                            title: '加载图片信息失败',
                                            icon: 'none'
                                        });
                                    }
                                });
                            } else {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '下载图片失败',
                                    icon: 'none'
                                });
                            }
                        },
                        fail: () => {
                            wx.hideLoading();
                            wx.showToast({
                                title: '下载图片失败',
                                icon: 'none'
                            });
                        }
                    });

                } else {
                    wx.hideLoading();
                    wx.showToast({
                        title: '图片处理失败',
                        icon: 'none'
                    });
                }
            },
            fail() {
                wx.hideLoading();
                wx.showToast({
                    title: '请求失败',
                    icon: 'none'
                });
            }
        });
    },
    //确定裁减
    confirmCut: function () {
        const $ = this;
        const src = $.data.src;
        const zjzType = $.data.zjzType;
        if (src && $.cropper) {
            $.cropper.getImg(function (res) {
                wx.redirectTo({
                    url: '../idPhotoPreview/idPhotoPreview?zjzType=' + zjzType + "&pic=" + res.url,
                })
            });
        }
    },
    //rpx转px
    toPx: function (d) {
        const ww = this.data.ww;
        return ww * d / 750;
    },
    //裁减框加载图片
    loadimage(e) {
        const $ = this;
        $.cropper = $.selectComponent("#image-cropper");
        $.cropper._imgComputeSize(false);
        $.setData({cutTop: $.cropper.data.cut_top, cutHeight: $.cropper.data.height});
    },
    //旋转
    toRotate: function () {
        const $ = this;
        const oldAngle = $.cropper.data.angle;
        let newAngle;
        if (oldAngle % 90 === 0) {
            newAngle = oldAngle + 90;
        } else {
            if (oldAngle > 0) {
                newAngle = (parseInt(oldAngle / 90) + 1) * 90;
            } else {
                newAngle = parseInt(oldAngle / 90) * 90;
            }
        }
        newAngle = newAngle > 360 ? (newAngle - 360) : newAngle;
        newAngle = newAngle < -360 ? (Math.abs(newAngle + 360)) : newAngle;
        newAngle = newAngle === 0 ? 0 : newAngle;
        $.cropper.setAngle(newAngle);
    },
    //切换大小
    changeZjzType: function (e) {
        const tp = Number(e.currentTarget.dataset.tp);
        this.setData({zjzType: tp});
    },
    //显示选择图片底部弹窗
    toSelectPic: function () {
        this.setData({isShowBottomDialog: true});
    },
    //点击底部选择弹框关闭按钮
    closeSelectModal: function () {
        this.setData({isShowBottomDialog: false});
    },
    chooseImageFromChat() {
        this.closeSelectModal();
        const that = this;
        wx.chooseMessageFile({
            count: 1,
            type: 'image',
            extension: ['png', 'jpg', 'jpeg'],
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
                        that.initCroper(filePath);
                    }
                });
            }
        });
    },

    chooseImageFromAlbum() {
        const that = this;
        that.closeSelectModal();
        wx.chooseMedia({
            count: 1,
            sizeType: ['original'],
            sourceType: ['album'],
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
                        that.initCroper(filePath);
                    }
                });
            }
        });
    },
    openPicker() {
        this.setData({
            colorPickerShow: true,
        })
    },

    colorConfirm(event) {
        this.setData({
            backgroundColor: event.detail.hex
        })
    },
    downloadImage() {
        const $ = this;
        $.cropper = $.selectComponent("#image-cropper");
        $.cropper.downloadImage();
    }
})
