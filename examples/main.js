// @ts-ignore
import App from './App.vue'
import Vue from 'vue'
import xChart from '../comp/index'
import http from './utils/http'
// 注册组件库
Vue.use(xChart);

Vue.prototype.http = http;

new Vue({
  el: '#app',
  render: h => h(App)
});
