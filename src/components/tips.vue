<template>
  <span class="tips" v-if="tipShowIndex===id">
    <span class="tips-wrap" :style="{width:width}">
      <span @touchstart.stop="withdraw" v-if="sort===1">撤回</span>
      <span
        v-if="type===0"
        v-clipboard:copy="content"
        v-clipboard:success="Copy"
        class="van-hairline--left van-hairline--right"
      >复制</span>
      <span @touchstart="deletes" :class="{'van-hairline--left':(type===6||type===1)&&sort===1}">删除</span>
    </span>
  </span>
</template>

<script>
import api from "../http";
export default {
  name: "tips",
  data() {
    return {};
  },
  props: {
    id: {
      type: Number //每条记录的id
    },
    tipShowIndex: {
      type: Number
    },
    content: {
      type: String,
      default: ""
    },
    userId: {
      //操作用的sendId
      type: Number
    },
    type: {
      type: Number //0 文字  1图片 6表情
    },
    sort: {
      type: Number //1用户 2客服
    }
  },
  computed: {
    width() {
      // return `3.55rem`;
    }
  },
  methods: {
    // 撤回
    withdraw(e) {
      e.preventDefault();
      api.withdraw({ id: this.id, sendId: this.userId }).then(res => {
        this.hide();
        this.$parent.$parent.changeRecods(this.id, 21);
      });
    },
    // 复制
    Copy(e) {
      this.$toast("复制成功");
      this.hide();
    },
    // 删除
    deletes() {
      api.delNews({ id: this.id }).then(res => {
        this.hide();
        this.$parent.$parent.delMsg(this.id);
      });
    },
    hide() {
      this.$parent.tipShowIndex = -1;
    }
  },
  mounted() {
    // console.log(this.type)
  }
};
</script>

<style lang="scss" scoped>
.tips {
  position: absolute;
  top: -0.78rem;
  left: 46%;
  transform: translateX(-50%);
  background: #29272a;
  height: 0.58rem;
  line-height: 0.58rem;

  white-space: nowrap;
  border-radius: 0.1rem;
  // width: 3.55rem;
  z-index: 99;
  .tips-wrap {
    height: 0.58rem;
    display: inline-block;
    position: relative;
    z-index: 99;
    & > span {
      display: inline-block;
      font-size: 0.25rem;
      color: #fff;
      box-sizing: border-box;
      height: 100%;
      padding: 0 0.3rem;
      width: 1.18rem;
      text-align: center;
    }
    &::after {
      position: absolute;
      bottom: -0.35rem;
      left: 50%;
      content: "";
      transform: translateX(-50%);
      border-top: 0.2rem solid #29272a;
      border-bottom: 0.2rem solid transparent;
      border-right: 0.18rem solid transparent;
      border-left: 0.18rem solid transparent;
    }
    .border {
      border-left: 1px solid #fff;
      border-right: 1px solid #fff;
      box-sizing: border-box;
    }
  }
}
</style>