<template>
  <div class="record">
    <div class="total">
      <div class="panel bg-green">
        <div class="title">百公里油耗</div>
        <div class="result">
          <div class="value">{{result.mpg}}</div>
          <div class="unit">升/百公里</div>
        </div>
      </div>
      <div class="panel bg-yellow">
        <div class="title">每公里耗费</div>
        <div class="result">
          <div class="value">{{result.costPK}}</div>
          <div class="unit">元/公里</div>
        </div>
      </div>
    </div>
    <div class="tips">注：记录两次开始计算油耗，每次把油加满计算更准确。</div>
    <div class="btn-box">
      <mp-button v-if="recordData.length < 1" type="primary" size="large" @click="navigateTo('/pages/index/main')">没有找到您的加油记录，去加油</mp-button>
    </div>
    <div v-for="(item, index) in recordData" :key="index" class="weui-form-preview">
      <div class="weui-form-preview__hd">
        <div class="weui-form-preview__item">
          <label class="weui-form-preview__label">支付金额</label>
          <em class="weui-form-preview__value">¥{{item.amount}}</em>
        </div>
      </div>
      <div class="weui-form-preview__bd">
        <div class="weui-form-preview__item">
          <label class="weui-form-preview__label">日期</label>
          <span class="weui-form-preview__value">{{item.date}}</span>
        </div>
        <div class="weui-form-preview__item">
          <label class="weui-form-preview__label">公里数</label>
          <span class="weui-form-preview__value">{{item.km}}公里</span>
        </div>
        <div class="weui-form-preview__item">
          <label class="weui-form-preview__label">加油量</label>
          <span class="weui-form-preview__value">{{item.fill}}升</span>
        </div>
        <div class="weui-form-preview__item">
          <label class="weui-form-preview__label">单价</label>
          <span class="weui-form-preview__value">{{item.unitPrice}}元/升</span>
        </div>
      </div>
      <div class="weui-form-preview__ft">
        <a class="weui-form-preview__btn weui-form-preview__btn_warn" href="javascript:" @click="deleteItem(index)">删除此条</a>
      </div>
    </div>
    <mp-modal ref="mpModal" title="提醒" content="确定要删除本条记录吗？" :showCancel="true" @confirm="confirmDelete" @cancel="cancelDelete"></mp-modal>
  </div>
</template>

<script>
import mpModal from 'mpvue-weui/src/modal'
import mpButton from 'mpvue-weui/src/button'
import { formatToFixed, compare } from './../../utils/index'
export default {
  name: 'record',
  data () {
    return {
      recordData: [], // 我的记录
      deleteIndex: '' // 删除时临时保存索引值
    }
  },

  computed: {
    result () { // 百公里油耗
      let totalKm = 0 // 总公里数
      let totalFill = 0 // 总加油量
      let totalCost = 0
      if (this.recordData.length > 0) {
        let firstKM = Number(this.recordData[0].km)
        let lastKM = Number(this.recordData[this.recordData.length - 1].km)
        totalKm = lastKM - firstKM
        for (let [index, item] of this.recordData.entries()) {
          if (index > 0) {
            totalFill += Number(item.fill)
            totalCost += Number(item.amount)
          }
        }
      }
      return {
        mpg: isNaN(this.numToFixed(totalFill / totalKm * 100)) ? 0 : this.numToFixed(totalFill / totalKm * 100),
        costPK: isNaN(this.numToFixed(totalCost / totalKm)) ? 0 : this.numToFixed(totalCost / totalKm)
      }
    }
  },

  components: {
    mpModal,
    mpButton
  },

  methods: {
    getData () {
      try {
        let arr = wx.getStorageSync('recordData') || []
        this.recordData = arr.sort(compare('km'))
        console.log(this.recordData)
        for (let item of this.recordData) {
          item.unitPrice = Number(item.amount) / Number(item.fill)
          console.log(item.unitPrice)
          for (let key in item) {
            switch (key) {
              case 'date':
                break
              default:
                item[key] = this.numToFixed(item[key])
            }
          }
        }
      } catch (e) {
        // Do something when catch error
      }
    },
    submit () { // 保存
      try {
        wx.setStorageSync('recordData', this.recordData)
      } catch (e) { }
    },
    floatDiv (num1, num2) {
      return this.numToFixed(Number(num1) / Number(num2))
    },
    deleteItem (i) { // 删除本条
      this.deleteIndex = i
      this.$refs.mpModal.show()
    },
    confirmDelete () { // 确认删除
      this.recordData.splice(this.deleteIndex, 1)
      this.submit()
    },
    cancelDelete () { // 取消删除
      this.deleteIndex = ''
    },
    numToFixed (v, n) { // 四舍五入
      return formatToFixed(v, n)
    },
    navigateTo (url) {
      wx.navigateTo({ url: url })
    }
  },
  onShow () {
    this.getData()
  }
}
</script>

<style scoped>
  .record{
    background: #eee;
  }
  .record .total{
    margin-bottom: 10px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .record .total .panel{
    color: #fff;
    font-weight: bold;
    padding: 15px;
  }
  .bg-green{
    background: #78ba00;
  }
  .bg-yellow{
    background: #ff9900;
  }
  .record .total .panel .title{
    font-size: 20px;
  }
  .record .total .panel .result{
    display: flex;
    font-size: 30px;
  }
  .record .total .panel .result .value{
    flex: 1;
  }
  .record .total .panel .result .unit{
    opacity: 0.5;
  }
  .weui-form-preview{
    margin-bottom: 10px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
  .weui-form-preview:after,
  .weui-form-preview:before{
    display: none;
  }
  .weui-form-preview__hd:after{
    left: 0;
  }
  .weui-form-preview__value{
    font-size: 16px;
  }
  .weui-form-preview__btn_warn{
    color: #fa5151;
  }
  .tips{
    padding: 0 10px 10px;
    color: #999;
    font-size: 12px;
  }
  .btn-box{
    background: #fff;
    padding: 10px;
  }
</style>
