Page({
  data: {
    PageCur: 'toolbox'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '不常用的工具大集合',
      imageUrl: 'https://nas.allbs.cn:9006/cloudpic/cloudpic/2024/07/88af384e698c5b47819c8be2bb3f33b8.png',
      path: '/pages/index/index'
    }
  },
})
