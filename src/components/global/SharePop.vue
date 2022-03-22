<template>
    <div class="m-share" id="JshareBox" v-if="showSharePop">
        <div class="shareImg" v-if="showShareImgPop">
            <div class="close" @click="closeShareImgPop()"></div>
            <img :src="shareImgSrc" />
            <div class="save-tips">长按保存进行分享↑</div>
        </div>
        <div class="shareCover" id="shareCover">
            <div class="close" @click="closeSharePop()"></div>
            <div class="time">有效期至 {{endTimeForShare}}</div>
            <div class="tit">
                <div class="tTit">送您一个大红包</div>
                <div class="bTit">
                    <span class="price">{{groupStock}}</span>元
                </div>
            </div>
            <div class="qrCode-bg">
                <vue-qr class="qrCode" :text="ops.text" :logoSrc="ops.logoSrc" :binarize="ops.binarize"
                    :binarizeThreshold="ops.binarizeThreshold" :colorDark="ops.colorDark" :autoColor="ops.autoColor"
                    :size="ops.size" :dotScale="ops.dotScale" :bgcale="ops.bgcale" :bgSrc="ops.bgSrc" qid="itxst.com"
                    :margin="0" :colorLight="ops.colorLight">
                </vue-qr>
            </div>
            <div class="tip1">扫码即可参与</div>
            <div class="th">团号:{{groupId}}</div>
            <div class="tip2">打开知科技活动页</div>
            <div class="tip3">输入团号即可瓜分红包</div>
        </div>
        <div class="shareCon" v-if="!showShareImgPop">
            <p class="pTit">分享到</p>
            <div id="pcShare" class="pop-share_other">
                <span class="pcShare sharePic" @click="sharePic()"></span>
                <span class="pcShare shareLink" @click="copyLink()"></span>
                <a data-app="weixin" class="pcShare weixin" @click="toWeixin()"></a>
                <span class="more"></span>
            </div>
        </div>
    </div>
</template>

