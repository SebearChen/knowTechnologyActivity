<template>
    <div class="redRainSe">
        <div class="redSeb">
            <div class="redSe">
                <div class="redRainTime" v-if="RpRainToStatus == '0'">
                    距离本场红包雨结束：
                    <span class="time">{{hours}}</span>
                    <span class="time">{{minutes}}</span>
                    <span class="time">{{seconds}}</span>
                </div>
                <div class="redRainTime" v-if="RpRainToStatus == '1'">
                    距离下场红包雨开始：
                    <span class="time">{{hours}}</span>
                    <span class="time">{{minutes}}</span>
                    <span class="time">{{seconds}}</span>
                </div>
                <div class="redSessions">
                    <div class="end" v-for="(item, index) in RpRainEndTimeList" :key="'end'+index">
                        <div @click="toEnd()">
                            <div class="time">{{item.dailyStartTime}}</div>
                            <div class="status"></div>
                        </div>
                    </div>
                    <div class="ing" id="ingRain" v-for="(item, index) in RpRainIngTimeList" :key="'ing'+index">
                        <div @click="toRedRain(item.id)">
                            <div class="time">{{item.dailyStartTime}}</div>
                            <div class="status"></div>
                        </div>
                    </div>
                    <div class="will" id="willRain" v-for="(item, index) in RpRainWillTimeList" :key="'will'+index">
                        <div @click="toWaitRedRain(item.id)">
                            <div class="time">{{item.dailyStartTime}}</div>
                            <div class="status"></div>
                        </div>
                    </div>
                    <div class="next" v-for="(item, index) in RpRainNextTimeList" :key="'next'+index">
                        <div @click="toNext()">
                            <div class="time">{{item.dailyStartTime}}</div>
                            <div class="status"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="getRedList">
            <div class="swiper-container">
                <div class="swiper-wrapper swiper-no-swiping">
                    <div class="swiper-slide" v-for="(item,index) in getRedList" :key="'swp'+index">
                        <div class="getRedItem">
                            <div class="content"><img :src="item.headImage" /><span
                                    class="name">{{item.userName}}</span><span class="tit">领到{{item.prize}}奖励</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div> -->
        <!-- <div class="openGroup" v-if="showOpenGroup">
            <div class="tit">输入团号参团：</div>
            <input class="inp" v-model="groupNum">
            <div class="ctBtn" @click="toCT()"></div>
        </div> -->
        <div class="condition">
            <!-- <div class="conditionItem">
                <div class="toBegin" v-for="(item, index) in openGroupList" :key="'be_'+index">
                    <div class="price">
                        <div>{{item.groupStock}}</div>
                    </div>
                    <div class="tit">邀{{item.groupNumber -1 }}人，团长分{{item.groupCaptainMin}}元起</div>
                    <div class="pic" v-if="item.groupNumber>4">
                        <img src="../../assets/images/user-icon.png" v-for="index of 4" :key="'toPic'+index" />
                        <div class="be_blank">...</div>
                    </div>
                    <div class="pic" v-else>
                        <img src="../../assets/images/user-icon.png" v-for="index of item.groupNumber"
                            :key="'toPic'+index" />
                    </div>
                    <div class="btn" @click="toBegin(item.ruleId,item.groupCaptainMin)"></div>
                </div>
                <div class="invite" v-for="(item, index) in inviteGroupList" :key="'in_'+index">
                    <div class="toGroupDetail" @click="toGroupDetail(item.myGroupDetail.id)"></div>
                    <div class="price">
                        <div>{{item.groupStock}}</div>
                    </div>
                    <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                    <div class="pic">
                        <img :src="item.myGroupDetail.captain.headImage" />
                        <img v-for="(picItem,index) in item.myGroupDetail.members" :key="'inPic'+index"
                            :src="picItem.headImage" />
                        <div class="blank" v-if="item.myGroupDetail.members.length>=3">...</div>
                        <div class="num">再邀{{item.groupNumber - item.myGroupDetail.currentNumber}}人领</div>
                    </div>
                    <div class="btn"></div>
                    <div class="tips">仅今日有效</div>
                </div>
                <div class="noReceive" v-for="(item, index) in noReceiveGroupList" :key="'nr_'+index">
                    <div class="toGroupDetail" @click="toGroupDetail(item.myGroupDetail.id)"></div>
                    <div class="price">
                        <div>{{item.groupStock}}</div>
                    </div>
                    <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                    <div class="pic">
                        <img :src="item.myGroupDetail.captain.headImage" />
                        <img v-for="(picItem,index) in item.myGroupDetail.members" :key="'noPic'+index"
                            :src="picItem.headImage" />
                        <div class="blank" v-if="item.myGroupDetail.members.length>=3">...</div>
                        <div class="num">恭喜成团</div>
                        <i class="angle"></i>
                    </div>
                    <div class="btn" @click="toReceive(item.myGroupDetail.id)"></div>
                </div>
                <div class="received" v-for="(item, index) in receivedGroupList" :key="'re_'+index">
                    <div class="toGroupDetail" @click="toGroupDetail(item.myGroupDetail.id)"></div>
                    <div class="price">
                        <div>{{item.groupStock}}</div>
                    </div>
                    <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                    <div class="pic">
                        <img :src="item.myGroupDetail.captain.headImage" />
                        <img v-for="(picItem,index) in item.myGroupDetail.members" :key="'rePic'+index"
                            :src="picItem.headImage" />
                        <div class="blank" v-if="item.myGroupDetail.members.length>=3">...</div>
                        <div class="num">恭喜成团</div>
                        <i class="angle"></i>
                    </div>
                    <div class="btn" @click="toReceive(item.myGroupDetail.id)"></div>
                </div>
                <div class="overtime" v-for="(item, index) in overtimeGroupList" :key="'ovt_'+index">
                    <div class="toGroupDetail" @click="toGroupDetail(item.myGroupDetail.id)"></div>
                    <div class="price">
                        <div>{{item.groupStock}}</div>
                    </div>
                    <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                    <div class="pic">
                        <img :src="item.myGroupDetail.captain.headImage" />
                        <img v-for="(picItem,index) in item.myGroupDetail.members" :key="'ovPic'+index"
                            :src="picItem.headImage" />
                        <div class="blank" v-if="item.myGroupDetail.members.length>=3">...</div>
                        <div class="num">差{{item.groupNumber - item.myGroupDetail.currentNumber}}未拼成</div>
                        <i class="angle"></i>
                    </div>
                    <div class="btn"></div>
                </div>
                <div class="overdue" v-for="(item, index) in overdueGroupList" :key="'ov_'+index">
                    <div class="price">
                        <div>{{item.groupStock}}</div>
                    </div>
                    <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                    <div class="pic" v-if="item.groupNumber>4">
                        <img src="../../assets/images/user-icon.png" v-for="index of 4" :key="'toPic'+index" />
                        <div class="blank">...</div>
                    </div>
                    <div class="pic" v-else>
                        <img src="../../assets/images/user-icon.png" v-for="index of item.groupNumber"
                            :key="'toPic'+index" />
                    </div>
                    <div class="btn"></div>
                </div>
            </div> -->
            <div class="conditionItem">
                <div class="conditionTit">这些活动进行中：</div> 
                <div class="item item1" @click="toCircle()"></div>
                <div class="dashed"></div> 
                <a class="item item2" href="https://pcsac.pc.com.cn/t/wh?type=zt&browser=commonWebView"></a>
            </div>
        </div>
        <RedRainPop />
    </div>
