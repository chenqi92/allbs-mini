
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  toPicGen:function (e) {
    var tp = e.currentTarget.dataset.tp;
    wx.navigateTo({
      url: '../picGen/picGen?type='+tp,
    })
  },
  toZjz:function(){
    wx.navigateTo({
      url: '../idPhoto/idPhoto',
    })
  }
})