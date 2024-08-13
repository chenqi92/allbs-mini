Page({

    /**
     * 页面的初始数据
     */
    data: {
        previewPic: null,//预览图片
        zjzType: null,
        title: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const zjzType = Number(options.zjzType);
        const title = (zjzType === 3 ? "身份证" : (zjzType + "寸照片")) + "预览";
        this.setData({title: title})
        const pic = options.pic;

        if (zjzType !== 3) {
            this.setData({
                zjzType: zjzType
            });
            this.initCanvas(zjzType, pic);
        } else {
            this.setData({
                zjzType: zjzType,
                previewPic: pic
            });
        }
    },

    initCanvas: function (zjzType, pic) {
        wx.showLoading({
            title: '证件照生成中...',
            mask: true
        })
        const $ = this;
        //预览操作--生成预览图片
        var cvx = wx.createCanvasContext("preview-canvas", this);
        cvx.setFillStyle('white');
        cvx.fillRect(0, 0, 1051, 1500);
        if (zjzType === 1) {
            //1寸
            var w = 295;
            var h = 413;
            var l = 21;
            var t = 69;
            var m = 62;
            cvx.drawImage(pic, l, t, w, h);
            cvx.drawImage(pic, l + w + m, t, w, h);
            cvx.drawImage(pic, l + (w + m) * 2, t, w, h);
            cvx.drawImage(pic, l, t + h + m, w, h);
            cvx.drawImage(pic, l + w + m, t + h + m, w, h);
            cvx.drawImage(pic, l + (w + m) * 2, t + h + m, w, h);
            cvx.drawImage(pic, l, t + (h + m) * 2, w, h);
            cvx.drawImage(pic, l + w + m, t + (h + m) * 2, w, h);
            cvx.drawImage(pic, l + (w + m) * 2, t + (h + m) * 2, w, h);
        } else {
            //2寸
            var w = 413;
            var h = 578;
            var l = 82;
            var t = 141;
            var m = 62;
            cvx.drawImage(pic, l, t, w, h);
            cvx.drawImage(pic, l + w + m, t, w, h);
            cvx.drawImage(pic, l, t + h + m, w, h);
            cvx.drawImage(pic, l + w + m, t + h + m, w, h);
        }
        cvx.draw(true, () => {
            wx.canvasToTempFilePath({
                width: 1051,
                height: 1500,
                destWidth: 1051,
                destHeight: 1500,
                fileType: 'png',
                quality: 1,
                canvasId: 'preview-canvas',
                success: (res1) => {
                    $.setData({previewPic: res1.tempFilePath}, () => {
                        setTimeout(() => {
                            wx.hideLoading()
                        }, 100);
                    });
                }
            })
        });
    },
    //保存图片到本地相册
    savePic() {
        const $ = this;
        const previewPic = $.data.previewPic;
        if (!previewPic) {
            return;
        }
        wx.getImageInfo({
            src: previewPic,
            success(res) {
                wx.saveImageToPhotosAlbum({
                    filePath: res.path,
                    success(r) {
                        //保存成功
                        wx.showToast({
                            title: '保存成功',
                            icon: 'none',
                            duration: 1500,
                            mask: true
                        });
                    },
                    fail(r) {
                        console.log(r);
                        if (r && r.errMsg && (r.errMsg.indexOf("denied") != -1 || r.errMsg.indexOf("deny") != -1)) {
                            wx.showToast({
                                title: '需要相册权限',
                                icon: 'none',
                                duration: 1500,
                                mask: true
                            });
                        }
                    }
                })
            }
        })
    }

})
