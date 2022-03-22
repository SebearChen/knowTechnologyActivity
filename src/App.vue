<template>
    <div class="appBody">
        <!-- 不使用路由可以删除 -->
        <transition name="router-fade" mode="out-in">
            <keep-alive>
                <router-view :userId="userInfoObj.userId" :unionId="userInfoObj.unionId" :isOldUser="isOldUser"
                    v-if="$route.meta.keepAlive" :hasBeenInvited="hasBeenInvited" />
            </keep-alive>
        </transition>
        <transition name="router-fade" mode="out-in">
            <router-view :userId="userInfoObj.userId" :unionId="userInfoObj.unionId" :isOldUser="isOldUser"
                v-if="!$route.meta.keepAlive" :hasBeenInvited="hasBeenInvited" />
        </transition>
    </div>
</template>
<script>
    import storage from '@/mixin/storage.js'
    export default {
        mixins: [storage],
        data() {
            return {
                isOldUser: false, //是否是老用户
                hasBeenInvited: false,
                scrollTimer: null,
                userInfoObj: {
                    userId: '', //用户ID
                    openId: '',
                    refreshToken: '',
                    accessToken: '',
                    nickName: '',
                    icon: '',
                    unionId: '',
                },
                loginStatus: false, //是否已登录
                groupId: '', //当前团ID
                groupNum: '', //当前团号
                hasCreatedGroup: '',
                failFetchCount: null,
            }
        },
        computed: {},
        methods: {
            //用户资格校验
            async getRpRainVerify() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchRpRainVerify({
                        // ruleId: this.ruleId
                    }, localStorage.getItem("devId"));
                    switch (code) {
                        case 0:
                            if (data) {
                                this.$EventBus.$emit("RedRainPopStatus", localStorage.getItem("RedRainPopStatus"))
                            } else {
                                localStorage.removeItem("RedRainPopStatus");
                                this.$toast("你已参与本场红包雨，敬请期待下一场哦~");
                            }
                            break;
                        case 1:
                            this.$toast("请先进行微信授权~")
                            break;
                        case 2:
                            this.$toast("当前活动不存在~")
                        default:
                            break;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            //获取用户信息
            async getCurrentUserFirst() {
                try {
                    const {
                        userId,
                        unionId,
                        isOldUser,
                        hasBeenInvited,
                        code
                    } = await this.$api.fetchCurrentUser(localStorage.getItem("devId"), storage.methods.getCookie(storage.data().LOGIN_TOKEN));
                    if (code == '100' || code == '401') {
                        this.failFetchCount = parseInt(this.failFetchCount) + 1;
                        if (this.failFetchCount >= 5) {
                            this.$toast("接口繁忙，请稍后再试~");
                            return
                        }
                        setTimeout(() => {
                            this.getCurrentUser();
                        }, 500);
                        return
                    }
                    if (code == '0') {
                        if (localStorage.getItem("userId")== '' || localStorage.getItem("userId")== null) {
                            localStorage.setItem("userId",userId)
                        }
                        if (unionId) {
                            localStorage.setItem("unionId", unionId);
                        }
                        this.userInfoObj.userId = userId;
                        this.isOldUser = isOldUser;
                        this.hasBeenInvited = hasBeenInvited;
                        if ((isOldUser == '1' || hasBeenInvited) && window.location.hash.indexOf("fromWx=1") !=-1) {
                            this.$EventBus.$emit("WelcomeOldUsersPop");
                        }
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            //获取用户信息
            async getCurrentUser() {
                try {
                    const {
                        userId,
                        hasWxAuthed,
                        isOldUser,
                        unionId,
                        hasBeenInvited,
                        hasCreatedGroup,
                        code
                    } = await this.$api.fetchCurrentUser(localStorage.getItem("devId"), storage.methods.getCookie(storage.data().LOGIN_TOKEN));
                    if (code == '100' || code == '401') {
                        this.failFetchCount = parseInt(this.failFetchCount) + 1;
                        if (this.failFetchCount >= 5) {
                            this.$toast("接口繁忙，请稍后再试~");
                            return
                        }
                        setTimeout(() => {
                            this.getCurrentUser();
                        }, 500);
                        return
                    }
                    if (code == '0') {
                        if (localStorage.getItem("userId")== '' || localStorage.getItem("userId")== null) {
                            localStorage.setItem("userId",userId)
                        }
                        if (unionId) {
                            localStorage.setItem("unionId", unionId);
                        }
                        this.userInfoObj.userId = userId;
                        this.isOldUser = isOldUser;
                        this.hasBeenInvited = hasBeenInvited;
                        this.hasCreatedGroup = hasCreatedGroup;
                        if (hasBeenInvited == false && hasCreatedGroup == false && isOldUser == '0') {
                            sessionStorage.setItem("haveCTQuali", "true");
                        }
                        if (localStorage.getItem("activtyCenterStorage") == 'CT') {
                            if (hasBeenInvited == true || hasCreatedGroup == true || isOldUser == '1') {
                                if (window.PCJSKit.platform() == 'iOS') {
                                    this.$toast("限新用户参团哦~老朋友请开团邀好友一起分红包吧！");
                                } else {
                                    setTimeout(() => {
                                        this.$toast("限新用户参团哦~老朋友请开团邀好友一起分红包吧！");
                                    }, 1000);
                                }
                            }
                        }
                        if (hasWxAuthed == 0) {
                            window.location.href = "pcaction://user-browser-wechat?callback=getwxInfo";
                        } else {
                            if (localStorage.getItem("RedRainPopStatus") != null) {
                                this.$EventBus.$emit("activtyCenterCallBack");
                            }
                            if (localStorage.getItem("activtyCenterStorage") != null) {
                                this.$EventBus.$emit("activtyCenterCallBack");
                                if (localStorage.getItem("activtyCenterStorage") == 'CT') {
                                    try {
                                        const {
                                            code,
                                            data
                                        } = await this.$api.fetchJoinGroup({
                                            'code': localStorage.getItem("CTgroupNum")
                                        }, localStorage.getItem("devId"));
                                        if (code == '0') {
                                            this.$EventBus.$emit("showCTStatusPop", code, data);
                                        } else {
                                            this.$EventBus.$emit("showCTStatusPop", code);
                                        }
                                    } catch (error) {
                                        console.error(error);
                                    } finally {}
                                }
                            }
                            if (localStorage.getItem("RedRainPopStatus") != null) {
                                // 获取用户资格
                                this.getRpRainVerify();
                            }
                            if (localStorage.getItem("withdRawalStatus") != null) {
                                this.$EventBus.$emit("withdRawalPop");
                            }
                        }
                    } else {
                        this.$EventBus.$emit("toLogin");
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            async postAuthoRize() {
                try {
                    var postJson = JSON.stringify(this.userInfoObj);
                    const {
                        code,
                    } = await this.$api.fetchAuthoRize(postJson, localStorage.getItem("devId"));
                    if (code == '1') {
                        setTimeout(() => {
                            this.$toast("此微信账号已绑定其他用户，无法参与活动~");
                        }, 1000);
                    } else if (code == '0') {
                        if (localStorage.getItem("RedRainPopStatus") != null) {
                            this.$EventBus.$emit("activtyCenterCallBack");
                        }
                        if (localStorage.getItem("activtyCenterStorage") != null) {
                            this.$EventBus.$emit("activtyCenterCallBack");
                            if (localStorage.getItem("activtyCenterStorage") == 'CT') {
                                this.$EventBus.$emit("activtyCenterCallBackToCT");
                            }
                        }
                        if (localStorage.getItem("RedRainPopStatus") != null) {
                            // 获取用户资格
                            this.getRpRainVerify();
                        }
                        if (localStorage.getItem("withdRawalStatus") != null) {
                            this.$EventBus.$emit("withdRawalPop");
                        }
                    }
                    this.$forceUpdate();
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            //滚动事件
            winScroll() {
                window.requestAnimationFrame(() => {
                    const scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body
                        .scrollTop;
                    // console.log(scrollTop,'scrolltop')
                    // const clientHeight =
                    // 	document.body.clientHeight < document.documentElement.clientHeight
                    // 		? document.body.clientHeight
                    // 		: document.documentElement.clientHeight;
                    // const documentHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
                    // if (documentHeight <= scrollTop + clientHeight + 100) {
                    // 	this.$EventBus.$emit("arriveEnd");
                    // }
                    this.scrollTimer = null;
                    this.scrollTimer = setTimeout(() => {
                        this.$EventBus.$emit("scrolling", scrollTop);
                    }, 50);
                });
            }
        },
        mounted() {
            if (localStorage.getItem("onlyOneYD") == '' || localStorage.getItem("onlyOneYD") == null) {
                localStorage.setItem("onlyOneYD", "true");
            }
            sessionStorage.setItem("acCenterLoadingStatus", "true");
            console.log("当前路径", window.location.href);
            var that = this
            if (window.PCJSKit.platform() == 'iOS') {
                localStorage.setItem("devId", window.PCJSKit.commonSessionId());
            } else {
                localStorage.setItem("devId", window.PCJSKit.devId());
            }
            window.getwxInfo = function (data) {
                let jsonData = (new Function("return " + data))();
                // let wxInfoA = JSON.parse(data);
                // if (wxInfoA && !wxInfoA.accessToken) {
                //     this.$toast("微信绑定失败请重新绑定");
                //     return false;
                // }
                that.userInfoObj.openId = jsonData.openId
                that.userInfoObj.refreshToken = jsonData.refreshToken
                that.userInfoObj.accessToken = jsonData.accessToken
                that.userInfoObj.nickName = jsonData.nickName
                that.userInfoObj.icon = jsonData.icon
                that.userInfoObj.unionId = jsonData.unionId
                that.postAuthoRize();
            }
            window.getCommonId = function (data) {
                storage.methods.setCookie(storage.data().LOGIN_TOKEN, data, 48);
                // if (window.PCJSKit.platform() == 'iOS') {
                that.getCurrentUser(data);
                // } else {
                // window.location.reload();
                // that.getCurrentUser();
                // }
            }
            // 判断是否已登录
            if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(storage.data()
                    .LOGIN_TOKEN) != null) {
                this.getCurrentUserFirst();
            }
            // else {
            //     window.location.href = 'pcaction://user-browser-user-center?callback=getCommonId';
            // }
            window.scrollTo(0, 0);
            //滚动监听事件
            this.$nextTick(() => {
                window.addEventListener("scroll", this.winScroll);
            });
            // this.$EventBus.$off("toLogin");
            // this.$EventBus.$on("toLogin", () => {
            //     if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' || storage.methods.getCookie(storage.data().LOGIN_TOKEN) != null) {
            //         this.getCurrentUser();
            //     } else {
            //         window.location.href = 'pcaction://user-browser-user-center?callback=getCommonId';
            //     }
            // });
            if (window.location.hash.indexOf("groupdetails") == -1) {
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
            }
        },
        created() {
            this.$EventBus.$on("toLogin", () => {
                if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(
                        storage.data().LOGIN_TOKEN) != null) {
                    this.getCurrentUser();
                } else {
                    window.location.href = 'pcaction://user-browser-user-center?callback=getCommonId';
                }
            });
            // this.$EventBus.$on("toGPvueData",(data)=>{
            //     this.groupNum = data;
            //     console.log('this.groupNum',this.groupNum);
            // });

        },
        destroyed() {
            this.$EventBus.$off("toLogin");
            //   this.$EventBus.$off("toGPvueData");  
        }
    }
</script>
<style lang="scss">
    .appBody {
        // position: absolute;
    }
</style>