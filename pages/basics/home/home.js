// pages/toolbox/home/home.js
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
  },
  methods: {
    toSlectPicSize: function () {
      wx.navigateTo({
        url: '/pages/subpage/pages/picSize/picSize',
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
  },
})
