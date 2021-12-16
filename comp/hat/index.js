import ClHat from './src/hat'

ClHat.install = function(Vue) {
  Vue.component(ClHat.name, ClHat);
};

export default {
  component: ClHat,
  name: '博士帽图',
  deployOption: {
    hatBackSize: 8
  }
};
