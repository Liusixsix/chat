<template>
  <span class="tips">
    <span class="tips-wrap">
      <span>撤回</span>
      <span class="van-hairline--left van-hairline--right">复制</span>
      <span>删除</span>
    </span>
  </span>
</template>

<script>
export default {
  name: "tips",
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.tips {
  position: absolute;
  top: -0.78rem;
  left: 50%;
  background: #29272a;
  height: 0.58rem;
  line-height: 0.58rem;
  border-radius: 0.1rem;
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
      border-bottom: .2rem solid transparent;
      border-right: .18rem solid transparent;
       border-left: .18rem solid transparent;
       
    }
    .border {
      border-left: 1px solid #fff;
      border-right: 1px solid #fff;
      box-sizing: border-box;
    }
  }
}
</style>