<template>
  <div class="index">
    <mp-navbar :tabs="['加油记录', '今日油价']" :activeIndex="tabActiveIndex" @tabClick="tabClick"></mp-navbar>
    <div class="weui-cells weui-cells_form" v-if="tabActiveIndex === 0">
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">公里数(KM)</label></div>
        <div class="weui-cell__bd">
          <input type="digit" class="weui-input" placeholder="填写本次加油时的公里数" v-model="currentData.km">
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">加油量(L)</label></div>
        <div class="weui-cell__bd">
          <input type="digit" class="weui-input" placeholder="填写本次加油量" v-model="currentData.fill">
        </div>
      </div>
      <div class="weui-cell">
        <div class="weui-cell__hd"><label class="weui-label">支付金额(元)</label></div>
        <div class="weui-cell__bd">
          <input type="digit" class="weui-input" placeholder="填写本次支付金额" v-model="currentData.amount">
        </div>
      </div>
      <div class="weui-cell weui-cell_access">
        <div class="weui-cell__hd"><label class="weui-label">加油日期</label></div>
        <div class="weui-cell__bd">
          <input type="date" class="weui-input" @tap="showMpDatePicker" :value="currentData.date" disabled="disabled">
          <mp-datepicker ref="mpDatePicker" :defaultDate="currentData.date" @onConfirm="onConfirm" @onCancel="onCancel"></mp-datepicker>
        </div>
        <div class="weui-cell__ft"></div>
      </div>
      <mp-button type="primary" size="large" btnClass="mt5" :disabled="!currentData.km || !currentData.fill || !currentData.amount" @click="submit">保存</mp-button>
      <mp-button type="default" size="large" btnClass="mt5" @click="navigateTo('/pages/record/main')">我的记录</mp-button>
    </div>
    <div class="gnyj" v-if="tabActiveIndex === 1">
      <div class="adContainer">
        <ad unit-id="adunit-f0dd28c7bb9c94aa" ad-intervals="30"></ad>
      </div>
      <div class="table">
        <div class="thead">
          <div class="tr">
            <div class="th">城市</div>
            <div class="th">92号</div>
            <div class="th">95号</div>
            <div class="th">98号</div>
            <div class="th">柴油</div>
          </div>
        </div>
        <div class="tbody">
          <div class="tr" v-for="(item, index) in gnyj.result" :key="index">
            <div class="td">{{item['city']}}</div>
            <div class="td">{{item['92h']}}</div>
            <div class="td">{{item['95h']}}</div>
            <div class="td">{{item['98h']}}</div>
            <div class="td">{{item['0h']}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="weui-footer" v-if="tabActiveIndex === 0">
      <p class="weui-footer__links">
        <a href="javascript:" class="weui-footer__link" @click="dialogShow">技术支持</a>
      </p>
      <p class="weui-footer__text">Copyright © 2020 XiaoGang v1.1.5</p>
      <div class="adContainer" style="margin-top: 10px;">
        <ad unit-id="adunit-2a91947b8b091dc0" ad-intervals="30"></ad>
      </div>
    </div>
    <halfScreenDialog ref="halfScreenDialog" title="技术支持" @close="dialogClose">
      <div class="my-qrcode">
        <div class="qrcode"><img style="width:240px;height:240px" :src="imageUrls.myQrcode" @click="previewImage"></div>
        <div class="tips">扫一扫上面的二维码图案，加我微信</div>
      </div>
    </halfScreenDialog>
  </div>
</template>

<script>
import mpNavbar from 'mpvue-weui/src/navbar'
import mpDatepicker from 'mpvue-weui/src/date-picker'
import mpButton from 'mpvue-weui/src/button'
import halfScreenDialog from './../../components/weui-half-screen-dialog/dialog'
import { formatNumber, formatTime } from './../../utils/index'
export default {
  components: {
    mpNavbar,
    mpDatepicker,
    mpButton,
    halfScreenDialog
  },

  data () {
    return {
      tabActiveIndex: 0,
      imageUrls: {
        myQrcode: 'https://static-public-1301949451.cos.ap-shanghai.myqcloud.com/common/my-qrcode.jpg'
      },
      recordData: [], // 我的记录
      currentData: { // 本次加油数据
        km: '', // 公里数
        fill: '', // 加油量
        amount: '', // 支付金额
        date: formatTime(new Date()).split(' ')[0] // 默认获取当前日期
      },
      gnyj: { // 国内油价
        date: '',
        result: []
      },
      currentProvince: '' // 所在省份
    }
  },

  methods: {
    showShareMenu () { // 菜单展示分享按钮
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
    },
    userLogin () { // 获取用户信息
      const vm = this
      wx.login({
        success (res) {
          console.log(res)
          if (res.code) {
            // 发起网络请求
            vm.$httpWX.get({
              url: 'https://api.jungkisong.cn/myOCC/users',
              data: {
                code: res.code
              }
            }).then(result => {
              console.log(result)
            }).catch(err => {
              console.log(err)
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    },
    getLocation () { // 查询所在省份
      const vm = this
      return new Promise((resolve, reject) => {
        // 获取坐标
        wx.getLocation({
          type: 'wgs84',
          success (res) {
            const latitude = res.latitude
            const longitude = res.longitude
            /* 根据坐标获取地址信息 */
            vm.$httpWX.get({
              url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=ZRGBZ-MGAKQ-G7Z5L-GNIX5-64OCQ-XCFUK'
            }).then(result => {
              vm.currentProvince = result.result.ad_info.province
              resolve(vm.currentProvince)
            }).catch(err => {
              console.log(err)
              reject(new Error('err'))
            })
          },
          fail (res) {
            reject(res)
          }
        })
      })
    },
    tabClick (index) { // 顶部tab点击
      this.tabActiveIndex = index
    },
    showMpDatePicker () {
      this.$refs.mpDatePicker.show() // 弹出日期
    },
    onConfirm (res) {
      this.currentData.date = res.value[0] + '-' + formatNumber(res.value[1]) + '-' + res.value[2]
    },
    navigateTo (url) {
      wx.navigateTo({ url: url })
    },
    getData () {
      console.log('getData')
      try {
        this.recordData = wx.getStorageSync('recordData') || []
        console.log(this.recordData)
      } catch (e) {
        // Do something when catch error
      }
    },
    submit () { // 保存
      this.recordData.push(this.currentData)
      try {
        wx.setStorageSync('recordData', this.recordData)
        this.currentData = { // 清空填写的数据
          km: '',
          fill: '',
          amount: '',
          date: formatTime(new Date()).split(' ')[0]
        }
        this.navigateTo('/pages/record/main')
      } catch (e) { }
    },
    queryGnyj () { // 查询油价
      return new Promise((resolve, reject) => {
        let today = formatTime(new Date()).split(' ')[0]
        if (wx.getStorageSync('gnyj') && wx.getStorageSync('gnyj').date === today) { // 今天是否查询过油价
          resolve(wx.getStorageSync('gnyj').result)
        } else {
          this.$httpWX.post({
            url: 'https://apis.juhe.cn/gnyj/query?key=7f4439b60c5ce9da399df82485caafa5'
          }).then(res => {
            resolve(res.result)
          }).catch(err => {
            console.log(err)
            reject(new Error())
          })
        }
      })
    },
    dialogShow () {
      this.$refs.halfScreenDialog.show()
    },
    dialogClose (n) {
      console.log(n)
      // do nothing...
    },
    previewImage () {
      wx.previewImage({
        current: this.imageUrls.myQrcode, // 当前显示图片的http链接
        urls: [this.imageUrls.myQrcode] // 需要预览的图片http链接列表
      })
    }
  },

  created () { },

  onLoad () {
    this.showShareMenu()
    this.userLogin()
  },

  onShow () {
    this.getData() // 查询我的记录
    this.queryGnyj().then((res) => { // 查询油价
      console.log('查询油价成功')
      console.log(res)
      this.gnyj.date = formatTime(new Date()).split(' ')[0]
      this.gnyj.result = res
      wx.setStorageSync('gnyj', this.gnyj)
      this.getLocation().then((province) => { // 获取定位
        console.log(province)
        for (let i = 0; i < res.length; i++) {
          if (province.indexOf(res[i].city) > -1) { // 匹配当前城市
            let currentData = res[i]
            this.gnyj.result.splice(i, 1)
            this.gnyj.result.unshift(currentData) // 将当前城市排到第一位
            break
          }
        }
        console.log(this.gnyj)
      }).catch((err) => {
        console.log(err)
      })
    })
  },

  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    } else {
      // 来自菜单栏转发按钮
      console.log(res.target)
    }
    return {
      title: '来测测你爱车的真实油耗',
      path: '/pages/index/main',
      imageUrl: 'https://static-public-1301949451.cos.ap-shanghai.myqcloud.com/my-occ/share.png',
      // 成功的回调
      success: (res) => {},
      // 失败的回调
      fail: (res) => {},
      // 无论成功与否的回调shareAppMessage
      complete: (res) => {}
    }
  },

  onShareTimeline (res) {
    console.log(res)
    return {
      title: '来测测你爱车的真实油耗',
      query: '',
      imageUrl: 'https://static-public-1301949451.cos.ap-shanghai.myqcloud.com/my-occ/share.png'
    }
  }
}
</script>

<style scoped>
  .weui-cells {
    padding: 0 15px;
    margin-top: 0;
  }
  .weui-cells:after,
  .weui-cells:before{
    display: none;
  }
  .weui-cell:before{
    left: 0;
  }
  .weui-label{
    display: block;
  }
  .weui-footer{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }
  .adContainer{
    width: 100%;
  }
  .my-qrcode .qrcode{
    display: flex;
    justify-content: center;
  }
  .my-qrcode .tips{
    text-align: center;
  }
  .table .tr{
    display: flex;
  }
  .table .tr .th,
  .table .tr .td{
    flex: 1;
    font-size: 16px;
    height: 34px;
    line-height: 34px;
    text-align: center;
  }
  .table .thead .tr{
    font-weight: bold;
  }
  .table .tbody .tr:nth-child(odd){
    background: #eee;
  }
</style>
