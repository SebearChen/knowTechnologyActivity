<template>
    <div class="RedRainPop" v-if="RedRainPop" @click="countClickNum()">
        <div class="close" @click="close()"
            v-if="RedRainPopStatus != '4'|| (reRainLotteryData.type == '8' || (!this.flag && this.count == '0'))"></div>
        <div class="wait" v-if="RedRainPopStatus == '1'">
            <div class="leftTime">距离红包雨开始还有:
                <span class="time">{{hours == ''?'00': hours}}</span>:
                <span class="time">{{minutes == ''?'00': minutes}}</span>:
                <span class="time">{{seconds == ''?'00': seconds}}</span>
            </div>
            <div class="tits">
                <div class="tit1">本轮瓜分红包</div>
                <div class="tit2">{{rpRainTotalValueData}}元</div>
            </div>
            <div class="tip"></div>
        </div>
        <div class="countdown" v-if="RedRainPopStatus == '2'">
            <div class="tits">
            </div>
            <div class="tip">活动时间:12.20-12.29</div>
            <div class="countdownicon">
                <div :class="[countdownNum]"></div>
            </div>
        </div>
        <div class="ing" v-if="RedRainPopStatus == '3'">
            <div class="leftTime">剩余时间:<span>{{redRainLeftTime}}</span>S</div>
            <div class="redRainTit">已抢到红包<span>{{count}}</span>个</div>
            <div class="rain-wrapper" ref="rain" :time="10">
                <div ref="rainBox" id="rainBox" class="rainBox">
                    <rain-point v-for="(item, idx) in rains" :key="`rain-point-${idx}`" :ref="`rain-point-${idx}`"
                        @rainPoinclick="rainPoinclick"></rain-point>
                </div>
            </div>
        </div>
        <div class="finish" id="prizeImgCanvas" v-if="RedRainPopStatus == '4'&& this.count != '0'">
            <div class="finishClose" @click="close()"></div>
            <div class="redEnvelope" v-if="reRainLotteryData.type == '1'">
                <div class="content">
                    <div class="tit">恭喜你！</div>
                    <div class="redPrice">本轮抢到<span>{{reRainLotteryData.value/100}}</span>元</div>
                    <div class="redTip">邀请好友一起抢，大红包几率翻倍哦！</div>
                </div>
                <div class="rank">
                    <div class="tit">恭喜手气榜前{{rpRainLuckyList.length}}的用户</div>
                    <div class="swiper-container-redrain swiper-container content">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide item" v-for="(item,index) in rpRainLuckyList" :key="'reD'+index">
                                <div class="icon">
                                    <img :src="item.headImage" alt="">
                                </div>
                                <div class="info">
                                    <div class="infoName">{{item.name}}</div>
                                    <div class="phone">{{item.phone}}</div>
                                </div>
                                <div class="price">{{item.prizeValue}}元</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn" @click="toWR()"></div>
            </div>
            <div class="gold" v-if="reRainLotteryData.type == '2'">
                <div class="content">
                    <div class="tit">恭喜你！本轮抢到</div>
                    <div class="goldPrice">{{reRainLotteryData.value}}金币</div>
                </div>
                <div class="rank">
                    <div class="tit">恭喜手气榜前{{rpRainLuckyList.length}}的用户</div>
                    <div class="swiper-container-redrain swiper-container content">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide item" v-for="(item,index) in rpRainLuckyList" :key="'goL'+index">
                                <div class="icon">
                                    <img :src="item.headImage" alt="">
                                </div>
                                <div class="info">
                                    <div class="infoName">{{item.name}}</div>
                                    <div class="phone">{{item.phone}}</div>
                                </div>
                                <div class="price">{{item.prizeValue}}元</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn" @click="toGoldCenter()"></div>
            </div>
            <div class="coupon" v-if="reRainLotteryData.type == '3'">
                <div class="content">
                    <div class="tit">恭喜你！本轮抢到</div>
                    <div class="tag">
                        <img :src="reRainLotteryData.pic" alt="">
                    </div>
                </div>
                <div class="rank">
                    <div class="tit">恭喜手气榜前{{rpRainLuckyList.length}}的用户</div>
                    <div class="swiper-container-redrain swiper-container content">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide item" v-for="(item,index) in rpRainLuckyList" :key="'coU'+index">
                                <div class="icon">
                                    <img :src="item.headImage" alt="">
                                </div>
                                <div class="info">
                                    <div class="infoName">{{item.name}}</div>
                                    <div class="phone">{{item.phone}}</div>
                                </div>
                                <div class="price">{{item.prizeValue}}元</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn" @click="toget(reRainLotteryData.clientUrl)"></div>
            </div>
            <div class="prize" v-if="reRainLotteryData.type == '4'">
                <div class="content">
                    <div class="tit">恭喜你！本轮抢到奖品</div>
                    <img :src="reRainLotteryData.pic" alt="">
                    <div class="name">{{reRainLotteryData.name}}</div>
                </div>
                <div class="rank">
                    <div class="tit">恭喜手气榜前{{rpRainLuckyList.length}}的用户</div>
                    <div class="swiper-container-redrain swiper-container content">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide item" v-for="(item,index) in rpRainLuckyList" :key="'prI'+index">
                                <div class="icon">
                                    <img :src="item.headImage" alt="">
                                </div>
                                <div class="info">
                                    <div class="infoName">{{item.name}}</div>
                                    <div class="phone">{{item.phone}}</div>
                                </div>
                                <div class="price">{{item.prizeValue}}元</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="btn" @click="toLook()">请截图联系客服</div>
                <div class="tip">请微信联系客服（zeuskami）领取</div>
            </div>
        </div>
        <div class="prizeImgPop" v-if="showPrizeImgPop">
            <div class="close" @click="closePrizeImgPop()"></div>
            <img :src="prizeImgSrc" />
            <div class="save-tips">长按保存进行保存↑</div>
        </div>
        <!-- v-if="reRainLotteryData.type == '8' || (!this.flag && this.count == '0') || RedRainPopStatus== '6'"> -->
        <div class="nothing" v-if="reRainLotteryData.type == '8' || (!this.flag && this.count == '0')">
            <div class="tit"></div>
            <div class="time" v-if="allAcEndStatus&&hasNextTimeObj">下一场活动将于明天{{nextTimeOb}}开始</div>
            <div class="time" v-if="!allAcEndStatus&&hasNextTimeObj">下一场活动将于今天{{nextTimeOb}}开始</div>
            <div class="redPCover"></div>
            <div class="btn" @click="toAcCenter()"></div>
        </div>
        <div class="over" v-if="RedRainPopStatus == '5'">
            <div class="leftTime">距离红包雨开始还有:
                <span class="time">{{nextHours}}</span>:
                <span class="time">{{nextMinutes}}</span>:
                <span class="time">{{nextSeconds}}</span>
            </div>
            <div class="tits">
                <div class="tit1">下轮红包雨</div>
                <div class="tit2">明日{{nextTimeOb}}开抢</div>
            </div>
            <div class="tip"></div>
        </div>
        <div class="bottom"
            v-if="RedRainPopStatus == '1' || RedRainPopStatus == '5' || (reRainLotteryData.type == '8' || (!this.flag && this.count == '0'))">
        </div>
        <div class="countdownBottom" v-if="RedRainPopStatus == '2'"></div>
        <div class="ingBottom" v-if="RedRainPopStatus == '3'"></div>
        <div class="loading" v-if="isLoading">
            <div class="curtain">
                <div class="loader"></div>
                <div class="loaderTit">Loading...</div>
            </div>
        </div>
    </div>
