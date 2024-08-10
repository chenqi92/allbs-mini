var HTTP = require("../../../../utils/http.js");
var ratio = 0.95;
var ratioEnable = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        src: '',
        ww: wx.getSystemInfoSync().windowWidth,
        w: 0,
        h: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const $ = this;
        wx.showLoading({
            title: '初始化...',
            mask: true
        })
        var winh = wx.getSystemInfoSync().windowHeight;
        if (winh < 600) {
            //比iphone6小的屏适配
            ratioEnable = true;
        }
        var w = $.toPx(ratioEnable ? 599 * ratio : 599);
        var h = $.toPx(ratioEnable ? 948 * ratio : 948);
        var sfzType = Number(options.sfzType);
        var sfzBgWidth = sfzType === 1 ? 398 : 238;
        var sfzBgHeight = sfzType === 1 ? 342 : 224;
        var sfzBgPos1 = sfzType === 1 ? 70 : 31;
        var sfzBgPos2 = sfzType === 1 ? 44 : 31;
        sfzBgWidth = $.toPx(ratioEnable ? sfzBgWidth * ratio : sfzBgWidth);
        sfzBgHeight = $.toPx(ratioEnable ? sfzBgHeight * ratio : sfzBgHeight);
        sfzBgPos1 = $.toPx(ratioEnable ? sfzBgPos1 * ratio : sfzBgPos1);
        sfzBgPos2 = $.toPx(ratioEnable ? sfzBgPos2 * ratio : sfzBgPos2);
        wx.getImageInfo({
            src: options.src,
            success: (res) => {
                $.setData({
                    width: w,
                    height: h,
                    sfzType: sfzType,
                    src: JSON.stringify(res),
                    sfzBgWidth: sfzBgWidth,
                    sfzBgHeight: sfzBgHeight,
                    sfzBgPos1: sfzBgPos1,
                    sfzBgPos2: sfzBgPos2
                });
            }
        });

    },
    //rpx转px
    toPx: function (d) {
        var ww = this.data.ww;
        return ww * d / 750;
    },
    //裁减框加载图片
    loadimage(e) {
        const $ = this;
        $.cropper = $.selectComponent("#image-cropper");
        $.cropper._init_sfz_imgComputeSize();
        $.setData({cutTop: $.cropper.data.cut_top, cutHeight: $.cropper.data.height}, () => {
            setTimeout(() => {
                wx.hideLoading()
            }, 100);
        });
    },
    //旋转
    toRotate: function () {
        const $ = this;
        const oldAngle = $.cropper.data.angle;
        let newAngle;
        if (oldAngle % 90 == 0) {
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
        newAngle = newAngle == 0 ? 0 : newAngle;
        $.cropper.setAngle(newAngle);
    },
    //重置
    toReset: function () {
        this.cropper.imgReset();
        this.cropper._init_sfz_imgComputeSize();
    },
    //保存
    confirmCut: function () {
        const $ = this;
        const sfzType = this.data.sfzType;
        if (!$.cropper) {
            return;
        }
        wx.showLoading({
            title: '保存中...',
            mask: true
        })
        $.cropper.getImg(function (res) {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];  //上一个页面
            $.gpic(res.url, (pic) => {
                prevPage.setPic(sfzType, pic);
                wx.hideLoading()
                wx.navigateBack();
            });
        });
    },
    //旋转生成图片
    gpic: function (photoPic, cb) {
        const $ = this;
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