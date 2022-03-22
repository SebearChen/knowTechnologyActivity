<template>
    <div class="GroupStatusPop" v-if="hasInfoPop">
        <div class="success" v-if="isSuccess">
            <div class="content">
                <div class="tips">{{groupNum}}团已成团，赶紧去开红包吧！</div>
            </div>
            <div class="bottom">
                <div class="con">
                    <span class="btn" @click="toOpenRP()"></span>
                </div>
            </div>
            <div class="close" @click="close()"></div>
        </div>
        <div class="overdue" v-if="isOverdue">
            <div class="content">
                <div class="tips">{{groupNum}}团距离成团只差一点点，开个新团冲刺吧！</div>
            </div>
            <div class="bottom">
                <div class="con">
                    <span class="btn" @click="toStartGroupError()"></span>
                </div>
            </div>
            <div class="close" @click="close()"></div>
        </div>

        <div class="joinReminder" v-if="isJoinReminder">
            <div class="content">
                <div class="tips" v-if="msg.length <= 12"><div class="tit1">{{msg}}</div><div class="tit2">参团了！</div></div>
                <div class="tips_1" v-else><div class="tit1">{{msg}}</div><div class="tit2">等人参团了！</div></div>
                <div class="tips_2">再邀{{leftPeopleNum}}人即可开红包！</div>
            </div>
            <div class="bottom">
                <div class="con">
                    <span class="btn" @click="toStartGroup()"></span>
                </div>
            </div>
            <div class="close" @click="close()"></div>
        </div>
    </div>
</template>

