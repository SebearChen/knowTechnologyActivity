<template>
    <div class="KTSuccess" v-if="showKTSuccess" @click="close()">
        <div class="wrap">
            <div class="content">
                <div class="tit">请在今日23:59:59前</div>
                <div class="tips">邀请新用户到知科技APP活动页输入团号参团，即可瓜分红包，您至少可分{{groupCaptainMinData}}元哦!</div>
            </div>
            <div class="bottom">
                <div class="con">
                    <span class="tit">复制团号分享好友</span>
                    <span class="th">{{th}}</span>
                    <span class="btn" @click="copyTH()"></span>
                </div>
                <div class="tips">活动期间，每天都可开新团，天天快乐抢红包吧！</div>
            </div>
            <div class="close" @click="close()"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "KTSuccessPop",
        data() {
            return {
                th: 'A12345',
                groupCaptainMinData: '',//团长最小可分金额
                showKTSuccess: false,
                groupId: ''
            };
        },
        created() {},
        methods: {
            // 复制团号
            copyTH() {
                //创建一个input元素
                let input = document.createElement('input')
                //给input的内容复制
                input.value = this.th
                // 在body里面插入这个元素
                document.body.appendChild(input)
                // 选中input里面内容
                input.select()
                //执行document里面的复制方法
                document.execCommand("Copy")
                // 复制之后移除这个元素
                document.body.removeChild(input)
                return this.$toast("复制成功")
            },
            // 关闭弹窗
            close() {
                this.showKTSuccess = false;
                this.$router.push("/groupdetails?groupId=" + this.groupId + "&browser=commonWebView&showShareButton=1");
            }
        },
        mounted() {
            // 监听弹窗是否显示
            this.$EventBus.$off("showKTSuccess");
            this.$EventBus.$on("showKTSuccess",(data,groupCaptainMin,groupId)=>{
                this.groupCaptainMinData = groupCaptainMin
                this.th = data;
                this.groupId = groupId;
                this.showKTSuccess=true;
                // 神策埋点 弹窗事件
                this.$sensorsEvent.popup('首页','开团成功提醒弹窗','恭喜您已开团');
            })
        }
    };
</script>

<style lang="scss" scoped>
    .KTSuccess {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 88;

        .wrap {
            width: vw(559);
            height: vw(636);
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            z-index: 89;
            @include bg("../../assets/images/KTSuccess_bg.png", left top, 100% 100%, no-repeat);

            .content {
                width: vw(487);
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

                .tips {
                    margin-top: vw(15);
                    font-size: vw(25);
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
                        width: vw(100);
                        height: vw(33);
                        position: relative;
                        top: vw(6);
                        @include bg("../../assets/images/copyBtn.png", left top, 100% 100%, no-repeat);
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
    }
</style>