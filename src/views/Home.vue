<template>
    <div>

    </div>
</template>

<script>
    import share from "@mixin/share";
    import storage from '@mixin/storage'
    import Swiper from "swiper";
    import "swiper/css/swiper.min.css";
    window._Swiper = Swiper;
    export default {
        name: 'Home',
        mixins: [share, storage],
        data() {
            return {
            }
        },
        created() {
            
        },
        methods: {
            getCookie(name) {
                try {
                    var arr = document.cookie
                        .match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
                    if (arr != null)
                        return unescape(arr[2]);
                    return null;
                } catch (e) {
                    console.warn(e)
                    return null;
                }
            },
        },
        mounted() {
            if (sessionStorage.getItem("acCenterLoadingStatus") == 'true') {
                sessionStorage.removeItem("acCenterLoadingStatus");
                this.$router.push("/withdrawal");
            }
            // if (window.PCJSKit.platform() == 'iOS') {
            //     localStorage.setItem("devId",window.PCJSKit.commonSessionId());
            // }else{
            //     localStorage.setItem("devId",window.PCJSKit.devId());
            // }
            // var shareObj = {
            //     "title":"喜迎2022，知科技好福利！",
            //     "desc":"知科技APP每日12时、15时、18时、21时，新年红包雨疯狂开抢>",
            //     "image":"http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg",
            //     "url": "https://www1.pconline.com.cn/case/test/zt/act/year/202111/app-wap/index.html#/activitycenter",
            //     "wapUrl":"https://www1.pconline.com.cn/case/test/zt/act/year/202111/app-wap/index.html#/activitycenter"
            // };
            // window.PCJSKit.changeMeta(JSON.stringify(shareObj));
        }
    }
</script>

<style lang="scss" scoped>

</style>