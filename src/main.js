import App from './App.vue';
import Vue from 'vue';
import xChart from '../comp/index'
import router from './router/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import PageForm from '../examples/utils/PageForm'
import PageTable from './components/PageTable/index'
import http from './utils/http'
import store from './store'
import FormBuild from '@/views/draw/build/index';
import smartRem from 'smart-rem'
smartRem(1920);
import '@/assets/font/font.css';
import '../src/style/index.scss'

let w = document.getElementsByTagName('script');
console.log(w)

Vue.use(xChart);
Vue.use(ElementUI);
Vue.use(FormBuild);
Vue.component('PageForm', PageForm);
Vue.component('PageTable', PageTable);

Vue.prototype.http = http;
Vue.prototype.$Bus = new Vue();

Vue.filter('locale', function (val) {
  val = parseInt(val);
  return Number.isFinite(val) ? val.toLocaleString('zh', { style: 'decimal' }) : 0;
});

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

