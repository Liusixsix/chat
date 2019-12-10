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
    <div class="footer-wrap" :style="{height:footerH+'rem'}" ref="footer">
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
const baseURL = "https://icon.sleep365.cn/";
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
      timer: null // 定时器
    };
  },
  watch: {
    value: {
      handler: function(newval) {
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
      this.$nextTick(() => {
        setTimeout(() => {
          // this.$refs.input.scrollIntoView(true)
        }, 200);
        //  document.activeElement.scrollIntoViewIfNeeded()
        // this.$toast(Dom.clientHeight);
      });

      // setTimeout(() => {
      //   let Dom = this.$refs.xwBody;
      //   let h = Dom.scrollHeight;
      //   Dom.scrollTop = h;
      // }, 300);
    },
    // 输入框失焦事件
    inputBlur() {
      // this.$toast("失去焦点");
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
      // const or = await this.getImageTag(file.file, "Orientation");
      // if (or) {   
      //     const self = this;
      //   // 使用FileReader读取文件流，file为上传的文件流
      //   const reader = new FileReader();
      //   reader.readAsDataURL(file.file);
      //   /* eslint-disable func-names */
      //   // 箭头函数会改变this，所以这里不能用肩头函数
      //   reader.onloadend = function() {
      //     // this.result就是转化后的结果
      //     const result = this.result;
      //     // 将base64添加到图片标签上
      //     const img = new Image();
      //     img.src = result;
        
      //     img.onload = function() {
      //       // 获取旋转后的图片
          
      //       const data = self.getRotateImg(img, or);
      //         console.log(data)
      //       // 如果上传接口不支持base64，则这里需要将base64转为文档流
      //       const f = self.dataURLtoFile(data);
      //       // 调用接口，上传图片
      //       console.log(f);
      //     };
      //   };
      // }

      const { name: fileName } = file.file;
      let prefix = moment(file.lastModified)
        .format("HHmmss")
        .toString();
      let newfileName = prefix + fileName;
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      const formdata = new FormData();
      formdata.append("file", file.file);
      formdata.append("key", newfileName);
      try {
        let uploadToken = await api
          .getUploadToken({ fileName: newfileName })
          .then(res => res.uploadToken);
        formdata.append("token", uploadToken);
        Toast.loading({
          message: "发送中...",
          forbidClick: true
        });
        let imgName = await axios
          .post("https://upload.qiniup.com", formdata, config)
          .then(res => res.key);
        this.news(1, `${baseURL + imgName}`);
      } catch (err) {
        console.log(err);
        this.$toast("发送失败");
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
      api.Messages().then(news => {
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
      setInterval(() => {
        this.Messages();
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
    onScroll(e) {
      if (e.srcElement.scrollTop === 0 && this.isScroll) {
        // 到达顶部时的滚动高度
        let LastScrH = e.srcElement.scrollHeight;
        this.isLoading = false;
        this.getHistory().then(res => {
          if (res.list.length) {
            this.records = [...res.list, ...this.records];
            this.$nextTick(() => {
              let Dom = this.$refs.xwBody;
              let h = Dom.scrollHeight - LastScrH;
              Dom.scrollTop = h;
              setTimeout(() => {
                this.isLoading = true;
              }, 200);
            });
          } else {
            this.isScroll = false;
          }
        });
      }
    },
    getImageTag(file, tag) {
      if (!file) return 0;
      return new Promise((resolve, reject) => {
        Exif.getData(file, function() {
          const o = Exif.getTag(this, tag);
          resolve(o);
        });
      });
    },
    getRotateImg(img, or) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // 图片原始大小
      const width = img.width;
      const height = img.height;
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      switch (or) {
        case 6: // 顺时针旋转90度
           this.rotateImg(img, "right", canvas);
          break;
        case 8: // 逆时针旋转90度
          this.rotateImg(img, "left", canvas);
          break;
        case 3: // 顺时针旋转180度
          this.rotateImg(img, "right", canvas, 2);
          break;
        default:
          break;
      }
    },
    rotateImg(img, dir = "right", canvas, s = 1) {
      const MIN_STEP = 0;
      const MAX_STEP = 3;

      const width = canvas.width || img.width;
      const height = canvas.height || img.height;
      let step = 0;

      if (dir === "right") {
        step += s;
        step > MAX_STEP && (step = MIN_STEP);
      } else {
        step -= s;
        step < MIN_STEP && (step = MAX_STEP);
      }

      const degree = (step * 90 * Math.PI) / 180;
      const ctx = canvas.getContext("2d");

      switch (step) {
        case 1:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, 0, -height, width, height);
          break;
        case 2:
          canvas.width = width;
          canvas.height = height;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, -height, width, height);
          break;
        case 3:
          canvas.width = height;
          canvas.height = width;
          ctx.rotate(degree);
          ctx.drawImage(img, -width, 0, width, height);
          break;
        default:
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          break;
      }
    },
    dataURLtoFile(dataUrl) {
      const filename = `img${Date.now()}`;
      const arr = dataUrl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    }
  },

  created() {},
  async mounted() {
    this.$nextTick(() => {});
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
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  // position: relative;
  // min-height: 100vh;
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
      margin-bottom: 0.08rem;
      img {
        height: 0.5rem;
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
