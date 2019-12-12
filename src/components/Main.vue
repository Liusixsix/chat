<template>
  <div class="App">
    <!-- <div class="header">
      <div class="header-bottom">
        <marquee class="marquee">客服热线 ：4005678456</marquee>
      </div>
    </div>-->

    <div class="content" ref="xwBody" :style="{bottom:footerH+'rem'}" @scroll="onScroll">
      <!-- <van-loading size="24px" vertical v-if="isLoading">查看更多...</van-loading> -->
      <!-- <van-pull-refresh v-model="isLoading" @refresh="onRefresh"> -->
      <div class="chat-wrap">
        <List :records="filterrecords"></List>
      </div>
      <!-- </van-pull-refresh> -->
    </div>
    <div class="footer-wrap" id="chatfooter" :style="{height:footerH+'rem'}" ref="footer">
      <!-- 底部输入框 -->

      <div class="footer">
        <div class="input-wrap">
          <van-field
            type="text"
            ref="input"
            v-model="value"
            placeholder
            @focus="inputFocus"
            @blur="inputBlur"
          ></van-field>
        </div>
        <div class="footer-tool">
          <div @touchstart="showExps">
            <img v-show="!isEXps" src="../assets/img/Expression.png" alt />
            <img v-show="isEXps" src="../assets/img/consulting_keyboard.png" alt />
          </div>
          <div>
            <van-uploader v-show="!isBtn" :after-read="afterRead" accept="image/*">
              <img src="../assets/img/More.png" alt />
            </van-uploader>

            <van-button v-show="isBtn" size="mini" class="Send-btn" @click="Sendout">发送</van-button>
          </div>
        </div>
      </div>

      <!-- 表情 -->
      <!-- <transition name="slide-fade"> -->
      <ul class="EXPS-wrap" v-show="isEXps">
        <li v-for="(item,index) in EXPS" :key="index" class="exps-item">
          <img :src="item.url" alt @click="clickEXPS($event,item.url)" />
        </li>
      </ul>
      <!-- </transition> -->
      <div
        id="k"
        v-show="ios11&&footerShow"
        class="kschatphone_popup_footer"
        style="height: 1.2rem; border: 0px;"
      ></div>
    </div>
  </div>
</template>

