<template>
  <ul>
    <li v-for="(message,index) of records" :key="index" class="li">
      <!-- 对方的消息 -->
      <div v-if="message.type===1" class="news">
        <div class="Customer-chat-msg">
          <div class="chat-avantar">
            <img src="../assets/img/female.jpg" alt />
          </div>
          <!-- Exp表情  Other背景   img-wrap图片-->
          <div class="chat-msg Other" v-hammer:press="()=>press(message.content)">
            {{message.content}}
            <!-- <tips ></tips> -->
          </div>
        </div>
      </div>

      <!-- 我的消息 -->
      <div v-else-if="message.type===2" class="news">
        <div class="my-chat-msg">
          <!-- Exp表情  Other背景   img-wrap图片-->
          <div class="chat-msg My" v-hammer:press="()=>press(index)">
            {{message.content}}
            <tips :index='tipShowIndex' :id='index' :content='message.content'></tips>
          </div>
          <div class="chat-avantar">
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
import AnyTouch from "any-touch";

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
      tipShowIndex:-1,
      images: []
    };
  },
  methods: {
    press(i) {
      this.tipShowIndex = i
      this.$toast(i);
    },
    importAT(at) {
      at.set({ isPreventDefault: false });
    },
    onChange() {},
    showImg(msg) {
      this.images = [msg.content];
      this.show = true;
    }
  },
  mounted() {}
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

  .Exp {
    img {
      height: 0.5rem;
    }
  }
  .img-wrap {
    max-width: 30%;
    img {
      max-width: 100%;
    }
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
</style>
