<template>
    <div class="WelcomeOldUsersPop" v-if="welcomeOldUsersPop">
        <div class="success">
            <div class="toMore" @click="toMore()"></div>
        </div>
        <div class="close" @click="close()"></div>
    </div>
</template>

<script>
    import storage from '@/mixin/storage.js'
    export default {
        name: "WelcomeOldUsersPop",
        mixins: [storage],
        data() {
            return {
                welcomeOldUsersPop: false
            };
        },
        watch: {
        },
        created() {
        },
        methods: {
            // 领取更多按钮
            toMore() {
                this.welcomeOldUsersPop = false
                this.$router.push("/activitycenter")
            },
            // 关闭弹窗
            close() {
                this.welcomeOldUsersPop = false
            },
        },
        mounted() {
            // 监听弹窗是否显示
            this.$EventBus.$off("WelcomeOldUsersPop");
            this.$EventBus.$on("WelcomeOldUsersPop",()=>{
                setTimeout(() => {
                    this.welcomeOldUsersPop=true;
                }, 2600);
                // 神策埋点 弹窗事件
                this.$sensorsEvent.popup('首页','欢迎老友弹窗','欢迎老朋友');
            })
        }
    };
</script>

<style lang="scss" scoped>
    .WelcomeOldUsersPop {
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
            @include bg("../../assets/images/welcomeolduser-bg.png", left top, 100% 100%, no-repeat);
            .toMore {
                // display: block;
                width: vw(360);
                height: vw(72);
                position: absolute;
                bottom: 5%;
                // top: 63%;
                left: 50%;
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                margin: 0 auto;
                z-index: 88;
                @include bg("../../assets/images/reAwardBtn.png", left top, 100% 100%, no-repeat);
            }
        }

        .close {
            width: vw(63);
            height: vw(61);
            position: absolute;
            top: 28%;
            right: 8.5%;
            @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
        }
    }
</style>