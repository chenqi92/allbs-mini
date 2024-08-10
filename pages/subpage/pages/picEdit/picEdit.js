var ratio = 0.9;
var ratioEnable = false;
var xkmbList = [{
    "typeName": "精美相框",
    "tpList": [{
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jingmei/moban/boluo_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jingmei/thumbnail/boluo_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jingmei/moban/haixing_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jingmei/thumbnail/haixing_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jingmei/moban/hongye_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jingmei/thumbnail/hongye_xiao.png"
    }, {
        "boxWidth": 350,
        "boxHeight": 506,
        "boxTop": 87,
        "path": "/xkmb/jingmei/moban/huangxigua_350x506_87_da.png",
        "thumbnailPath": "/xkmb/jingmei/thumbnail/huangxigua_xiao.png"
    }, {
        "boxWidth": 454,
        "boxHeight": 516,
        "boxTop": 76,
        "path": "/xkmb/jingmei/moban/lanse_454x516_76_da.png",
        "thumbnailPath": "/xkmb/jingmei/thumbnail/lanse_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jingmei/moban/lvse_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jingmei/thumbnail/lvse_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jingmei/moban/shuye_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jingmei/thumbnail/shuye_xiao.png"
    }]
}, {
    "typeName": "海报相框",
    "tpList": [{
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/haibao/moban/BB_474x707_0_da.png",
        "thumbnailPath": "/xkmb/haibao/thumbnail/BB_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/haibao/moban/huabiao_474x707_0_da.png",
        "thumbnailPath": "/xkmb/haibao/thumbnail/huabiao_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/haibao/moban/lvse_474x707_0_da.png",
        "thumbnailPath": "/xkmb/haibao/thumbnail/lvse_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/haibao/moban/milu_474x707_0_da.png",
        "thumbnailPath": "/xkmb/haibao/thumbnail/milu_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/haibao/moban/qiu_474x707_0_da.png",
        "thumbnailPath": "/xkmb/haibao/thumbnail/qiu_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/haibao/moban/zise_474x707_0_da.png",
        "thumbnailPath": "/xkmb/haibao/thumbnail/zise_xiao.png"
    }]
}, {
    "typeName": "简单相框",
    "tpList": [{
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jiandan/moban/aixin_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jiandan/thumbnail/aixin_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jiandan/moban/fenhua_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jiandan/thumbnail/fenhua_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jiandan/moban/mao_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jiandan/thumbnail/mao_xiao.png"
    }, {
        "boxWidth": 474,
        "boxHeight": 707,
        "boxTop": 0,
        "path": "/xkmb/jiandan/moban/xigua_474x707_0_da.png",
        "thumbnailPath": "/xkmb/jiandan/thumbnail/xigua_xiao.png"
    }]
}];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        serverUrl: "https://gitee.com/tiankf/images/raw/master",
        type: 1,
        fileSourcePath: '',
        optIdx: 1,//1-裁切 2-留白 3-相框
        MbList: [],//照片模板列表
        childTpList: [],//缩略图列表
        orgWidth: 0,//原始宽度
        orgHeight: 0,//原始高度
        isShow: true,//是否显示裁切和留白裁减区
        xk_mb_url: '',//相框模式模板url
        xk_mb_width: '',//相框模板宽度
        xk_mb_height: '',//相框模板高度
        mm: 0,//相框模式top偏移量
        mbTypeIdx: 0,//模板索引
        mbThuIdx: [0, -1],//缩略图缩印
        boxRealTop: 0,//接口返回真实boxTop
        boxRealWidth: 0,
        boxRealHeight: 0,
        resUrl: "",//测试
        isLoading: false, //是不是加载中
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const $ = this;
        wx.showLoading({
            title: '图片初始化中',
            mask: true
        })
        this.data.isLoading = true;
        const type = Number(options.type);
        const fileSourcePath = options.fileSourcePath;
        var title = (type == 4 ? "A4图片" : (type == 3 ? "7寸照片" : (type == 2 ? "6寸照片" : "5寸照片"))) + "编辑";
        wx.setNavigationBarTitle({
            title: title,
        });
        var winh = wx.getSystemInfoSync().windowHeight;
        if (winh < 600) {
            //比iphone6小的屏适配
            ratioEnable = true;
        }
        var wh = this.cumputeWH(type);
        this.setData({type: type, height: wh.h, width: wh.w, orgWidth: wh.w, orgHeight: wh.h});
        if (type == 2) {
            //6寸获取模板
            this.loadTpList(type);
        }
        //fileSourcePath: fileSourcePath,
        if (fileSourcePath) {
            wx.getImageInfo({
                src: fileSourcePath,
                success: (res) => {
                    $.setData({fileSourcePath: JSON.stringify(res)}, () => {
                        $.cropper = $.selectComponent("#image-cropper");
                    });
                },
                fail: (err) => {
                    $.data.isLoading = false;
                    wx.hideLoading()
                    wx.showToast({
                        title: '加载失败!请重试',
                        icon: 'none',
                        duration: 1500,
                        mask: true
                    });
                }
            });
        }
    },
    loadTpList: function (type) {
        const $ = this;
        $.setData({MbList: xkmbList, childTpList: xkmbList[0].tpList});
    },
    /**
     * 计算裁减框宽高
     */
    cumputeWH: function (type) {
        const $ = this;
        // 5寸：298*431
        // 6寸：298*444
        // 7寸：298*425
        // A 4：298*422
        var wh = wx.getSystemInfoSync().windowWidth;
        var w = (type == 4 ? 662 : (type == 3 ? 662 : (type == 2 ? 662 : 662))) * (ratioEnable ? ratio : 1);
        var h = (type == 4 ? 937 : (type == 3 ? 928 : (type == 2 ? 987 : 945))) * (ratioEnable ? ratio : 1);
        var obj = {};
        obj.h = $.toPx(h);
        obj.w = $.toPx(w);
        return obj;
    },
    changeOpt: function (e) {
        const $ = this;
        const lastOpt = $.data.optIdx;
        var opt = Number(e.currentTarget.dataset.opt);
        if (opt === 1) {
            //裁切
            if (lastOpt === 3) {
                wx.showLoading({
                    title: '图片初始化中',
                    mask: true
                })
                $.data.isLoading = true;
            }
            $.setData({
                isShow: true,
                optIdx: opt,
                width: this.data.orgWidth,
                height: this.data.orgHeight,
                mm: 0,
                mbTypeIdx: 0,
                mbThuIdx: [0, -1],
                xk_mb_url: '',
                xk_mb_width: 0,
                xk_mb_height: 0
            }, () => {
                if ($.cropper) {
                    $.cropper._imgComputeSize(false);
                }
            });

        } else if (opt === 2) {
            //留白
            if (lastOpt === 3) {
                wx.showLoading({
                    title: '图片初始化中',
                    mask: true
                })
                $.data.isLoading = true;
            }
            this.setData({
                isShow: true,
                optIdx: opt,
                width: this.data.orgWidth,
                height: this.data.orgHeight,
                mm: 0,
                mbTypeIdx: 0,
                mbThuIdx: [0, -1],
                xk_mb_url: '',
                xk_mb_width: 0,
                xk_mb_height: 0
            }, () => {
                if ($.cropper) {
                    $.cropper._imgComputeSize(true);
                }
            });
        } else {
            if (lastOpt === 3) {
                return;
            }
            wx.showLoading({
                title: '图片初始化中',
                mask: true
            })
            $.data.isLoading = true;
            //相框---todo
            var boxWidth = 474 * (ratioEnable ? ratio : 1);
            var boxHeight = 707 * (ratioEnable ? ratio : 1);
            var wh = {w: $.toPx(boxWidth), h: $.toPx(boxHeight)};
            const fileSourcePath = $.data.fileSourcePath;
            this.setData({fileSourcePath: ''}, () => {
                $.setData({
                    fileSourcePath: fileSourcePath,
                    optIdx: opt,
                    isShow: false,
                    width: wh.w,
                    height: wh.h,
                    xk_mb_width: wh.w + 0.5,
                    xk_mb_height: wh.h + 0.5,
                    mm: 0,
                    mbTypeIdx: 0,
                    mbThuIdx: [0, -1],
                    boxRealTop: 0,
                    boxRealWidth: 474,
                    boxRealHeight: 707
                });
            });

        }
    },
    getBoxWH: function (boxWidth, boxheight) {
        var wh = wx.getSystemInfoSync().windowHeight;
        var obj = {};
        var h = boxheight * wh / 603;
        var w = boxWidth * h / boxheight;
        obj.h = h;
        obj.w = w;
        return obj;
    },
    /**
     * 点击模板类型
     */
    changeMbType: function (e) {
        const idx = Number(e.currentTarget.dataset.idx);
        const oldIdx = this.data.mbTypeIdx;
        if (idx == oldIdx) {
            return;
        }
        this.setData({mbTypeIdx: idx, childTpList: [...this.data.MbList[idx].tpList]});
    },
    /**
     * 点击模板缩略图
     */
    changeTemplate: function (e) {
        const $ = this;
        const xkmburl = e.currentTarget.dataset.xkmburl || '';
        const boxTop = Number(e.currentTarget.dataset.boxTop || 0);
        const boxWidth = Number(e.currentTarget.dataset.boxWidth || 0);
        const boxHeight = Number(e.currentTarget.dataset.boxHeight || 0);
        const idx = Number(e.currentTarget.dataset.idx || 0);
        if ($.data.mbThuIdx[0] == $.data.mbTypeIdx && $.data.mbThuIdx[1] == idx) {
            return;
        }
        var wh = {w: $.toPx(boxWidth * (ratioEnable ? ratio : 1)), h: $.toPx(boxHeight * (ratioEnable ? ratio : 1))};

        $.setData({
            mm: $.toPx(boxTop * (ratioEnable ? ratio : 1)),
            xk_mb_url: xkmburl,
            mbThuIdx: [$.data.mbTypeIdx, idx],
            boxRealTop: boxTop,
            boxRealWidth: boxWidth,
            boxRealHeight: boxHeight,
            width: wh.w,
            height: wh.h
        }, () => {
            $.cropper.setCutCenter();
            $.cropper._imgMarginDetectionScale();
            $.cropper._imgComputeSize(false);
        });

    },
    toPx: function (d) {
        var ww = wx.getSystemInfoSync().windowWidth;
        return ww * d / 750;
    },
    cropperload: function () {
        console.log("corpper加载成功");
    },
    loadimage(e) {
        console.log("图片加载成功");
        const $ = this;
        const opt = Number($.data.optIdx);
        if (opt == 3) {
            $.cropper = $.selectComponent("#image-cropper1");
            $.cropper._imgComputeSize(false);
            // console.log($.cropper.data);
        } else {
            $.cropper = $.selectComponent("#image-cropper");
            if (opt == 1) {
                $.cropper._imgComputeSize(false);
            } else {
                $.cropper._imgComputeSize(true);
            }
            // $.cropper.imgReset();
        }
        if ($.data.isLoading) {
            $.data.isLoading = false;
            wx.hideLoading()
        }
    },
    getImg: function () {
        wx.showLoading({
            title: '图片初始化中',
            mask: true
        })
        const $ = this;
        const isShow = $.data.isShow;
        this.cropper.getImg(function (res) {
            var upUrl = "";
            if (res.url) {
                if (!isShow) {
                    //图片与模板合成
                    var cvx = wx.createCanvasContext("mb-canvas", $);
                    const boxRealTop = $.data.boxRealTop;
                    const boxRealWidth = $.data.boxRealWidth;
                    const boxRealHeight = $.data.boxRealHeight;
                    cvx.drawImage(res.url, (474 - boxRealWidth) / 2, boxRealTop, boxRealWidth, boxRealHeight);
                    const xk_mb_url = $.data.xk_mb_url;
                    if (xk_mb_url) {
                        wx.getImageInfo({
                            src: xk_mb_url,
                            success: function (res) {
                                cvx.drawImage(res.path, 0, 0, 474, 707);
                                cvx.draw(true, () => {
                                    wx.canvasToTempFilePath({
                                        width: 474,
                                        height: 707,
                                        destWidth: 1020,
                                        destHeight: 1520,
                                        fileType: 'png',
                                        quality: 1,
                                        canvasId: 'mb-canvas',
                                        success: (res1) => {
                                            $.finishPic(res1.tempFilePath);
                                        }
                                    })
                                });
                            },
                            fail: function () {
                                wx.hideLoading()
                                wx.showToast({
                                    title: '系统开小差了，请稍后再试',
                                    icon: 'none',
                                    duration: 1500,
                                    mask: true
                                });
                                $.data.isLoading = false;

                            }
                        })
                    } else {
                        cvx.draw(true, () => {
                            wx.canvasToTempFilePath({
                                width: 474,
                                height: 707,
                                destWidth: 1020,
                                destHeight: 1520,
                                fileType: 'png',
                                quality: 1,
                                canvasId: 'mb-canvas',
                                success: (res1) => {
                                    $.finishPic(res1.tempFilePath);
                                }
                            })
                        });
                    }
                } else {
                    upUrl = res.url;
                    $.finishPic(upUrl);
                }
            }
        });
    },
    finishPic: function (url) {
        const $ = this;
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({lastPic: url, w: 400 * $.data.width / $.data.height, h: 400});
        wx.navigateBack();
    },
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
    }

})