<template>
  <div class="js_dialog" v-show="isShow">
    <div class="weui-mask" @click="close"></div>
    <div id="js_dialog_1" class="weui-half-screen-dialog">
      <div class="weui-half-screen-dialog__close" @click="close"><i class="weui-icon-close-thin"></i></div>
      <div class="weui-half-screen-dialog__hd">
        <strong class="weui-half-screen-dialog__title">{{title}}</strong>
      </div>
      <div class="weui-half-screen-dialog__bd">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'dialog',
  props: {
    title: {
      type: String,
      default: '标题'
    }
  },
  data () {
    return {
      isShow: false
    }
  },
  methods: {
    show () {
      this.isShow = true
    },
    close () {
      this.isShow = false
      this.$emit('close', 'closed')
    }
  }
}
</script>

<style scoped>
  .weui-mask {
    position: fixed;
    z-index: 1000;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background: rgba(0,0,0,0.6);
  }
  .weui-half-screen-dialog {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    max-height: 75%;
    z-index: 5000;
    line-height: 1.4;
    background-color: #fff;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    overflow: hidden;
    padding: 0 24px;
  }
  .weui-half-screen-dialog__hd {
    font-size: 12px;
    height: 48px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
  .weui-half-screen-dialog__close {
    position: absolute;
    top: 0;
    left: 0;
    padding: 0;
    border: 0;
  }
  .weui-icon-close-thin {
    display: block;
    width: 48px;
    height: 48px;
    background-image: url('https://static-public-1301949451.cos.ap-shanghai.myqcloud.com/common/close_64px.png');
    background-repeat: no-repeat;
    background-position: center center;
    -webkit-background-size: 50% 50%;
    background-size: 50% 50%;
  }
  .weui-half-screen-dialog__title {
    display: block;
    color: rgba(0,0,0,0.9);
    font-weight: 700;
    font-size: 15px;
    text-align: center;
    flex: 1;
  }
  .weui-half-screen-dialog__bd {
    word-wrap: break-word;
    -webkit-hyphens: auto;
    hyphens: auto;
    overflow-y: auto;
    padding-top: 4px;
    padding-bottom: 40px;
    font-size: 14px;
    color: rgba(0,0,0,0.9);
  }
</style>