<script>
    import storage from '@/mixin/storage.js'
    export default {
        name: "GroupStatusPop",
        data() {
            return {
                hasInfoPop: false, //是否有消息提示
                isSuccess: false, //参团成功
                isOverdue: false, //团失效
                isJoinReminder: false, //有新用户参团
                groupNum: '', //团号
                groupId: '', //团Id
                msg: '', //有新用户参团时msg内为新人用户名称列表，以顿号分隔
                leftPeopleNum: '', //距离成团还差多少人

            };
        },
        created() {},
        methods: {
            async getNoticeData() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchNotice(localStorage.getItem("devId"))
                    this.groupNum = data.groupCode;
                    this.groupId = data.groupId;
                    this.$EventBus.$emit("groupStatusPopGroupNum", data.groupCode);
                    this.msg = data.msg;
                    this.leftPeopleNum = data.lastNumber;
                    switch (data.type) {
                        case 0:
                            setTimeout(() => {
                                this.hasInfoPop = false;
                            }, 2600);
                            break;
                        case 1:
                            setTimeout(() => {
                                this.hasInfoPop = true;
                                this.isJoinReminder = true;
                                // 神策埋点 弹窗事件
                            this.$sensorsEvent.popup('首页','有人进团提示弹窗','恭喜有用户参团了');
                            }, 2600);
                            break;
                        case 2:
                            setTimeout(() => {
                                this.hasInfoPop = true;
                                this.isSuccess = true;
                                 // 神策埋点 弹窗事件
                            this.$sensorsEvent.popup('首页','团员已满弹窗','恭喜成团');
                            }, 2600);
                            break;
                        case 3:
                            setTimeout(() => {
                                this.hasInfoPop = true;
                                this.isOverdue = true;
                                // 神策埋点 弹窗事件
                            this.$sensorsEvent.popup('首页','团已失效弹窗', '团已失效');
                            }, 2600);
                            break;
                        case 100:
                            this.getNoticeData();
                            break;
                        default:
                            break;
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            // 去开红包按钮
            toOpenRP() {
                this.$router.push("/groupdetails?groupId=" + this.groupId+"&browser=commonWebView&showShareButton=1");
                this.$sensorsEvent.buttonClick('首页', '团员已满', '恭喜成团', '去开红包', '');

            },
            // 去开团(团已失效)
            toStartGroupError() {
                this.hasInfoPop = false;
                this.$sensorsEvent.buttonClick('首页', '团已失效弹窗', '团已失效', '去开团', '');
            },
            // 去邀请好友
            toStartGroup() {
                this.hasInfoPop = false;
                 this.$sensorsEvent.buttonClick('首页', '有人进团提示弹窗', '恭喜有用户参团了', '去邀好友', localStorage.getItem("unionId"));      
            },
            // 关闭弹窗
            close() {
                this.hasInfoPop = false
            }
        },
        mounted() {
            // setTimeout(() => {
            //     this.hasInfoPop = true;
            //     this.isJoinReminder = true;
            //     this.msg = 'mb48175、mb48mb4817mb4817'
            //     this.leftPeopleNum = '2'
            // }, 3200);
            // 判断是否已登录
            if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != ''  &&  storage.methods.getCookie(storage.data().LOGIN_TOKEN) != null) {
                this.getNoticeData();
                this.$EventBus.$off("redRainSessionsGroupNum");
                this.$EventBus.$on("redRainSessionsGroupNum", (val) => {
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .GroupStatusPop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 88;

        .success,
        .overdue,
        .joinReminder {
            width: vw(559);
            height: vw(636);
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            @include bg("../../assets/images/groupStatusPop-success-bg.png", left top, 100% 100%, no-repeat);

            .content {
                width: vw(467);
                position: relative;
                top: vw(305);
                left: 0;
                margin: 0 auto;
                font-size: vw(29);
                font-weight: 300;
                text-align: center;

                .tit {
                    color: #46ebfd;
                }

                .tips,
                .tips_1,
                .tips_2 {
                    width: vw(320);
                    margin: vw(10) auto 0;
                    font-size: vw(30);
                    color: #fff;
                }
            }

            .bottom {
                width: vw(500);
                position: relative;
                top: vw(375);
                left: 0;
                margin: 0 auto;
                font-size: vw(25);
                text-align: center;

                .con {
                    display: inline-block;
                    height: vw(33);
                    line-height: vw(15) !important;
                    color: #fff;

                    .tit {
                        height: vw(40);
                    }

                    .th {
                        height: vw(40);
                        margin: 0 vw(18);
                        padding: vw(2) vw(20);
                        border-radius: vw(4);
                        background-color: #302e96;
                    }

                    .btn {
                        display: inline-block;
                        width: vw(360);
                        height: vw(72);
                        position: relative;
                        top: vw(16);
                        @include bg("../../assets/images/toOpenRP-btn.png", left top, 100% 100%, no-repeat);
                    }
                }

                .tips {
                    width: vw(640);
                    margin-top: vw(10);
                    font-size: vw(27);
                    -webkit-transform-origin-x: 0;
                    -webkit-transform: scale(0.8);
                    /* CSS缩放 */
                    color: #46ebfd;
                }
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

        .overdue {
            @include bg("../../assets/images/sx_bg.png", left top, 100% 100%, no-repeat);

            .content .tips {
                width: vw(450);
            }

            .bottom .con .btn {
                @include bg("../../assets/images/toKT_btn.png", left top, 100% 100%, no-repeat);
            }
        }

        .joinReminder {
            @include bg("../../assets/images/groupStatusPop-hasJoin-bg.png", left top, 100% 100%, no-repeat);

            .bottom {
                position: absolute;
                top: vw(475);
                left: 5%;
            }

            .content .tips {
                width: 100%;
                text-align: center;
                .tit1{
                    display: inline-block;
                    height: vw(60);
                    line-height: vw(60);
                    width: auto;
                }
                .tit2{
                    color: #fff;
                    height: vw(60);
                    line-height: vw(60);
                    display: inline-block;
                    width: auto;
                }
            }

            .content .tips_1{
                width: 100%;
                text-align: center;
                .tit1{
                    display: inline-block;
                    height: vw(60);
                    line-height: vw(60);
                    // float: left;
                    width: vw(255);
                    margin-right: vw(-30);
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .tit2{
                    color: #fff;
                    float: right;
                    height: vw(60);
                    line-height: vw(60);
                    display: inline-block;
                    width: vw(195);
                }
            }

            .content .tips_2 {
                margin: 0 auto;
            }

            .bottom .con .btn {
                @include bg("../../assets/images/toReive-Btn.png", left top, 100% 100%, no-repeat);
            }

        }
    }
</style>