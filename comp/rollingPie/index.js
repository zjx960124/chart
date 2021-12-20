import ClRollingPie from './src/rollingPie'

ClRollingPie.install = function(Vue) {
  Vue.component(ClRollingPie.name, ClRollingPie);
};

export default {
  component: ClRollingPie,
  name: '滚动饼图',
  deployOption: {}
};
