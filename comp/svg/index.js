import ClSvg from './src/svg'

ClSvg.install = function(Vue) {
  Vue.component(ClSvg.name, ClSvg);
};

export default {
  component: ClSvg,
  name: 'svg分布图',
  deployOption: {

  }
};