<script>
    import html2canvas from "html2canvas"
    import VueQr from 'vue-qr';
    import storage from '@/mixin/storage.js'
    export default {
        name: "SharePop",
        props: ['groupId', 'groupStock', 'groupCode'],
        components: {
            VueQr
        },
        data() {
            return {
                showShareImgPop: false, //是否显示分享海报
                showSharePop: false, // 是否显示分享Pop
                shareImgSrc: '', //分享海报
                ops: {
                    //二维码内容
                    text: 'https://'+storage.data().SHARE_LINK_DOMAIN+storage.data().SHARE_LINK+'/zt/act/year/202111/wx-wap/index.html#/?groupId=' +
                    this.groupCode + '&appShare=1',
                    //logo图标
                    logoSrc: 'https://www1.pconline.com.cn/miniapp/weixin/pconline/coin/images/4UV2GV.png',
                    //autoColor未false,二维码数据点的颜色
                    colorDark: '#007bff',
                    //二维码数据点的速率比，默认未0.35
                    dotScale: 1,
                    //背景图的速率比
                    bgcale: 1,
                    colorLight: '#fff',
                    //二维码背景图
                    // bgSrc: 'http://192.168.2.103:8080/bg0.png',
                    //二维码数据点的颜色是否自动生成颜色
                    autoColor: true,
                    //二值化
                    binarize: false,
                    //二值化值
                    binarizeThreshold: 130
                },
                endTimeForShare: '', //结束标准时间
                nowServerTime: '',
                endtime: '',
            };
        },
        watch: {},
        created() {},
        methods: {
            // 关闭分享海报弹窗
            closeShareImgPop() {
                this.showShareImgPop = false
                this.showSharePop = false
            },
            // 关闭分享弹窗
            closeSharePop() {
                this.showSharePop = false
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
                        this.endtime = new Date(new Date(this.nowServerTime).toLocaleDateString()).getTime() + 86400000;
                        this.endTimeForShare = this.timestampToTime(this.endtime - 1000);
                    }
                } catch (error) {
                    console.error(error);
                } finally {}
            },
            // 生成分享图
            sharePic() {
                let that = this
                this.showShareImgPop = true
                // var pic1 = document.getElementsByClassName("shareCover") //要生成图片的标签
                // html2canvas(pic1[0],{backgroundColor: 'transparent'}).then(function (canvas) { //找到pic元素时，生成canvas元素。
                //     var dataURL = canvas.toDataURL("image/png") // 获取canvas对应的base64编码
                //     that.shareImgSrc = dataURL
                // });
                this.$sensorsEvent.buttonClick('组团页', '邀请好友弹窗', '分享方式', '生成分享图', localStorage.getItem("unionId"));
                let targetDom = document.getElementById("shareCover");
                var width = targetDom.offsetWidth; //dom宽
                var height = targetDom.offsetHeight + 5; //dom高
                // 解决图片模糊
                var scale = 0.65; //放大倍数
                var canvas = document.createElement('canvas');
                canvas.width = width * 2;
                canvas.height = height * 2;
                canvas.style.width = width/2 + 'px';
                canvas.style.height = height/2 + 'px';
                var context = canvas.getContext('2d');
                context.scale(scale, scale);
                //设置context位置，值为相对于视窗的偏移量负值，让图片复位(解决偏移的重点)
                var rect = targetDom.getBoundingClientRect(); //获取元素相对于视察的偏移量
                // context.translate(-rect.left, -rect.top);
                context.fillStyle = "#d72321";
                var opts = {
                    canvas: canvas,
                    backgroundColor: null,
                    useCORS: true, // 【重要】开启跨域配置
                    scrollY: 0, // 纵向偏移量 写死0 可以避免滚动造成偶尔偏移的现象
                };
                html2canvas(targetDom, opts).then(canvas => {
                    // 使用toDataURL方法将图像转换被base64编码的URL字符串
                    that.shareImgSrc = canvas.toDataURL();
                    // this.upload_quick_base64(src)
                })
            },
            // 复制链接
            copyLink() {
                this.$sensorsEvent.buttonClick('组团页', '邀请好友弹窗', '分享方式', '复制链接', localStorage.getItem("unionId"));
                //创建一个input元素
                let input = document.createElement('input')
                //给input的内容复制
                input.value = "https://"+storage.data().SHARE_LINK_DOMAIN+storage.data().SHARE_LINK+"/zt/act/year/202111/wx-wap/index.html#/?groupId=" +
                    this.groupCode + "&appShare=1"
                // 在body里面插入这个元素
                document.body.appendChild(input)
                // 选中input里面内容
                input.select()
                //执行document里面的复制方法
                document.execCommand("Copy")
                // 复制之后移除这个元素
                document.body.removeChild(input)
                return this.$toast("复制链接成功");
            },
            // 分享到微信
            toWeixin() {
                this.$sensorsEvent.buttonClick('组团页', '邀请好友弹窗', '分享方式', '邀请微信好友', localStorage.getItem("unionId"));
                window.PCJSKit.shareWithoutSurface('嗨！快入团，发福利啦~', '来知科技APP输入团号【' + this.groupId + '】领红包！天天红包雨下不停，速来>',
                    'https://'+storage.data().SHARE_LINK_DOMAIN+storage.data().SHARE_LINK+'/zt/act/year/202111/wx-wap/index.html#/?groupId=' + this
                    .groupCode,
                    'http://img.pconline.com.cn/images/upload/upc/tx/pccoin/2112/06/c0/286488481_1638775495446.jpg',
                    '', 1);
            },
            // 时间戳转标准时间
            timestampToTime(timestamp) {
                var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
                var Y = date.getFullYear() + '/';
                var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
                var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
                var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
                var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
                return Y + M + D + h + m;
            },
        },
        mounted() {
            // 监听弹窗是否显示
            this.$EventBus.$off("showSharePop");
            this.$EventBus.$on("showSharePop", () => {
                this.showSharePop = true;
                this.getServerTime();
                // 神策埋点 弹窗事件
                this.$sensorsEvent.popup('组团页', '邀请好友弹窗', '分享方式');
            })
        }
    };
</script>

