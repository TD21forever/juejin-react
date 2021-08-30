const ch2en = (chineseName)=>{
    let res = ''
    switch (chineseName) {
        case "前端":
            res = "frontend"
            break;
        case "后端":
            res = "backend"
            break;
        case "Android":
            res = "Android"
            break;
        case "iOS":
            res = "iOS"
            break;
        case "推荐":
            res = "recommend"
            break;
        default:
            res = "tags"
            break;
    }
    return res
};

const getYMDHMS = (timestamp) => {
    let time = new Date(timestamp)
    let year = time.getFullYear()
    let month = time.getMonth() + 1
    let date = time.getDate()
    let hours = time.getHours()
    let minute = time.getMinutes()
    let second = time.getSeconds()

    if (month < 10) { month = '0' + month }
    if (date < 10) { date = '0' + date }

    return year + '年' + month + '月' + date + '日'
}

export {ch2en,getYMDHMS}
