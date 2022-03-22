<template>
    <div class="withdrawal">

        <Head />
        <!-- <div class="redRain" @click="toRedRain()"></div> -->
        <div class="select">
            <div class="balance">
                <span class="price">余额：{{balance}}元</span>
                <span class="tit">快速提现（72小时内到账微信）</span>
            </div>
            <div class="selectItem">
                <div class="one" :class="{pitch:selectItemIndex==='one'}" @click="selectItem('one')">
                    <span class="price">1元</span>
                    <span class="icon" v-if="todayWallet&&!activityEnd">明日可兑</span>
                    <span class="icon" v-if="activityEnd2&&!activityEnd3">活动结束</span>
                </div>
                <div class="two" :class="{pitch:selectItemIndex==='two'}" @click="selectItem('two')">
                    <span class="price">5元</span>
                    <span class="icon" v-if="todayWallet&&!activityEnd">明日可兑</span>
                    <span class="icon" v-if="activityEnd2&&!activityEnd3">活动结束</span>
                </div>
                <div class="three" :class="{pitch:selectItemIndex==='three'}" @click="selectItem('three')">
                    <span class="price">20元</span>
                    <span class="icon" v-if="todayWallet&&!activityEnd">明日可兑</span>
                    <span class="icon" v-if="activityEnd2&&!activityEnd3">活动结束</span>
                </div>
                <div class="four" :class="{pitch:selectItemIndex==='four'}" @click="showExchangeGoldPop()">
                    <span class="gold">
                        <span class="goldWay">兑换金币<br />
                            <span class="tips1">0.1元起兑,秒到账</span>
                        </span>
                    </span>
                    <span class="icon" v-if="todayWallet&&!activityEnd">明日可兑</span>
                    <span class="icon" v-if="activityEnd2&&!activityEnd3">活动结束</span>
                </div>
            </div>
            <div class="tips">12月20-30日18时，每日均可提现1次，如有疑问，请微信联系客服（zeuskami）</div>
            <div class="btn" @click="toDrawal()" v-if="!todayWallet&&activityEnd&&!activityEnd2">立即提现</div>
            <div class="btn-toMore" @click="toMore()" v-if="todayWallet&&!activityEnd&&!activityEnd2">领取更多奖励</div>
            <div class="btn" @click="toDrawal()" v-if="activityEnd3">立即提现</div>
            <div class="btn-toMore" @click="toMore()" v-if="activityEnd2&&!activityEnd3">领取更多奖励</div>
        </div>
        <div class="history">
            <div class="tit">提现记录</div>
            <div class="list">
                <div class="item" v-for="(item,index) in myWalletList" :key="'mW'+index">
                    <span class="time">{{item.applyTime}}</span>
                    <span class="price" v-if="item.type == '1'">提现{{item.amount / 100}}元</span>
                    <span class="price" v-if="item.type == '2'">兑换金币{{item.amount}}个</span>
                    <span class="status" v-if="item.status == '1'">待审核</span>
                    <span class="status" v-if="item.status == '2'">审核驳回</span>
                    <span class="status" v-if="item.status == '3'">待提现</span>
                    <span class="status" v-if="item.status == '4'">提现成功</span>
                    <span class="status" v-if="item.status == '5'">提现失败</span>
                </div>
                <div class="noItem" v-if="!myWalletList.length">
                    暂无记录，快开团分红包吧~
                </div>
            </div>
        </div>
        <ExchangeGoldPop :balance="balance" :activityEnd="activityEnd"/>
        <RedRainPop />
    </div>
</template>

