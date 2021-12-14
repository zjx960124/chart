// @ts-ignore
import App from './App.vue'
import Vue from 'vue'
import xChart from '../comp/index'
import http from './utils/http'
import router from './utils/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import PageForm from './utils/PageForm'
import smartRem from 'smart-rem'
smartRem(1920);

// 注册组件库
Vue.use(xChart);
Vue.use(ElementUI);
Vue.component('PageForm', PageForm);

Vue.prototype.http = http;

new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
