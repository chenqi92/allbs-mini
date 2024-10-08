const app = getApp();
const API = app.globalData.API_ENDPOINTS.HOT;

Component({
    options: {
        addGlobalClass: true,
    },
    data: {
        CustomBar: app.globalData.CustomBar,
        TabCur: 0,
        MainCur: 0,
        VerticalNavTop: 0,
        list: [],
        load: true,
        hotNewsList: [],
        hasMore: true,
        bannerList: [],
        modalName: null,  // 控制弹窗显示状态
        modalTitle: '',   // 弹窗标题
        modalContent: '', // 弹窗内容
        modalCover: ''    // 弹窗图片
    },
    attached() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        this.sideBarList();
        this.getBannerList();
    },
    ready() {
        wx.hideLoading();
    },
    methods: {
        tabSelect(e) {
            const id = e.currentTarget.dataset.id;
            this.setData({
                TabCur: id,
                MainCur: id,
                VerticalNavTop: (id - 1) * 50,
                hotNewsList: [],
                hasMore: true,
            });
            this.queryHotNews(this.data.list[id].name, true);
        },
        VerticalMain(e) {
            let that = this;
            let list = this.data.list;
            let tabHeight = 0;
            if (this.data.load) {
                for (let i = 0; i < list.length; i++) {
                    let view = wx.createSelectorQuery().select("#main-" + list[i].id);
                    view.fields({
                        size: true
                    }, data => {
                        // list[i].top = tabHeight;
                        // tabHeight = tabHeight + data.height;
                        // list[i].bottom = tabHeight;
                    }).exec();
                }
                that.setData({
                    load: false,
                    list: list
                });
            }
            let scrollTop = e.detail.scrollTop + 20;
            for (let i = 0; i < list.length; i++) {
                if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
                    that.setData({
                        VerticalNavTop: (list[i].id - 1) * 50,
                        TabCur: list[i].id
                    });
                    if (i !== that.data.MainCur) {
                        that.setData({MainCur: i});
                        that.queryHotNews(list[i].path, false);
                    }
                    return false;
                }
            }
        },
        sideBarList() {
            const _this = this;
            app.$http.get(API.SIDE_BAR_LIST).then(res => {
                if (res.ok) {
                    _this.setData({
                        list: res.data,
                        TabCur: 0,
                        MainCur: 0,
                    });
                    _this.queryHotNews(res.data[0].name, true);
                    wx.hideLoading();
                }
            }).catch(err => {
                console.log(err);
                wx.hideLoading();
            });
        },
        getBannerList() {
            const _this = this;
            app.$http.get(API.BANNER_LIST).then(res => {
                if (res.ok) {
                    _this.setData({
                        bannerList: res.data
                    });
                }
            }).catch(err => {
                console.log(err);
            });
        },
        queryHotNews(name, reset = false) {
            const _this = this;
            if (this.data.hasMore) {
                app.$http.get(`${API.GET_HOT_NEWS}/${name}`).then(res => {
                    if (res.ok) {
                        const newList = res.data;
                        _this.setData({
                            hotNewsList: newList,
                            hasMore: false
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        formatTime(timestamp) {
            const date = new Date(timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        },
        CopyLink(e) {
            wx.setClipboardData({
                data: e.currentTarget.dataset.link,
                success: res => {
                    wx.showToast({
                        title: '链接已复制',
                        duration: 1000,
                    })
                }
            })
        },
        showModal(e) { // 修改后的方法，接收数据
            const target = e.currentTarget.dataset.target;
            if (!target) return; // 如果target为空，直接返回，不显示任何弹窗

            this.setData({
                modalName: target,
                modalTitle: e.currentTarget.dataset.title || '', // 设置弹窗标题
                modalContent: e.currentTarget.dataset.desc || '', // 设置弹窗内容，确保包含 HTML 标签
                modalCover: e.currentTarget.dataset.cover || ''  // 设置弹窗图片
            });
        },
        hideModal() { // 隐藏弹窗
            this.setData({
                modalName: null,
                modalTitle: '', // 清空弹窗标题
                modalContent: '', // 清空弹窗内容
                modalCover: '' // 清空弹窗图片
            });
        },
    }
});