<script>
import EXPS from "../static/emojis.json";
import axios from "axios";
import List from "./list";
import api from "../http";
import moment from "moment";
import { Toast } from "vant";
import Exif from "exif-js";
import { setInterval } from "timers";
import { async } from "q";
const baseURL = "https://icon.sleep365.cn/";
let timer = null;
let interval = null;
// （0文字，1图片，6表情）
export default {
  name: "mains",
  components: {
    List
  },
  data() {
    return {
      h: "",
      value: "",
      id: "",
      footerH: 1.11,
      EXPS, //表情图片列表
      isEXps: false, //表情列表是否展开
      isBtn: false, //是否显示发送按钮
      records: [], //聊天记录
      count: 0,
      isLoading: false,
      isScroll: true, //滚动顶部是否还有记录
      timer: null, // 定时器
      isFor: true, // 是否接着循环
      footerShow: false,
      ios11: false
    };
  },
  watch: {
    value: {
      handler: function(newval) {
        var u = navigator.userAgent;
        var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1; //android终端
        if (isAndroid) {
          this.isBtn = true;
          return;
        }
        if (newval.trim()) {
          this.isBtn = true;
        } else {
          this.isBtn = false;
        }
      },

      immediate: true
    },
    isEXps: {
      handler: function(isEXps) {
        if (isEXps) {
          this.footerH = 1.11 + 3;
        } else {
          this.footerH = 1.11;
        }
      }
    }
  },
  computed: {
    filterrecords() {
      return this.records.map(item => {
        if (item.state === 4 && item.sort === 1) {
          item.type = 21; //用户撤回
        } else if (item.state === 4 && item.sort === 2) {
          item.type = 20; //客服撤回
        }
        return item;
      });
    }
  },
  methods: {
    // 点击表情 是否显示表情列表
    showExps() {
      this.isEXps = !this.isEXps;
      this.setIpuBlur();
      this.scrollToBottom();
    },
    // 点击某个表情发送
    async clickEXPS(e, src) {
      // console.log("exp");
      this.news(6, src);
      this.scrollToBottom();
    },

    // 输入框聚焦事件
    inputFocus() {
      this.isEXps = false;
      if (this.ios11) {
        this.footerShow = true;
        this.footerH = 1.1 + 1.2;
      }
    },

    // 输入框失焦事件
    inputBlur() {
      if (this.ios11) {
        this.footerShow = true;
        this.footerH = 1.1;
      }
    },
   
    //主动让input失去焦点 消除键盘
    setIpuBlur() {
      this.$refs.input.blur();
    },
    // 发送按钮
    async Sendout() {
      if (!this.value.trim()) return;
      await this.news(0, this.value);
      this.value = "";
    },
    // 发消息 自己往数组里追加
    async news(type, content) {
      let news = await api.sendNews({ type, content }).then(res => res);
      this.records = [...this.records, news];
      setTimeout(() => {
        this.scrollToBottom();
      }, 200);
    },
    // 上传图片
    async afterRead(file) {
      const { name: fileName } = file.file;
      let prefix = moment(file.lastModified)
        .format("HHmmss")
        .toString();
      let newfileName = prefix + fileName;
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };

      let Orientation;
      let self = this;
      //去获取拍照时的信息，解决拍出来的照片旋转问题
      Exif.getData(file.file, function() {
        Orientation = Exif.getTag(this, "Orientation");
      });

      // 看支持不支持FileReader
      if (!file || !window.FileReader) return;
      if (/^image/.test(file.file.type)) {
        // 创建一个reader
        let reader = new FileReader();
        // 将图片2将转成 base64 格式
        reader.readAsDataURL(file.file);
        // 读取成功后的回调
        reader.onloadend = async function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          // 大于500k 压缩
          if (result.length <= 500 * 1024) {
            // console.log('未压缩')
            const formdata = new FormData();
            formdata.append("file", file.file);
            formdata.append("key", newfileName);
            // console.log(data);
            try {
              let uploadToken = await api
                .getUploadToken({ fileName: newfileName })
                .then(res => res.uploadToken);
              formdata.append("token", uploadToken);
              Toast.loading({
                duration: 0,
                message: "发送中...",
                forbidClick: true
              });
              let imgName = await axios
                .post("https://upload.qiniup.com", formdata, config)
                .then(res => res.key);
              self.news(1, `${baseURL + imgName}`);
              Toast.clear();
            } catch (err) {
              Toast.clear();
              self.$toast("发送失败");
            }
          } else {
            img.onload = async function() {
              // console.log('压缩')
              let data = self.compress(img, Orientation);
              const formdata = new FormData();
              let files = self.dataURLtoFile(data, fileName);
              formdata.append("file", files);
              formdata.append("key", newfileName);
              // console.log(data);
              try {
                let uploadToken = await api
                  .getUploadToken({ fileName: newfileName })
                  .then(res => res.uploadToken);
                formdata.append("token", uploadToken);
                Toast.loading({
                  duration: 0,
                  message: "发送中...",
                  forbidClick: true
                });
                let imgName = await axios
                  .post("https://upload.qiniup.com", formdata, config)
                  .then(res => res.key);
                self.news(1, `${baseURL + imgName}`);
                Toast.clear();
              } catch (err) {
                Toast.clear();
                self.$toast("发送失败");
              }
            };
          }
        };
      }

      // this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        let Dom = this.$refs.xwBody;
        if (Dom) {
          Dom.scrollTop = Dom.scrollHeight;
        }
      });
    },
    // 接收新消息
    Messages() {
      this.isFor = false;
      api.Messages().then(news => {
        this.isFor = true;
        if (news.length) {
          news.forEach(item => {
            // 为4 撤回  4&&2 客服的撤回
            if (item.state === 4 && item.sort === 2) {
              // 将列表里数据换为撤回状态
              let index = this.records.findIndex(items => {
                return items.id === item.id;
              });
              if (index >= 0) {
                let replaceItem = this.records[index];
                replaceItem.type = 20;
                this.records.splice(index, 1, replaceItem);
              }
            } else if (item.state === 2 && item.sort === 1) {
              // 用户删除的消息
              let index = this.records.findIndex(items => {
                return items.id === item.id;
              });
              if (index >= 0) {
                let replaceItem = this.records[index];
                replaceItem.type = 22;
                this.records.splice(index, 1, replaceItem);
              }
            } else if (item.state === 0 && item.sort === 2) {
              this.records.push(item);
            }
          });
          this.scrollToBottom();
        }
      });
    },
    // 用来修改数组的里状态 比如撤回删除 供子组件调用
    changeRecods(id, type) {
      // type 20 客服撤回 type21 用户撤回
      const index = this.records.findIndex(item => {
        return item.id === id;
      });
      let replaceItem = this.records[index];
      replaceItem.type = type;
      this.records.splice(index, 1, replaceItem);
    },
    // 删除消息
    delMsg(id) {
      const index = this.records.findIndex(item => {
        return item.id === id;
      });
      this.records.splice(index, 1);
    },
    // 查看更多历史消息时调用
    getHistory() {
      return api.getHistory({ id: this.records[0].id });
    },
    // 进入页面获取消息
    async init() {
      let res = await api.getHistory();
      let data = await api.Messages();
      this.records = [...res.list, ...data];
      // console.log(document.readyState);
      setTimeout(() => {
        this.scrollToBottom();
      }, 500);
      timer = setInterval(() => {
        if (this.isFor) {
          this.Messages();
        }
      }, 3000);
    },
    // 事件节流
    throttle(func, delay) {
      var prev = Date.now();
      return function() {
        var context = this;
        var args = arguments;
        var now = Date.now();
        if (now - prev >= delay) {
          func.apply(context, args);
          prev = Date.now();
        }
      };
    },
    // 滚动事件 加载更多
    onScroll(e) {
      if (e.srcElement.scrollTop === 0 && this.isScroll) {
        // 到达顶部时的滚动高度
        let LastScrH = e.srcElement.scrollHeight;
        this.isLoading = false;
        Toast.loading({
          duration: 0,
          message: "加载更多中...",
          forbidClick: true
        });
        this.getHistory().then(res => {
          if (res.list.length) {
            this.records = [...res.list, ...this.records];
            this.$nextTick(() => {
              let Dom = this.$refs.xwBody;
              let h = Dom.scrollHeight - LastScrH;
              Dom.scrollTop = h;
              Toast.clear();
              setTimeout(() => {
                this.isLoading = true;
              }, 200);
            });
          } else {
            this.isScroll = false;
            Toast.clear();
          }
        });
      }
    },
    dataURLtoFile(dataurl, filename) {
      // 将base64转换为file文件
      let arr = dataurl.split(",");
      let mime = arr[0].match(/:(.*?);/)[1];
      let bstr = atob(arr[1]);
      let n = bstr.length;
      let u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    // 压缩图片
    compress(img, Orientation) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      //瓦片canvas
      let tCanvas = document.createElement("canvas");
      let tctx = tCanvas.getContext("2d");
      // let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      let ratio;
      if ((ratio = (width * height) / 6000000) > 1) {
        // console.log("大于400万像素");
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
      //    铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      let count;
      if ((count = (width * height) / 1000000) > 1) {
        // console.log("超过100W像素");
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //      计算每块瓦片的宽和高
        let nw = ~~(width / count);
        let nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (let i = 0; i < count; i++) {
          for (let j = 0; j < count; j++) {
            tctx.drawImage(
              img,
              i * nw * ratio,
              j * nh * ratio,
              nw * ratio,
              nh * ratio,
              0,
              0,
              nw,
              nh
            );
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      console.log(Orientation);
      //修复ios上传图片的时候 被旋转的问题
      if (Orientation != "" && Orientation != 1) {
        switch (Orientation) {
          case 6: //需要顺时针（向左）90度旋转
            this.rotateImg(img, "left", canvas);
            break;
          case 8: //需要逆时针（向右）90度旋转
            this.rotateImg(img, "right", canvas);
            break;
          case 3: //需要180度旋转
            this.rotateImg(img, "right", canvas); //转两次
            this.rotateImg(img, "right", canvas);
            break;
        }
      }
      //进行最小压缩
      let ndata = canvas.toDataURL("image/jpeg", 0.5);
      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    },
    // 旋转图片
    rotateImg(img, direction, canvas) {
      //最小与最大旋转方向，图片旋转4次后回到原方向
      const min_step = 0;
      const max_step = 3;
      if (img == null) return;
      //img的高度和宽度不能在img元素隐藏后获取，否则会出错
      let height = img.height;
      let width = img.width;
      let step = 2;
      if (step == null) {
        step = min_step;
      }
      if (direction == "right") {
        step++;
        //旋转到原位置，即超过最大值
        step > max_step && (step = min_step);
      } else {
        step--;
        step < min_step && (step = max_step);
      }
      //旋转角度以弧度值为参数
      let degree = (step * 90 * Math.PI) / 180;
      let ctx = canvas.getContext("2d");
      switch (step) {
        case 0:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0);
          break;
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0);
          break;
      }
    },
    uaIos11() {
      try {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.indexOf("like mac os x") > 0) {
          var reg = /os [\d._]*/gi;
          var verinfo = ua.match(reg);
          var version = (verinfo + "")
            .replace(/[^0-9|_.]/gi, "")
            .replace(/_/gi, ".");
          var arr = version.split(".");
          if (arr[0] > 11 && arr[1] > 0) {
            this.ios11 = false;
          } else {
            this.ios11 = true;
          }
          // alert(this.ios11)
        }
      } catch (err) {}
    }
  },
  beforeDestroy() {
    clearInterval(timer);
  },
  async mounted() {
    this.uaIos11();
    this.init();
  }
};
</script>


