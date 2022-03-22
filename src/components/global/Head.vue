<template>
	<div class="head">
        <a class="play" @click="showPlay()"></a>
        <!-- <div class="withdrawal" @click="toWithdrawal()"></div> -->
	</div>
</template>

<script>
    import storage from '@/mixin/storage.js'
export default {
	name: "Head",
    props: ["unionId"],
	data() {
		return {
		};
	},
	methods: {
        // 跳转玩法页
        showPlay(){
            // 神策埋点 按钮事件
            this.$sensorsEvent.buttonClick('首页','','','玩法','');
            this.$router.push("/activityrule")
        },
        // 前往拼团历史
        toWithdrawal(){
            // 神策埋点 按钮事件
            this.$sensorsEvent.buttonClick('首页','','','提现','');
            localStorage.setItem("withdRawalStatus",'true');
            // 判断是否已登录
            this.$EventBus.$emit("toLogin");
        }
	},
	mounted(){
	}
};
</script>

<style lang="scss" scoped>
.head {
	position: relative;
	min-height: vw(396);
    .play{
        width: vw(77);
        height: vw(69);
        position: absolute;
        top: vw(50);
        right: vw(15);
        @include bg("../../assets/images/head_play.png",top left,100% 100%,no-repeat)
    }
    .withdrawal{
        width: vw(77);
        height: vw(69);
        position: absolute;
        top: vw(125);
        right: vw(15);
        z-index: 2;
        @include bg("../../assets/images/head_withdrawal.png",top left,100% 100%,no-repeat)
    }
}
</style>
