<template>
    <div class="inviteCover">
        <div class="redCover">
            <div class="time" v-if="groupStatusNum == '1'">
                <div>助力倒计时</div><span>{{lefttime}}</span>
            </div>
            <div class="time" v-if="groupStatusNum == '3'">
                <div>已失效</div>
            </div>
            <div class="redRain" @click="toRedRain()"></div>
            <div :class="[groupStatus ? 'openBtn' : 'inviteBtn']" v-if="!groupSuNO">
                <div class="gNum">
                    团号:{{groupId}}
                </div>
                <div class="detail" v-if="!groupStatus">
                    <div class="price">{{groupDetailList.groupStock}}<span>元</span></div>
                    <div class="rule">邀{{groupDetailList.groupNumber -1 }}人，团长分{{groupDetailList.groupCaptainMin}}元起
                    </div>
                </div>
                <div class="detail" v-if="groupStatus">
                    <div class="tit1">{{groupDetailList.groupStock}}元红包</div>
                    <div class="tit2">立即开抢!</div>
                </div>
                <div class="btn" @click="inviteWXFriend()" v-if="!groupStatus"></div>
                <div class="btn" @click="openRp()" v-if="groupStatus"></div>
            </div>
            <div class="getRedCover" v-if="groupSuNO">
                <div class="detail">
                    <div class="price">恭喜分到<span>{{rpPrice}}</span>元</div>
                </div>
                <div class="gNum">
                    团号:{{groupId}}
                </div>
                <div class="btn" @click="toWithdrawalPage()"></div>
                <div class="toKTBtn" @click="toKT()">继续开团，领更多红包</div>
            </div>
        </div>
        <div class="inviteDetail">
            <div v-if="!groupSuNO">
                <div class="inviteList">
                    <a class="btn" @click="inviteFriend()" v-if="!groupStatus"></a>
                    <div :class="[groupStatus ? ( groupSuNumber ? 'fullList' : 'list' ): 'list']"
                        v-if="groupDetailList.groupNumber>=3">
                        <div class="tz">
                            <div class="icon">
                                <div class="txIcon"></div>
                                <img :src="groupDetailList.captain.headImage" />
                            </div>
                            <div class="name">{{groupDetailList.captain.userName}}</div>
                        </div>
                        <div class="tyYj" v-for="(item,index) in groupDetailList.members" :key="'tyYj'+index">
                            <div class="icon">
                                <div class="txYjIcon"></div>
                                <img :src="item.headImage" />
                            </div>
                            <div class="name">{{item.userName}}</div>
                        </div>
                        <div class="ty" v-for="index of leftSuccessNum" :key="'ty' + index">
                            <div class="icon" @click="inviteFriend()"></div>
                            <div class="name"></div>
                        </div>
                    </div>
                    <div class="noFullList" v-else>
                        <div class="tz">
                            <div class="icon">
                                <div class="txIcon"></div>
                                <img :src="groupDetailList.captain.headImage" />
                            </div>
                            <div class="name">{{groupDetailList.captain.userName}}</div>
                        </div>
                        <div class="tyYj" v-for="(item,index) in groupDetailList.members" :key="'tyYj'+index">
                            <div class="icon">
                                <div class="txYjIcon"></div>
                                <img :src="item.headImage" />
                            </div>
                            <div class="name">{{item.userName}}</div>
                        </div>
                        <div class="ty" v-for="index of leftSuccessNum" :key="'ty' + index">
                            <div class="icon" @click="inviteFriend()"></div>
                            <div class="name"></div>
                        </div>
                    </div>
                </div>
                <div class="tips">
                    <img src="../../assets/images/inviteDetailTips.png" v-if="!groupStatus" />
                    <img src="../../assets/images/inviteDetailSuTips.png" v-if="groupStatus" />
                </div>
            </div>
            <div class="openDetailList" v-if="groupSuNO">
                <div class="itemBox">
                    <div class="item" v-for="(item,index) in receivedGroupList" :key="'reG'+index">
                        <img class="pic" :src="item.headImage" />
                        <div class="name">{{item.userName}}</div>
                        <div class="price">获得{{item.rpMoney}}元现金红包</div>
                        <div class="time">{{item.rpTime}}</div>
                    </div>
                </div>
            </div>
        </div>
        <SharePop :groupId="groupId" :groupStock="groupDetailList.groupStock" :groupCode="groupCode" />
        <RedRainPop />
    </div>
