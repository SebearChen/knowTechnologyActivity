<template>
    <div class="body">
        <div class="head">
            <a class="play" @click="showPlay()"></a>
            <div class="withdrawal" @click="toWithdrawal()"></div>
        </div>
        <Redrainsessions :userId="userId" :unionId="unionId" :isOldUser="isOldUser" />
        <KTSuccessPop />
        <CTStatusPop />
        <WelcomeOldUsersPop :isOldUser="isOldUser" :hasBeenInvited="hasBeenInvited" />
        <GroupStatusPop />
        <RedRainPop :userId="userId" />
        <div class="acCenterLoading" v-if="showAcCenterLoading"></div>
        <!-- <div class="haveCTQuali" v-if="haveCTQuali">
            <div class="btn" @click="changeHavaCtQ()">{{leftCloseTime}}秒后关闭</div>
        </div>
        <div class="noCTQuali" v-if="noCTQuali">
            <div class="btn" @click="changeNoCtQ()">{{leftCloseTime}}秒后关闭</div>
        </div> -->
    </div>
</template>

<script>
    import storage from '@/mixin/storage.js'
    export default {
        props: ['userId', 'isOldUser', 'unionId', 'isLogin', 'hasBeenInvited'],
        name: 'ActivityCenter',
        data() {
            return {
                showAcCenterLoading: false, //显示加载页
                // haveCTQuali: false,
                // noCTQuali: false,
                // leftCloseTime: '10',
                // leftCloseTimeIN: '',
            }
        },
        created() {
            if (sessionStorage.getItem("acCenterLoadingStatus") == 'true') {
                sessionStorage.removeItem("acCenterLoadingStatus");
                this.$router.push("/withdrawal?time="+Date.parse(new Date()));
            }
        },
        watch: {
            isLogin(val) {
                if (val == 'true') {
                    this.getActivityCenterGData();
                }
            }
        },
        methods: {
            // changeHavaCtQ(){
            //     this.haveCTQuali = false;
            // },
            // changeNoCtQ(){
            //     this.noCTQuali = false;
            // },
            // 跳转玩法页
            showPlay() {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('首页', '', '', '玩法', '');
                this.$router.push("/activityrule")
            },
            // 前往拼团历史
            toWithdrawal() {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('首页', '', '', '提现', '');
                localStorage.setItem("withdRawalStatus", 'true');
                // 判断是否已登录
                this.$EventBus.$emit("toLogin");
            }
        },
        mounted() {
            setTimeout(() => {
                location.reload();
            }, 3600000);
            // 神策埋点 浏览事件
            this.$sensorsEvent.detailView('首页', '');
            this.$nextTick(() => {
                if (sessionStorage.getItem("acCenterLoadingStatus") == 'true') {
                    sessionStorage.removeItem("acCenterLoadingStatus");
                    this.showAcCenterLoading = true;
                    setTimeout(() => {
                        this.showAcCenterLoading = false;
                        // if (localStorage.getItem("onlyOneYD") == 'true') {
                        //     // window.clearInterval(this.leftCloseTimeIN);
                        //     // 判断是否已登录
                        //     if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage
                        //         .methods.getCookie(storage.data().LOGIN_TOKEN) != null) {
                        //         if (localStorage.getItem("haveCTQuali") == true) {
                        //             localStorage.removeItem("haveCTQuali");
                        //             this.haveCTQuali = true;
                        //             this.leftCloseTimeIN = setInterval(() => {
                        //                 this.leftCloseTime = parseInt(this.leftCloseTime) - 1;
                        //             }, 1000)
                        //             setTimeout(() => {
                        //                 this.haveCTQuali = false;
                        //             }, 10000);
                        //         } else {
                        //             this.noCTQuali = true;
                        //             this.leftCloseTimeIN = setInterval(() => {
                        //                 this.leftCloseTime = parseInt(this.leftCloseTime) - 1;
                        //             }, 1000)
                        //             setTimeout(() => {
                        //                 this.noCTQuali = false;
                        //             }, 10000);
                        //         }
                        //     } else {
                        //         this.haveCTQuali = true;
                        //         this.leftCloseTimeIN = setInterval(() => {
                        //             this.leftCloseTime = parseInt(this.leftCloseTime) - 1;
                        //         }, 1000)
                        //             setTimeout(() => {
                        //                 this.haveCTQuali = false;
                        //             }, 10000);
                        //     }
                        //     localStorage.setItem("onlyOneYD", "false");
                        // }
                    }, 2500);
                }
            })
            if (window.PCJSKit.platform() == 'iOS') {
                localStorage.setItem("devId", window.PCJSKit.commonSessionId());
            } else {
                localStorage.setItem("devId", window.PCJSKit.devId());
            }
            let shareObj = JSON.stringify({
                "title": "喜迎2022，知科技好福利！",
                "desc": "知科技APP每日12时、15时、18时、21时，新年红包雨疯狂开抢>",
                "image": "http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg",
                "url": "https://www1.pconline.com.cn" + storage.data().SHARE_LINK +
                    "/zt/act/year/202111/wx-wap/index.html#/sharepop",
                "wapUrl": "https://www1.pconline.com.cn" + storage.data().SHARE_LINK +
                    "/zt/act/year/202111/wx-wap/index.html#/sharepop"
            });
            this.$utils.setShareApp(shareObj)
            this.$EventBus.$off("withdRawalPop");
            this.$EventBus.$on("withdRawalPop", () => {
                localStorage.removeItem("withdRawalStatus");
                this.$router.push("/collagehistory");
            });
        }
    }
