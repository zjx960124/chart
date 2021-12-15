// form-build.js
import componentObj from './build';
import { version } from '../../../../package';
import echartMixin from './mixins';

const formBuild = {
  // mixins: [echartMixin],
  props: {
    options: {
      type: Object,
      required: true
    },
  },
  watch: {
    'options': {
      deep:true, //深度监听设置为 true
      handler: function (newV, oldV) {
        // this.renderEChart();
      }
    }
  },
  render(h) {
    const options = this.options;
    const layouts = options.layouts;
    const conf = options.conf; // 画布属性, 根属性
    const childComp = [];
    if(!layouts) return;
    console.log(layouts)
    const layoutComponents = layouts.map((item, index) => {
      let func = item.type === 'cChart' ? componentObj['cChart'] : componentObj[item.layout];
      return func ? func.call(this, h, item, conf, layouts.length === index + 1, conf.flexDirection, this) : null;
    });
    childComp.push(layoutComponents);
    return h('div', {
      attrs: {class: 'flex-view'},
      style: {
        display: 'flex',
        flex: 1,
        flexDirection: conf.flexDirection
      }
      }, [childComp]);
  },
}

const install = function (Vue, ops = {}) {
  Vue.component('formBuild', formBuild)
}

const API = {
  install,
  version
}

if (typeof window !== 'undefined' && window.vue) {
  install(window.vue)
}

export default API
