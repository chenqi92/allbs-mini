Page({
    data: {
        ww: wx.getAppBaseInfo().windowWidth,
        wh: wx.getAppBaseInfo().windowHeight,
        zjzType: 1, // 证件照类型：1-1寸 2-2寸
        isShowBottomDialog: false, // 是否显示底部文件选择弹窗
        isScale: false, // 是否缩放，针对小屏高度小于603
        src: '', // 当前选择的图片路径
    },

    onLoad: function (options) {
        if (this.data.wh < 603) {
            this.setData({ isScale: true });
        }
    },

    // 初始化裁剪框
    initCroper: function (imgPath) {
        wx.showLoading({
            title: '准备中请耐心等待...',
            mask: true
        });

        const isScale = this.data.isScale;
        const w = this.toPx(isScale ? 488 * 0.9 : 488);
        const h = this.toPx(isScale ? 684 * 0.9 : 684);

        wx.getImageInfo({
            src: imgPath,
            success: (res) => {
                this.setData({
                    width: w,
                    height: h,
                    src: imgPath // 直接使用本地路径
                }, () => {
                    wx.hideLoading();
                });
            },
            fail: (res) => {
                wx.hideLoading();
                wx.showToast({
                    title: '加载图片失败',
                    icon: 'none'
                });
            }
        });
    },

    // 确定裁剪
    confirmCut: function () {
        const src = this.data.src;
        const zjzType = this.data.zjzType;
        if (src && this.cropper) {
            this.cropper.getImg(function (res) {
                wx.redirectTo({
                    url: '../idPhotoPreview/idPhotoPreview?zjzType=' + zjzType + "&pic=" + res.url,
                });
            });
        }
    },

    // rpx 转 px
    toPx: function (d) {
        return this.data.ww * d / 750;
    },

    // 裁剪框加载图片
    loadimage(e) {
        this.cropper = this.selectComponent("#image-cropper");
        this.cropper._imgComputeSize(false);
        this.setData({
            cutTop: this.cropper.data.cut_top,
            cutHeight: this.cropper.data.height
        });
    },

    // 旋转图片
    toRotate: function () {
        const oldAngle = this.cropper.data.angle;
        let newAngle = (Math.ceil(oldAngle / 90) * 90) % 360;
        this.cropper.setAngle(newAngle === 360 ? 0 : newAngle);
    },

    // 切换证件照类型
    changeZjzType: function (e) {
        const tp = Number(e.currentTarget.dataset.tp);
        this.setData({ zjzType: tp });
    },

    // 显示选择图片底部弹窗
    toSelectPic: function () {
        this.setData({ isShowBottomDialog: true });
    },

    // 关闭底部选择弹框
    closeSelectModal: function () {
        this.setData({ isShowBottomDialog: false });
    },

    // 选择文件（微信照片或手机相册）
    selectFile: function (e) {
        const opr = e.currentTarget.dataset.opr;
        const chooseFunction = opr == "1" ? wx.chooseMessageFile : wx.chooseImage;
        const options = opr == "1" ? { count: 1, type: 'image', extension: ['png', 'jpg', 'jpeg'] } : { count: 1, sizeType: ['original'], sourceType: ['album', 'camera'] };

        chooseFunction({
            ...options,
            success: (res) => {
                const path = opr == "1" ? res.tempFiles[0].path : res.tempFilePaths[0];
                this.handleImageSelect(path);
            }
        });

        this.closeSelectModal();
    },

    // 处理选择的图片
    handleImageSelect: function (filePath) {
        wx.getFileSystemManager().getFileInfo({
            filePath,
            success: (info) => {
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (info.size > maxSize) {
                    wx.showToast({ title: '文件大小超过10MB', icon: 'none' });
                    return;
                }
                this.setData({
                    src: filePath,
                    buttonDisabled: false, // 允许裁剪操作
                });
                this.initCroper(filePath); // 初始化裁剪
            }
        });
    },

    // 使用2D Canvas API绘制内容
    drawOnCanvas() {
        const ctx = wx.createCanvasContext('myCanvas', this); // 使用id获取Canvas上下文
        ctx.fillStyle = 'red';
        ctx.fillRect(10, 10, 150, 100);
        ctx.draw();
    }
});
