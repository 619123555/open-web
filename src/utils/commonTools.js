const commonTools = {
    /**
     * 根据参数，计算出距离现在已经过去的天数
     * parameter : timeStamp   时间戳
     * return : number
     * */
    pastDays: (timeStamp) => {
        if (timeStamp != null && timeStamp != '' && timeStamp) {
            let dateReg = /^(\d{4})-(\d{1,2})-(\d{1,2})*/;
            if (dateReg.test(timeStamp)) {
                return Math.floor((new Date() - new Date(timeStamp)) / 86400000);
            } else {
                let nowTimeStamp = Date.parse(Date());
                return Math.floor((nowTimeStamp - timeStamp) / 86400000);
            }
        } else {
            return 0;
        }
    },

    /**
     * 格式化时间，为固定格式
     * parameter：timeStamp   时间戳
     * return: YYYY-MM-DD
     * */
    fmtTimeStampToDate: (timeStamp) => {
        let dateReg = /^(\d{4})-(\d{1,2})-(\d{1,2})*/;
        if (dateReg.test(timeStamp)) {
            return timeStamp;
        } else {
            var date = new Date(timeStamp);
            var y = 1900 + date.getYear();
            var m = "0" + (date.getMonth() + 1);
            var d = "0" + date.getDate();
            return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
        }
    },
    /**
     * 格式化时间，为固定格式
     * parameter：timeStamp   时间戳
     * return: YYYY-MM-DD HH:mm:ss
     * */
    fmtTimeStampToDateLong: (timeStamp) => {
        let dateReg = /^(\d{4})-(\d{1,2})-(\d{1,2})*/;
        if (dateReg.test(timeStamp)) {
            return timeStamp;
        } else {
            var date = new Date(timeStamp);
            var y = 1900 + date.getYear();
            var m = "0" + (date.getMonth() + 1);
            var d = "0" + date.getDate();
            var h = "0" + date.getHours();
            var mi = "0" + date.getMinutes();
            var s = "0" + date.getSeconds();
            return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length)
                + " " + h.substring(h.length - 2, h.length) + ":" + mi.substring(mi.length - 2, mi.length) + ":" + s.substring(s.length - 2, s.length);
        }
    },
}

export default commonTools