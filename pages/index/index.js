Page({
  data: {
    PageCur: 'basics'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '不常用的工具大集合',
      imageUrl: '/images/logo.png',
      path: '/pages/index/index'
    }
  },
})
