const app = getApp();
const API = app.globalData.API_ENDPOINTS.THIRD_PARTY;
Page({
    data: {
        bgColor: '',
        title: '',
        InputBottom: 0,
        inputValue: '',
        messages: [], // 存储聊天记录
        ColorList: app.globalData.ColorList
    },

    onLoad(options) {
        const {title, color} = options;
        this.setData({
            bgColor: `bg-gradual-${color}`,
            title: title
        });
    },

    InputFocus(e) {
        this.setData({
            InputBottom: e.detail.height
        });
    },

    InputBlur(e) {
        this.setData({
            InputBottom: 0
        });
    },

    onInput(e) {
        this.setData({
            inputValue: e.detail.value
        });
    },

    onSend() {
        const content = this.data.inputValue;
        if (!content) return;

        // 将自己发送的内容加入消息列表
        this.setData({
            messages: [...this.data.messages, { type: 'self', content: content }],
            inputValue: '' // 清空输入框
        });

        // 发送请求到接口
        app.$http.post(API.TRANS, { text: content }).then(res => {
            if (res.ok && res.data.length > 0) {
                // 获取颜色数组
                const colorList = this.data.ColorList;

                // 构建翻译结果对象并分配颜色
                const translations = [];
                res.data.forEach((item, index) => {
                    item.trans.forEach((word, wordIndex) => {
                        translations.push({
                            text: word, // 每个词汇单独展示
                            color: colorList[(index + wordIndex) % colorList.length].name // 循环使用颜色数组
                        });
                    });
                });

                // 更新页面的数据
                this.setData({
                    messages: [...this.data.messages, {
                        type: 'other',
                        translations: translations  // 将翻译结果以带颜色数组形式传递
                    }]
                });
            } else {
                // 当接口没有返回有效数据时显示错误信息
                this.setData({
                    messages: [...this.data.messages, { type: 'info', content: '没有找到相关词汇翻译' }]
                });
            }
        }).catch(err => {
            // 出现错误时，显示拒绝消息
            this.setData({
                messages: [...this.data.messages, { type: 'info', content: '没有找到相关词汇翻译' }]
            });
        });
    }
});
