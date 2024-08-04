// api.js
// const API_BASE_URL = "https://wx.allbs.cn/";
const API_BASE_URL = "http://192.168.0.120:8888/";
const PREVIEW_BASE_URL = "https://preview.allbs.cn/onlinePreview?url=";

const API_URLS = {
    PROFILE: {
        BASE: 'wx/statics',
        STATICS: 'profileStatics',
    },
    MINIO: {
        BASE: 'minio',
        UPLOAD: 'upload',
        REMOVE_BG: 'remove-bg'
    },
    HOT: {
        BASE: 'wx/hot',
        SIDE_BAR_LIST: 'sideBarList',
        GET_HOT_NEWS: 'getHotNews'
    },
    // 更多模块
};

// 使用 Proxy 动态拼接 URL
const createApiUrls = (urls) => {
    const handler = {
        get(target, prop) {
            if (typeof target[prop] === 'object') {
                return new Proxy(target[prop], handler);
            }
            if (typeof target.BASE === 'string' && typeof target[prop] === 'string') {
                return `${target.BASE}/${target[prop]}`;
            }
            return target[prop];
        }
    };
    return new Proxy(urls, handler);
};

const API_ENDPOINTS = createApiUrls(API_URLS);

export {API_BASE_URL, API_ENDPOINTS, PREVIEW_BASE_URL};