<style lang="scss" scoped>
    .m-share {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 999;

        .shareImg {
            width: 100%;
            height: 100%;

            .close {
                width: vw(63);
                height: vw(61);
                position: relative;
                float: right;
                top: 5%;
                right: vw(40);
                @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
            }

            img {
                width: vw(555);
                height: vw(850);
                position: relative;
                top: 42%;
                left: 50%;
                transform: translate(-50%, -50%);
                -webkit-touch-callout:default;
            }

            .save-tips {
                width: 100%;
                text-align: center;
                font-size: vw(48);
                color: #f0e07e;
                font-weight: 700;
                position: absolute;
                left: 0;
                bottom: 24%;
                transform: translateY(-50%);
            }

            @media screen and (max-height: 770px) {
                .save-tips{
                    bottom: 18%;
                }
            }

            @media screen and (max-height: 740px) {
                .save-tips{
                    bottom: 16%;
                }
            }

            @media screen and (max-height: 630px) {
                .save-tips{
                    bottom: 14%;
                }
            }
            
            @media screen and (max-height: 590px) {
                .save-tips{
                    bottom: 8%;
                }
            }

            @media screen and (max-height: 525px) {
                .save-tips{
                    bottom: 4%;
                }
            }

            @media screen and (max-height: 495px) {
                .save-tips{
                    bottom: 2%;
                }
            }

            @media screen and (max-height: 425px) {
                .save-tips{
                    bottom: 2%;
                }
            }
        }

        .shareCover {
            width: vw(455);
            height: vw(671);
            min-height: vw(671);
            margin: 20% auto;
            text-align: center;
            @include bg("../../assets/images/sharePopCover_bg.png", left top, 100% 100%, no-repeat);

            .close {
                width: vw(63);
                height: vw(61);
                position: relative;
                top: vw(-60);
                left: vw(450);
                @include bg("../../assets/images/closeBtn.png", left top, 100% 100%, no-repeat);
            }

            .time {
                // position: relative;
                // top: vw(40);
                margin: vw(0) auto 0;
                display: inline-block;
                font-size: vw(24);
                color: #90091b;
            }

            .tit {
                // position: relative;
                // top: vw(50);
                margin: vw(0) auto 0;
                font-size: vw(40);
                font-weight: 600;

                .tTit,
                .bTit,
                .price {
                    color: #f0e07e;
                }

                .bTit {
                    margin-top: vw(-20);
                    font-size: vw(50);
                }

                .price {
                    margin: 0 vw(7) 0 0;
                    font-size: vw(90);
                }
            }

            .qrCode-bg {
                width: vw(200);
                height: vw(200);
                margin: vw(0) auto;
                padding: vw(1);
                position: relative;
                @include bg("../../assets/images/qrCode_bg.png", left top, 100% 100%, no-repeat);

                .qrCode {
                    width: vw(188);
                    height: vw(188);
                    margin: 0 auto;
                    display: inline-block;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);

                    img {
                        width: vw(188);
                        height: vw(188);
                    }
                }
            }

            .tip1 {
                margin: vw(10) auto 0;
                font-size: vw(24);
                color: #fff;
            }

            .th {
                width: vw(229);
                height: vw(50);
                line-height: vw(50);
                margin: vw(12) auto 0;
                color: #fff;
                font-size: vw(24);
                text-align: center;
                @include bg("../../assets/images/gNum_bg.png", left top, 100% 100%, no-repeat);
            }

            .tip2 {
                width: vw(280);
                margin: vw(15) auto 0;
                font-size: vw(24);
                font-weight: 600;
                color: #90091b;
            }

            .tip3 {
                width: vw(280);
                margin: 0 auto 0;
                font-size: vw(24);
                font-weight: 600;
                color: #90091b;
            }
        }
        
            
        @media screen and (max-height: 590px) {
            .shareCover{
                margin: 10% auto;
            }
        }
        
        .shareCon {
            width: 100%;
            background: #1d4bce;
            border-radius: vw(20) vw(20) 0 0;
            position: fixed;
            bottom: 0;
            left: 0;
            text-align: center;
            padding: 10px 0 0;

            .sharePic,
            .shareLink,
            .weixin {
                display: inline-block;
                width: vw(104);
                height: vw(150);
                margin: 0 vw(50) vw(60);
            }

            .sharePic {
                @include bg("../../assets/images/sharePicBtn.png", left top, 100% 100%, no-repeat)
            }

            .shareLink {
                @include bg("../../assets/images/shareLinkBtn.png", left top, 100% 100%, no-repeat)
            }

            .weixin {
                @include bg("../../assets/images/shareWXBtn.png", left top, 100% 100%, no-repeat)
            }
        }

        .pTit {
            padding-bottom: 12px;
            color: #fff;
            text-align: left;
            margin-left: vw(40);
            font-size: vw(26);
        }
    }
</style>