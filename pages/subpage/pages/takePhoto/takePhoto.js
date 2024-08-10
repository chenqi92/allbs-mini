var HTTP = require("../../../../utils/http.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ww: wx.getSystemInfoSync().windowHeight,
        photoPic: null,//拍照照片
        sfzType: 0,//1-正面 2-反面
        hasAuthPhoto: true,//是否具有拍照权限
        w: 0,
        h: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const $ = this;
        const sfzType = Number(options.sfzType || 1);
        this.setData({sfzType: sfzType, ww: wx.getSystemInfoSync().windowHeight});
    },
    error: function (e) {
        this.setData({hasAuthPhoto: false});
        wx.showToast({
            title: '权限不足，请点击拍照按钮设置权限',
            icon: 'none',
            duration: 1500,
            mask: true
        });
    },
    toPx: function (d) {
        var ww = this.data.ww;
        return ww * d / 750;
    },
    checkAuthPhoto: function () {
        const $ = this;
        wx.openSetting({
            success(res) {
                if (res.authSetting['scope.camera']) {
                    $.setData({hasAuthPhoto: true}, () => {
                        $.paizhao();
                    });
                } else {
                    $.setData({hasAuthPhoto: false});
                }
            }
        })
    },
    paizhao: function () {
        const $ = this;
        const ctx = wx.createCameraContext();
        ctx.takePhoto({
            quality: 'normal',
            success: (res) => {
                $.setData({
                    photoPic: res.tempImagePath,
                    hasAuthPhoto: true
                })
            }
        })
    },
    guanbi: function () {
        wx.navigateBack({
            delta: 1
        })
    },
    quxiao: function () {
        this.setData({photoPic: null});
    },
    queding: function () {
        const $ = this;
        const photoPic = $.data.photoPic;
        const sfzType = $.data.sfzType;
        if (photoPic) {
            wx.showLoading({
                title: '保存中...',
                mask: true
            })
            $.gpic((pic) => {
                var pages = getCurrentPages();
                var prevPage = pages[pages.length - 2];  //上一个页面
                prevPage.setPic(sfzType, pic);
                wx.hideLoading()
                wx.navigateBack();
            });
        }
    },
    //旋转生成图片
    gpic: function (cb) {
        const $ = this;
        const photoPic = this.data.photoPic;
        if (photoPic) {
            wx.getImageInfo({
                src: photoPic,
                success(res) {
                    const w = res.width;
                    const h = res.height;
                    $.setData({w: w, h: h}, () => {
                        var cvx = wx.createCanvasContext('my-canvas');
                        cvx.translate(0, w);
                        cvx.rotate(270 * Math.PI / 180);
                        cvx.drawImage(photoPic, 0, 0, w, h);
                        cvx.draw(true, () => {
                            setTimeout(() => {
                                wx.canvasToTempFilePath({
                                    x: 0,
                                    y: 0,
                                    width: w * 2,
                                    height: h * 2,
                                    destWidth: 506,
                                    destHeight: 319,
                                    fileType: 'jpg',
                                    quality: 1,
                                    canvasId: 'my-canvas',
                                    success: (res1) => {
                                        if (cb) {
                                            cb(res1.tempFilePath);
                                        }
                                    }
                                })
                            }, 100);
                        });
                    });
                }
            })
        }
    }
})