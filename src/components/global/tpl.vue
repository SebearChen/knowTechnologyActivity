<template>
    <div class="rain-box">
        <div v-if="this.isShow" @touchstart="rainPoinclick($event)" class="rain-point" :class="{action: isClick}"
            :style="styleText">
            <div class="addOne" v-if="this.isClick"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "rain-point",
        props: {},
        data() {
            return {
                styleText: {},
                isShow: true,
                isClick: false
            };
        },
        methods: {
            rainPoinclick(e) {
                e.preventDefault();
                if (this.isClick) return;
                this.isClick = true;
                this.$emit("rainPoinclick");
                setTimeout(() => {
                    this.isShow = false;
                }, 100);
            },
            setStyle(params) {
                this.styleText = params;
            },
            destory() {
                this.isShow = false;
            }
        }
    };
</script>

<style>
    .rain-box {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }

    .rain-point {
        /* border: 1px blue solid !important; */
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        position: absolute;
        background-image: url("../../assets/images/RedRainIng-RP-item.png");
        background-size: 95%, 95%;
        background-repeat: no-repeat;
        background-position: center;
        width: 85px;
        height: 130px;
    }

    .action {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        /* animation-name: action_animation;
    animation-duration: 10s; */
    }

    .addOne {
        position: relative;
        top: -20px;
        right: -40px;
        background-image: url("../../assets/images/redrain-addone.png");
        background-size: 100%, 100%;
        background-repeat: no-repeat;
        width: 25px;
        height: 30px;
        -webkit-backface-visibility: hidden;
        /* animation-name: addOne_animation;
    animation-duration: 10s; */
    }

    /* @keyframes action_animation {
    0% {
        opacity: 1;
    }
    1%{
        opacity: 0;
    }
    100%{
        opacity: 0;
    }
} 

@keyframes addOne_animation {
    0% {
        opacity: 1;
    }
    1%{
        opacity: 0;
    }
    100%{
        opacity: 0;
    }
} */
</style>