<style  lang='scss' scoped>
.App {
  // display: flex;
  // flex-direction: column;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  // height: 100%;
  width: 100%;
  overflow-x: hidden;
  // position: relative;
  height: 100vh;
}
.header {
  // font-size: 0.36rem;
  text-align: center;
  // position: absolute;
  position: fixed;
  // position: absolute;
  top: 0;
  width: 100%;
  height: 0.8rem;
  .header-bottom {
    background-color: rgb(221, 125, 51);
    // background: red;
    // padding: 0.18rem 0;
    color: #fff;
    height: 0.8rem;
    box-sizing: border-box;
    line-height: 0.8rem;
    .marquee {
      font-size: 0.3rem;
      color: #fff;
    }
  }
}
.content {
  padding: 0.42rem 0.35rem 0;
  box-sizing: border-box;
  font-size: 0.3rem;
  overflow-y: auto;
  // position: absolute;
  position: fixed;
  // position: absolute;
  // top: 0.8rem;
  top: 0;
  width: 100%;
  background: #fff;
  -webkit-overflow-scrolling: touch;
  img {
    pointer-events: none;
  }
  .chat-wrap {
    .chat-msg-wrap {
      display: flex;
      align-items: center;
      margin-bottom: 0.3rem;
      // max-width: 80%;
      &-right {
        justify-content: flex-end;
      }
      .chat-avantar-wrap {
        // -webkit-touch-callout: none;
        width: 0.72rem;
        height: 0.72rem;
        img {
          width: 0.72rem;
          height: 0.72rem;
          border-radius: 50%;
        }
      }
      .chat-avantar-left {
        margin-right: 0.25rem;
      }
      .chat-avantar-right {
        margin-left: 0.25rem;
      }
      .chat-msg {
        padding: 0.18rem 0.29rem;
        box-sizing: border-box;
        max-width: 65%;
        // -webkit-touch-callout: none;
        span {
          line-height: 1.3em;
          // -webkit-touch-callout: none;
        }
      }
      .Other {
        background-color: #577ef7;
        color: #ffffff;
        font-size: 0.3rem;
        letter-spacing: 0.03rem;
        border-top-left-radius: 0.02rem 0.02rem;
        border-top-right-radius: 0.15rem 0.15rem;
        border-bottom-right-radius: 0.15rem 0.15rem;
        border-bottom-left-radius: 0.15rem 0.15rem;
      }
      .My {
        background-color: #f5f5f5;
        color: #656565;
        font-size: 0.3rem;
        letter-spacing: 0.03rem;
        border-top-left-radius: 0.15rem 0.15rem;
        border-top-right-radius: 0.02rem 0.02rem;
        border-bottom-right-radius: 0.15rem 0.15rem;
        border-bottom-left-radius: 0.15rem 0.15rem;
      }
    }
  }
}
.footer-wrap {
  background-color: #f6f6f6;
  min-height: 1.11rem;
  position: fixed;
  // position: absolute;
  width: 100%;
  bottom: 0;
  .footer {
    background-color: #f6f6f6;
    height: 1.11rem;
    font-size: 0.36rem;
    padding: 0.16rem 0.31rem;
    padding-right: 0;
    box-sizing: border-box;
    display: flex;
    .input-wrap {
      height: 100%;
      width: 73%;
      // position: relative;
      .van-field {
        height: 100%;
        width: 100%;
      }
    }
    .footer-tool {
      display: flex;
      flex: 1;
      align-items: center;
      // justify-content: center;
      & > div {
        width: 0.55rem;
        img {
          width: 0.55rem;
        }
      }
      & > div:first-child {
        margin-left: 0.17rem;
      }
      & > div:last-child {
        flex: 1;
        text-align: center;
      }
      .Send-btn {
        height: 0.58rem;
        line-height: 0.58rem;
        background-color: #5b8aff;
        color: #fff;
        border-radius: 0.1rem;
        font-size: 0.25rem;
        // line-height: .54rem;
      }
    }
  }
  .EXPS-wrap {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: 3rem;
    background-color: #f6f6f6;
    .exps-item {
      // border: 1px solid red;
      box-sizing: border-box;
      width: 20%;
      height: 0.5rem;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.09rem;
      img {
        height: 0.5rem;
        width: 0.5rem;
      }
    }
  }
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(0.5rem);
  opacity: 0;
}
</style>
