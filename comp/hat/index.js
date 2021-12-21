import ClHat from './src/hat'

ClHat.install = function(Vue) {
  Vue.component(ClHat.name, ClHat);
};

export default {
  component: ClHat,
  name: '博士帽图',
  isChart: false,
  deployOption: {
    hatBackSize: 8
  }
};
