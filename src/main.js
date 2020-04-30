import 'mpvue-weui/src/style/weui.css'
import Vue from 'vue'
import App from './App'
import WXrequest from './utils/wx-request'
Vue.prototype.$httpWX = WXrequest

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
