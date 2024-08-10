var HTTP = require("../../../../utils/http.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        canConfirm: false,//确认按钮是否可点击
        zmPic: null,//正面照片
        fmPic: null,//反面照片
        previewPic: null,//预览图片
        confirmMsg: '',//确认弹框消息
        confirmTitle: '提示',//确认弹框标题
        isShowBottomDialog: false,//是否显示底部文件选择弹框
        tempType: 0,//临时类型：1-正面 2-反面
        isShowPreviewModal: false,//是否显示预览弹框
        deleteTp: null,//待删除类型
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    //删除图片
    toDelete: function (e) {
        const tp = Number(e.currentTarget.dataset.tp);
        this.setData({ deleteTp: tp, confirmMsg: "确认删除吗？" });
    },
    //显示选择照片方式底部弹框
    showSelectModal: function (e) {
        const tp = Number(e.currentTarget.dataset.tp);
        const zmPic = this.data.zmPic;
        const fmPic = this.data.fmPic;
        if (tp == 1 && !zmPic || tp == 2 && !fmPic) {
            //弹出底部弹框
            this.setData({ isShowBottomDialog: true, tempType: tp });
        }
        else {
            //已有图片跳转到图片编辑页面
            wx.navigateTo({
                url: '../certificatesEdit/certificatesEdit?sfzType=' + tp + "&src=" + (tp == 1 ? zmPic : fmPic),
            })
        }
    },
    //点击底部选择弹框关闭按钮
    closeSelectModal: function () {
        this.setData({ isShowBottomDialog: false, tempType: 0 });
    },
    //确认打印按钮点击
    toConfirm: function () {
        const $ = this;
        const canConfirm = $.data.canConfirm;
        if (canConfirm) {
            if (!$.data.previewPic) {
                $.generatePreviewPic(() => {
                    wx.navigateTo({
                        url: '../idPhotoPreview/idPhotoPreview?zjzType=3&pic=' + $.data.previewPic,
                    })
                });
            }
            else {
                wx.navigateTo({
                    url: '../idPhotoPreview/idPhotoPreview?zjzType=3&pic=' + $.data.previewPic,
                })
            }
        }
    },
    //设置正反面图片
    setPic: function (type, pic) {
        const $ = this;
        var dataZmPic = type == 2 ? $.data.zmPic : pic;
        var dataFmPic = type == 2 ? pic : $.data.fmPic;
        if (type == 2) {
            $.setData({ fmPic: pic });
        }
        else {
            $.setData({ zmPic: pic });
        }
        setTimeout(() => {
            $.updateConfirmInfo(dataZmPic, dataFmPic);
        }, 50);
    },
    updateConfirmInfo: function (dataZmPic, dataFmPic) {
        const $ = this;
        if (dataZmPic != null && dataZmPic != undefined && dataFmPic != null && dataFmPic != undefined) {
            $.setData({ canConfirm: true });
        }
        else {
            $.setData({ canConfirm: false });
        }
    },
    //点击预览按钮
    yulan: function () {
        const $ = this;
        const zmPic = $.data.zmPic;
        const fmPic = $.data.fmPic;
        const previewPic = $.data.previewPic;
        if (previewPic) {
            $.changePreviewModal();
        }
        else if (zmPic && fmPic) {
            $.generatePreviewPic(() => {
                $.changePreviewModal();
            });
        }
    },
    changePreviewModal: function () {
        const $ = this;
        const canConfirm = $.data.canConfirm;
        const previewPic = $.data.previewPic;
        if (canConfirm && previewPic) {
            $.setData({ isShowPreviewModal: true });
        }
        else {
            $.setData({ isShowPreviewModal: false });
        }
    },
    //关闭预览弹框
    closeYuLan: function () {
        this.setData({ isShowPreviewModal: false });
    },
    //用画布生成预览图片
    generatePreviewPic: function (cb) {
        wx.showLoading({
            title: '图片合成中...',
            mask: true
        })
        const $ = this;
        const canConfirm = $.data.canConfirm;
        const zmPic = $.data.zmPic;
        const fmPic = $.data.fmPic;
        if (canConfirm && zmPic && fmPic) {
            //预览操作--生成预览图片
            var cvx = wx.createCanvasContext("preview-canvas", this);
            cvx.setFillStyle('white');
            cvx.fillRect(0, 0, 1238, 1754);
            cvx.save();
            // cvx.setFillStyle('white');
            // cvx.fillRect(0, 0, 506, 718);
            // cvx.save();
            //画身份证正面
            $.roundRect(cvx, 366, 518, 506, 319, 22);
            cvx.drawImage(zmPic, 366, 518, 506, 319);
            cvx.restore();
            //画身份证背面
            $.roundRect(cvx, 366, 917, 506, 319, 22);
            cvx.drawImage(fmPic, 366, 917, 506, 319);
            cvx.draw(true, () => {
                wx.canvasToTempFilePath({
                    width: 1238,
                    height: 1754,
                    destWidth: 1238,
                    destHeight: 1754,
                    fileType: 'png',
                    quality: 1,
                    canvasId: 'preview-canvas',
                    success: (res1) => {
                        $.setData({ previewPic: res1.tempFilePath }, () => {
                            wx.hideLoading()
                            if (cb) {
                                cb();
                            }
                        });
                    }
                })
            });
        }
    },
    //确认弹框事件
    bindConfirm: function (e) {
        const $ = this;
        const confirmMsg = this.data.confirmMsg;
        $.setData({ confirmMsg: '' });
        if (e.detail.index == 1) {
           if (confirmMsg.indexOf("删除") != -1) {
                const tp = $.data.deleteTp;
                $.setData({ canConfirm: false, previewPic: null});
                $.setPic(tp, null);
            }
        }
    },
    //点击底部选择弹框本地或微信文件事件
    selectFile: function (e) {
        const $ = this;
        var opr = e.currentTarget.dataset.opr;
        const sfzType = $.data.tempType;
        if (opr == "1") {
            //微信图片
            wx.chooseMessageFile({
                count: 1,
                type: 'image',
                extension: ['png', 'jpg', 'jpeg'],
                success(res) {
                    // $.setPic(sfzType, res.tempFiles[0].path);
                    wx.navigateTo({
                        url: '../certificatesEdit/certificatesEdit?sfzType=' + sfzType + "&src=" + res.tempFiles[0].path,
                    })
                }
            })
        }
        else if (opr == "2") {
            //拍照
            wx.navigateTo({
                url: '../takePhoto/takePhoto?sfzType=' + sfzType,
            })
        }
        else {
            //手机相册
            wx.chooseImage({
                count: 1,
                sizeType: ['original'],
                sourceType: ['album'],
                success(res) {
                    // $.setPic(sfzType, res.tempFiles[0].path);
                    wx.navigateTo({
                        url: '../certificatesEdit/certificatesEdit?sfzType=' + sfzType + "&src=" + res.tempFiles[0].path,
                    })
                }
            })
        }
        $.closeSelectModal();
    },
    //空函数
    emp: function () { },
    /**
     * @param {CanvasContext} ctx canvas上下文
     * @param {number} x 圆角矩形选区的左上角 x坐标
     * @param {number} y 圆角矩形选区的左上角 y坐标
     * @param {number} w 圆角矩形选区的宽度
     * @param {number} h 圆角矩形选区的高度
     * @param {number} r 圆角的半径
     */
    roundRect: function (ctx, x, y, w, h, r) {
        // 开始绘制
        ctx.beginPath();
        // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
        // 这里是使用 fill 还是 stroke都可以，二选一即可
        ctx.setFillStyle('white');
        // ctx.setStrokeStyle('transparent')
        // 左上角
        ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5);

        // border-top
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.lineTo(x + w, y + r);
        // 右上角
        ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2);

        // border-right
        ctx.lineTo(x + w, y + h - r);
        ctx.lineTo(x + w - r, y + h);
        // 右下角
        ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5);

        // border-bottom
        ctx.lineTo(x + r, y + h);
        ctx.lineTo(x, y + h - r);
        // 左下角
        ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI);

        // border-left
        ctx.lineTo(x, y + r);
        ctx.lineTo(x + r, y);

        // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
        ctx.fill();
        // ctx.stroke()
        ctx.closePath();
        // 剪切
        ctx.clip();
    }

})