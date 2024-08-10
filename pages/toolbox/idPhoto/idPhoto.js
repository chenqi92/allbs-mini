// pages/toolbox/idPhoto/idPhoto.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bgColor: '',
    title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 页面已经准备好，可以执行一些额外的初始化操作
    const { title, color } = options;
    // 动态设置 bgColor 和 itemName
    this.setData({
      bgColor: `bg-gradual-${color}`,
      title: title
    });
  },

  toSlectPicSize: function () {
    wx.navigateTo({
        url: '/page/subpage/pages/picSize/picSize',
      })
  },
 
  toPicGen: function () {
    wx.navigateTo({
        url: '/pages/subpage/pages/picGen/picGen?type=4'
      });
  },
  toSfz:function () {
    wx.navigateTo({
        url: '/pages/subpage/pages/certificates/certificates'
      });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})