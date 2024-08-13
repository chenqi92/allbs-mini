Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 1,  //类型：1-5寸 2-6寸 3-7寸 4-A4
        isShowBottomDialog: false,
        isLoading: false, //是不是加载中
        lastPic: undefined,//最终图片
        w: 0,
        h: 0,
        title: '图片生成'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const $ = this;
        const type = Number(options.type) || 1;
        const title = (type === 4 ? "A4图片" : (type === 3 ? "7寸照片" : (type === 2 ? "6寸照片" : "5寸照片"))) + "生成";
        this.setData({title: title})
        if (!this.lastPic) {
            this.setData({isShowBottomDialog: true, type: type});
        } else {
            this.setData({type: type});
        }
    },
    //点击添加图片
    addFile: function () {
        this.setData({isShowBottomDialog: true});
    },
    //编辑裁减页面
    toEdit: function (e) {
        const type = this.data.type;
        const fileSourcePath = e.currentTarget.dataset.spt;
        wx.navigateTo({
            url: '../picEdit/picEdit?type=' + type + "&fileSourcePath=" + fileSourcePath,
        })
    },
    //点击底部选择弹框关闭按钮
    closeSelectModal: function () {
        this.setData({isShowBottomDialog: false});
    },
    //点击底部选择弹框本地或微信文件事件
    selectFile: function (e) {
        const $ = this;
        var opr = e.currentTarget.dataset.opr;
        this.closeSelectModal();
        if (opr == "1") {
            //微信图片
            wx.chooseMessageFile({
                count: 1,
                type: 'image',
                extension: ['png', 'jpg', 'jpeg'],
                success(res) {
                    $.leapToEdit(res.tempFiles[0].path)
                }
            })
        } else if (opr == "2") {
            //拍照
            wx.chooseImage({
                count: 1,
                sizeType: ['original'],
                sourceType: ['camera'],
                success(res) {
                    $.leapToEdit(res.tempFilePaths[0])
                }
            })
        } else {
            //手机相册
            wx.chooseImage({
                count: 1,
                sizeType: ['original'],
                sourceType: ['album'],
                success(res) {
                    $.leapToEdit(res.tempFilePaths[0])
                }
            })
        }
    },
    //跳转
    leapToEdit: function (path) {
        wx.navigateTo({
            url: '../picEdit/picEdit?type=' + this.data.type + "&fileSourcePath=" + path,
        })
    },
    //保存到相册
    saveImg: function () {
        const $ = this;
        const lastPic = $.data.lastPic;
        if (!lastPic) {
            return;
        }
        wx.getImageInfo({
            src: lastPic,
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
                        if (r && r.errMsg && (r.errMsg.indexOf("denied") !== -1 || r.errMsg.indexOf("deny") !== -1)) {
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
