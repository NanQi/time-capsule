var formatTime = (timestamp) => {
    var time = new Date(parseInt(timestamp) * 1000);
    time = time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日";  

    return time;
}

module.exports = {
    formatTime
}