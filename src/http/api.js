import fetcher from '@http/fetch.js'

import {
    service,
    fetchPrefix,
    activityId,
    activityId2,
} from '@config/config.js'

import storage from "../mixin/storage";


/**
 * 图片上传（file格式上传）
 * ******referer=http://xxx.pcauto.com.cn/admin/***** 不需要登录标识符
 * data { String } [true] file
 */
export const fetchUpLoadImg1 = data => {
    if (!data) {
        console.warn('data不能为空')
        return
    }
    let formData = new FormData()
    formData.append('photoFile', data)

    return fetcher(`${service.upc}/upload_quick.jsp?referer=http://xxx.pcauto.com.cn/admin/&keepSrc=yes&readExif=no&application=play`, formData, 'post')
}
/**
 * 上传图片
 * application: "play",
 * readExif: "yes",
 * keepSrc: "yes",
 * data: _data //base64字符
 */
export const fetchUpLoadImg2 = data => {
    data = {
        application: "play",
        readExif: "yes",
        keepSrc: "yes",
        data
    }
    return fetcher(`${service.upc}/upload_quick_base64.jsp?referer=http://xxx.pcauto.com.cn/admin/`, data, 'post')
}

/**
 * 事件计数器
 * id { string } 事件计数器id
 */
export const countAd = (id) => {
    var img = new Image;
    img.src = `//count.pcauto.com.cn/count.php?channel=${id}&screen=${screen.width}*${screen.height}&refer=${encodeURIComponent(document.referrer)}&anticache=${new Date().getTime()}&url=${encodeURIComponent(location.href)}&from=event`
}

// 获取用户信息
export const fetchCurrentUser = (headersData, cookie) => fetcher(`${service.auto}${fetchPrefix}/currentUser?${storage.data().LOGIN_TOKEN}=${cookie}`, '', 'get', 'ajax', headersData, storage.data().LOGIN_TOKEN, cookie)

// 知科技微信授权H5回传
export const fetchAuthoRize = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/wx/authorize`, data, 'post', 'ajax', headersData)

// 获取用户拼团历史
export const fetchMyHistory = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/myHistory`, '', 'get', 'ajax', headersData)

// 获取活动首页团信息
export const fetchActivityCenterGData = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/today`, '', 'get', 'ajax', headersData)

// 获取当前所有规则
export const fetchActivityRulesData = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/today/rules`, '', 'get', 'ajax', headersData)

// 获取当前团信息
export const fetchGroupDetailData = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/${data.groupId}`, '', 'get', 'ajax', headersData)

// 获取活动首页轮播区消息
export const fetchGroupBroadCast = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/broadcast`, '', 'get', 'ajax', headersData)

// 开团
export const fetchOpenGroup = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group`, data, 'post', 'ajax', headersData)

// 参团
export const fetchJoinGroup = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/join?code=${data.code}`, '', 'post', 'ajax', headersData)

// 开红包
export const fetchOpenRp = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/${data.groupId}/openRp`, '', 'post', 'ajax', headersData)

// 弹窗信息
export const fetchNotice = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/notice`, '', 'get', 'ajax', headersData)

// 我的钱包余额
export const fetchMyWallet = (headersData) => fetcher(`${service.auto}${fetchPrefix}/withdraw/myWallet`, '', 'get', 'ajax', headersData)

// 申请提现
export const fetchWithdraw = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/withdraw`, data, 'post', 'ajax', headersData)

// 我的提现记录
export const fetchMyRecord = (headersData) => fetcher(`${service.auto}${fetchPrefix}/withdraw/myRecord`, '', 'get', 'ajax', headersData)

// 请求当日红包雨规则场次
export const fetchRpRain = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId2}/rpRain/list`, '', 'get', 'ajax', headersData)

// 获取当日红包雨全部场次
export const fetchRpRainRules = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId2}/rpRain/rules`, '', 'get', 'ajax', headersData)

// 红包雨开奖
export const fetchRPRainLo = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId2}/rpRain/lottery?${data}`, '', 'post', 'ajax', headersData)

// 红包雨手气榜
export const fetchRpRainLucky = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId2}/rpRain/lucky`, '', 'get', 'ajax', headersData)

// 获取下一场红包雨的时间
export const fetchRpRainNextTime = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId2}/rpRain/nextTime`, '', 'get', 'ajax', headersData)

// 获取未登录的下一场红包雨的时间
export const fetchRpRainIndexNextTime = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId2}/rpRain/index/nextTime`, '', 'get', 'ajax', headersData)

// 用户资格校验
export const fetchRpRainVerify = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId2}/rpRain/verify?ruleId=${data.ruleId}`, '', 'get', 'ajax', headersData)

// 当前时刻红包雨（提现浮窗用）
export const fetchRpRainCurrent = (data, headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId2}/rpRain/current`, '', 'get', 'ajax', headersData)

// 当前服务器时间
export const fetchServerTime = (headersData) => fetcher(`${service.auto}${fetchPrefix}/act/${activityId}/group/time`, '', 'get', 'ajax', headersData)