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
    },
    attached() {
        let that = this;
        wx.showLoading({
            title: '加载中...',
            mask: true
        });
        that.sideBarList();
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
            this.queryHotNews(this.data.list[id].path, true);
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
                        list[i].top = tabHeight;
                        tabHeight = tabHeight + data.height;
                        list[i].bottom = tabHeight;
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
                        that.setData({ MainCur: i });
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
                    let list = res.data.filter(item => item.path).reverse();
                    _this.setData({
                        list: list,
                        TabCur: 0,
                        MainCur: 0,
                    });
                    _this.queryHotNews(list[0].path, true);
                    wx.hideLoading();
                }
            }).catch(err => {
                console.log(err);
                wx.hideLoading();
            });
        },
        queryHotNews(path, reset = false) {
            const _this = this;
            if (this.data.hasMore) {
                app.$http.get(API.GET_HOT_NEWS, { "path": path }).then(res => {
                    if (res.ok) {
                        const newList = res.data;
                        const hotNewsList = reset ? newList : _this.data.hotNewsList.concat(newList);
                        _this.setData({
                            hotNewsList: hotNewsList,
                            hasMore: false
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            }
        },
        loadMoreNews() {
            if (this.data.hasMore) {
                const currentPath = this.data.list[this.data.TabCur].path;
                this.queryHotNews(currentPath, false);
            }
        },
        formatTime(timestamp) {
            const date = new Date(timestamp);
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
    }
});
