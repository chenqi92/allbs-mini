const app = getApp()
const API = app.globalData.API_ENDPOINTS.PROFILE;
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    fc: 0,
    sc: 0,
    tc: 0,
  },
  attached() {
    let that = this;
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    that.numDH();
    wx.hideLoading()
  },
  methods: {
    numDH() {
      const _this = this;

      app.$http.get(API.STATICS).then(res => {
        if(res.ok) {
          _this.setData({
            fc: _this.countNum(res.data.fc),
            sc: _this.countNum(res.data.sc),
            tc: _this.countNum(res.data.tc)
          })
        }
      }).catch(err => {
        console.log(err);
      })
    },
    countNum(e) {
      if (e > 1000 && e < 10000) {
        e = (e / 1000).toFixed(1) + 'k'
      }
      if (e > 10000) {
        e = (e / 10000).toFixed(1) + 'W'
      }
      return e
    },
    CopyLink(e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: res => {
          wx.showToast({
            title: '已复制',
            duration: 1000,
          })
        }
      })
    },
    showModal(e) {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    },
    hideModal(e) {
      this.setData({
        modalName: null
      })
    },
    showQrcode() {
      // wx.previewImage({
      //   urls: ['https://image.weilanwl.com/color2.0/zanCode.jpg'],
      //   current: 'https://image.weilanwl.com/color2.0/zanCode.jpg' // 当前显示图片的http链接
      // })
    },
  }
})
