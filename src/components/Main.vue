<template>
  <div class="App">
    <div class="header">
      <img src="../assets/img/back.png" alt />
      <span>咨询聊天</span>
    </div>

    <div class="content" ref="xwBody">
      <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
        <div class="chat-wrap">
          <ul>
            <li v-for="(message,index) of records" :key="index">
              <!-- 对方的消息 -->
              <div v-if="message.type===1">
                <div class="chat-msg-wrap">
                  <div class="chat-avantar-wrap chat-avantar-left">
                    <img src="../assets/img/female.jpg" alt />
                  </div>
                  <div class="chat-msg Other">
                    <span v-html="message.content"></span>
                  </div>
                </div>
              </div>

              <!-- 我的消息 -->
              <div v-else-if="message.type===2">
                <div class="chat-msg-wrap chat-msg-wrap-right">
                  <div class="chat-msg My">
                    <span v-html="message.content"></span>
                  </div>
                  <div class="chat-avantar-wrap chat-avantar-right">
                    <img src="../assets/img/female.jpg" alt />
                  </div>
                </div>
              </div>

              <!-- 撤回消息提示 -->
              <div v-else-if="message.type===3">
                <div class="withdraw-wrap">
                  <p class="withdraw-time">15:30</p>
                  <p class="withdraw-tips">你撤回了一条消息</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </van-pull-refresh>
    </div>
    <div class="footer-wrap">
      <!-- 底部输入框 -->
      <div class="footer">
        <div class="input-wrap">
          <van-field v-model="value" placeholder @focus="inputFocus"></van-field>
          <transition name="fade">
            <van-button type="primary" size="small" v-show="isBtn" @touchstart="Sendout">发送</van-button>
          </transition>
        </div>
        <div class="footer-tool">
          <div @touchstart="showExps">
            <img v-show="!isEXps" src="../assets/img/Expression.png" alt />
            <img v-show="isEXps" src="../assets/img/consulting_keyboard.png" alt />
          </div>
          <div>
            <img src="../assets/img/More.png" alt />
          </div>
        </div>
      </div>

      <!-- 表情 -->
      <transition name="slide-fade">
        <ul class="EXPS-wrap" v-show="isEXps">
          <li
            v-for="(item,index) in EXPS"
            :key="index"
            class="exps-item"
            @touchstart="clickEXPS(item.url)"
          >
            <img :src="item.url" alt />
          </li>
        </ul>
      </transition>
    </div>
    <!-- <van-number-keyboard safe-area-inset-bottom /> -->
  </div>
</template>

<script>
import EXPS from "../static/emojis.json";

export default {
  name: "mains",
  data() {
    return {
      value: "",
      id: "",
      EXPS, //表情图片列表
      isEXps: false, //表情列表是否展开
      isBtn: false, //是否显示发送按钮
      records: [
        { type: 1, content: "风格啊发哇发" },
        { type: 2, content: "风格啊发哇发fwafw" },
        {
          type: 1,
          content: "风格啊发哇的瓦房我福娃福娃狗娃福娃福娃发发福娃福娃"
        },
        { type: 1, content: "风格啊发哇发" },
        { type: 2, content: "风格啊发哇发fwafw" },
        {
          type: 1,
          content: "风格啊发哇的瓦房我福娃福娃狗娃福娃福娃发发福娃福娃"
        },
        { type: 1, content: "风格啊发哇发" },
        { type: 2, content: "风格啊发哇发fwafw" },
        {
          type: 1,
          content: "风格啊发哇的瓦房我福娃福娃狗娃福娃福娃发发福娃福娃"
        },
        { type: 1, content: "风格啊发哇发" },
        { type: 2, content: "风格啊发哇发fwafw" },
        {
          type: 1,
          content: "风格啊发哇的瓦房我福娃福娃狗娃福娃福娃发发福娃福娃"
        },
        { type: 1, content: "风格啊发哇发" },
        { type: 2, content: "风格啊发哇发fwafw" },
        {
          type: 1,
          content: "风格啊发哇的瓦房我福娃福娃狗娃福娃福娃发发福娃福娃"
        },
        { type: 1, content: "风格啊发哇发" },
        { type: 2, content: "风格啊发哇发fwafw" },
        {
          type: 3
        },
        {
          type: 2,
          content: "风格啊发哇的瓦房我福娃福娃狗娃福娃福娃发发福娃福娃"
        }
      ], //聊天记录
      count: 0,
      isLoading: false
    };
  },
  watch: {
    value(newval) {
      if (newval.trim()) {
        this.isBtn = true;
      } else {
        this.isBtn = false;
      }
    }
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.$toast("刷新成功");
        this.isLoading = false;
        this.count++;
      }, 500);
    },
    // 点击表情 是否显示表情列表
    showExps() {
      this.isEXps = !this.isEXps;
      this.scrollToBottom();
    },
    // 点击某个表情发送
    clickEXPS(src) {
      this.records.push({
        type: 2,
        content: `<img style='height:.5rem' src="${src}" alt />`
      });
      this.scrollToBottom();
    },
    // 输入框聚焦事件
    inputFocus() {
      this.isEXps = false;
    },
    // 发送按钮
    Sendout() {
      this.records.push({
        type: 2,
        content: this.value
      });
      this.value = "";
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        let Dom = this.$refs.xwBody;
        Dom.scrollTop = Dom.scrollHeight;
      });
    }
  },
  mounted() {
    // setTimeout(()=>{
    //   this.scrollToBottom()
    // },200)
  }
};
</script>


<style scoped lang='scss'>
.App {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.header {
  font-size: 0.36rem;
  text-align: center;
  height: 0.88rem;
  line-height: 0.88rem;
  box-shadow: 0px 3px 13px 0px rgba(212, 229, 255, 0.21);
  color: #333333;
  position: relative;
  img {
    position: absolute;
    left: 0.3rem;
    width: 0.46rem;
    height: 0.32rem;
    top: 0.28rem;
  }
}
.content {
  flex: 1;
  padding: 0.42rem 0.35rem 0;
  box-sizing: border-box;
  font-size: 0.3rem;
  overflow: scroll;
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
        span {
          line-height: 1.3em;
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

    .withdraw-wrap {
      color: #8c8c8c;
      font-size: 0.26rem;
      text-align: center;
      margin: 0.39rem 0;
      .withdraw-time {
        margin-bottom: 0.25rem;
      }
    }
  }
}
.footer-wrap {
  background-color: #f6f6f6;
  .footer {
    height: 1.11rem;
    font-size: 0.36rem;

    padding: 0.16rem 0.31rem;
    box-sizing: border-box;
    display: flex;
    .input-wrap {
      height: 100%;
      width: 73%;
      position: relative;
      .van-field {
        height: 100%;
        width: 100%;
        padding-right: 1.55rem;
      }
      .van-button {
        position: absolute;
        right: 0.2rem;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .footer-tool {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      & > div {
        // width: .55rem;
        img {
          width: 0.55rem;
        }
      }
      & > div:first-child {
        margin-right: 0.17rem;
      }
    }
  }
  .EXPS-wrap {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    height: 3rem;
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