</template>

<script>
    import storage from '@/mixin/storage.js'
    export default {
        props: ['unionId', 'RedRainPopStatus'],
        name: "InviteCover",
        data() {
            return {
                nowServerTime: '', //当前服务器时间戳
                groupCode: '', //团Id
                groupId: '', //团号
                hours: null, //倒计时：时
                minutes: null, //倒计时：分
                seconds: null, //倒计时：秒
                nowtime: '', //当前时间戳
                endtime: '', //结束时间戳
                endTimeForShare: '', //结束标准时间
                createTime: '', //创建时间戳
                lefttime: '', //剩余时间戳
                groupStatus: false, //是否组团成功
                groupSuNO: false, //组团成功是否开红包
                groupDetailList: [], //当前团信息
                leftSuccessNum: '', //差多少人成功
                receivedGroupList: [], //已领红包的成员列表
                groupFailStatus: false, //超过时间，已失效
                rpPrice: '', //红包金额
                nowUserId: '', //用户Id
                groupStatusNum: '', //团状态码
                groupSuNumber: false, //成团人数是否等于或超过3
                userId: '', //用户id
                rpRainCurrentData: '', //最近一场红包雨
            };
        },
        watch: {
            receivedGroupList(val) {
                this.receivedGroupList = val
            },
            groupDetailList(val) {
                if (val.status == '1') {
                    setInterval(() => {
                        this.countLeftTime();
                    }, 1000);
                }
            }
        },
        created() {
            if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(
                    storage.data().LOGIN_TOKEN) != null) {
                //获取用户信息
                this.getCurrentUser();
            }
            this.getGroupDetailData();
            // 当前服务器时间
            this.getServerTime();
        },
        methods: {
            //获取用户信息
            async getCurrentUser() {
                try {
                    const {
                        userId
                    } = await this.$api.fetchCurrentUser(localStorage.getItem("devId"), storage.methods.getCookie(
                        storage.data().LOGIN_TOKEN));
                    this.userId = userId;
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            //当前服务器时间
            async getServerTime() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchServerTime(localStorage.getItem("devId"));
                    if (code == 0) {
                        this.nowServerTime = data;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            async getGroupDetailData() {
                // 当前服务器时间
                this.getServerTime();
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchGroupDetailData({
                        groupId: this.$route.query.groupId
                    }, localStorage.getItem("devId"));
                    if (code == 0) {
                        this.groupCode = ''; //团Id
                        this.groupId = ''; //团号
                        this.endtime = ''; //结束时间戳
                        this.endTimeForShare = ''; //结束标准时间
                        this.createTime = ''; //创建时间戳
                        this.groupStatus = false; //是否组团成功
                        this.groupSuNO = false; //组团成功是否开红包
                        this.groupDetailList = []; //当前团信息
                        this.leftSuccessNum = ''; //差多少人成功
                        this.receivedGroupList = []; //已领红包的成员列表
                        this.rpPrice = ''; //红包金额
                        this.groupSuNumber = false; //成团人数是否等于或超过3
                        this.groupDetailList = data;
                        // 计算剩余时间戳
                        this.createTime = this.groupDetailList.createTime;
                        this.endtime = new Date(new Date(this.nowServerTime).toLocaleDateString()).getTime() +
                            86400000;
                        this.endTimeForShare = this.timestampToTime(this.endtime - 1000)
                        this.groupId = this.groupDetailList.code;
                        this.groupCode = this.groupDetailList.id
                        this.$EventBus.$emit("toGPvueData", this.groupId);
                        // 瓜分总金额
                        this.groupDetailList.groupStock = this.groupDetailList.groupStock / 100;

                        // 团长所获红包最小值
                        this.groupDetailList.groupCaptainMin = this.groupDetailList.groupCaptainMin / 100;
                        if (this.userId == this.groupDetailList.captain.id) {
                            this.rpPrice = this.groupDetailList.captain.rpMoney / 100;
                            if (this.groupDetailList.captain.rpStat == '0') {
                                this.groupSuNO = false;
                            } else {
                                this.groupSuNO = true
                            }
                        }

                        // 计算差多少人拼成功
                        this.leftSuccessNum = this.groupDetailList.groupNumber - this.groupDetailList.currentNumber;
                        // 已领红包的成员列表
                        this.groupDetailList.captain.rpMoney = this.groupDetailList.captain.rpMoney / 100;
                        this.groupDetailList.captain.rpTime = this.timestampToTime(this.groupDetailList.captain
                            .rpTime);
                        if (this.groupDetailList.captain.rpStat == '1') {
                            this.receivedGroupList.push(this.groupDetailList.captain);
                        }
                        // 成团人数是否等于或超过3
                        if (this.groupDetailList.members.length >= 3) {
                            this.groupSuNumber = true;
                        }

                        //团员处理
                        for (let i = 0; i < this.groupDetailList.members.length; i++) {
                            if (this.groupDetailList.members[i].rpStat == '1') {
                                this.groupDetailList.members[i].rpMoney = this.groupDetailList.members[i].rpMoney /
                                    100;
                                this.groupDetailList.members[i].rpTime = this.timestampToTime(this.groupDetailList
                                    .members[i].rpTime);
                                this.receivedGroupList.push(this.groupDetailList.members[i]);
                            }
                            if (this.userId == this.groupDetailList.members[i].id) {
                                this.rpPrice = this.groupDetailList.members[i].rpMoney;
                                if (this.groupDetailList.members[i].rpStat == '0') {
                                    this.groupSuNO = false;
                                    this.groupStatus = true;
                                }
                            }
                        }
                        // 判断团状态
                        this.judgeGroupStatus();
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 判断团状态
            judgeGroupStatus() {
                this.rpPrice = '';
                this.groupSuNO = false;
                if (this.userId == this.groupDetailList.captain.id) {
                    this.rpPrice = this.groupDetailList.captain.rpMoney;
                    if (this.groupDetailList.captain.rpStat == '0') {
                        this.groupSuNO = false;
                    } else {
                        this.groupSuNO = true
                    }
                }
                for (let i = 0; i < this.groupDetailList.members.length; i++) {
                    if (this.userId == this.groupDetailList.members[i].id) {
                        this.rpPrice = this.groupDetailList.members[i].rpMoney;
                        if (this.groupDetailList.members[i].rpStat == '0') {
                            this.groupSuNO = false;
                        }
                    }
                }
                if (this.groupDetailList.status == '1') {
                    this.groupStatusNum = '1';
                    this.groupStatus = false;
                    this.groupFailStatus = false;
                    // 神策埋点 浏览事件
                    this.$sensorsEvent.detailView('组团页', '');
                } else if (this.groupDetailList.status == '2') {
                    this.groupStatusNum = '2'
                    this.groupStatus = true
                    if (this.userId == this.groupDetailList.captain.id) {
                        if (this.groupDetailList.captain.rpStat == '0') {
                            this.groupSuNO = false
                            this.groupStatus = true;
                            // 神策埋点 浏览事件
                            this.$sensorsEvent.detailView('参团页', '');
                        } else {
                            this.groupSuNO = true
                            this.groupStatus = false;
                            // 神策埋点 浏览事件
                            this.$sensorsEvent.detailView('开红包页', '');
                        }
                    }
                    for (let i = 0; i < this.groupDetailList.members.length; i++) {
                        if (this.userId == this.groupDetailList.members[i].id) {
                            if (this.groupDetailList.members[i].rpStat == '0') {
                                this.groupSuNO = false
                                this.groupStatus = true;
                                // 神策埋点 浏览事件
                                this.$sensorsEvent.detailView('参团页', '');
                            } else {
                                this.groupSuNO = true
                                this.groupStatus = false;
                                // 神策埋点 浏览事件
                                this.$sensorsEvent.detailView('开红包页', '');
                            }
                        }
                    }
                } else if (this.groupDetailList.status == '3') {
                    this.groupStatusNum = '3'
                    this.groupFailStatus = true
                    // 神策埋点 浏览事件
                    this.$sensorsEvent.detailView('组团页', '');
                }
            },
            // 计算剩余时间戳
            countLeftTime() {
                this.endtime = new Date(new Date(this.nowServerTime).toLocaleDateString()).getTime() + 86400000;
                this.nowServerTime = this.nowServerTime + 1000;
                this.lefttime = this.endtime - this.nowServerTime //距离结束时间的时间
                if (this.lefttime == 0) {
                    this.groupStatusNum = '3';
                }
                var time = {
                    hour: parseInt((this.lefttime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) < 10 ? "0" +
                        parseInt((this.lefttime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : parseInt((this
                            .lefttime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minute: parseInt((this.lefttime % (1000 * 60 * 60)) / (1000 * 60)) < 10 ? "0" + parseInt((this
                        .lefttime % (1000 * 60 * 60)) / (1000 * 60)) : parseInt((this.lefttime % (1000 * 60 *
                        60)) / (1000 * 60)),
                    second: parseInt((this.lefttime % (1000 * 60)) / 1000) < 10 ? "0" + parseInt((this.lefttime % (
                        1000 * 60)) / 1000) : parseInt((this.lefttime % (1000 * 60)) / 1000),
                }
                this.lefttime = time.hour + ":" + time.minute + ":" + time.second;
            },
            // 时间戳转标准时间
            timestampToTime(timestamp) {
                var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '/';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
                var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                return Y + M + D + h + m;
            },
            // 红包雨按钮
            toRedRain() {
                // localStorage.setItem("RedRainPopStatus", '88');
                // 判断是否已登录
                // this.$EventBus.$emit("toLogin");
                this.getRpRainCurrent();

                // 神策埋点 按钮事件
                //红包雨弹窗状态 1:等待活动开始，2:倒计时，3:活动进行页，4:此次结束，5:今日所有活动都已结束
                this.$sensorsEvent.buttonClick('组团页', '', '', '红包雨', '');
            },
            // 邀请好友按钮
            inviteFriend() {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('组团页', '', '', '+', '');
                this.$EventBus.$emit("showSharePop");
            },
            // 当前时刻红包雨（提现浮窗用）
            async getRpRainCurrent() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchRpRainCurrent(localStorage.getItem("devId"));
                    // 1、开始前10分钟：显示红包雨倒计时浮窗；
                    // 2、红包雨开始，且用户可以参与：红包雨浮窗；
                    // 3、红包雨开始，且用户已经参与过：回到活动首页；
                    // 4、红包雨已结束：回到活动首页；

                    switch (code) {
                        case 1:
                            this.$EventBus.$emit("RedRainPopStatus", "1")
                            this.$EventBus.$emit("rpRainCurrentData", data.rpRainRuleVOList[0].id);
                            break;
                        case 2:
                            this.$EventBus.$emit("RedRainPopStatus", "2")
                            this.$EventBus.$emit("rpRainCurrentData", data.rpRainRuleVOList[0].id);
                            break;
                        case 3:
                            this.$router.push("/activitycenter")
                            break;
                        case 4:
                            this.$router.push("/activitycenter")
                            break;
                        default:
                            break;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 开红包按钮
            async openRp() {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('参团页', '', '', '开', '');
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchOpenRp({
                        'groupId': this.$route.query.groupId
                    }, localStorage.getItem("devId"));
                    if (code == 0) {
                        this.rpPrice = '';
                        this.groupStatus = true;
                        this.groupSuNO = true;
                        this.rpPrice = data / 100;
                        this.getGroupDetailData();
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 前往活动中心
            toKT() {
                this.$router.push("/activitycenter")
            },
            // 前往提现页
            toWithdrawalPage() {
                this.$sensorsEvent.buttonClick('开红包页', '', '', '立即提现', '');
                this.$router.push("/withdrawal")
            },
            // 邀请微信好友按钮
            inviteWXFriend() {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('组团页', '', '', '邀请好友', localStorage.getItem("unionId"));
                // 跳转到微信
                window.PCJSKit.shareWithoutSurface('嗨！快入团，发福利啦~', '来知科技APP输入团号【' + this.groupId + '】领红包！天天红包雨下不停，速来>',
                    'https://' + storage.data().SHARE_LINK_DOMAIN + storage.data().SHARE_LINK +
                    '/zt/act/year/202111/wx-wap/index.html#/?groupId=' + this.groupCode + '&fromWx=1',
                    'http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg',
                    '', 1);
            }
        },
        mounted() {}
    };
</script>

<style lang="scss" scoped>
    .inviteCover {
        margin-top: vw(-35);

        .redCover {
            .time {
                width: vw(442);
                height: vw(61);
                line-height: vw(57);
                margin: 0 auto;
                font-size: vw(29);
                font-weight: 300;
                text-align: center;
                @include bg("../../assets/images/inviteCoverTime_bg.png", left top, 100% 100%, no-repeat);

                div {
                    display: inline-block;
                    color: #06f9fe;
                }

                span {
                    position: relative;
                    top: vw(2);
                    font-size: vw(36);
                    color: #fff;
                    margin-left: vw(12);
                }

            }

            .redRain {
                width: vw(131);
                height: vw(115);
                position: absolute;
                top: vw(365);
                left: vw(12);
                z-index: 2;
                @include bg("../../assets/images/redRainBtn.gif", left top, 100% 100%, no-repeat);
            }

            .inviteBtn,
            .openBtn {
                width: 100%;
                height: vw(763);
                position: relative;
                margin-top: vw(28);
                @include bg("../../assets/images/receiveBtn_bg.png", left top, 100% 100%, no-repeat);

                .gNum {
                    width: vw(229);
                    height: vw(50);
                    line-height: vw(50);
                    position: absolute;
                    top: vw(62);
                    left: vw(266);
                    color: #fff;
                    font-size: vw(24);
                    text-align: center;
                    @include bg("../../assets/images/gNum_bg.png", left top, 100% 100%, no-repeat);
                }

                .detail {
                    width: 100%;
                    height: vw(170);
                    display: inline-block;
                    text-align: center;
                    margin-top: vw(278);

                    .price {
                        font-size: vw(100);
                        font-weight: 600;
                        background-image: -webkit-linear-gradient(top, #e7e1cc, #e9d030);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;

                        span {
                            margin-left: vw(2);
                            font-size: vw(50);
                        }
                    }

                    .rule {
                        font-size: vw(24);
                        text-shadow: #bc0d10 vw(0.5) vw(3) 0;
                        color: #fff;
                    }

                    .tit1 {
                        margin-top: vw(20);
                    }

                    .tit1,
                    .tit2 {
                        font-size: vw(45);
                        font-weight: 600;
                        text-align: center;
                        background-image: -webkit-linear-gradient(top, #e7e1cc, #e9d030);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }

                .btn {
                    width: vw(120);
                    height: vw(139);
                    position: relative;
                    top: vw(-312);
                    left: vw(322);
                }

                &:before {
                    content: "";
                    display: block;
                    width: vw(750);
                    height: vw(767);
                    position: absolute;
                    top: vw(-265);
                    left: 0;
                    @include bg("../../assets/images/receiveBtn_before.png", left top, 100% 100%, no-repeat);
                }
            }

            .openBtn {
                @include bg("../../assets/images/openBtn_bg.png", left top, 100% 100%, no-repeat);
            }

            .getRedCover {
                width: 100%;
                height: vw(799);
                position: relative;
                margin-top: vw(28);
                @include bg("../../assets/images/getRedCover_bg.png", left top, 100% 100%, no-repeat);

                .gNum {
                    width: vw(229);
                    height: vw(50);
                    line-height: vw(50);
                    position: absolute;
                    top: vw(262);
                    left: vw(266);
                    color: #fff;
                    font-size: vw(24);
                    text-align: center;
                    @include bg("../../assets/images/gGNum_bg.png", left top, 100% 100%, no-repeat);
                }

                .detail {
                    width: 100%;
                    height: vw(170);
                    display: inline-block;
                    text-align: center;
                    margin-top: vw(178);

                    .price {
                        margin-left: vw(2);
                        font-size: vw(35);
                        font-weight: 600;
                        background-image: -webkit-linear-gradient(top, #ff9b58, #fa2537);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;

                        span {
                            font-size: vw(50);
                        }
                    }
                }

                .btn {
                    width: vw(316);
                    height: vw(72);
                    position: relative;
                    top: vw(42);
                    left: vw(218);
                    @include bg("../../assets/images/ljtx_bg.png", left top, 100% 100%, no-repeat);
                }

                .toKTBtn {
                    display: inline-block;
                    position: relative;
                    top: vw(52);
                    left: vw(270);
                    font-size: vw(24);
                    color: #b7030e;
                    border-bottom: #b7030e vw(1) solid;
                    -webkit-transform-origin-x: 0;
                    -webkit-transform: scale(0.9);
                    /* CSS缩放 */
                }

                &:before {
                    content: "";
                    display: block;
                    width: vw(750);
                    height: vw(767);
                    position: absolute;
                    top: vw(-220);
                    left: 0;
                    @include bg("../../assets/images/receiveBtn_before.png", left top, 100% 100%, no-repeat);
                }

            }
        }

        .inviteDetail {
            width: vw(733);
            height: vw(582);
            margin: vw(-190) auto 0;
            position: relative;
            z-index: 2;
            @include bg("../../assets/images/openDetailList_bg.png", left top, 100% 100%, no-repeat);

            .openDetailList {
                width: vw(680);
                height: vw(435);
                // margin: vw(65) 0 vw(32) vw(45);

                &::before {
                    content: "";
                    display: block;
                    width: vw(4);
                    height: vw(435);
                    position: absolute;
                    top: vw(70);
                    right: vw(40);
                    background-color: #101047;
                }

                .itemBox {
                    width: vw(640);
                    height: vw(435);
                    // display: flex;
                    // justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    overflow-y: scroll;
                    overflow-x: hidden;
                    position: relative;
                    top: vw(72);
                    left: vw(55);

                    /* 设置滚动条的样式 */
                    &::-webkit-scrollbar {
                        width: vw(8);
                    }

                    /* 滚动条滑块 */
                    &::-webkit-scrollbar-thumb {
                        border-radius: vw(30);
                        background: #08f4ff;
                        -webkit-box-shadow: inset 0 0 vw(20) #08f4ff;
                    }

                    &::-webkit-scrollbar-thumb:window-inactive {
                        background: #08f4ff;
                    }

                    .item {
                        display: flex;
                        width: vw(700);
                        height: vw(106);
                        // line-height: vw(106);
                        font-size: vw(24);
                        -webkit-transform-origin-x: 0;
                        -webkit-transform: scale(0.9);
                        /* CSS缩放 */
                        text-align: center;
                        border-bottom: #2a2977 vw(1) solid;

                        .pic {
                            width: vw(60);
                            height: vw(60);
                            margin: auto 0;
                            border: #08f4ff vw(1) solid;
                            border-radius: 50%
                        }

                        .name {
                            width: vw(200);
                            margin: auto vw(2);
                            color: #08f4ff;
                        }

                        .price {
                            width: vw(310);
                            line-height: vw(106);
                            color: #fff;
                        }

                        .time {
                            width: vw(300);
                            line-height: vw(106);
                            color: #fff;
                        }
                    }

                }
            }

            .inviteList {
                display: inline-block;
                margin: vw(65) 0 vw(32) vw(55);

                .btn {
                    width: vw(159);
                    height: vw(187);
                    float: left;
                    margin-right: vw(22);
                    @include bg("../../assets/images/inviteDetailBtn.png", left top, 100% 100%, no-repeat);
                }

                .list,
                .fullList {
                    width: vw(455);
                    display: flex;
                    overflow-x: scroll;
                    justify-content: space-between;

                    &::-webkit-scrollbar {
                        display: none;
                    }

                    .tz,
                    .ty,
                    .tyYj {
                        margin-right: vw(35);

                        img {
                            height: 100%;
                        }
                    }

                    .icon {
                        width: vw(118);
                        height: vw(138);
                        position: relative;
                        overflow: hidden;

                        .txIcon {
                            width: 100%;
                            height: 101%;
                            position: absolute;
                            left: 0;
                            z-index: 3;
                            @include bg("../../assets/images/tzIcon.png", left top, 100% 100%, no-repeat);
                        }

                        .txYjIcon {
                            width: 100%;
                            height: 101%;
                            position: absolute;
                            // top: vw(-1);
                            left: 0;
                            @include bg("../../assets/images/tyYjIcon.png", left top, 100% 100%, no-repeat);
                        }

                        img {
                            width: 96%;
                            height: 98%;
                            position: absolute;
                            top: vw(2);
                            left: vw(2);
                            z-index: -1;
                        }
                    }

                    .name {
                        width: vw(123);
                        height: vw(33);
                        line-height: vw(33);
                        margin-top: vw(12);
                        color: #1a497a;
                        text-align: center;
                        font-size: vw(24);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        @include bg("../../assets/images/tyName_bg.png", left top, 100% 100%, no-repeat);
                    }

                    .ty {
                        .icon {
                            @include bg("../../assets/images/tyIcon.png", left top, 100% 100%, no-repeat);
                        }
                    }

                    :last-child {
                        margin-right: 0;
                    }
                }

                .fullList {
                    width: vw(625);
                }

                .noFullList {
                    // width: vw(455);
                    display: flex;
                    overflow-x: scroll;
                    justify-content: space-between;

                    &::-webkit-scrollbar {
                        display: none;
                    }

                    .tz,
                    .ty,
                    .tyYj {
                        margin-right: vw(35);

                        img {
                            height: 100%;
                        }
                    }

                    .icon {
                        width: vw(118);
                        height: vw(138);
                        position: relative;
                        overflow: hidden;

                        .txIcon {
                            width: 100%;
                            height: 101%;
                            position: absolute;
                            left: 0;
                            z-index: 3;
                            @include bg("../../assets/images/tzIcon.png", left top, 100% 100%, no-repeat);
                        }

                        .txYjIcon {
                            width: 100%;
                            height: 101%;
                            position: absolute;
                            left: 0;
                            @include bg("../../assets/images/tyYjIcon.png", left top, 100% 100%, no-repeat);
                        }

                        img {
                            width: 96%;
                            height: 98%;
                            position: absolute;
                            top: vw(2);
                            left: vw(2);
                            z-index: -1;
                        }
                    }

                    .name {
                        width: vw(123);
                        height: vw(33);
                        line-height: vw(33);
                        margin-top: vw(12);
                        color: #1a497a;
                        text-align: center;
                        font-size: vw(24);
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        @include bg("../../assets/images/tyName_bg.png", left top, 100% 100%, no-repeat);
                    }

                    .ty {
                        .icon {
                            @include bg("../../assets/images/tyIcon.png", left top, 100% 100%, no-repeat);
                        }
                    }

                    :last-child {
                        margin-right: 0;
                    }
                }
            }

            .tips {
                width: vw(646);
                height: vw(229);
                margin: vw(-10) auto 0;
            }
        }
    }
</style>