</script>

<style lang="scss" scoped>
    .body {
        height: 100%;
        position: relative;
        background-color: #00092c;
        z-index: 2;

        .head {
            width: vw(750);
            min-height: vw(858);
            position: relative;
            top: 0;
            left: 0;
            margin-bottom: vw(-460);
            z-index: -1;
            @include bg("../assets/images/head_bg.png", top left, 100% 100%, no-repeat);

            .play {
                width: vw(77);
                height: vw(69);
                position: absolute;
                top: vw(50);
                right: vw(15);
                @include bg("../assets/images/head_play.png", top left, 100% 100%, no-repeat)
            }

            .withdrawal {
                width: vw(77);
                height: vw(69);
                position: absolute;
                top: vw(125);
                right: vw(15);
                z-index: 2;
                @include bg("../assets/images/head_withdrawal.png", top left, 100% 100%, no-repeat)
            }
        }

        .acCenterLoading {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            @include bg("../assets/images/acCenterLoading.gif", top left, 100% 100%, no-repeat);
            z-index: 1;
        }

        .haveCTQuali {
            width: vw(750);
            height: vw(1624);
            position: absolute;
            top: 0;
            left: 0;
            @include bg("../assets/images/have-CT-bg.jpg", top left, 100% 100%, no-repeat);
            z-index: 88;

            .btn {
                width: vw(376);
                height: vw(123);
                line-height: vw(183);
                margin: vw(1050) auto 0;
                z-index: 88;
                @include bg("../assets/images/iknow.png", top left, 100% 100%, no-repeat);
                text-align: center;
                font-size: vw(27);
                color: rgba(255, 255, 255, 0.5);
            }
        }

        .noCTQuali {
            width: vw(750);
            height: vw(1624);
            position: absolute;
            top: 0;
            left: 0;
            @include bg("../assets/images/no-CT-bg.jpg", top left, 100% 100%, no-repeat);
            z-index: 88;

            .btn {
                width: vw(376);
                height: vw(123);
                line-height: vw(183);
                margin: vw(1050) auto 0;
                z-index: 88;
                @include bg("../assets/images/iknow.png", top left, 100% 100%, no-repeat);
                text-align: center;
                font-size: vw(27);
                color: rgba(255, 255, 255, 0.5);
            }
        }
    }
</style>