<script>
    import storage from '@/mixin/storage.js'
    export default {
        name: "Withdrawal",
        props: ['userId', 'unionId'],
        data() {
            return {
                selectItemIndex: 'one', //选中的提现item项
                balance: '', // 余额
                withdrawDTO: {
                    type: '',
                    mount: '',
                    activityId: '1'
                }, // post提现信息
                myWalletList: [], //提现记录list
                todayWallet: false, //今天已提现
                todayLefttimestamp: '', //当天0点的时间戳
                rpRainCurrentData: '', //最近一场红包雨
                nowServerTime: '',//当前服务器时间戳
                activityEnd: false,//活动是否已结束
                activityEnd2: false,
                activityEnd3: false,
            };
        },
        created() {
            // 获取我的钱包
            this.getMyWalletData();
            // 我的提现记录
            this.getMyRecordData();
            // 当天0点的时间戳
            this.todayLefttimestamp = new Date(new Date().toLocaleDateString()).getTime();

        },
        watch: {
            todayWallet(val) {
                if (val) {
                    // 获取我的钱包
                    this.getMyWalletData();
                    // 我的提现记录
                    this.getMyRecordData();
                }
            }
        },
        methods: {
            //当前服务器时间
            async getServerTime() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchServerTime(localStorage.getItem("devId"));
                    if (code == 0) {
                        this.nowServerTime = data;
                        if (data>= 1640793600000) {
                            this.activityEnd = true;
                        }
                        if (data>= 1640858400000) {
                            this.activityEnd2 = true;
                        }
                        // if (data>= 1640921400000 && data <= 1640925000000) {
                        //     this.activityEnd3 = true;
                        // }
                        if (data>= 1640860185629 && data <= 1640939400000) {
                            this.activityEnd3 = true;
                        }
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            toMore() {
                window.location.href = "pconlinebrowser://circle-topic-detail/441";
                this.$sensorsEvent.buttonClick('提现页', '', '', '领取更多奖励', '');
            },
            // 我的提现记录
            async getMyRecordData() {
                this.myWalletList = [];
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchMyRecord(localStorage.getItem("devId"));
                    if (code == 0) {
                        data.forEach((item) => {
                            if (this.todayLefttimestamp <= item.applyTime) {
                                this.todayWallet = true
                            }
                            item.applyTime = this.timestampToTime(item.applyTime);
                        })
                        this.myWalletList = data
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 兑换金币弹窗
            showExchangeGoldPop() {
                this.$sensorsEvent.buttonClick('提现页', '', '', '兑换金币', '');
                this.$EventBus.$emit("showExchangeGoldPop", "showExGoldPop");
                // 神策埋点 弹窗事件
                this.$sensorsEvent.popup('提现页', '金币兑换弹窗', '请输入兑换金额');
            },
            // 申请提现
            async postWithdraw(obj) {
                try {
                    var postJson = JSON.stringify(obj);
                    const {
                        code,
                        data
                    } = await this.$api.fetchWithdraw(postJson, localStorage.getItem("devId"));
                    switch (code) {
                        case 0:
                            this.$EventBus.$emit("showExchangeGoldPop", "success");
                            this.todayWallet = true;
                            this.getServerTime();
                            break;
                        case 1:
                            this.$toast("系统繁忙~");
                            break;
                        case 2:
                            this.$toast("提现额度错误~");
                            break;
                        case 3:
                            this.$toast("今日已提现~");
                            break;
                        case 4:
                            this.$toast("单日最高可兑换5000金币，请明日再来哦~");
                            break;
                        case 5:
                            this.$toast("您今天已提现过啦，快邀请朋友瓜分更多红包吧~");
                            break;
                        case 6:
                            this.$toast("您今天已提现过啦，快邀请朋友瓜分更多红包吧~");
                            break;
                        case 7:
                            this.$EventBus.$emit("showExchangeGoldPop", "insufficientBalance");
                            break;
                        case 8:
                            this.$toast("缺少任务配置~");
                            break;
                        case 99:
                            this.$toast("来晚了~活动已结束，请继续参与其他活动吧~");
                            break;
                        default:
                            break;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 获取我的钱包
            async getMyWalletData() {
                this.balance = '';
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchMyWallet(localStorage.getItem("devId"));
                    if (code == 0) {
                        this.balance = data.balance / 100;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 当前时刻红包雨（提现浮窗用）
            async getRpRainCurrent() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchRpRainCurrent(localStorage.getItem("devId"));
                    // 1、开始前2小时40分钟：显示红包雨倒计时浮窗；
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
            // 红包雨按钮
            toRedRain() {
                // localStorage.setItem("RedRainPopStatus", '88');
                // 判断是否已登录
                this.getRpRainCurrent();
                // window.location.href = "http://192.168.33.87:8070/202111Project/bonus-master/"
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('提现页', '', '', '红包雨', '');
            },
            // 选择提现金额
            selectItem(item) {
                switch (item) {
                    case "one":
                        this.$sensorsEvent.buttonClick('提现页', '', '', '1元', '');
                        break;
                    case "two":
                        this.$sensorsEvent.buttonClick('提现页', '', '', '5元', '');
                        break;
                    case "three":
                        this.$sensorsEvent.buttonClick('提现页', '', '', '10元', '');
                        break;
                }
                this.selectItemIndex = item
            },
            //立即提现按钮
            toDrawal() {
                // 判断是否已登录
                this.$EventBus.$emit("toLogin");
                switch (this.selectItemIndex) {
                    case "one":
                        this.withdrawDTO.type = '0';
                        this.withdrawDTO.mount = '100';
                        break;
                    case "two":
                        this.withdrawDTO.type = '1';
                        this.withdrawDTO.mount = '500';
                        break;
                    case "three":
                        this.withdrawDTO.type = '2';
                        this.withdrawDTO.mount = '2000';
                        break;
                    default:
                        break;
                }

                //神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('提现页', '', '', '立即提现');

                this.postWithdraw(this.withdrawDTO);
            },
            timestampToTime(timestamp) {
                var date = new Date(parseInt(timestamp, 10));
                var Y = date.getFullYear() + '-';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
                return Y + M + D;
            },
        },
        mounted() {
            this.getServerTime();
            if (window.PCJSKit.platform() == 'iOS') {
                localStorage.setItem("devId", window.PCJSKit.commonSessionId());
            } else {
                localStorage.setItem("devId", window.PCJSKit.devId());
            }
            // 神策埋点 浏览事件
            this.$sensorsEvent.detailView('提现页', '');
            this.$EventBus.$off("exChangeGoldSuccess");
            this.$EventBus.$on("exChangeGoldSuccess", () => {
                // 获取我的钱包
                this.getMyWalletData();
                // 我的提现记录
                this.getMyRecordData();
            });
            let shareObj = JSON.stringify({
                "title": "喜迎2022，知科技好福利！",
                "desc": "知科技APP，金币福利天天领～",
                "image": "http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg",
                "url": "https://www1.pconline.com.cn" + storage.data().SHARE_LINK +
                    "/zt/act/year/202111/wx-wap/index.html#/sharepop",
                "wapUrl": "https://www1.pconline.com.cn" + storage.data().SHARE_LINK +
                    "/zt/act/year/202111/wx-wap/index.html#/sharepop"
            });
            this.$utils.setShareApp(shareObj)
        }
    };
</script>

<style lang="scss" scoped>
    .withdrawal {
        width: 100%;
        height: 100%;
        min-height: vw(1624);
        position: relative;
        @include bg("../assets/images/bg.png", left top, 100% 100%, no-repeat);

        .redRain {
            width: vw(131);
            height: vw(115);
            position: absolute;
            top: vw(320);
            left: 0;
            z-index: 2;
            @include bg("../assets/images/redRainBtn.gif", left top, 100% 100%, no-repeat);
        }

        .select {
            width: vw(677);
            height: vw(655);
            margin: vw(30) auto 0;
            border-radius: vw(10);
            background-color: #fff;

            .balance {
                display: inline-block;
                width: vw(602);
                height: vw(66);
                margin: vw(16) 0 0 vw(35);
                line-height: vw(66);
                text-align: center;
                font-size: vw(27);
                color: #fff;
                @include bg("../assets/images/balance_bg.png", left top, 100% 100%, no-repeat);

                .tit {
                    float: right;
                    line-height: vw(70);
                    font-size: vw(24);
                }
            }

            .selectItem {
                width: vw(677);
                margin: 0 vw(10);
                text-align: center;
                font-size: vw(42);
                font-weight: 500;
                // position: relative;

                .price {
                    width: vw(286);
                    height: vw(145);
                    line-height: vw(145);
                    float: left;
                    margin: vw(27) vw(25) 0 0;
                    border: #a6a6a6 vw(1.5) solid;
                    border-radius: vw(12);
                }

                .gold {
                    width: vw(286);
                    height: vw(145);
                    line-height: vw(145);
                    float: left;
                    margin: vw(27) vw(25) 0 0;
                    border: #a6a6a6 vw(1.5) solid;
                    border-radius: vw(12);
                    overflow: hidden;

                    .goldWay {
                        display: inline-block;
                        position: relative;
                        top: vw(-19);

                        .tips1 {
                            position: relative;
                            top: vw(-100);
                            font-size: vw(27);
                            color: #a6a6a6;
                        }
                    }
                }

                .one,
                .two,
                .three,
                .four {
                    position: relative;
                    display: inline-block;
                }

                .icon {
                    width: vw(97);
                    height: vw(31);
                    line-height: vw(31);
                    position: absolute;
                    top: vw(22);
                    right: vw(2);
                    padding: vw(3) vw(10);
                    color: #fff;
                    font-size: vw(23);
                    -webkit-transform-origin-x: 0;
                    -webkit-transform: scale(0.8);
                    /* CSS缩放 */
                    background: -webkit-gradient(linear, left bottom, right bottom, from(#fe8159), to(#fe625f));
                    border-radius: 0 vw(10) 0 vw(10);
                }

                .pitch {
                    color: #fb9a36;
                    @include bg("../assets/images/selectItem_bg.png", left bottom, 92% 84%, no-repeat);

                    .price {
                        border-color: #fb9a36;
                    }
                }
            }

            .tips {
                width: 93%;
                display: inline-block;
                margin: vw(4) 0 0 vw(35);
                font-size: vw(27);
                color: #a6a6a6;
            }

            .btn,
            .btn-toMore {
                width: vw(596);
                height: vw(95);
                line-height: vw(95);
                font-size: vw(40);
                font-weight: bold;
                color: #fff;
                text-align: center;
                margin: vw(8) auto;
                @include bg("../assets/images/withdrawalBtn.png", left top, 100% 100%, no-repeat);
            }
        }

        .history {
            width: vw(677);
            height: vw(460);
            margin: vw(30) auto 0;
            border-radius: vw(10);
            background-color: #fff;

            .tit {
                display: inline-block;
                width: vw(565);
                height: vw(66);
                margin: vw(27) 0 0 vw(35);
                padding: 0 0 0 vw(40);
                line-height: vw(66);
                text-align: left;
                font-size: vw(27);
                color: #fff;
                @include bg("../assets/images/balance_bg.png", left top, 100% 100%, no-repeat);
            }

            .list {
                width: vw(605);
                height: vw(350);
                margin: vw(5) 0 0 vw(35);
                display: flex;
                flex-direction: column;
                overflow-x: scroll;

                &::-webkit-scrollbar {
                    display: none;
                }

                .item {
                    width: 100%;
                    font-size: vw(25);
                    color: #545556;
                    border-bottom: #dddddd vw(1) solid;

                    span {
                        display: inline-block;
                        width: 33%;
                        height: vw(60);
                        margin-top: vw(25);
                        // line-height: vw(50);
                    }

                    .time {
                        text-align: left;
                    }

                    .price {
                        text-align: center;
                    }

                    .status {
                        text-align: right;
                    }
                }

                .noItem {
                    // display: inline-block;
                    // margin: vw(20) 0 0 0;
                    display: flex;
                    margin: auto;
                    align-items: center;
                    justify-content: center;
                    font-size: vw(30);
                    color: #a6a6a6;
                }
            }
        }
    }
</style>