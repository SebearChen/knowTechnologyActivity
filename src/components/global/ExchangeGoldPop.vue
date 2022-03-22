<template>
    <div class="ExchangeGoldPop" v-if="showExGoldPop">
        <div class="wrap" v-if="showExGold">
            <div class="content">
                <div class="tit">余额: {{balance}}元</div>
            </div>
            <div class="bottom">
                <input v-model="exPrice"/><span>元=</span><input v-model="exGold" oninput="value=value.toString().match(/^\d+(?:\.\d{-1})?/)" /><span>金币</span>
            </div>
            <div class="enqury" @click="enquery()"></div>
            <div class="close" @click="close()"></div>
        </div>
        <div class="ad" @click="toGoldCenter()" v-if="showExGold"></div>
        <div class="pop">
            <div class="insufficientBalance" v-if="insufficientBalance">
                <div class="iInsufficientBalanceBg" @click="toAcCenter_fail()"></div>
                <div class="close" @click="closeIB()"></div>
            </div>
            <div class="WithdrawSuccessPop" v-if="WithdrawSuccessPop">
                <div class="WithdrawSuccessBg" @click="toAcCenter_success()"></div>
                <div class="close" @click="closeWS()"></div>
            </div>
            <div class="success" v-if="successPop">
                <div class="successPopBg">
                    <div class="tit1">{{exGold}}金币已到账，</div>
                    <div class="tit2">天天攒金币，商场兑大礼</div>
                    <div class="btn" @click="stoGoldCenter()"></div>
                </div>
                <div class="close" @click="closeSuPop()"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['balance','activityEnd'],
        name: "ExchangeGoldPop",
        data() {
            return {
                showExGoldPop: false, //Pop是否显示
                showExGold: false, //兑换金币pop
                insufficientBalance: false, //余额不足弹窗
                successPop: false, //兑换成功弹窗
                WithdrawSuccessPop: false, //提现成功弹窗
                exPrice: '', //兑换：元
                exGold: '', //兑换：金币
                todayHasWallet: false,//今日已兑换
                activityEndStatus: false,
            };
        },
        created() {},
        watch: {
            exPrice(val) {
                if (val) {
                    this.exPrice = val.toString().replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
                    if (val.toString().split(".").length == 1) {
                        this.exGold = val * 100;
                    }else if (val.toString().split(".")[1].length == 1) {
                        this.exGold = (val.toString().replace(".","") + '0').toString().replace(/\b(0+)/gi,"");
                    }else if (val.toString().split(".")[1].length == 2){
                        this.exGold = (val.toString().replace(".","")).toString().replace(/\b(0+)/gi,"");
                    }
                    if (val > 50) {
                        this.exPrice = 50
                        this.$toast("单日最高可兑换5000金币~");
                    }
                }else{
                    this.exPrice = null;
                    this.exGold = null;
                }
            },
            exGold(val) {
                if (val) {
                    this.exGold = val;
                    this.exPrice = val / 100;
                    if (val > 5000) {
                        this.exGold = 5000
                        this.$toast("单日最高可兑换5000金币~");
                    }
                }else{
                    this.exPrice = null;
                    this.exGold = null;
                }
            },
            activityEnd(val){
                if (val) {
                    this.activityEndStatus = true;
                }
            }
        },
        methods: {
            // 确认兑换按钮
            async enquery() {
                this.$sensorsEvent.buttonClick('提现页', '金币兑换弹窗', '请输入兑换金额', '确认兑换', this.unionId);
                if (this.exPrice == '') {
                    this.$toast("请输入兑换金额~");
                    return
                }
                var postObj = {
                    type: '3',
                    mount: this.exGold,
                    activityId: '1'
                }
                try {
                    var postJson = JSON.stringify(postObj);
                    const {
                        code,
                        data
                    } = await this.$api.fetchWithdraw(postJson,localStorage.getItem("devId"));
                    if (code == 0) {
                    }
                    switch (code) {
                        case 0:
                            this.showExGold = false;
                            this.successPop = true;
                            this.$EventBus.$emit("exChangeGoldSuccess");
                            // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('提现页', '兑换成功弹窗', '兑换成功');
                            break;
                        case 1:
                            this.$toast("系统繁忙~");
                            break;
                        case 2:
                            this.$toast("提现额度错误~");
                            break;
                        case 3:
                            this.$toast("今天已提现,请明日再来~");
                            break;
                        case 4:
                            this.$toast("单日最高可兑换5000金币~");
                            break;
                        case 5:
                            this.$toast("IP提现被限制~");
                            break;
                        case 6:
                            this.$toast("设备提现被限制~");
                            break;
                        case 7:
                            this.showExGold = false;
                            this.insufficientBalance = true;
                            break;
                        case 8:
                            this.$toast("缺少任务配置~");
                            break;
                        case 9:
                            this.$toast("兑换金币额度不能小于等于0~")
                            break;
                        case 10:
                            this.$toast("单日最高可兑换5000金币，请明日再来哦~")
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
            // 前往金币商城
            toGoldCenter() {
                window.location.href = 'pconlinebrowser://score-mall';
                this.$sensorsEvent.buttonClick('提现页', '金币兑换弹窗', '请输入兑换金额', '推广',this.unionId);
            },
             stoGoldCenter() {
                window.location.href = 'pconlinebrowser://score-mall';
                this.$sensorsEvent.buttonClick('提现页', '兑换成功弹窗', '兑换成功', '前往查看',this.unionId);
            },
            // 前往活动中心
            toAcCenter_fail() {
                window.location.href = "pconlinebrowser://circle-topic-detail/441";
                this.$sensorsEvent.buttonClick('提现页','余额不足弹窗','余额不足','领取更多奖励',this.unionId);
            },
            toAcCenter_success() {
                window.location.href = "pconlinebrowser://circle-topic-detail/441";
                this.$sensorsEvent.buttonClick('提现页','提现申请成功弹窗','申请成功','领取更多奖励',this.unionId);
            },
            // 关闭弹窗
            close() {
                this.showExGold = false;
                this.showExGoldPop = false;
                this.exGold = null;
                this.exPrice = null;
            },
            closeIB() {
                this.showExGoldPop = false;
                this.insufficientBalance = false
            },
            closeSuPop() {
                this.showExGoldPop = false;
                this.successPop = false
            },
            closeWS() {
                this.showExGoldPop = false;
                this.WithdrawSuccessPop = false
            }
        },
        mounted() {
            // 监听弹窗是否显示
            this.$EventBus.$off("showExchangeGoldPop");
            this.$EventBus.$on("showExchangeGoldPop", (data) => {
                this.showExGoldPop = true;
                switch (data) {
                    case "success":
                        this.WithdrawSuccessPop = true;
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('提现页', '提现申请成功弹窗', '申请成功');
                        break;
                    case "insufficientBalance":
                        this.insufficientBalance = true;
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('提现页', '余额不足弹窗', '余额不足');
                        break;
                    case "showExGoldPop":
                        this.showExGold = true;
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('提现页', '金币兑换弹窗', '请输入兑换金额');
                    default:
                        break;
                }

            })
        }
    };
</script>

<style lang="scss" scoped>
    .ExchangeGoldPop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 3;

        .wrap {
            width: vw(559);
            height: vw(636);
            position: absolute;
            top: 35%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            @include bg("../../assets/images/ExchangeGoldPop-bg.png", left top, 100% 100%, no-repeat);

            .content {
                width: vw(467);
                position: relative;
                top: vw(305);
                left: vw(-90);
                // margin: 0 auto;
                font-size: vw(29);
                font-weight: 300;
                text-align: center;

                .tit {
                    color: #46ebfd;
                }
            }

            .bottom {
                // width: vw(500);
                position: relative;
                top: vw(325);
                left: vw(10);
                margin: 0 auto;
                font-size: vw(25);
                text-align: center;
                @include flexCenter();

                input {
                    width: vw(119);
                    height: vw(55);
                    border: vw(1) #3815a0 solid;
                    border-radius: vw(10);
                    color: #0d35a9;
                    text-align: center;
                    font-size: vw(30);
                    // display: -moz-box;
                    // display: -ms-flexbox;
                    // display: -webkit-box;
                }

                span {
                    color: #fff;
                    font-size: vw(30);
                    margin: 0 vw(10);
                }
            }

            .enqury {
                display: block;
                width: vw(360);
                height: vw(72);
                position: relative;
                top: vw(390);
                margin: 0 auto;
                z-index: 2;
                @include bg("../../assets/images/enquryBtn.png", left top, 100% 100%, no-repeat);
            }

            .close {
                width: vw(63);
                height: vw(61);
                position: absolute;
                top: vw(30);
                right: vw(-32);
                @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
            }
        }

        .ad{
            width: vw(540);
            height: vw(140);
            position: absolute;
            top: 60%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            @include bg("../../assets/images/changeGoldAd.png", center, 100% 100%, no-repeat);
        }

        .pop {
            .insufficientBalance {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .5);
                z-index: 4;

                .iInsufficientBalanceBg {
                    width: vw(559);
                    height: vw(636);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                    @include bg("../../assets/images/iInsufficientBalance-bg.png", left top, 100% 100%, no-repeat);
                }

                .close {
                    width: vw(63);
                    height: vw(61);
                    position: absolute;
                    top: vw(435);
                    right: vw(67);
                    @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
                }
            }

            .WithdrawSuccessPop {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .5);
                z-index: 4;

                .WithdrawSuccessBg {
                    width: vw(559);
                    height: vw(636);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                    @include bg("../../assets/images/WithdrawSuccessPop.png", left top, 100% 100%, no-repeat);
                }

                .close {
                    width: vw(63);
                    height: vw(61);
                    position: absolute;
                    top: vw(435);
                    right: vw(67);
                    @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
                }
            }

            .success {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, .5);
                z-index: 4;

                .successPopBg {
                    width: vw(559);
                    height: vw(636);
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    -webkit-transform: translate(-50%, -50%);
                    transform: translate(-50%, -50%);
                    @include bg("../../assets/images/ExGoldPop-bg.png", left top, 100% 100%, no-repeat);

                    .tit1,
                    .tit2 {
                        width: 100%;
                        position: relative;
                        top: 52.5%;
                        margin: 0 auto;
                        text-align: center;
                        font-size: vw(30);
                        color: #fff;
                    }

                    .tit2 {
                        top: 53%;
                    }

                    .btn {
                        width: vw(360);
                        height: vw(72);
                        position: relative;
                        top: vw(410);
                        margin: 0 auto;
                        @include bg("../../assets/images/toGoldCenterBtn.png", left top, 100% 100%, no-repeat);

                    }
                }

                .close {
                    width: vw(63);
                    height: vw(61);
                    position: absolute;
                    top: 29%;
                    right: 8%;
                    @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
                }
            }
        }
    }
</style>