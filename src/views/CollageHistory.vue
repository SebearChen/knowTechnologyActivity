<template>
    <div class="collageHistory">
        <div class="content">
            <div class="head">
                <div class="tit">
                    <div class="lTit">红包余额</div>
                    <div class="rTit">今日收益：+{{todayEarning}}元</div>
                </div>
                <div class="price">{{balance}}<span>元</span></div>
                <div class="btn" @click="toWithdrawalPage()"></div>
            </div>
            <div class="condition">
                <div class="conditionItem">
                    <div class="invite" v-for="(item,index) in inviteGroupList" :key="'in'+index">
                        <div class="toGroupDetail" @click="toGroupDetail(item.id)"></div>
                        <div class="wfq_tip" v-if="item.role == '0'"></div>
                        <div class="wcy_tip" v-if="item.role == '1'"></div>
                        <div class="price">
                            <div>{{item.groupStock}}</div>
                        </div>
                        <div class="tzfPrice">团长分{{item.groupCaptainMin}}元起</div>
                        <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                        <div class="pic">
                            <img :src="item.captain.headImage" />
                            <img v-for="(picItem,index) in item.members" :key="'inPic'+index"
                                :src="picItem.headImage" />
                            <div class="blank" v-if="item.members.length>=3">...</div>
                            <div class="num">再邀{{item.groupNumber - item.currentNumber}}人领</div>
                        </div>
                        <div class="btn" @click="toInvite(item.id,item.code)"></div>
                        <div class="tips">仅今日有效</div>
                    </div>
                    <div class="receive" v-for="(item,index) in noReceiveGroupList" :key="'re'+index">
                        <div class="toGroupDetail" @click="toGroupDetail(item.id)"></div>
                        <div class="wfq_tip" v-if="item.role == '0'"></div>
                        <div class="wcy_tip" v-if="item.role == '1'"></div>
                        <div class="price">
                            <div>{{item.groupStock}}</div>
                        </div>
                        <div class="tzfPrice" v-if="item.captain.rpStat == '1'">团长分{{item.captain.rpMoney / 100}}元</div>
                        <div class="tzfPrice" v-if="item.captain.rpStat == '0'">团长分{{item.groupCaptainMin}}元起</div>
                        <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                        <div class="pic">
                            <img :src="item.captain.headImage" />
                            <img v-for="(picItem,index) in item.members" :key="'rePic'+index"
                                :src="picItem.headImage" />
                            <div class="blank" v-if="item.members.length>=3">...</div>
                            <div class="num">恭喜成团</div>
                            <i class="angle"></i>
                        </div>
                        <div class="btn" @click="toReceive(item.id)"></div>
                    </div>
                    <div class="received" v-for="(item,index) in receivedGroupList" :key="'red'+index">
                        <div class="toGroupDetail" @click="toGroupDetail(item.id)"></div>
                        <div class="wfq_tip" v-if="item.role == '0'"></div>
                        <div class="wcy_tip" v-if="item.role == '1'"></div>
                        <div class="price">
                            <div>{{item.groupStock}}</div>
                        </div>
                        <div class="tzfPrice" v-if="item.captain.rpStat == '1'">团长分{{item.captain.rpMoney / 100}}元</div>
                        <div class="tzfPrice" v-if="item.captain.rpStat == '0'">团长分{{item.groupCaptainMin}}元起</div>
                        <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                        <div class="pic">
                            <img :src="item.captain.headImage" />
                            <img v-for="(picItem,index) in item.members" :key="'redPic'+index"
                                :src="picItem.headImage" />
                            <div class="blank" v-if="item.members.length>=3">...</div>
                        </div>
                        <div class="btn" @click="toReceive(item.id)"></div>
                    </div>
                    <div class="overdue" v-for="(item,index) in overdueGroupList" :key="'ov'+index">
                        <div class="wfq_tip" v-if="item.role == '0'"></div>
                        <div class="wcy_tip" v-if="item.role == '1'"></div>
                        <div class="price">
                            <div>{{item.groupStock}}</div>
                        </div>
                        <div class="tit">邀{{item.groupNumber -1 }}人，瓜分{{item.groupStock}}元</div>
                        <div class="pic">
                            <img :src="item.captain.headImage" />
                            <img v-for="(picItem,index) in item.members" :key="'ovPic'+index"
                                :src="picItem.headImage" />
                            <div class="blank" v-if="item.members.length>=3">...</div>
                        </div>
                        <div class="btn end"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import storage from '@/mixin/storage.js'
    export default {
        name: "CollageHistory",
        props: ['userId', 'unionId'],
        data() {
            return {
                groupHistoryList: [], //拼团历史List
                inviteGroupList: [], // 可邀请的列表
                noReceiveGroupList: [], // 可领红包的列表
                receivedGroupList: [], // 已领红包的列表
                overdueGroupList: [], // 已失效的列表
                balance: '', // 今日收益，以分为单位
                todayEarning: '', // 余额，以分为单位
            };
        },
        created() {
            // 获取用户拼团历史
            // this.getGroupHistoryList();
            // // 获取我的钱包
            // this.getMyWalletData();
        },
        watch: {
            userId(val) {
                this.getGroupHistoryList();
            },
        },
        methods: {
            // 前往团详情页
            toGroupDetail(groupId) {
                this.$router.push("/groupdetails?groupId=" + groupId + "&browser=commonWebView&showShareButton=1")
            },
            // 获取用户拼团历史
            async getGroupHistoryList() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchMyHistory(localStorage.getItem("devId"));
                    if (code == 0) {
                        this.groupHistoryList = [];
                        this.groupHistoryList = data;
                        this.filterGroupHistoryData();
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 处理拼团历史列表数据
            filterGroupHistoryData() {
                this.inviteGroupList= []; // 可邀请的列表
                this.noReceiveGroupList= []; // 可领红包的列表
                this.receivedGroupList= []; // 已领红包的列表
                this.overdueGroupList= []; // 已失效的列表
                this.groupHistoryList.filter((item) => {
                    //瓜分总金额
                    item.groupStock = item.groupStock / 100;
                    //团长所获红包最小值
                    item.groupCaptainMin = item.groupCaptainMin / 100;
                    //可邀请的列表
                    if (item.status == '1') {
                        this.inviteGroupList.push(item);
                        if (item.members.length >= 4) {
                            item.members.splice(3);
                        }
                    }
                    //可领红包的列表
                    //已领红包的列表
                    if (item.status == '2') {
                        if (item.captain.rpStat == '0' && this.userId == item.captain.id) {
                            this.noReceiveGroupList.push(item);
                        }
                        item.members.forEach(itemData => {
                            if (itemData.rpStat == '0' && this.userId == itemData.id) {
                                this.noReceiveGroupList.push(item);
                            }
                        });
                        if (item.captain.rpStat == '1' && this.userId == item.captain.id) {
                            this.receivedGroupList.push(item);
                        }
                        item.members.forEach(itemData => {
                            if (itemData.rpStat == '1' && this.userId == itemData.id) {
                                this.receivedGroupList.push(item);
                            }
                        });
                        if (item.members.length >= 4) {
                            item.members.splice(3);
                        }
                    }
                    //已失效的列表
                    if (item.status == '3') {
                        this.overdueGroupList.push(item);
                        if (item.members.length >= 4) {
                            item.members.splice(3);
                        }
                    }

                })
            },
            // 获取我的钱包
            async getMyWalletData() {
                try {
                    const {
                        code,
                        data
                    } = await this.$api.fetchMyWallet(localStorage.getItem("devId"));
                    if (code == 0) {
                        this.todayEarning = data.todayEarning / 100;
                        this.balance = data.balance / 100;
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 前往邀请好友
            toInvite(groupId, code) {
                this.$sensorsEvent.buttonClick('拼团历史页', '', '', '邀请好友', localStorage.getItem("unionId"));
                window.PCJSKit.shareWithoutSurface('嗨！快入团，发福利啦~', '来知科技APP输入团号【' + code + '】领红包！天天红包雨下不停，速来>','https://'+storage.data().SHARE_LINK_DOMAIN+storage.data().SHARE_LINK+'/zt/act/year/202111/wx-wap/index.html#/?groupId=' +groupId,'http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg','', 1);
            },
            // 前往领红包
            toReceive(id) {
                this.$sensorsEvent.buttonClick('拼团历史页', '', '', '领红包', '');
                this.$router.push("/groupdetails?groupId=" + id + "&browser=commonWebView&showShareButton=1")
            },
            // 前往提现页
            toWithdrawalPage() {
                // 神策埋点 按钮事件
                this.$sensorsEvent.buttonClick('拼团历史页', '', '', '立即提现', '');
                this.$router.push("/withdrawal")
            }
        },
        mounted() {
            // 获取用户拼团历史
            this.getGroupHistoryList();
            // 获取我的钱包
            this.getMyWalletData();
            if (window.PCJSKit.platform() == 'iOS') {
                localStorage.setItem("devId",window.PCJSKit.commonSessionId());
            }else{
                localStorage.setItem("devId",window.PCJSKit.devId());
            }
            
            let shareObj = JSON.stringify({
                "title":"喜迎2022，知科技好福利！",
                "desc":"知科技APP每日12时、15时、18时、21时，新年红包雨疯狂开抢>",
                "image":"http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg",
                "url": "https://www1.pconline.com.cn"+storage.data().SHARE_LINK+"/zt/act/year/202111/wx-wap/index.html#/sharepop",
                "wapUrl":"https://www1.pconline.com.cn"+storage.data().SHARE_LINK+"/zt/act/year/202111/wx-wap/index.html#/sharepop"
            });
            this.$utils.setShareApp(shareObj)
            // window.PCJSKit.changeMeta(JSON.stringify(shareObj));
            // 神策埋点 浏览事件
            this.$sensorsEvent.detailView('拼团历史页', '');
            // 监听是否已登录
            // this.$EventBus.$on("loginSuccess",(data)=>{
            //     console.log('参与历史on已登录');
            //     if (data == 'collagehistory') {
            //         // 获取我的钱包
            //         this.getMyWalletData();
            //         // 我的提现记录
            //         this.getMyRecordData();
            //     }
            // })
        }
    };
</script>

<style lang="scss" scoped>
    .collageHistory {
        width: vw(750);
        height: vw(1624);
        background-color: #00092c;

        .content {
            display: inline-block;
            height: vw(1320);
            margin: vw(60) vw(3) 0;
            padding: vw(90) vw(48) vw(100);
            color: #fefffe;
            @include bg("../assets/images/rule_bg.png", left top, 100% 100%, no-repeat);

            .head {
                display: inline-block;
                width: vw(640);
                height: vw(194);
                font-size: vw(26);
                @include bg("../assets/images/ye_bg.png", left top, 100% 100%, no-repeat);

                .tit {
                    display: inline-block;
                    width: vw(540);
                    margin: vw(40) vw(45) 0 vw(50);

                    .lTit {
                        float: left;
                    }

                    .rTit {
                        float: right;
                    }
                }

                .price {
                    display: inline-block;
                    margin: vw(10) 0 0 vw(50);
                    font-size: vw(55);
                    font-weight: 600;

                    span {
                        font-size: vw(30);
                    }
                }

                .btn {
                    display: inline-block;
                    float: right;
                    width: vw(118);
                    height: vw(37);
                    margin: vw(30) vw(55) 0 0;
                    @include bg("../assets/images/collageHistoryBtn.png", left top, 100% 100%, no-repeat);
                }
            }

            .condition {
                // width: vw(750);
                // height: vw(1000);
                position: relative;
                left: 0;
                padding-top: vw(18);

                .conditionItem {
                    // width: vw(750);
                    height: vw(1130);
                    display: flex;
                    flex-direction: column;
                    overflow-y: scroll;

                    &::-webkit-scrollbar {
                        display: none;
                    }

                    .blank {
                        width: vw(41);
                        height: vw(51);
                        line-height: vw(31);
                        margin-left: vw(-22);
                        border-radius: 50%;
                        border: #fff vw(2) solid;
                        display: inline-flex;
                        padding-left: vw(8);
                        color: #0d35a9;
                        font-size: vw(40);
                        // float: revert;
                        background-color: #c7e3ff;
                    }

                    .invite,
                    .receive,
                    .received,
                    .overdue {
                        width: vw(646);
                        height: vw(209);
                        position: relative;
                        margin: 0 0 vw(20) 0;
                        // padding-top: vw(16);
                        white-space: nowrap;
                    }

                    .toGroupDetail {
                        width: vw(480);
                        height: vw(209);
                        position: absolute;
                        margin: 0 0 vw(20) 0;
                        white-space: nowrap;
                        z-index: 5;
                    }

                    .wfq_tip {
                        width: vw(104);
                        height: vw(28);
                        position: relative;
                        top: 0;
                        left: 0;
                        @include bg("../assets/images/wfq_tip.png", left top, 100% 100%, no-repeat);
                    }

                    .wcy_tip {
                        width: vw(104);
                        height: vw(28);
                        position: relative;
                        top: 0;
                        left: 0;
                        @include bg("../assets/images/wcy_tip.png", left top, 100% 100%, no-repeat);

                    }

                    .tzfPrice {
                        height: vw(31);
                        line-height: vw(33);
                        position: absolute;
                        top: vw(32);
                        left: vw(185);
                        padding: vw(1) vw(14) vw(1) vw(15);
                        font-size: vw(24);
                        border-radius: vw(20);
                        background-color: #f85e0d;
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
                        @include bg("../assets/images/price_bg.png", left top, 100% 100%, no-repeat);

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
                            @include bg("../assets/images/priceN_bg.png", left top, 100% 100%, no-repeat);
                        }
                    }

                    .tit {
                        display: inline;
                        position: relative;
                        top: vw(-85);
                        left: vw(190);
                        font-size: vw(32);
                        font-weight: 600;
                        color: #0d35a9;
                    }

                    .pic {
                        display: table-caption;
                        position: relative;
                        top: vw(-80);
                        left: vw(201);

                        img {
                            width: vw(51);
                            height: vw(51);
                            margin-left: vw(-22);
                            border-radius: 50%;
                            border: #fff vw(2) solid;
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
                        left: vw(494);
                        width: vw(130);
                        height: vw(51);
                    }

                    .invite {
                        @include bg("../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);

                        .price {}

                        .tit {
                            color: #0d35a9;
                        }

                        .pic {}

                        .btn {
                            top: vw(-190);
                            @include bg("../assets/images/invite_btn.png", left top, 100% 100%, no-repeat);
                        }

                        .tips {
                            position: relative;
                            top: vw(-180);
                            left: vw(498);
                            width: vw(108);
                            height: vw(20);
                            font-size: vw(24);
                            color: #747474;
                        }
                    }

                    .receive,
                    .received {
                        position: relative;
                        @include bg("../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);

                        &::after {
                            content: "";
                            width: vw(83);
                            height: vw(83);
                            position: absolute;
                            top: 0;
                            right: 0;
                            @include bg("../assets/images/receive_angle.png", left top, 100% 100%, no-repeat)
                        }

                        .btn {
                            top: vw(-170);
                            @include bg("../assets/images/receive_btn.png", left top, 100% 100%, no-repeat);
                        }
                    }

                    .received .btn {
                        @include bg("../assets/images/overdueLQ_btn.png", left top, 100% 100%, no-repeat);
                    }

                    .overdue {
                        @include bg("../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);

                        .pic {
                            .angle {
                                @include bg("../assets/images/inandot_bg.png", left top, 100% 100%, no-repeat);
                            }
                        }

                        .btn {
                            top: vw(-170);
                        }

                        .end {
                            @include bg("../assets/images/overdueJS_btn.png", left top, 100% 100%, no-repeat);
                        }

                    }

                    :last-child {
                        margin-bottom: 0;
                    }
                }
            }
        }
    }
</style>