</template>

<script>
    import storage from '@/mixin/storage.js'

    export default {
        name: "Redrainsessions",
        props: ["userId", "isOldUser", "unionId"],
        data() {
            return {
                nowServerTime: '', //当前服务器时间戳
                hours: null, //倒计时：时
                minutes: null, //倒计时：分
                seconds: null, //倒计时：秒
                nowtime: '', //当前时间戳
                isMass: false, //是否已开团
                groupNum: '', //团号
                getRedList: [], //领取到奖励的用户列表
                groupDataList: [], // 团信息列表
                openGroupList: [], // 可开团的列表
                inviteGroupList: [], // 可邀请的列表
                noReceiveGroupList: [], // 可领红包的列表
                receivedGroupList: [], // 已领红包的列表
                overtimeGroupList: [], // 已结束的列表
                overdueGroupList: [], // 明日可开的列表
                groupStatusPopGroupNumData: '', // GroupStatusPop组件的团号
                deleteRepeatItem: {}, //去重用
                swiper: null,
                showOpenGroup: true, //	是否显示参团
                RpRainList: [], //红包雨规则场次List
                RpRainEndTimeList: [], //红包雨结束场次
                RpRainIngTimeList: [], //红包雨正在进行场次
                RpRainWillTimeList: [], //红包雨即将开始场次
                RpRainNextTimeList: [], //红包雨未开始场次
                RpRainToStatus: '', //红包雨距离开始结束：0.显示距离结束，1.显示距离开始
                dailyStartTimeList: [], //红包雨开始时间List
                minLeftTime: '', //最近场次的时间戳
                leftStartTime: '', //距离开始或结束时间戳
                countLeftStartTimeIN: '', //倒计时时间戳距离开始定时器
                countLeftEndTimeIN: '', //倒计时时间戳距离结束定时器
                // rainName: '',
                rpRainNextTimeObj: {}, //下一场红包雨倒计时对象
                countLeftTimeout1: '',
                countLeftTimeout2: '',
                nowServerTimeInter: '',
                userInfoObj: {
                    userId: '', //用户ID
                    openId: '',
                    refreshToken: '',
                    accessToken: '',
                    nickName: '',
                    icon: '',
                    unionId: '',
                },
            };
        },
        created() {
            // 红包雨场次
            this.getRpRainData();
            // 获取活动首页团信息
            // this.getActivityCenterGData();
            if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(
                    storage.data().LOGIN_TOKEN) != null) {
                // 判断是否是新用户
                this.getCurrentUser();
            }
            this.getRedListData();
            // 当前服务器时间
            this.getServerTime();
        },
        watch: {
            groupDataList(val) {},
            groupNum(val) {
                this.groupNum = val.replace(/(^\s*)|(\s*$)/g, "");
                // 传团号给CTStatusPop组件
                this.$EventBus.$emit("groupNum", val)
            },
            getRedList(val) {
                this.$nextTick(() => {
                    // this.swiper = null;
                    if (this.swiper == null) {
                        this.initSwiper();
                    }
                })
            },
            groupStatusPopGroupNumData(val) {
                for (let i = 0; i < this.groupDataList.rules.length; i++) {
                    if (val == this.groupDataList.rules[i].myGroupDetail.code) {
                        var leftNum = this.groupDataList.rules[i].myGroupDetail.groupNumber - this.groupDataList.rules[
                            i].myGroupDetail.currentNumber
                        this.$EventBus.$emit("redRainSessionsGroupNum", leftNum);
                    }
                }
            },
            leftStartTime(val) {
                if ((val == '0' || val == '9300') && this.RpRainToStatus == '1') { // 距离开始
                    // 红包雨场次
                    this.getRpRainData();
                }
            },
            // rainName(val){
            //     val = document.getElementById('ingRain').innerText;
            //     this.$EventBus.$emit("rainName", val)
            // }
        },
        methods: {
            toCircle(){
                window.location.href = "pconlinebrowser://circle-topic-detail/441";
            },
            toEnd() {
                this.$toast("本场红包雨已结束，请参与下一场吧~");
            },
            toNext() {
                this.$toast("本场红包雨即将开始，记得来~");
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
                        window.clearInterval(this.nowServerTimeInter);
                        this.nowServerTimeInter = setInterval(() => {
                            this.nowServerTime = this.nowServerTime + 1000;
                        }, 1000);
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
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
                        window.clearInterval(this.countLeftStartTimeIN);
                        window.clearInterval(this.countLeftEndTimeIN);
                        this.rpRainNextTimeObj = getData;
                        if (this.RpRainIngTimeList.length > 0) {
                            this.RpRainToStatus = '0';
                            this.countLeftStartTimeIN = setInterval(() => {
                                this.countLeftEndTime();
                            }, 1000);
                        } else {
                            this.RpRainToStatus = '1';
                            this.countLeftEndTimeIN = setInterval(() => {
                                this.countLeftStartTime();
                            }, 1000);
                        }
                        if (getData == null) {
                            this.hours = "00时";
                            this.minutes = "00分";
                            this.seconds = "00秒";
                        }
                    }
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
                        this.RpRainList = []; //红包雨规则场次List
                        this.RpRainEndTimeList = []; //红包雨结束场次
                        this.RpRainIngTimeList = []; //红包雨正在进行场次
                        this.RpRainWillTimeList = []; //红包雨即将开始场次
                        this.RpRainNextTimeList = []; //红包雨未开始场次
                        this.RpRainToStatus = ''; //红包雨距离开始结束：0.显示距离结束，1.显示距离开始
                        this.dailyStartTimeList = []; //红包雨开始时间List
                        this.minLeftTime = ''; //最近场次的时间戳
                        this.leftStartTime = ''; //距离开始或结束时间戳
                        window.clearInterval(this.countLeftStartTimeIN);
                        window.clearInterval(this.countLeftEndTimeIN);
                        window.clearTimeout(this.countLeftTimeout1);
                        window.clearTimeout(this.countLeftTimeout2);
                        // var getData = {nowTime: 1639216765546,rpRainRuleVOList:[{
                        //     dailyEndTime: 1639216741000,
                        //     dailyStartTime: 1639216200000,
                        //     id: 32,
                        //     rpRainTotalValue: 50000
                        // },{
                        //     dailyEndTime: 1639227101000,
                        //     dailyStartTime: 1639217101000,
                        //     id: 32,
                        //     rpRainTotalValue: 50000
                        // },]}
                        this.RpRainTimeList = getData;
                        this.RpRainList = getData;
                        this.nowtime = getData.nowTime;
                        this.RpRainList.rpRainRuleVOList.filter((item) => {
                            this.dailyStartTimeList.push(Math.abs(getData.nowTime - item.dailyStartTime));
                            //红包雨结束场次
                            if (getData.nowTime > item.dailyEndTime) {
                                this.minLeftTime = item.dailyStartTime / 1000;
                                item.dailyStartTime = this.formatDate(item.dailyStartTime);
                                item.dailyEndTime = this.formatDate(item.dailyEndTime);
                                this.RpRainEndTimeList.push(item);
                            }
                            //红包雨正在进行场次
                            if (getData.nowTime >= item.dailyStartTime && getData.nowTime <= item
                                .dailyEndTime) {
                                var leftEnd = item.dailyEndTime - getData.nowTime;
                                this.countLeftTimeout1 = setTimeout(() => {
                                    // 红包雨场次
                                    this.getRpRainData();
                                }, leftEnd);
                                this.minLeftTime = item.dailyEndTime / 1000;
                                item.dailyStartTime = this.formatDate(item.dailyStartTime);
                                item.dailyEndTime = this.formatDate(item.dailyEndTime);
                                this.RpRainIngTimeList.push(item);
                            }
                            //红包雨即将开始场次
                            if (getData.nowTime >= (parseInt(item.dailyStartTime) - 9302000) && getData
                                .nowTime <= item.dailyEndTime) {
                                var leftChange = parseInt(item.dailyStartTime) - parseInt(getData.nowTime)
                                this.countLeftTimeout2 = setTimeout(() => {
                                    // 红包雨场次
                                    this.getRpRainData();
                                }, leftChange);
                                if (this.RpRainIngTimeList.length == 0) {
                                    this.minLeftTime = item.dailyStartTime / 1000;
                                }
                                this.RpRainToStatus = '1'; //显示距离开始
                                item.dailyStartTime = this.formatDate(item.dailyStartTime);
                                item.dailyEndTime = this.formatDate(item.dailyEndTime);
                                this.RpRainWillTimeList.push(item);
                            }
                            //红包雨未开始场次
                            if (getData.nowTime <= item.dailyStartTime && getData.nowTime <= item
                                .dailyEndTime) {
                                if (this.RpRainNextTimeList.length == "0" && this.RpRainIngTimeList
                                    .length == 0) {
                                    this.minLeftTime = item.dailyStartTime / 1000;
                                }
                                item.dailyStartTime = this.formatDate(item.dailyStartTime);
                                item.dailyEndTime = this.formatDate(item.dailyEndTime);
                                this.RpRainNextTimeList.push(item);
                            }
                        });
                    }
                    if (getCode == 100) {
                        this.getRpRainData();
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
                // 获取下场红包雨时间
                this.getRpRainNextTime();
            },
            //获取用户信息
            async getCurrentUser() {
                try {
                    const {
                        isOldUser,
                        hasBeenInvited,
                        hasCreatedGroup,
                        userId,
                        code
                    } = await this.$api.fetchCurrentUser(localStorage.getItem("devId"), storage.methods.getCookie(
                        storage.data().LOGIN_TOKEN));
                    if (code == 0) {
                        if (localStorage.getItem("userId")== '' || localStorage.getItem("userId")== null) {
                            localStorage.setItem("userId",userId)
                        }
                        this.userInfoObj.userId = userId
                        if (hasBeenInvited == false && hasCreatedGroup == false && isOldUser == '0') {
                            this.showOpenGroup = true;
                        } else {
                            this.showOpenGroup = false;
                        }
                    }
                    if (code == 100) {
                        this.getCurrentUser();
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            //获取用户信息
            async getCurrentUserSecond() {
                // if (window.PCJSKit.platform() == 'iOS') {
                //     window.location.reload();
                // }
                // location.reload();
                try {
                    const {
                        isOldUser,
                        hasBeenInvited,
                        hasCreatedGroup,
                        userId,
                        code
                    } = await this.$api.fetchCurrentUser(localStorage.getItem("devId"), storage.methods.getCookie(
                        storage.data().LOGIN_TOKEN));
                    if (code == 0) {
                        if (localStorage.getItem("userId")== '' || localStorage.getItem("userId")== null) {
                            localStorage.setItem("userId",userId)
                        }
                        this.userInfoObj.userId = userId;
                        if (hasBeenInvited == false && hasCreatedGroup == false && isOldUser == '0') {
                            this.showOpenGroup = true;
                        } else {
                            this.showOpenGroup = false;
                        }
                        this.postAuthoRize(userId);
                    }
                    if (code == 100) {
                        this.getCurrentUserSecond();
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 前往团详情页
            toGroupDetail(groupId) {
                this.$router.push("/groupdetails?groupId=" + groupId + "&browser=commonWebView&showShareButton=1")
            },
            toLogin() {},
            // 获取活动首页团信息
            async getActivityCenterGData() {
                try {
                    var getCode = 0;
                    var getData = {};
                    // 判断是否已登录
                    if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(
                            storage.data().LOGIN_TOKEN) != null) {
                        // 获取活动首页团信息
                        const {
                            code,
                            data
                        } = await this.$api.fetchActivityCenterGData(localStorage.getItem("devId"));
                        getCode = code;
                        getData = data;
                    } else {
                        const {
                            code,
                            data
                        } = await this.$api.fetchActivityRulesData(localStorage.getItem("devId"));
                        getCode = code;
                        getData = data;
                    }
                    if (getCode == 0) {
                        this.groupDataList = [];
                        this.groupDataList = getData;
                        // 获取下场红包雨时间
                        this.getRpRainNextTime();
                        this.filterGroupDataList();
                    }
                    if (getCode == 100) {
                        this.getActivityCenterGData();
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 处理活动首页团信息数据
            filterGroupDataList() {
                this.openGroupList = [];
                this.inviteGroupList = [];
                this.noReceiveGroupList = [];
                this.receivedGroupList = [];
                this.overtimeGroupList = [];
                this.overdueGroupList = [];
                this.deleteRepeatItem = {};
                for (let i = 0; i < this.groupDataList.rules.length; i++) {
                    // 判断用户是否有开团
                    if (this.groupDataList.rules[i].isInviting == true) {
                        this.isMass = true
                    }
                }
                this.groupDataList.rules.forEach(item => {
                    //瓜分总金额
                    item.groupStock = item.groupStock / 100;
                    //团长所获红包最大值
                    item.groupCaptainMax = item.groupCaptainMax / 100;
                    //团长所获红包最小值
                    item.groupCaptainMin = item.groupCaptainMin / 100;
                    // 可开团的列表
                    if (this.isMass == false) {
                        if (item.isInviting == false && item.canInvite == true) {
                            this.openGroupList.push(item);
                            this.deleteRepeatItem[item.ruleId] = true;
                            // if (item.myGroupDetail != null && item.myGroupDetail.members.length >= 4) {
                            //     item.myGroupDetail.members.splice(3);
                            // }
                        }
                    }
                    //可邀请的列表
                    if (item.isInviting == true && item.myGroupDetail.status == '1') {
                        if (item.myGroupDetail != null && item.myGroupDetail.members.length >= 4) {
                            item.myGroupDetail.members.splice(3);
                        }
                        this.inviteGroupList.push(item);
                        this.deleteRepeatItem[item.ruleId] = true;
                    }
                    //可领红包的列表
                    if (item.isInviting == true && item.myGroupDetail.status == '2' && item.myGroupDetail
                        .rpOpenStatus == '0') {
                        if (item.myGroupDetail != null && item.myGroupDetail.members.length >= 4) {
                            item.myGroupDetail.members.splice(3);
                        }
                        this.noReceiveGroupList.push(item);
                        this.deleteRepeatItem[item.ruleId] = true;
                    }
                    //已领红包的列表
                    if (item.isInviting == true && item.myGroupDetail.rpOpenStatus == '1') {
                        if (item.myGroupDetail != null && item.myGroupDetail.members.length >= 4) {
                            item.myGroupDetail.members.splice(3);
                        }
                        this.receivedGroupList.push(item);
                        this.deleteRepeatItem[item.ruleId] = true;
                    }
                    //已结束的列表
                    if (item.isInviting == true && item.myGroupDetail.rpOpenStatus == '1' && item.myGroupDetail
                        .createTime < new Date(new Date(this.nowServerTime).toLocaleDateString()).getTime()) {
                        if (item.myGroupDetail != null && item.myGroupDetail.members.length >= 4) {
                            item.myGroupDetail.members.splice(3);
                        }
                        this.overtimeGroupList.push(item);
                        this.deleteRepeatItem[item.ruleId] = true;
                    }
                });
                //明日可开的列表
                if (this.isMass == true) {
                    for (let j = 0; j < this.groupDataList.rules.length; j++) {
                        if (!this.deleteRepeatItem[this.groupDataList.rules[j].ruleId]) {
                            if (this.groupDataList.rules[j].myGroupDetail && this.groupDataList.rules[j].myGroupDetail
                                .members.length >= 4) {
                                this.groupDataList.rules[j].myGroupDetail.members.splice(3);
                            }
                            this.overdueGroupList.push(this.groupDataList.rules[j]);
                        }
                    }
                } else {
                    for (let j = 0; j < this.groupDataList.rules.length; j++) {
                        if (!this.deleteRepeatItem[this.groupDataList.rules[j].ruleId] && this.groupDataList.rules[j]
                            .canInvite == false) {
                            if (this.groupDataList.rules[j].myGroupDetail && this.groupDataList.rules[j].myGroupDetail
                                .members.length >= 4) {
                                this.groupDataList.rules[j].myGroupDetail.members.splice(3);
                            }
                            this.overdueGroupList.push(this.groupDataList.rules[j]);
                        }
                    }
                }
            },
            // 计算距离下场红包雨开始剩余时间戳
            countLeftStartTime() {
                this.leftStartTime = parseInt((this.rpRainNextTimeObj.dailyStartTime - this.nowServerTime) /
                    1000); //距离开始时间的时间戳
                if (this.leftStartTime < 0) {
                    this.getRpRainData();
                }
                this.hours = (Math.floor(this.leftStartTime / 3600) < 10 ? '0' + Math.floor(this.leftStartTime / 3600) :
                    Math.floor(this.leftStartTime / 3600)) + "时";
                this.minutes = (Math.floor((this.leftStartTime / 60) % 60) < 10 ? '0' + Math.floor((this.leftStartTime /
                    60) % 60) : Math.floor((this.leftStartTime / 60) % 60)) + "分";
                this.seconds = (Math.floor(this.leftStartTime) % 60 < 10 ? '0' + Math.floor(this.leftStartTime) % 60 :
                    Math.floor(this.leftStartTime) %
                    60) + "秒";
            },
            // 计算距离本场红包雨结束剩余时间戳
            countLeftEndTime() {
                this.leftStartTime = parseInt((this.minLeftTime - this.nowServerTime / 1000)); //距离结束时间的时间戳
                if (this.leftStartTime < 0) {
                    this.getRpRainData();
                }
                this.hours = (Math.floor(this.leftStartTime / 3600) < 10 ? '0' + Math.floor(this.leftStartTime / 3600) :
                    Math.floor(this.leftStartTime / 3600)) + "时";
                this.minutes = (Math.floor((this.leftStartTime / 60) % 60) < 10 ? '0' + Math.floor((this.leftStartTime /
                    60) % 60) : Math.floor((this.leftStartTime / 60) % 60)) + "分";
                this.seconds = (Math.floor(this.leftStartTime) % 60 < 10 ? '0' + Math.floor(this.leftStartTime) % 60 :
                    Math.floor(this.leftStartTime) %
                    60) + "秒";
            },
            // 前往红包雨进行页
            toRedRain(ruleId) {
                localStorage.setItem("RedRainPopStatus", '2');
                if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(storage
                        .data().LOGIN_TOKEN) != null) {
                    this.getRpRainVerify(ruleId);
                } else {
                    window.location.href = 'pcaction://user-browser-user-center?callback=getCommonId2';
                }
                // this.rainName = document.getElementById('ingRain').innerText;
                // this.rainName = "1111";
                // this.$EventBus.$emit("rainName", this.rainName);
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('首页', '', '', document.getElementById('ingRain').innerText,
                    '');

            },
            // 前往红包雨等待页
            toWaitRedRain(ruleId) {
                localStorage.setItem("RedRainPopStatus", '1');
                if (storage.methods.getCookie(storage.data().LOGIN_TOKEN) != '' && storage.methods.getCookie(storage
                        .data().LOGIN_TOKEN) != null) {
                    this.getRpRainVerify(ruleId);
                } else {
                    window.location.href = 'pcaction://user-browser-user-center?callback=getCommonId2';
                }
                // 神策埋点 浏览事件
                this.$sensorsEvent.buttonClick('首页', '', '', document.getElementById('willRain').innerText,
                    '');
            },
            //用户资格校验
            async getRpRainVerify(ruleId) {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchRpRainVerify({
                        ruleId: ruleId
                    }, localStorage.getItem("devId"));
                    switch (code) {
                        case 0:
                            if (data) {
                                this.getRedListData();
                                this.$EventBus.$emit("RedRainPopStatus", localStorage.getItem("RedRainPopStatus"))
                            } else {
                                localStorage.removeItem("RedRainPopStatus");
                                this.$toast("你已参与本场红包雨，敬请期待下一场哦~");
                            }
                            break;
                        case 1:
                            // this.$toast("请先进行微信授权~")
                            window.location.href = "pcaction://user-browser-wechat?callback=getwxInfo2";
                            break;
                        case 2:
                            this.$toast("当前活动不存在~")
                        default:
                            break;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 获取轮播区消息
            async getRedListData() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchGroupBroadCast(localStorage.getItem("devId"));
                    if (code == 0) {
                        this.getRedList = data.broadcast;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 前往参团
            async toCT() {
                localStorage.setItem("activtyCenterStorage", 'CT')
                localStorage.setItem("CTgroupNum", this.groupNum.toString())
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('首页', '', '', '参团', '');
                // 判断是否已登录
                this.$EventBus.$emit("toLogin");
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchJoinGroup({
                        'code': this.groupNum.toString()
                    }, localStorage.getItem("devId"));
                    if (code == '0') {
                        this.showOpenGroup = false;
                        this.$EventBus.$emit("showCTStatusPop", code, data);
                    } else {
                        this.$EventBus.$emit("showCTStatusPop", code);
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 前往参团
            async toCT2() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchJoinGroup({
                        'code': this.groupNum.toString()
                    }, localStorage.getItem("devId"));
                    if (code == '0') {
                        this.showOpenGroup = false;
                        this.$EventBus.$emit("showCTStatusPop", code, data);
                    } else {
                        this.$EventBus.$emit("showCTStatusPop", code);
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 前往开团
            async toBegin(ruleId, groupCaptainMin) {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('首页', '', '', '开团', '');
                localStorage.setItem("activtyCenterStorage", 'KT')
                // 判断是否已登录
                this.$EventBus.$emit("toLogin");
                try {
                    var postObj = {
                        activityId: '1',
                        ruleId: ruleId
                    }
                    var postJson = JSON.stringify(postObj);
                    const {
                        code,
                        data
                    } = await this.$api.fetchOpenGroup(postJson, localStorage.getItem("devId"));
                    switch (code) {
                        case 0:
                            // this.getActivityCenterGData();
                            this.$EventBus.$emit("showKTSuccess", data.groupCode, groupCaptainMin, data.groupId);
                            break;
                        case 1:
                            this.$toast("今日已开团~");
                            break;
                        case 2:
                            this.$toast("今日此团已无名额~");
                            break;
                        case 6:
                            this.$toast("请先进行微信授权~");
                            this.$EventBus.$emit("toLogin");
                            break;
                        case 10:
                            this.$toast("IP已被限制~");
                            break;
                        case 11:
                            this.$toast("设备号已被限制~");
                            break;
                        default:
                            break;
                    }
                } catch (error) {
                    console.log(error);
                } finally {}
            },
            // 前往邀请好友
            toInvite(ruleId, code) {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('首页', '', '', '邀请好友', '', localStorage.getItem("unionId"));
                // 跳转到微信
                window.PCJSKit.shareWithoutSurface("嗨！快入团，发福利啦~", "来知科技APP输入团号【" + code + "】领红包！天天红包雨下不停，速来>",
                    "https://" + storage.data().SHARE_LINK_DOMAIN + storage.data().SHARE_LINK +
                    "/zt/act/year/202111/wx-wap/index.html#/?groupId=" +
                    ruleId,
                    "http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg",
                    "", 1);
            },
            // 前往团信息详情页
            toReceive(ruleId) {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('首页', '', '', '领红包', '');
                this.$router.push("/groupdetails?groupId=" + ruleId + "&browser=commonWebView&showShareButton=1")
            },
            //时间戳转换方法
            formatDate(date) {
                var date = new Date(parseInt(date, 10));
                var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                return hh + mm;
            },
            // 初始化swiper
            initSwiper() {
                this.swiper = new window._Swiper(".swiper-container", {
                    autoplay: {
                        delay: 2000,
                    },
                    slidesPerView: 'auto',
                    loop: true,
                    direction: 'vertical',
                    spaceBetween: 10,
                    speed: 800,
                });
            },
            async postAuthoRize(userId) {
                try {
                    // this.userInfoObj.userId = userId;
                    var userInfo = {
                        userId: userId == '' ? localStorage.getItem("userId") : userId, //用户ID
                        openId: JSON.parse(localStorage.getItem("wxInfoJson")).openId,
                        refreshToken: JSON.parse(localStorage.getItem("wxInfoJson")).refreshToken,
                        accessToken: JSON.parse(localStorage.getItem("wxInfoJson")).accessToken,
                        nickName: JSON.parse(localStorage.getItem("wxInfoJson")).nickName,
                        icon: JSON.parse(localStorage.getItem("wxInfoJson")).icon,
                        unionId: JSON.parse(localStorage.getItem("wxInfoJson")).unionId,
                    }
                    var postJson = JSON.stringify(userInfo);
                    const {
                        code,
                    } = await this.$api.fetchAuthoRize(postJson, localStorage.getItem("devId"));
                    console.log('刷新');
                    switch (code) {
                        case 0:
                            setTimeout(() => {
                                that.$toast("微信授权成功~");
                            }, 800);
                            console.log('刷新1');
                            window.location.reload();
                            break;
                        case '0':
                            setTimeout(() => {
                                that.$toast("微信授权成功~");
                            }, 800);
                            console.log('刷新2');
                            window.location.reload();
                            break;
                        case 1:
                            setTimeout(() => {
                                this.$toast("此微信账号已绑定其他用户，无法参与活动~");
                            }, 800);
                            break;
                        case '1':
                            setTimeout(() => {
                                this.$toast("此微信账号已绑定其他用户，无法参与活动~");
                            }, 800);
                            break;
                        default:
                            break;
                    }
                    this.$forceUpdate();
                } catch (error) {
                    console.error(error);
                } finally {}
            },
        },
        mounted() {
            if (localStorage.getItem("wxInfoJson") != null && localStorage.getItem("wxInfoJson") != "") {
                this.getCurrentUserSecond();
            }

            this.$EventBus.$off("activtyCenterCallBack");
            this.$EventBus.$on("activtyCenterCallBack", () => {
                localStorage.removeItem("activtyCenterStorage");
                // 红包雨场次
                this.getRpRainData();
                // 处理活动首页团信息数据
                // this.getActivityCenterGData();
                // 判断是否是新用户
                this.getCurrentUser();
                // 当前服务器时间
                this.getServerTime();
            });
            this.$EventBus.$off("activtyCenterCallBackToCT");
            this.$EventBus.$on("activtyCenterCallBackToCT", () => {
                this.toCT2();
            });
            this.$EventBus.$off("groupStatusPopGroupNum");
            this.$EventBus.$on("groupStatusPopGroupNum", (val) => {
                this.groupStatusPopGroupNumData = val
            });
            var that = this;

            window.getwxInfo2 = function (data) {
                let jsonData = (new Function("return " + data))();
                // let wxInfoA = JSON.parse(data);
                // if (wxInfoA && !wxInfoA.accessToken) {
                //     this.$toast("微信绑定失败请重新绑定");
                //     return false;
                // }
                that.userInfoObj.openId = jsonData.openId
                that.userInfoObj.refreshToken = jsonData.refreshToken
                that.userInfoObj.accessToken = jsonData.accessToken
                that.userInfoObj.nickName = jsonData.nickName
                that.userInfoObj.icon = jsonData.icon
                that.userInfoObj.unionId = jsonData.unionId
                localStorage.setItem("wxInfoJson", JSON.stringify(jsonData))
                
                if (window.PCJSKit.platform() != 'iOS') {
                    window.location.reload();
                }
                that.getCurrentUserSecond();
            }

            
            window.getCommonId2 = function (data) {
                storage.methods.setCookie(storage.data().LOGIN_TOKEN, data, 48);
                // if (window.PCJSKit.platform() == 'iOS') {
                that.getCurrentUserSecond(data);
                // } else {
                // window.location.reload();
                // that.getCurrentUser();
                // }
            }
        }
    };
</script>

<style lang="scss" scoped>
    .redRainSe {
        width: 100%;
        height: 100%;

        .redSeb {
            width: vw(750);
            height: vw(220);
            padding: vw(60) 0 0 0;
            @include bg("../../assets/images/redrainsessions_bg.png", left top, 100% 100%, no-repeat);

            .redSe {
                // position: relative;
                width: vw(640);
                height: vw(208);
                margin: 0 auto vw(5);
                top: vw(65);
                left: 0;
                @include bg("../../assets/images/redse_bg.png", left top, 100% 100%, no-repeat);

                .redRainTime {
                    position: relative;
                    top: vw(20);
                    left: 0;
                    text-align: center;
                    color: #fff;
                    font-size: vw(24);

                    .time {
                        margin-right: vw(5);
                        padding: vw(8) vw(15);
                        color: #3fcee9;
                        background-color: #10256e;
                        border-radius: vw(8);
                    }
                }

                .redSessions {
                    display: flex;
                    color: #fff;
                    font-weight: 600;
                    text-align: center;
                    overflow-y: scroll;

                    &::-webkit-scrollbar {
                        display: none;
                    }

                    .time {
                        height: vw(60);
                        line-height: vw(62);
                        font-size: vw(40);
                    }

                    .status {
                        width: vw(117);
                        height: vw(35);
                        margin: 0 auto;
                    }

                    .end,
                    .ing,
                    .will,
                    .next {
                        width: vw(132);
                        height: vw(109);
                        // margin-top: vw(45);
                        margin: vw(45) vw(14) 0;
                    }

                    .end {
                        .status {
                            width: vw(120);
                            height: vw(35);
                            @include bg("../../assets/images/end_status.png", left top, 100% 100%, no-repeat);
                        }
                    }

                    .ing {
                        color: #46ebfd;
                        background-color: #302e96;
                        border-radius: vw(8);

                        .status {
                            @include bg("../../assets/images/ing_status.png", left top, 100% 100%, no-repeat)
                        }

                    }

                    .will {
                        .status {
                            @include bg("../../assets/images/will_status.png", left top, 100% 100%, no-repeat)
                        }
                    }

                    .next {
                        .status {
                            @include bg("../../assets/images/next_status.png", left top, 100% 100%, no-repeat)
                        }
                    }
                }
            }
        }

        .openGroup {
            // position: relative;
            display: flex;
            // top: vw(65);
            // left: 0;
            margin-top: vw(-5);
            width: vw(750);
            height: vw(69);
            justify-content: center;
            align-items: center;
            @include bg("../../assets/images/opengroup_bg.png", left top, 100% 100%, no-repeat);

            .tit {
                color: #fff;
                font-size: vw(27);
            }

            .inp {
                width: vw(210);
                height: vw(46);
                color: #fff;
                font-size: vw(24);
                text-align: center;
                margin: 0 vw(22) 0 0;
                border-radius: vw(5);
                background-color: #302e96;
                -webkit-user-select: auto;
                /* webkit浏览器 */
                margin: 0;
                padding: 0;
                outline: none;
            }

            .ctBtn {
                width: vw(132);
                height: vw(40);
                position: relative;
                left: vw(20);
                @include bg("../../assets/images/ctBtn.png", left top, 100% 100%, no-repeat);
            }
        }

        .getRedList {
            // position: relative;
            display: flex;
            // top: vw(65);
            // left: 0;
            margin-top: vw(-2);
            width: vw(750);
            height: vw(69);
            justify-content: center;
            align-items: center;
            overflow: hidden;
            @include bg("../../assets/images/opengroup_bg.png", left top, 100% 100%, no-repeat);

            .swiper-container {
                .swiper-wrapper {
                    height: vw(46) !important;

                    .swiper-slide {
                        width: vw(520);
                        text-align: center;

                        .getRedItem {
                            width: 99%;
                            height: vw(46);
                            // border: #34faf3 vw(1) solid;
                            // border-radius: vw(25);
                            @include bg("../../assets/images/slider_bg.png", left top, 100% 100%, no-repeat);


                            img {
                                width: vw(30);
                                height: vw(30);
                                margin: vw(8) vw(5) vw(5) 0;
                                border: #33f0ec vw(1) solid;
                                border-radius: 50%;
                                float: left;
                            }

                            .name {
                                margin: vw(6) 0 0;
                                width: auto;
                                max-width: vw(86);
                                line-height: vw(28);
                                overflow: hidden;
                                white-space: nowrap;
                                text-overflow: ellipsis;
                                text-align: right;
                            }

                            .tit {
                                margin: vw(6) 0 0;
                                width: vw(280);
                                line-height: vw(28);
                                overflow: hidden;
                                text-align: left;
                            }

                            .content {
                                // display: inline-block;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: #fff;
                                font-size: vw(28);
                            }
                        }
                    }
                }
            }
        }

        .condition {
            width: vw(750);
            height: vw(800);
            // position: relative;
            // top: vw(64);
            // left: 0;
            margin-top: vw(-6);
            padding-top: vw(10);
            @include bg("../../assets/images/condition_bg.png", left top, 100% 100%, no-repeat);

            .conditionItem {
                width: vw(640);
                height: vw(735);
                display: flex;
                flex-direction: column;
                overflow-y: scroll; 
                margin: 0 auto;
                padding: vw(10) 0 0 0;
                background: #1f2360;


                &::-webkit-scrollbar {
                    display: none;
                }

                .conditionTit{
                    font-size: vw(36);
                    color: #fff;
                }
                .item{
                    width: vw(640);
                    height: vw(268);
                    margin: vw(20) 0;
                }

                .dashed{
                    margin: vw(10) 0;
                    border: vw(1) dashed #9c9db1;
                }

                .item1{
                    @include bg("../../assets/images/end_other_1.png", left top, 100% 100%, no-repeat);
                }

                .item2{
                    @include bg("../../assets/images/end_other_2.png", left top, 100% 100%, no-repeat);
                }

                .toBegin,
                .invite,
                .noReceive,
                .received,
                .overdue,
                .overtime {
                    width: vw(646);
                    height: vw(177);
                    margin: 0 auto vw(20);
                    white-space: nowrap;
                }

                .toGroupDetail {
                    width: vw(650);
                    height: vw(180);
                    position: absolute;
                    margin: 0 0 vw(20) 0;
                    white-space: nowrap;
                    z-index: 5;
                }

                .price {
                    width: vw(127);
                    height: vw(127);
                    line-height: vw(127);
                    position: relative;
                    top: vw(25);
                    left: vw(25);
                    text-align: center;
                    font-size: vw(65);
                    font-weight: 600;
                    @include bg("../../assets/images/price_bg.png", left top, 100% 100%, no-repeat);

                    div {
                        background-image: -webkit-linear-gradient(top, #fe7402, #ee3a20);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    }

                    &::after {
                        content: "";
                        position: absolute;
                        bottom: 0;
                        right: vw(-20);
                        width: vw(54);
                        height: vw(54);
                        @include bg("../../assets/images/priceN_bg.png", left top, 100% 100%, no-repeat);
                    }
                }

                .tit {
                    display: inline;
                    position: relative;
                    top: vw(-85);
                    left: vw(190);
                    font-size: vw(28.5);
                    font-weight: 600;
                }

                .pic {
                    display: table-caption;
                    position: relative;
                    top: vw(-80);
                    left: vw(201);

                    img,
                    .blank,
                    .be_blank {
                        width: vw(51);
                        height: vw(51);
                        margin-left: vw(-22);
                        border-radius: 50%;
                        border: #fff vw(2) solid;
                    }

                    .blank,
                    .be_blank {
                        width: vw(41);
                        line-height: vw(31);
                        display: inline-flex;
                        padding-left: vw(8);
                        color: #0d35a9;
                        font-size: vw(40);
                        // float: revert;
                        background-color: #c7e3ff;
                    }

                    .be_blank {
                        color: #f65910;
                        background-color: #ffe2d0;
                    }

                    .num {
                        display: inline-block;
                        font-size: vw(24);
                        color: #0d35a9;
                        height: vw(51);
                        line-height: vw(51);
                        margin-left: vw(8);
                    }
                }

                .btn {
                    position: relative;
                    top: vw(-150);
                    left: vw(494);
                    width: vw(130);
                    height: vw(51);
                }

                .toBegin {
                    @include bg("../../assets/images/toBegin_bg.png", left top, 100% 100%, no-repeat);

                    .tit {
                        color: #f65910;
                    }

                    .btn {
                        @include bg("../../assets/images/toBegin_btn.png", left top, 100% 100%, no-repeat);
                    }
                }

                .invite {
                    @include bg("../../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);

                    .price {}

                    .tit {
                        color: #0d35a9;
                    }

                    .pic {}

                    .btn {
                        top: vw(-160);
                        @include bg("../../assets/images/invite_btn.png", left top, 100% 100%, no-repeat);
                    }

                    .tips {
                        position: relative;
                        top: vw(-150);
                        left: vw(498);
                        width: vw(108);
                        height: vw(20);
                        font-size: vw(24);
                        color: #747474;
                    }
                }

                .noReceive {
                    position: relative;
                    @include bg("../../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);

                    &::after {
                        content: "";
                        width: vw(83);
                        height: vw(83);
                        position: absolute;
                        top: 0;
                        right: 0;
                        @include bg("../../assets/images/receive_angle.png", left top, 100% 100%, no-repeat)
                    }

                    .btn {
                        top: vw(-150);
                        @include bg("../../assets/images/receive_btn.png", left top, 100% 100%, no-repeat);
                    }
                }

                .received {
                    position: relative;
                    @include bg("../../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);

                    &::after {
                        content: "";
                        width: vw(83);
                        height: vw(83);
                        position: absolute;
                        top: 0;
                        right: 0;
                        @include bg("../../assets/images/receive_angle.png", left top, 100% 100%, no-repeat)
                    }

                    .btn {
                        top: vw(-150);
                        @include bg("../../assets/images/overdueLQ_btn.png", left top, 100% 100%, no-repeat);
                    }
                }

                .overtime {
                    position: relative;
                    @include bg("../../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);

                    .btn {
                        top: vw(-150);
                        @include bg("../../assets/images/overdueJS_btn.png", left top, 100% 100%, no-repeat);
                    }
                }

                .overdue {
                    @include bg("../../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);

                    .pic {
                        .angle {
                            @include bg("../../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);
                        }
                    }

                    .btn {
                        top: vw(-150);
                        @include bg("../../assets/images/overdue_btn.png", left top, 100% 100%, no-repeat);
                    }
                }

                :last-child {
                    margin-bottom: 0;
                }
            }
        }

        &::before {
            content: "";
            display: block;
            width: vw(83);
            height: vw(60);
            position: absolute;
            top: vw(355);
            left: vw(260);
            @include bg("../../assets/images/redRainSe_before.png", left top, 100% 100%, no-repeat);

        }
    }
</style>