</template>

<script>
    import html2canvas from "html2canvas"
    import rainPoint from "./tpl.vue";
    import countdown from "./countdown";
    import storage from '@/mixin/storage.js'
    export default {
        name: "RedRainPop",
        props: {
            density: {
                // 雨点创建速度
                type: Number,
                default: 350
            },
            delay: {
                // 雨点时长
                type: Number,
                default: 4
            },
            time: {
                // 动画时长(秒)
                type: Number,
                default: 10
            }
        },
        data() {
            return {
                allAcEndStatus: false, //今天是否已全结束
                RedRainPop: false, //红包雨弹窗
                // RedRainPop: true, //红包雨弹窗
                RedRainPopStatus: '', //红包雨弹窗状态 1:等待活动开始，2:倒计时，3:活动进行页，4:此次结束，5:今日所有活动都已结束
                // RedRainPopStatus: '4', //红包雨弹窗状态 1:等待活动开始，2:倒计时，3:活动进行页，4:此次结束，5:今日所有活动都已结束
                hours: '', //倒计时：时
                minutes: '', //倒计时：分
                seconds: '', //倒计时：秒
                RpRainList: [], //红包雨规则场次List
                minLeftTime: '', //最近场次的时间戳
                dailyStartTimeList: [], //红包雨开始时间List
                nowTime: '', //当前服务器时间戳
                nowTime2: '', //当前服务器时间戳,红包雨倒计时用
                leftStartTime: '', //距离开始时间戳
                allAcEnd: false, //今日所有活动都已结束
                countdownNum: 'three', //倒计时icon
                reRainLotteryData: {}, //红包雨开奖数据
                // reRainLotteryData: {
                //     type: 4
                // }, //红包雨开奖数据
                rpRainLuckyList: [], //红包雨手气榜
                count: 0, // 点击统计
                // count: 1, // 点击统计
                rains: [], // 组件列表
                rainsCount: 0, // 组件下标
                createTimer: null, // 创建雨点计时器
                flag: true, // 是否结束
                redRainLeftTime: '10', //红包雨剩余时间
                countRedRainLeftTimeInterval: '', //倒计时定时器
                countdownNumTimeout3: '', //红包雨剩余时间倒计时定时器
                countdownNumTimeout2: '', //红包雨剩余时间倒计时定时器
                countdownNumTimeout1: '', //红包雨剩余时间倒计时定时器
                hasNextTimeObj: false, //有下一场
                rpRainNextTimeObj: {}, //下一场红包雨Obj
                nextHours: '', //下一场红包雨倒计时：时
                nextMinutes: '', //下一场红包雨倒计时：分
                nextSeconds: '', //下一场红包雨倒计时：秒
                nextTimeOb: '', //下一场红包雨：时:分
                nowRuleId: '', //当前场次红包雨id
                rpRainTotalValueData: '', //本轮瓜分红包金额
                ingClickNum: 0, //红包雨进行时总的点击次数
                showPrizeImgPop: '', //抽中奖品时的奖品图片弹窗
                prizeImgSrc: '', //抽中奖品时的的奖品图片
                rainPointXList: [0.1, 0.4, 0.7, 0.3, 0.6, 0.8, 0.2, 0.4, 0.5, 0.8, 0.2, 0.1, 0.8, 0.1, 0.4, 0.7, 0.3,
                    0.6, 0.8, 0.2, 0.4, 0.5, 0.8, 0.2, 0.1, 0.4, 0.7, 0.3, 0.6, 0.8, 0.2, 0.4, 0.5, 0.8, 0.2, 0.1,
                    0.8, 0.1, 0.4, 0.7, 0.1, 0.4, 0.7, 0.3, 0.6, 0.8, 0.2, 0.4, 0.5, 0.8, 0.2, 0.1, 0.8, 0.1, 0.4,
                    0.7,
                ], //雨点的x坐标List
                rainPointI: 0, //雨点x坐标的i
                redRainSwiper: null,
                isLoading: false, //加载中
                setTimeOutItem1: '',
                setTimeOutItem2: '',
                rainTime: '', //当前场次红包雨时间
                countdownNumInterval1: '',
                ClientRect: {},//屏幕宽度
            };
        },
        components: {
            rainPoint
        },
        watch: {
            nowRuleId(val) {
                console.log('val', val);
            },
            RedRainPopStatus(val) {
                // this.getRpRainData();
                if (val != '') {
                    switch (val) {
                        case '1':
                            // 下一场红包雨时间
                            this.getRpRainNextTime();
                            this.RedRainPop = true; //红包雨弹窗
                            break;
                        case '2':
                            this.redRainLeftTime = '10' //红包雨剩余时间
                            window.clearTimeout(this.countdownNumTimeout3);
                            window.clearTimeout(this.countdownNumTimeout2);
                            window.clearTimeout(this.countdownNumTimeout1);
                            this.countdownNumTimeout3 = setTimeout(() => {
                                this.countdownNum = 'two';
                                this.countdownNumTimeout2 = setTimeout(() => {
                                    this.countdownNum = 'one';
                                    this.countdownNumTimeout1 = setTimeout(() => {
                                        this.RedRainPopStatus = '3';
                                        this.start();
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                            break;
                        case '3':
                            this.countRedRainLeftTimeInterval = setInterval(() => {
                                this.countRedRainLeftTime();
                            }, 1000);
                            this.setTimeOutItem1 = setTimeout(() => {
                                clearInterval(this.countRedRainLeftTimeInterval);
                                this.RedRainPopStatus = '';
                                this.isLoading = true;
                                setTimeout(() => {
                                    this.isLoading = false;
                                }, 1000);
                                this.flag = true;
                            }, 10000);
                            this.setTimeOutItem2 = setTimeout(() => {
                                this.RedRainPopStatus = '6';
                                this.postRPRainLo();
                                //红包雨结束后 统计点击次数
                                this.$sensorsEvent.activityClick('首页', this.rainTime, this.count, parseInt(this.ingClickNum) + parseInt(this.count));
                            }, 11000);
                            break;
                        case '4':
                            break;
                        case '5':
                            this.allAcEnd = true;
                            break;
                        case '6':
                            break;
                        default:
                            break;
                    }
                }
            },
            leftStartTime(val) {
                if (val == '0') {
                    this.RedRainPopStatus = '2'
                }
            },
            // redRainLeftTime(val) {
            //     if (val == '0') {
            //         if (this.count == '0') {
            //             this.RedRainPopStatus = ''
            //             this.reRainLotteryData.type = '8';
            //             console.log('this.RedRainPopStatus',this.RedRainPopStatus);
            //         }else{
            //             this.RedRainPopStatus = '4'
            //         }

            //     }
            // }
        },
        created() {
            // 判断是否已登录
            // this.$EventBus.$emit("toLogin");
            //请求当日红包雨规则场次
            // this.getRpRainData();
            if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(storage.data()
                    .LOGIN_TOKEN) != null) {
                // 红包雨手气榜
                this.getRpRainLucky();
            }
            // 获取服务器时间
            this.getServerTime();
        },
        methods: {
            closePrizeImgPop() {
                this.RedRainPop = false;
                this.reRainLotteryData.type = '';
            },
            //当前服务器时间
            async getServerTime() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchServerTime(localStorage.getItem("devId"));
                    if (code == 0) {
                        this.nowTime2 = data;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            countClickNum() {
                if (this.RedRainPopStatus == '3') {
                    this.ingClickNum = parseInt(this.ingClickNum) + 1;
                }
            },
            toAcCenter() {
                this.RedRainPop = false;
                this.$router.push("/activitycenter");
            },
            toget(clientUrl) {
                window.location.href = clientUrl;
                this.$sensorsEvent.buttonClick('首页', '获得优惠券弹窗', '恭喜你获得优惠券！', '点击领取', '');
            },
            toGoldCenter() {
                window.location.href = 'pconlinebrowser://score-mall';
                this.$sensorsEvent.buttonClick('首页', '获得金币弹窗', '恭喜你获得金币！', '立即查看', '');
            },
            toLook() {
                //创建一个input元素
                let input = document.createElement('input');
                //给input的内容复制
                input.value = "zeuskami";
                // 在body里面插入这个元素
                document.body.appendChild(input);
                // 选中input里面内容
                input.select();
                //执行document里面的复制方法
                document.execCommand("Copy");
                // 复制之后移除这个元素
                document.body.removeChild(input);
                this.$toast("已复制客服微信号zeuskami~");
                this.$sensorsEvent.buttonClick('首页', '获得奖品弹窗', '恭喜你获得奖品！', '立即查看', '');
            },
            toWR() {
                this.$router.push("/withdrawal");
                this.$sensorsEvent.buttonClick('首页', '获得红包弹窗', '恭喜你获得红包！', '立即提现', '');
            },
            //获取下一场红包雨的时间
            async getRpRainNextTime() {
                try {
                    var getCode = 0;
                    var getData = {};
                    if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(
                            storage.data().LOGIN_TOKEN) != null) {
                        const {
                            code,
                            data
                        } = await this.$api.fetchRpRainNextTime(localStorage.getItem("devId"));
                        getCode = code;
                        getData = data;
                    } else {
                        const {
                            code,
                            data
                        } = await this.$api.fetchRpRainIndexNextTime(localStorage.getItem("devId"));
                        getCode = code;
                        getData = data;
                    }
                    if (getCode == 0) {
                        this.rpRainNextTimeObj = {};
                        this.rpRainNextTimeObj = getData;
                        this.rpRainTotalValueData = getData.rpRainTotalValue;
                        this.hasNextTimeObj = true;
                        if (getData.dailyStartTime >= new Date(new Date(this.nowTime2)
                                .toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) {
                            this.allAcEndStatus = true;
                        } else {
                            this.allAcEndStatus = false;
                        }
                        this.nextTimeOb = this.timestampToTime(getData.dailyStartTime);
                        setInterval(() => {
                            this.countLeftNextTime();
                        }, 1000);
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            //红包雨手气榜
            async getRpRainLucky() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchRpRainLucky(localStorage.getItem("devId"));
                    if (code == 0) {
                        this.rpRainLuckyList = [];
                        this.rpRainLuckyList = data;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 初始化swiper
            initRedRainSwiper() {
                this.redRainSwiper = new window._Swiper(".swiper-container-redrain", {
                    autoplay: {
                        delay: 1000,
                    },
                    slidesPerView: 'auto',
                    loop: true,
                    direction: 'vertical',
                    spaceBetween: 10,
                    speed: 800,
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                });
            },
            //红包雨开奖
            async postRPRainLo() {
                try {
                    var postObj = {
                        activityId: '2',
                        ruleId: this.nowRuleId,
                        type: ''
                    }
                    if (this.count != 0) {
                        postObj.type = 0
                    } else {
                        postObj.type = 1
                    }
                    const Qs = require('qs')
                    postObj = Qs.stringify(postObj)
                    const {
                        code,
                        data
                    } = await this.$api.fetchRPRainLo(postObj, localStorage.getItem("devId"));
                    // if (code == 0) {
                    //     this.reRainLotteryData = {};
                    //     this.reRainLotteryData = data;
                    //     this.RedRainPopStatus = '4'
                    // };
                    switch (code) {
                        case 0:
                            this.getRpRainLucky();
                            // 抽中奖品
                            this.reRainLotteryData = {};
                            this.reRainLotteryData = data;
                            this.RedRainPopStatus = '4';
                            this.$nextTick(() => {
                                if (this.redRainSwiper == null) {
                                    // setTimeout(() => {
                                    this.initRedRainSwiper();
                                    // }, 1000);
                                }
                            });
                            switch (data.type) {
                                case 1:
                                    // 神策埋点 弹窗事件
                                    this.$sensorsEvent.popup('首页', '获得红包弹窗', '恭喜你获得红包！');
                                    break;
                                case 2:
                                    // 神策埋点 弹窗事件
                                    this.$sensorsEvent.popup('首页', '获得金币弹窗', '恭喜你获得金币！');
                                    break;
                                case 3:
                                    // 神策埋点 弹窗事件
                                    this.$sensorsEvent.popup('首页', '获得优惠券弹窗', '恭喜你获得优惠券！');
                                    break;
                                case 4:
                                    // 神策埋点 弹窗事件
                                    this.$sensorsEvent.popup('首页', '获得奖品弹窗', '恭喜你获得奖品！');
                                    break;
                                case 8:
                                    // 神策埋点 弹窗事件
                                    this.$sensorsEvent.popup('首页', '未抽中弹窗', '很遗憾礼物飞走了！');
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case 1:
                            this.close();
                            this.$toast("活动不存在~");
                            break;
                        case 2:
                            this.close();
                            this.$toast("规则不存在~");
                            break;
                        case 3:
                            this.close();
                            this.$toast("红包雨未开始~");
                            break;
                        case 4:
                            this.close();
                            this.$toast("红包雨已结束~");
                            break;
                        case 5:
                            this.close();
                            this.$toast("规则错误~");
                            break;
                        case 6:
                            this.reRainLotteryData = {};
                            this.RedRainPopStatus = '';
                            this.reRainLotteryData.type = '8';
                            break;
                        case 7:
                            this.close();
                            this.$toast("系统繁忙~");
                            break;
                        case 8:
                            this.reRainLotteryData = {};
                            this.RedRainPopStatus = '';
                            this.reRainLotteryData.type = '8';
                            break;
                        default:
                            break;
                    };
                    // 下一场红包雨时间
                    this.getRpRainNextTime();
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            //请求当日红包雨规则场次
            async getRpRainData() {
                try {
                    var getCode = 0;
                    var getData = {};
                    // 判断是否已登录
                    if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(
                            storage.data().LOGIN_TOKEN) != null) {
                        const {
                            code,
                            data
                        } = await this.$api.fetchRpRain(localStorage.getItem("devId"));
                        getCode = code;
                        getData = data;
                    } else {
                        const {
                            code,
                            data
                        } = await this.$api.fetchRpRainRules(localStorage.getItem("devId"));
                        getCode = code;
                        getData = data;
                    }
                    if (getCode == 0) {
                        this.RpRainList = [];
                        this.dailyStartTimeList = [];
                        this.rpRainTotalValueData = '';
                        this.minLeftTime = '';
                        this.allAcEnd = '';
                        this.RpRainList = getData;
                        this.nowTime = getData.nowTime;
                        this.nowTime2 = getData.nowTime;
                        this.RpRainList.rpRainRuleVOList.forEach((item) => {
                            this.dailyStartTimeList.push(Math.abs(this.nowTime - item
                                .dailyStartTime));

                            //红包雨正在进行场次
                            if (getData.nowTime >= item.dailyStartTime && getData.nowTime <= item
                                .dailyEndTime) {
                                this.nowRuleId = item.id;
                                this.rainTime = this.timestampToTime(item.dailyStartTime);
                            }
                            //红包雨即将开始场次
                            if (getData.nowTime >= (parseInt(item.dailyStartTime) - 9305000) && getData
                                .nowTime <=
                                item.dailyEndTime) {
                                this.nowRuleId = item.id;
                                this.rpRainTotalValueData = item.rpRainTotalValue;
                                this.rainTime = this.timestampToTime(item.dailyStartTime);
                            }
                        });
                        for (let i = 0; i < this.dailyStartTimeList.length; i++) {
                            if (i == 0) {
                                this.minLeftTime = this.dailyStartTimeList[0];
                            }
                            if (i > 0 && this.dailyStartTimeList[i] < this.dailyStartTimeList[i - 1] && this
                                .nowTime <= this.RpRainList.rpRainRuleVOList[i].dailyStartTime) {
                                this.minLeftTime = this.RpRainList.rpRainRuleVOList[i].dailyStartTime;
                            }
                            if (this.nowTime >= getData.rpRainRuleVOList[i].dailyEndTime) {
                                this.allAcEnd = true;
                            } else {
                                this.allAcEnd = false;
                            }
                        }
                        // if (this.rpRainTotalValueData.length != 0) {
                        //     this.minLeftTime = this.rpRainTotalValueData.dailyStartTime;
                        // }
                        if (this.allAcEnd == false) {
                            // 下一场红包雨时间
                            this.getRpRainNextTime();
                            clearInterval(this.countdownNumInterval1);
                            this.countdownNumInterval1 = setInterval(() => {
                                this.countLeftTime();
                            }, 1000);
                        }
                    }
                    if (getCode == 100) {
                        this.getRpRainData();
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 计算红包雨剩余时间戳
            countRedRainLeftTime() {
                this.redRainLeftTime = parseInt(this.redRainLeftTime) - 1;
            },
            // 计算红包雨下一场剩余时间戳
            countLeftNextTime() {
                this.nowTime2 = parseInt(this.nowTime2) + 1000;
                this.leftNextStartTime = Math.floor(this.rpRainNextTimeObj.dailyStartTime / 1000) - Math.floor(this
                    .nowTime2 / 1000); //距离结束时间的时间戳
                this.nextHours = (Math.floor(this.leftNextStartTime / 3600) < 10 ? '0' + Math.floor(this
                        .leftNextStartTime / 3600) :
                    Math.floor(this.leftNextStartTime / 3600));
                this.nextMinutes = (Math.floor((this.leftNextStartTime / 60) % 60) < 10 ? '0' + Math.floor((this
                    .leftNextStartTime /
                    60) % 60) : Math.floor((this.leftNextStartTime / 60) % 60));
                this.nextSeconds = (Math.floor(this.leftNextStartTime) % 60 < 10 ? '0' + Math.floor(this
                        .leftNextStartTime) % 60 : Math.floor(this.leftNextStartTime) %
                    60);
            },
            // 计算剩余时间戳
            countLeftTime() {
                this.nowTime = parseInt(this.nowTime) + 1000;
                this.leftStartTime = Math.floor(this.rpRainNextTimeObj.dailyStartTime / 1000) - Math.floor(this
                    .nowTime / 1000); //距离结束时间的时间戳
                this.hours = (Math.floor(this.leftStartTime / 3600) < 10 ? '0' + Math.floor(this.leftStartTime / 3600) :
                    Math.floor(this.leftStartTime / 3600));
                this.minutes = (Math.floor((this.leftStartTime / 60) % 60) < 10 ? '0' + Math.floor((this.leftStartTime /
                    60) % 60) : Math.floor((this.leftStartTime / 60) % 60));
                this.seconds = (Math.floor(this.leftStartTime) % 60 < 10 ? '0' + Math.floor(this.leftStartTime) % 60 :
                    Math.floor(this.leftStartTime) %
                    60);
            },
            // 关闭弹窗
            close() {
                // this.ingClickNum = 0;
                window.clearTimeout(this.countdownNumTimeout3);
                window.clearTimeout(this.countdownNumTimeout2);
                window.clearTimeout(this.countdownNumTimeout1);
                window.clearTimeout(this.setTimeOutItem1);
                window.clearTimeout(this.setTimeOutItem2);
                window.clearInterval(this.countLeftNextTimeInterval);
                window.clearInterval(this.countRedRainLeftTimeInterval);
                window.clearInterval(this.allAcEndInterval);
                window.clearInterval(this.countdownNumInterval1)
                this.RedRainPopStatus = '';
                this.hours = '';
                this.minutes = '';
                this.seconds = '';
                this.rpRainNextTimeObj = {}; //下一场红包雨Obj
                this.nextHours = ''; //下一场红包雨倒计时：时
                this.nextMinutes = ''; //下一场红包雨倒计时：分
                this.nextSeconds = ''; //下一场红包雨倒计时：秒
                this.nextTimeOb = ''; //下一场红包雨：时 =分
                this.redRainLeftTime = '10'; //红包雨剩余时间
                this.count = 0; // 点击统计
                this.countdownNum = 'three'; //倒计时icon
                this.RedRainPop = false;
                this.reRainLotteryData = {}
                this.stop();
                this.clear();
                this.flag = true;
            },
            // 时间戳转标准时间
            timestampToTime(timestamp) {
                if (timestamp > new Date(new Date(new Date(this.nowTime2).toLocaleDateString()).getTime() + 24 * 60 *
                        60 * 1000 - 1)) {
                    this.allAcEnd = true;
                } else {
                    this.allAcEnd = false;
                }
                var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                return h + m;
            },
            // 结束后回调
            timeoutCallback() {
                this.$emit('timeoutCallback', this.count)
            },

            // 点击雨点
            rainPoinclick() {
                if (!this.flag) return;
                this.count += 1;
            },

            // 生成随机起始与落点坐标
            grid() {
                this.rainPointI = parseInt(this.rainPointI) + 1
                let [startX, startY, endX, endY] = [0, 0, 0, 0]
                if (this.ClientRect.height == 0) {
                    this.ClientRect = document.documentElement.getBoundingClientRect()
                }
                let randomNum = this.rainPointXList[this.rainPointI]
                startX = randomNum * (this.ClientRect.width - 20)
                startY = -20
                endX = randomNum * (this.ClientRect.width - 20)
                endY = this.ClientRect.height
                return {
                    startX,
                    startY,
                    endX,
                    endY
                }
            },

            // 随机速度曲线值
            newCubicBezier() {
                // let arr = ['.5,.5,.5,.5', '.5,.5,.5,.5', '.5,.5,.5,.5', ] // 快 中 慢 
                // // let idx = parseInt(Math.random() * 10) > 2 ? 0 : 1
                // let idx = parseInt(Math.random() * 3)
                return '.5,.5,.5,.5'
            },

            // 创建雨点
            async create(rainscount) {

                // 生成Dom
                this.rains.push(`rain-point-${rainscount}`)

                // 生成坐标
                let rects = await this.grid();

                // 渲染完成后执行
                await this.$nextTick(async function () {
                    // Dom节点
                    let el = this.$refs[`rain-point-${rainscount}`][0];

                    let initStyleText = {
                        '-webkit-transform': `translate3d(${rects.startX}px, ${rects.startY}px,0)`,
                        'moz-transform': `translate3d(${rects.startX}px, ${rects.startY}px,0)`,
                        'ms-transform': `translate3d(${rects.startX}px, ${rects.startY}px,0)`,
                        'o-transform': `translate3d(${rects.startX}px, ${rects.startY}px,0)`,
                        'transform': `translate3d(${rects.startX}px, ${rects.startY}px,0)`,
                        '-webkit-transform-style': 'preserve-3d',
                    }
                    let actionStyleText = {
                        'transition': `transform ${this.delay}s cubic-bezier(${ this.newCubicBezier() })`,
                        '-webkit-transform': `translate3d(${rects.endX}px, ${rects.endY}px,0)`,
                        'moz-transform': `translate3d(${rects.endX}px, ${rects.endY}px,0)`,
                        'ms-transform': `translate3d(${rects.endX}px, ${rects.endY}px,0)`,
                        'o-transform': `translate3d(${rects.endX}px, ${rects.endY}px,0)`,
                        'transform': `translate3d(${rects.endX}px, ${rects.endY}px,0)`,
                        '-webkit-transform-style': 'preserve-3d',
                    }

                    // 设置初始坐标
                    await el.setStyle(initStyleText);
                    // 设置结束坐标
                    await setTimeout(() => {
                        el.setStyle(actionStyleText)
                    }, 50)
                    // 动画结束
                    el.$el.addEventListener('transitionend', el.destory, false);
                })
            },

            // 执行
            start() {
                this.clear()
                // 开启雨点点击
                this.flag = true
                // 重置点击数
                this.count = 0

                this.ingClickNum = 0
                // 清除动画定时器
                countdown.clearAssignTimer('rain')
                // 动画定时器
                countdown.creatTimer({
                    remainTime: parseInt(this.time) * 1000,
                    label: 'rain',
                    timeoutFn: () => {
                        this.clear()
                        this.timeoutCallback()
                    }
                })
                this.rainPointI = 0;
                // 创建节点
                this.createTimer = setInterval(async () => {
                    await this.create(this.rainsCount);
                    this.rainsCount += 1;
                }, this.density);
            },

            // 停止
            stop() {
                this.flag = false
                clearInterval(this.createTimer)
            },

            // 清空
            clear() {
                this.stop()
                countdown.clearAssignTimer('rain')
                this.rains = []
                this.rainsCount = 0
            },
        },
        mounted() {
            // 奖品弹窗
            // setTimeout(() => {
            //     this.RedRainPop = true;
            //     this.RedRainPopStatus = '2';
            //     // this.count = 1;
            //     // this.reRainLotteryData = {
            //     //     "id": 1,
            //     //     "type": 1,
            //     //     "value": 88,
            //     //     "name": "中奖",
            //     //     "clientUrl": "",
            //     //     "pic": "https://t-upc.pcauto.com.cn/upcfiles/images/upload/upc/tx/play/2112/14/c0/59619451_1639475357667.png",
            //     //     "desc": ""
            //     // }
            // }, 1000);
            this.$nextTick(()=>{
                this.ClientRect= document.documentElement.getBoundingClientRect();
            });
            // 监听弹窗是否显示
            this.$EventBus.$off("RedRainPopStatus");
            // 监听是否有点红包雨弹窗
            this.$EventBus.$on("RedRainPopStatus", (data) => {
                localStorage.removeItem("RedRainPopStatus");
                this.RedRainPop = true;
                //请求当日红包雨规则场次
                this.getRpRainData();
                // 1:等待活动开始，2:倒计时，3:活动进行页，4:此次结束，5:今日所有活动都已结束
                switch (data) {
                    case '1':
                        this.RedRainPopStatus = '1';
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('首页', '红包雨等待弹窗', '瓜分红包');
                        break;
                    case '2':
                        this.RedRainPopStatus = '2';
                        // 神策埋点 弹窗事件
                        this.$sensorsEvent.popup('首页', '红包雨活动弹窗', '正在抢红包');
                        break;
                    case '3':
                        this.RedRainPopStatus = '3';
                        break;
                    case '4':
                        this.RedRainPopStatus = '4';
                        // this.$sensorsEvent.popup('首页', '红包雨活动结束弹窗', '本场红包雨结束！');     
                        break;
                    case '5':
                        // 获取下一场红包雨时间
                        this.getRpRainNextTime();
                        this.RedRainPopStatus = '5';
                        break;
                    case '88':
                        // this.getRpRainData('88');
                        // 1:等待活动开始，2:倒计时，3:活动进行页，4:此次结束，5:今日所有活动都已结束
                        this.RedRainPopStatus = '';
                        this.reRainLotteryData.type == '';
                        if (this.allAcEnd == true) {
                            this.reRainLotteryData.type == '8'
                        }
                        if (this.nowRuleId != '') {
                            this.RedRainPopStatus = '2';
                        }
                        if (this.rpRainTotalValueData != '') {
                            this.RedRainPopStatus = '1';
                        }
                        break;
                    default:
                        break;
                }
                this.$EventBus.$on("rpRainCurrentData", (rpRainCurrentData) => {
                    this.nowRuleId = rpRainCurrentData;
                })
                // this.$EventBus.$on("rainName", (rainName) => {
                //     this.rainTime = rainName;
                // })
            });
        },
    };
</script>

<style lang="scss" scoped>
    .RedRainPop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .8);
        z-index: 100;
        overflow: hidden;

        .rain-wrapper {
            width: 100%;
            height: vw(1100);
            overflow: hidden;
            position: absolute;
            top: 20%;
            z-index: 3;
        }

        .rainBox {
            width: 100%;
            height: 100%;
        }

        .close {
            width: vw(58);
            height: vw(50);
            position: absolute;
            top: 3%;
            right: 4%;
            @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
        }

        .wait {
            width: vw(750);
            height: vw(432);
            position: relative;
            top: 40.5%;
            left: 50%;
            transform: translate(-50%, -50%);

            .leftTime {
                height: vw(46);
                margin: 0 auto;
                text-align: center;
                color: #17cfd5;
                font-size: vw(29);

                .time {
                    margin-right: vw(5);
                    padding: vw(2) vw(8);
                    color: #3fcee9;
                    background-color: #10256e;
                }
            }

            .tits {
                width: vw(626);
                height: vw(290);
                margin: 0 auto;
                text-align: center;

                .tit1,
                .tit2 {
                    font-size: vw(102);
                    font-weight: 600;
                    color: #fac565;
                }
            }

            .tip {
                width: vw(442);
                height: vw(61);
                margin: 0 auto;
                z-index: 3;
                @include bg("../../assets/images/RedRainTip-1.png", left top, 100% 100%, no-repeat);
            }
        }

        .countdown {
            width: vw(750);
            height: vw(800);
            position: relative;
            top: 40.5%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;

            .tits {
                width: vw(611);
                height: vw(245);
                margin: 0 auto;
                text-align: center;
                @include bg("../../assets/images/countdown-tits.png", left top, 100% 100%, no-repeat);
            }

            .tip {
                width: vw(442);
                height: vw(61);
                line-height: vw(58);
                text-align: center;
                color: #08f4ff;
                font-size: vw(33);
                margin: vw(40) auto;
                z-index: 3;
                @include bg("../../assets/images/RedRainTit-bg.png", left top, 100% 100%, no-repeat);
            }

            .countdownicon {
                width: vw(183);
                height: vw(720);
                margin: 0 auto;
                position: relative;
                z-index: 3;

                .three,
                .two,
                .one {
                    position: relative;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }

                .three {
                    width: vw(183);
                    height: vw(248);
                    @include bg("../../assets/images/countdownNum-3.png", left top, 100% 100%, no-repeat);
                }

                .two {
                    width: vw(184);
                    height: vw(240);
                    @include bg("../../assets/images/countdownNum-2.png", left top, 100% 100%, no-repeat);
                }

                .one {
                    width: vw(121);
                    height: vw(246);
                    @include bg("../../assets/images/countdownNum-1.png", left top, 100% 100%, no-repeat);
                }
            }
        }

        .ing {
            .leftTime {
                position: relative;
                top: vw(135);
                margin: 0 auto;
                text-align: center;
                font-size: vw(36);
                color: #08f4ff;

                span {
                    font-size: vw(50);
                }
            }

            .redRainTit {
                width: vw(442);
                height: vw(61);
                position: relative;
                top: vw(165);
                line-height: vw(58);
                text-align: center;
                color: #08f4ff;
                font-size: vw(33);
                margin: 0 auto;
                z-index: 3;
                @include bg("../../assets/images/RedRainTit-bg.png", left top, 100% 100%, no-repeat);

                span {
                    width: vw(48);
                    height: vw(41);
                    border-radius: vw(5);
                    margin: 0 vw(10);
                    padding: 0 vw(5) vw(2);
                    background-color: #2d0b83;
                }
            }
        }

        .finish {
            width: vw(506);
            height: vw(756);
            position: relative;
            top: 43%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 2;
            @include bg("../../assets/images/RedRainFinish-bg.png", left top, 100% 100%, no-repeat);

            &::before {
                content: "";
                width: vw(714);
                height: vw(571);
                display: block;
                position: absolute;
                z-index: -1;
                top: vw(115);
                left: vw(-110);
                @include bg("../../assets/images/RedRain-before.png", left top, 100% 100%, no-repeat);
            }

            .redEnvelope,
            .gold,
            .coupon,
            .prize {
                width: 100%;
                height: 100%;
                padding: vw(120) 0 vw(10);

                .content {
                    width: 100%;
                    height: vw(270);
                    text-align: center;

                    .tit {
                        font-size: vw(33);
                        color: #f66144;
                    }

                    img {
                        width: vw(175);
                        height: vw(105);
                        margin: vw(15) 0 vw(12);
                        border: vw(1) #e8a467 solid;
                        border-radius: vw(10);
                    }

                    .name {
                        font-size: vw(29);
                        font-weight: 600;
                        color: #fc6f37;
                    }

                }

                .rank {
                    width: vw(406);
                    height: vw(182);
                    margin: 0 auto;
                    @include bg("../../assets/images/RedRainRank-bg.png", left top, 100% 100%, no-repeat);

                    // &::before {
                    //     content: "";
                    //     display: block;
                    //     width: vw(6);
                    //     height: vw(107);
                    //     position: absolute;
                    //     top: vw(443);
                    //     right: vw(62);
                    //     border-radius: vw(10);
                    //     background-color: #ac0b0f;
                    // }

                    .tit {
                        font-size: vw(22);
                        text-align: center;
                        color: #fff;
                    }

                    .content {
                        width: vw(375);
                        height: vw(107);
                        flex-direction: column;
                        overflow-y: scroll;
                        overflow-x: hidden;
                        position: relative;
                        top: vw(22);
                        left: vw(20);

                        /* 设置滚动条的样式 */
                        &::-webkit-scrollbar {
                            width: vw(8);
                        }

                        /* 滚动条滑块 */
                        &::-webkit-scrollbar-thumb {
                            border-radius: vw(30);
                            background: #fe3e32;
                            -webkit-box-shadow: inset 0 0 vw(20) #fe3e32;
                        }

                        &::-webkit-scrollbar-thumb:window-inactive {
                            background: #fe3e32;
                        }

                        .swiper-wrapper {
                            flex-direction: column;
                        }

                        .item {
                            display: flex;
                            width: 100%;
                            height: vw(44);
                            text-align: center;
                            margin-bottom: vw(20);
                            position: relative;

                            .icon {
                                width: vw(42);
                                height: vw(42);
                                border-radius: 50%;

                                img {
                                    width: 100%;
                                    height: 100%;
                                    margin: 0;
                                    border: 0;
                                    border-radius: 50%;
                                }
                            }

                            .info {
                                color: #fff;
                                text-align: left;
                                margin-left: vw(10);

                                .infoName {
                                    font-size: vw(24);
                                    line-height: vw(20);
                                    -webkit-transform-origin-x: 0;
                                    -webkit-transform: scale(0.7);
                                    /* CSS缩放 */
                                    float: left;
                                }

                                .phone {
                                    font-size: vw(24);
                                    -webkit-transform-origin-x: 0;
                                    -webkit-transform: scale(0.7);
                                    /* CSS缩放 */
                                }
                            }

                            .price {
                                height: vw(44);
                                line-height: vw(44);
                                position: absolute;
                                top: 0;
                                right: vw(20);
                                font-size: vw(24);
                                color: #fff;
                            }
                        }

                        :last-child {
                            margin-bottom: 0;
                        }
                    }
                }

                .btn {
                    width: vw(389);
                    height: vw(88);
                    line-height: vw(98);
                    margin: vw(18) auto 0;
                    position: relative;
                    color: #fff;
                    text-align: center;
                    font-size: vw(34);
                    @include bg("../../assets/images/RedRain-toLook-Btn.png", left top, 100% 100%, no-repeat);
                }

                .tip {
                    display: inline;
                    position: absolute;
                    bottom: 4%;
                    left: 20%;
                    color: #fff;
                    text-align: center;
                    font-size: vw(24);
                    -webkit-transform-origin-x: 0;
                    -webkit-transform: scale(0.85);
                    border-bottom: vw(1) #fff solid;
                }
            }

            .prize .btn {
                @include bg("../../assets/images/RedRain-toLook-Btn-2.png", left top, 100% 100%, no-repeat);
            }

            .redEnvelope {
                .content {
                    .tit {
                        font-size: vw(40);
                    }

                    .redPrice {
                        font-size: vw(50);
                        font-weight: 600;
                        background-image: -webkit-linear-gradient(top, #fd8837, #fa2537);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;

                        span {
                            font-size: vw(75);
                        }
                    }

                    .redTip {
                        width: vw(410);
                        display: inline;
                        position: absolute;
                        top: 36%;
                        left: 16%;
                        text-align: center;
                        color: #b7030e;
                        border-bottom: vw(1) #b7030e solid;
                        font-size: vw(24);
                        -webkit-transform-origin-x: 0;
                        -webkit-transform: scale(0.85);
                    }
                }

                .btn {
                    margin: vw(40) auto 0;
                    @include bg("../../assets/images/RedRain-toRW-Btn.png", left top, 100% 100%, no-repeat);
                }
            }

            .gold {
                .content {
                    .tit {
                        margin-top: vw(20);
                        font-size: vw(40);
                    }

                    .goldPrice {
                        font-size: vw(67);
                        font-weight: 600;
                        background-image: -webkit-linear-gradient(top, #fd8837, #fa2537);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }
                }

                .rank {
                    // &::before {
                    //     content: "";
                    //     display: block;
                    //     width: vw(6);
                    //     height: vw(107);
                    //     position: absolute;
                    //     top: vw(463);
                    //     right: vw(62);
                    //     border-radius: vw(10);
                    //     background-color: #ac0b0f;
                    // }
                }

                .btn {
                    @include bg("../../assets/images/RedRain-toLook-Btn.png", left top, 100% 100%, no-repeat);
                }

            }

            .coupon {
                .content {
                    .tit {
                        margin-top: vw(20);
                        font-size: vw(40);
                    }

                    .tag {
                        width: vw(311);
                        height: vw(118);
                        margin: 0 auto;
                        // @include bg("../../assets/images/RedRainCouponTag-bg.png", left top, 100% 100%, no-repeat);

                        img {
                            width: 100%;
                            height: 100%;
                            border: 0;
                            // border-radius: 50%;
                            // float: left;
                            // margin: vw(25) 0 0 vw(42);
                        }
                    }
                }

                .rank {
                    // &::before {
                    //     content: "";
                    //     display: block;
                    //     width: vw(6);
                    //     height: vw(107);
                    //     position: absolute;
                    //     top: vw(463);
                    //     right: vw(62);
                    //     border-radius: vw(10);
                    //     background-color: #ac0b0f;
                    // }
                }

                .btn {
                    @include bg("../../assets/images/RedRain-toRe-Btn.png", left top, 100% 100%, no-repeat);
                }
            }

            .finishClose {
                width: vw(50);
                height: vw(43);
                position: absolute;
                top: -7%;
                right: -9.5%;
                @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
            }
        }

        .prizeImgPop {
            width: 100%;
            height: 100%;

            .close {
                width: vw(63);
                height: vw(61);
                position: relative;
                float: right;
                top: 10%;
                right: vw(60);
                @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
            }

            img {
                width: vw(506);
                height: vw(756);
                position: relative;
                top: 43%;
                left: 50%;
                transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                -webkit-touch-callout: default;
            }

            .save-tips {
                width: 100%;
                text-align: center;
                font-size: vw(26);
                color: #fff;
                font-weight: 700;
                position: absolute;
                left: 0;
                top: 80%;
                transform: translateY(-50%);
            }

        }

        .nothing {
            width: vw(750);
            height: vw(432);
            position: relative;
            top: 26.5%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 3;

            .tit {
                width: vw(531);
                height: vw(190);
                margin: 0 auto;
                @include bg("../../assets/images/RedRain-nothing-tit.png", left top, 100% 100%, no-repeat);
            }

            .time {
                width: vw(542);
                height: vw(61);
                line-height: vw(61);
                margin: vw(38) auto 0;
                text-align: center;
                font-weight: bold;
                color: #17cfd5;
                font-size: vw(31);
                @include bg("../../assets/images/RedRainTit-bg.png", left top, 100% 100%, no-repeat)
            }

            .redPCover {
                width: vw(396);
                height: vw(402);
                margin: vw(10) auto 0;
                @include bg("../../assets/images/RedRain-redPCover.png", left top, 100% 100%, no-repeat);
            }

            .btn {
                width: vw(394);
                height: vw(74);
                margin: vw(18) auto 0;
                @include bg("../../assets/images/RedRain-nothing-btn.png", left top, 100% 100%, no-repeat);
            }
        }

        .over {
            width: vw(750);
            height: vw(432);
            position: relative;
            top: 40.5%;
            left: 50%;
            transform: translate(-50%, -50%);

            .leftTime {
                height: vw(46);
                margin: 0 auto;
                text-align: center;
                color: #17cfd5;
                font-size: vw(29);

                .time {
                    margin-right: vw(5);
                    padding: vw(2) vw(8);
                    color: #3fcee9;
                    background-color: #10256e;
                }
            }

            .tits {
                width: vw(750);
                height: vw(290);
                margin: 0 auto;
                text-align: center;

                .tit1,
                .tit2 {
                    font-size: vw(98);
                    font-weight: 600;
                    background-image: -webkit-linear-gradient(top, #ffd88a, #f19e32);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            .tip {
                width: vw(442);
                height: vw(61);
                margin: 0 auto;
                z-index: 3;
                @include bg("../../assets/images/RedRainTip-1.png", left top, 100% 100%, no-repeat);
            }
        }

        .bottom,
        .countdownBottom,
        .ingBottom {
            width: vw(750);
            height: vw(922);
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 0;
        }

        .bottom {
            @include bg("../../assets/images/RedRain-bg.png", left top, 100% 100%, no-repeat);
        }

        .countdownBottom {
            @include bg("../../assets/images/RedRainCoDown-bg.png", left top, 100% 100%, no-repeat);
        }

        .ingBottom {
            @include bg("../../assets/images/RedRainIng-bg.png", left top, 100% 100%, no-repeat);
        }

        .loader {
            position: fixed;
            left: 45%;
            top: 40%;
            margin: -0.2em 0 0 -0.2em;
            text-indent: -9999em;
            border-top: 0.3em solid rgba(0, 0, 0, 0.1);
            border-right: 0.3em solid rgba(0, 0, 0, 0.1);
            border-bottom: 0.3em solid rgba(0, 0, 0, 0.1);
            border-left: 0.3em solid #555;
            -moz-transform: translateZ(0);
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            -moz-animation: loader 1000ms infinite linear;
            -webkit-animation: loader 1000ms infinite linear;
            animation: loader 1000ms infinite linear;
            -moz-transition: all 3000ms ease;
            -o-transition: all 3000ms ease;
            -webkit-transition: all 3000ms ease;
            transition: all 3000ms ease;

        }

        .loaderTit {
            position: fixed;
            left: 41%;
            top: 48%;
            margin: 0 auto;
            text-align: center;
            color: #fff;
        }

        .loader,
        .loader:after {
            border-radius: 50%;
            width: 2em;
            height: 2em;
        }

        .curtain {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background-color: rgba(0, 0, 0, .8);
            -moz-transition: all 4000ms ease;
            -o-transition: all 4000ms ease;
            -webkit-transition: all 4000ms ease;
            transition: all 4000ms ease;
            filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=0);
            opacity: 0;
            z-index: 0;
            overflow: hidden;
        }

        @-webkit-keyframes loader {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }

            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        @-moz-keyframes loader {
            0% {
                -moz-transform: rotate(0deg);
                transform: rotate(0deg);
            }

            100% {
                -moz-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        @keyframes loader {
            0% {
                -webkit-transform: rotate(0deg);
                transform: rotate(0deg);
            }

            100% {
                -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
            }
        }

        .loading {
            overflow: hidden;
        }

        .loading .curtain {
            filter: progid:DXImageTransform.Microsoft.Alpha(enabled=false);
            opacity: 1;
            z-index: 99;
        }

        .loading .loader {
            filter: progid:DXImageTransform.Microsoft.Alpha(enabled=false);
            opacity: 1;
        }

    }
</style>