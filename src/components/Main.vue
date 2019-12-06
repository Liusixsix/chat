<template>
  <div class="App">
    <div class="header">
      <div class="header-content">
        <div class="header-top">
          <img src="../assets/img/back.png" alt />
          <span>咨询聊天</span>
        </div>
        <div class="header-bottom">
          <marquee class="marquee">客服热线 ：4005678456</marquee>
        </div>
      </div>
    </div>

    <div class="content" ref="xwBody" :style="{bottom:footerH+'rem'}">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="chat-wrap">
          <List :records="filterrecords"></List>
        </div>
      </van-pull-refresh>
    </div>
    <div class="footer-wrap" :style="{height:footerH+'rem'}">
      <!-- 底部输入框 -->
      <div class="footer-content">
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
              <van-uploader v-show="!isBtn" :after-read="afterRead">
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
  </div>
</template>

<script>
import EXPS from "../static/emojis.json";
import axios from "axios";
import List from "./list";
import api from "../http";
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
      isLoading: false
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
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新");
        this.isLoading = false;
        this.count++;
      }, 500);
    },
    // 点击表情 是否显示表情列表
    showExps() {
      this.isEXps = !this.isEXps;
      this.setIpuBlur();
      this.scrollToBottom();
    },
    // 点击某个表情发送
    async clickEXPS(e, src) {
      this.news(6, src);
      this.scrollToBottom();
    },
    // 输入框聚焦事件
    inputFocus() {
      this.isEXps = false;
      // setTimeout(() => {
      //   let Dom = this.$refs.xwBody;
      //   let h = Dom.scrollHeight;
      //   Dom.scrollTop = h;
      // }, 300);
    },
    // 输入框失焦事件
    inputBlur() {
      this.$toast("失去焦点");
    },
    //主动让input失去焦点 消除键盘
    setIpuBlur() {
      this.$refs.input.blur();
    },
    // 发送按钮
    async Sendout() {
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
      const config = {
        headers: { "Content-Type": "multipart/form-data" }
      };
      const formdata = new FormData();
      formdata.append("file", file.file);
      formdata.append("key", fileName);
      try {
        let uploadToken = await api
          .getUploadToken({ fileName })
          .then(res => res.uploadToken);
        formdata.append("token", uploadToken);
        let imgName = await axios
          .post("https://upload.qiniup.com", formdata, config)
          .then(res => res.key);
        this.news(1, `${baseURL + imgName}`);
      } catch (err) {
        this.$toast("发送失败");
      }
      // this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        let Dom = this.$refs.xwBody;
        if(Dom){
           Dom.scrollTop = Dom.scrollHeight;
        }
      });
    },
    // 接收新消息
    Messages() {
      api.Messages().then(news => {
        if (news.length) {
          news.forEach(item => {
            // 为4 撤回  2 客服的撤回
            if (item.state === 4 && item.sort === 2) {
              // 将列表里数据换为撤回状态
              let index = this.records.findIndex(items => {
                return items.id === item.id;
              });
              if (index >= 0) {
                let replaceItem = this.records[index];
                replaceItem.type = 20;
                this.records.splice(index,1,replaceItem);
              }
            }else{
              // 正常新消息 push进去
              console.log(item)
              this.records.push(item)
            }
          });
          this.scrollToBottom();
        }
      });
    },
    // 进入页面查看历史消息
    getHistory() {
      return api.getHistory();
    },
    // 进入页面获取消息
    async init() {
      let res = await api.getHistory(res => res);
      let data = await api.Messages(res => res);
      this.records = [...res.list, ...data];
      setTimeout(() => {
        this.scrollToBottom();
      }, 300);
      setInterval(() => {
        this.Messages();
      }, 3000);
    }
  },
  async mounted() {
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
}
.header {
  font-size: 0.36rem;
  text-align: center;
  // height: 1.54rem;
  .header-content {
    height: 1.54rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
  }
  .header-top {
    height: 0.88rem;
    line-height: 0.88rem;
    box-shadow: 0px 3px 13px 0px rgba(212, 229, 255, 0.21);
    color: #333333;
    position: relative;
    z-index: 9;
    background-color: #fff;
    img {
      position: absolute;
      left: 0.3rem;
      width: 0.46rem;
      height: 0.32rem;
      top: 0.28rem;
    }
  }
  .header-bottom {
    background-color: rgb(221, 125, 51);
    padding: 0.18rem 0;
    color: #fff;
    .marquee {
      font-size: 0.3rem;
    }
  }
}
.content {
  padding: 0.42rem 0.35rem 0;
  box-sizing: border-box;
  font-size: 0.3rem;
  overflow-y: auto;
  position: fixed;
  top: 1.54rem;
  width: 100%;
  background: #fff;
  -webkit-overflow-scrolling: touch;
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
  // transition: all .3s ease;
  .footer-content {
    position: fixed;
    width: 100%;
    bottom: 0;
  }
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
      position: relative;
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
        height: 0.54rem;
        background-color: #5b8aff;
        color: #fff;
        border-radius: 0.15rem;
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
