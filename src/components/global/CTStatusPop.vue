<template>
    <div class="CTStatusPop" v-if="showCTStatusPop">
        <div class="success" v-if="successStatus">
            <div class="toKTToGroup" @click="toKTToGroup()">
                <div class="close" @click="closeToGroup()"></div>
            </div>
        </div>
        <div class="fail">
            <div class="thcw" v-if="thcwStatus">
                <div class="toKT" @click="toKT()">
                    <div class="close" @click="close()"></div>
                </div>
            </div>
            <div class="my" v-if="myStatus">
                <div class="toReGold" @click="toReGold()">
                    <div class="close" @click="close()"></div>
                </div>
            </div>
            <div class="sx" v-if="sxStatus">
                <span>{{th}}团距离成团只差一点点，开个新团冲刺吧！</span>
                <div class="toKT" @click="toKT()">
                    <div class="close" @click="close()"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CTStatusPop",
        data() {
            return {
                th: '',
                showCTStatusPop: false, //参团状态弹窗
                successStatus: false, //参团成功
                thcwStatus: false, //团号错误，团不存在
                myStatus: false, //团满员
                sxStatus: false, //团失效
                toKTS: false, //去开团按钮
                toReGoldS: false, //去领更多金币按钮
                groupId: '',
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
            toKTToGroup(){
                this.close();
                this.$router.push("/groupdetails?groupId=" + this.groupId+"&browser=commonWebView&showShareButton=1");
            },
            // 去开团
            toKT() {
                this.showCTStatusPop = false;
                this.close();
                if (this.successStatus == true) {
                    this.$sensorsEvent.buttonClick('首页', '参团成功弹窗', '参团成功', '去开团', '');
                } else if (this.thcwStatus == true) {
                    this.$sensorsEvent.buttonClick('首页', '团号错误弹窗', '团号错误', '去开团', '');
                } else if (this.myStatus == true) {
                    this.$sensorsEvent.buttonClick('首页', '该团已满弹窗', '该团已满员', '领取更多金币', '');
                } else if (this.sxStatus == true) {
                    this.$sensorsEvent.buttonClick('首页', '团已失效弹窗', '团已失效', '去开团', '');
                }
            },
            closeToGroup(){
                this.close();
                // this.$router.push("/groupdetails?groupId=" + this.groupId+"&browser=commonWebView&showShareButton=1");
            },
            // 去领取更多金币
            toReGold() {
                this.$router.push("/activitycenter");
                this.close();
            },
            // 关闭弹窗
            close() {
                this.showCTStatusPop = false
                this.successStatus = false //参团成功
                this.thcwStatus = false //团号错误，团不存在
                this.myStatus = false //团满员
                this.sxStatus = false //团失效
                this.toKTS = false //去开团按钮
                this.toReGoldS = false //去领更多金币按钮
            }
        },
        mounted() {
            // 监听弹窗是否显示
            this.$EventBus.$off("showCTStatusPop");
            this.$EventBus.$on("showCTStatusPop", (code,groupId) => {
                this.groupId = groupId;
                switch (code) {
                    case 0:
                        this.showCTStatusPop = true;
                        this.successStatus = true;
                        this.toKTS = true;
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('首页', '参团成功弹窗', '参团成功');
                        break;
                    case 1:
                        this.$toast("系统繁忙~");
                        break;
                    case 2:
                        this.$toast("曾经已参团~");
                        break;
                    case 3:
                        this.$toast("老用户不可重复参团~");
                        break;
                    case 4:
                        this.showCTStatusPop = true;
                        this.thcwStatus = true;
                        this.toKTS = true;
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('首页', '团号错误弹窗', '团号错误');
                        break;
                    case 5:
                        this.showCTStatusPop = true;
                        this.myStatus = true;
                        this.toReGoldS = true;
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('首页', '该团已满弹窗', '该团已满员');
                        break;
                    case 6:
                        this.showCTStatusPop = true;
                        this.sxStatus = true;
                        this.toKTS = true;
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('首页', '团已失效弹窗', '团已失效');
                        break;
                    case 7:
                        this.$toast("活动不存在~");
                        break;
                    case 8:
                        this.$toast("用户不存在~");
                        break;
                    case 9:
                        this.$toast("团长不能参自己的团~");
                        break;
                    case 10:
                        this.$toast("IP已被限制~");
                        break;
                    case 11:
                        this.$toast("设备号已被限制~");
                        break;
                    case 12:
                        this.$toast("瓜分团员配置不存在~");
                        break;
                    case 13:
                        this.$toast("规则所配置瓜分金额配置出现冲突~");
                        break;
                    case 14:
                        this.$toast("请先进行微信授权~");
                        this.$EventBus.$emit("toLogin");
                        break;
                    case 15:
                        this.$toast("曾经已开团~");
                        break;
                    default:
                        this.showCTStatusPop = false;
                        break;
                }
            });
            // 接收团号
            this.$EventBus.$off("groupNum");
            this.$EventBus.$on("groupNum", (groupNum) => {
                this.th = groupNum;
            })
        }
    };
</script>

<style lang="scss" scoped>
    .CTStatusPop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        z-index: 88;

        .success {
            width: vw(559);
            height: vw(636);
            position: absolute;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            @include bg("../../assets/images/CTS_bg.png", left top, 100% 100%, no-repeat);
        }

        .fail {

            .thcw,
            .my,
            .sx {
                width: vw(559);
                height: vw(636);
                position: absolute;
                top: 50%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
            }

            .thcw {
                @include bg("../../assets/images/thcw_bg.png", left top, 100% 100%, no-repeat);
            }

            .my {
                @include bg("../../assets/images/my_bg.png", left top, 100% 100%, no-repeat);
            }

            .sx {
                @include bg("../../assets/images/sx_bg.png", left top, 100% 100%, no-repeat);

                span {
                    display: block;
                    width: vw(400);
                    margin: vw(325) auto 0;
                    text-align: center;
                    color: #fff;

                }
            }
        }

        .close {
            width: vw(63);
            height: vw(61);
            position: absolute;
            top: vw(-480);
            right: vw(-150);
            @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
        }

        .toKT {
            display: block;
            width: vw(360);
            height: vw(72);
            // position: relative;
            // top: vw(920);
            margin: 0 auto;
            position: absolute;
            bottom: vw(60);
            left: vw(100);
            z-index: 2;
            @include bg("../../assets/images/toKT_btn.png", left top, 100% 100%, no-repeat);
        }

        .toKTToGroup{
            display: block;
            width: vw(360);
            height: vw(72);
            // position: relative;
            // top: vw(920);
            margin: 0 auto;
            position: absolute;
            bottom: vw(60);
            left: vw(100);
            z-index: 2;
            @include bg("../../assets/images/toGoldCenterBtn.png", left top, 100% 100%, no-repeat);
        }

        .toReGold {
            display: block;
            width: vw(360);
            height: vw(72);
            position: absolute;
            bottom: vw(60);
            left: vw(100);
            margin: 0 auto;
            z-index: 2;
            @include bg("../../assets/images/reGoldBtn.png", left top, 100% 100%, no-repeat);
        }
    }
</style>