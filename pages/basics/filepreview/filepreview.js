// pages/basics/filepreview/filepreview.js
const Base64 = require('../../../utils/base64.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },

  /**
   * 文件预览按钮点击处理函数
   */
  handleFilePreview() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success(res) {
        const tempFilePath = res.tempFiles[0].path;
        console.log('文件路径：', tempFilePath);

        // 将文件路径进行 Base64 编码
        const encodedUrl = Base64.encode(tempFilePath);

        // 生成新的链接
        const previewUrl = 'https://preview.allbs.cn/onlinePreview?url=' + encodeURIComponent(encodedUrl);
        console.log('预览链接：', previewUrl);

        // 打开新页面加载该链接
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + encodeURIComponent(previewUrl)
        });

        // 将链接复制到剪贴板
        wx.setClipboardData({
          data: previewUrl,
          success() {
            wx.showToast({
              title: '链接已复制',
              duration: 2000
            });
          }
        });
      },
      fail(err) {
        console.error('选择文件失败：', err);
      }
    });
  }
});

