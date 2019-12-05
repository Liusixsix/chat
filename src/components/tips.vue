<template>
  <span class="tips" v-if="index===id">
    <span class="tips-wrap">
      <span @touchstart="withdraw">撤回</span>
      <span v-clipboard:copy="content"  v-clipboard:success='Copy' class="van-hairline--left van-hairline--right">复制</span>
      <span @touchstart="deletes">删除</span>
    </span>
  </span>
</template>

<script>
export default {
  name: "tips",
  data() {
    return {};
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number
    },
    index: {
      type: Number
    },
    content: {
      type: String,
      default:''
    }
  },
  methods: {
    // 撤回
    withdraw() {},
    // 复制
    Copy(e) {
      this.$toast('复制成功');
    },
    // 删除
    deletes() {}
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
  border-radius: 0.1rem;
  width: 3.5rem;
  z-index: 99;
  .tips-wrap {
    height: 0.58rem;
    display: inline-block;
    position: relative;
    & > span {
      display: inline-block;
      font-size: 0.25rem;
      color: #fff;
      box-sizing: border-box;
      height: 100%;
      padding: 0 0.3rem;
    }
    &::after {
      position: absolute;
      bottom: -0.4rem;
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