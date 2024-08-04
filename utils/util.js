const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
const formatTimestamp = (timestamp, format = 'yyyy-MM-dd HH:mm:ss') => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';

    const formatNumber = n => n.toString().padStart(2, '0');

    const replacements = {
        'yyyy': date.getFullYear(),
        'MM': formatNumber(date.getMonth() + 1),
        'dd': formatNumber(date.getDate()),
        'HH': formatNumber(date.getHours()),
        'mm': formatNumber(date.getMinutes()),
        'ss': formatNumber(date.getSeconds())
    };

    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, match => replacements[match]);
};

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

const extractFileNameFromUrl = url => {
    const urlParts = url.split('?')[0]
    return urlParts.substring(urlParts.lastIndexOf('/') + 1)
}

module.exports = {
    formatTime, formatTimestamp, formatNumber, extractFileNameFromUrl
}
