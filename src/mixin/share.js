import { getScript } from "@utils"
export default {
    methods: {
        shareConfig(obj) {
            let _default = {
                title: '太平洋汽车网',
                desc: '买车就选太平洋汽车网，好礼送不停',
                imgUrl: '',
                link: window.location.href.split('?')[0].replace('w1ssl','www1')
            }

            obj = Object.assign({}, _default, obj);

            if (this.$browserEnv==1) {
                let shareStr = JSON.stringify({
                  title: obj.title,
                  desc: obj.desc,
                  link: obj.link,
                  imgUrl: obj.imgUrl
                })
                if (window.PCJSKit&&window.PCJSKit.updateShareInfo) {
                    window.PCJSKit.updateShareInfo(shareStr);
                }else if (this.$wk==1) {
                    window.webkit.messageHandlers.PCJSKit.postMessage({functionName: 'updateShareInfo', data: shareStr});
                }else {
                    this.$toast("请更新到最新版本app：分享")
                }
            }else if (this.$browserEnv==2) {
                let _initWxApi = () => {
                    //微信自定义分享
                    window.wxApi = wxApi
                    wxApi.init(function() {
                        var shareData = {
                            title: obj.title,
                            desc: obj.desc,
                            link: obj.link,
                            imgUrl: obj.imgUrl
                        };
                        wx.onMenuShareAppMessage(shareData); // 分享给朋友
                        wx.onMenuShareTimeline(shareData); // 分享到朋友圈
                        wx.onMenuShareQQ(shareData); // 分享到QQ
                        wx.onMenuShareWeibo(shareData); // 分享到微博
                    });
                }
                if (window.wxApi) {
                    _initWxApi()
                }else {
                    getScript("//js.3conline.com/wap/pcauto/common/auto_wxShare.js", _initWxApi)
                }
            }
        }
    }
}


