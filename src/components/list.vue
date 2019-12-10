<template>
  <ul>
    <li v-for="(message,index) of records" :key="index" class="li">
      <!-- 对方的消息 文字内容 -->
      <div v-if="message.sort===2&&message.type===0" class="news">
        <div class="Customer-chat-msg">
          <div class="chat-avantar">
            <img src="../assets/img/kefu.png" alt />
          </div>
          <!-- Exp表情  Other背景   img-wrap图片-->
          <div class="chat-msg Other" v-hammer:press="()=>press(message.id)">
            {{message.content}}
            <tips
              :tipShowIndex="tipShowIndex"
              :id="message.id"
              :userId="message.userId"
              :content="message.content"
              :type="message.type"
              :sort="message.sort"
              ref="tips"
            ></tips>
          </div>
        </div>
      </div>

      <!-- 对方的消息 表情 或 图片  -->
      <div v-if="message.sort===2&&(message.type===6||message.type===1)" class="news">
        <div class="Customer-chat-msg">
          <div class="chat-avantar">
            <img src="../assets/img/kefu.png" alt />
          </div>
          <div
            :class="{'Exp':message.type===6,'img-wrap':message.type===1}"
            v-hammer:press="()=>press(message.id)"
          >
            <div v-hammer:tap="(e)=>showImg(e,message)">
              <img :src="message.content" alt />
            </div>
            <tips
              :tipShowIndex="tipShowIndex"
              :id="message.id"
              :userId="message.userId"
              :content="message.content"
              :type="message.type"
              :sort="message.sort"
              ref="tips"
            ></tips>
          </div>
        </div>
      </div>

      <!-- 我的消息 -->
      <div v-else-if="message.sort===1&&message.type===0" class="news">
        <p class="withdraw-time" v-if="showTime(index)">{{formatDate(message.created)}}</p>
        <div class="my-chat-msg">
          <!-- Exp表情  Other背景   img-wrap图片-->
          <div class="chat-msg My" v-hammer:press="()=>press(message.id)">
            {{message.content}}
            <transition name="van-fade">
              <tips
                :tipShowIndex="tipShowIndex"
                :id="message.id"
                :userId="message.userId"
                :content="message.content"
                :type="message.type"
                :sort="message.sort"
                ref="tips"
              ></tips>
            </transition>
          </div>
          <div class="chat-avantar">
            <img src="../assets/img/user.png" alt />
          </div>
        </div>
      </div>

      <!-- 我的消息 表情 或图片 -->
      <div v-else-if="message.sort===1&&(message.type===6||message.type===1)" class="news">
        <div class="my-chat-msg">
          <div
            :class="{'Exp':message.type===6,'img-wrap':message.type===1}"
            v-hammer:press="()=>press(message.id)"
          >
            <div v-hammer:tap="(e)=>showImg(e,message)">
              <img :src="message.content" alt  @load="handleLoad($event,index)" />
            </div>
            <transition name="van-fade">
              <tips
                :tipShowIndex="tipShowIndex"
                :id="message.id"
                :userId="message.userId"
                :content="message.content"
                :type="message.type"
                :sort="message.sort"
                ref="tips"
              ></tips>
            </transition>
          </div>
          <div class="chat-avantar">
            <img src="../assets/img/user.png" alt />
          </div>
        </div>
      </div>

      <!-- 撤回消息提示 -->
      <div v-else-if="message.type===20 || message.type===21">
        <div class="withdraw-wrap">
          <p class="withdraw-time">{{formatDate(message.created)}}</p>
          <p class="withdraw-tips">{{message.type===20?'对方':'你'}}撤回了一条消息</p>
        </div>
      </div>

      <!-- 发送的图片类型 -->
      <div class="msg-img-wrap" v-else-if="message.type===4">
        <div class="chat-msg-wrap chat-msg-wrap-right">
          <div class v-html="message.content"></div>
          <div class="chat-avantar-wrap chat-avantar-right">
            <img src="../assets/img/female.jpg" alt />
          </div>
        </div>
      </div>

    </li>
    <van-image-preview v-model="show" :images="images" @change="onChange"></van-image-preview>
  </ul>
</template>

<script>
import tips from "./tips";
// import AnyTouch from "any-touch";
import moment from "moment";
import { ImagePreview } from "vant";
export default {
  components: {
    tips
  },
  name: "list",
  props: {
    records: {
      type: Array
    }
  },
  data() {
    return {
      show: false,
      tipShowIndex: -1,
      images: [],
      flag: false
    };
  },
  computed: {},
  methods: {
    showTime(index) {
      if (index) {
        if (
          this.records[index].created - this.records[index - 1].created >=
          500000
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    handleLoad(e, index) {
     
    },
    formatDate(val) {
      if (!val) return;
      return moment(val).format("HH:mm:ss");
    },
    press(id) {
      this.tipShowIndex = id;
    },
    onChange() {},
    showImg(e, msg) {
      if (msg.type !== 1) return;
      ImagePreview({
        images: [msg.content],
        showIndex: false
      });
    },
    // 节流
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
    hideTips() {
      this.tipShowIndex = -1;
    }
  },
  mounted() {
    window.addEventListener("touchmove", this.throttle(this.hideTips, 1500));
  }
};
</script>


<style lang="scss" >
.li {
  margin-bottom: 0.3rem;
}

// 对面的消息
.Customer-chat-msg {
  display: flex;
  align-items: center;
  .chat-avantar {
    width: 0.72rem;
    height: 0.72rem;
    margin-right: 0.25rem;
    img {
      width: 0.72rem;
      height: 0.72rem;
      border-radius: 50%;
    }
  }
  .chat-msg {
    padding: 0.18rem 0.29rem;
    box-sizing: border-box;
    max-width: 65%;
    word-break: break-all;
    line-height: 1.3em;
    position: relative;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    // -webkit-touch-callout: none;
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
}
.withdraw-time {
  text-align: center;
  color: #8c8c8c;
  font-size: 0.25rem;
  text-align: center;
  margin: 0.39rem 0;
}
// 我发的消息
.my-chat-msg {
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .chat-avantar {
    width: 0.72rem;
    height: 0.72rem;
    margin-left: 0.25rem;
    img {
      width: 0.72rem;
      height: 0.72rem;
      border-radius: 50%;
    }
  }
  .chat-msg {
    padding: 0.18rem 0.29rem;
    box-sizing: border-box;
    max-width: 65%;
    word-break: break-all;
    line-height: 1.3em;
    color: #656565;
    position: relative;
    // -webkit-touch-callout: none;
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
  font-size: 0.25rem;
  text-align: center;
  margin: 0.39rem 0;
  .withdraw-time {
    margin-bottom: 0.25rem;
  }
}
.Exp {
  position: relative;
  img {
    height: 0.5rem;
    pointer-events: none;
  }
}
.img-wrap {
  max-width: 30%;
  position: relative;
  img {
    max-width: 100%;
    max-height: 100%;
    pointer-events: none;
  }
}
</style>
