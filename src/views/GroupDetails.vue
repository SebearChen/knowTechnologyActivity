<template>
    <div class="body">
        <Head />
        <InviteCover :unionId="unionId"/>
    </div>
</template>

<script>
    import storage from '@/mixin/storage.js'
    export default {
        props: ['unionId'],
        name: "GroupDetails",
        data() {
            return {
                groupCode: '',//团号
            };
        },
        methods: {
        },
        mounted() {
            if (window.PCJSKit.platform() == 'iOS') {
                localStorage.setItem("devId",window.PCJSKit.commonSessionId());
            }else{
                localStorage.setItem("devId",window.PCJSKit.devId());
            }
            this.$EventBus.$on("toGPvueData",(data)=>{
                let shareObj = JSON.stringify({
                    "title":"嗨！快入团，发福利啦~",
                    "desc":"来知科技APP输入团号【"+data+"】领红包！天天红包雨下不停，速来>",
                    "image":"http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg",
                    "url": "https://"+storage.data().SHARE_LINK_DOMAIN+storage.data().SHARE_LINK+"/zt/act/year/202111/wx-wap/index.html#/?groupId="+this.$route.query.groupId,
                    "wapUrl":"https://"+storage.data().SHARE_LINK_DOMAIN+storage.data().SHARE_LINK+"/zt/act/year/202111/wx-wap/index.html#/?groupId="+this.$route.query.groupId
                });
                this.$utils.setShareApp(shareObj)
            });
        }
    };
</script>

<style lang="scss" scoped>
    .body {
        height: 100%;
        @include bg("../assets/images/groupdetails_bg.png",top left,100% 100%,no-repeat)
    }
</style>