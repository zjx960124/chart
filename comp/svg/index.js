import ClSvg from './src/svg'

ClSvg.install = function(Vue) {
  Vue.component(ClSvg.name, ClSvg);
};

export default {
  component: ClSvg,
  name: '政治面貌',
  backgroundImage: require('../assets/zzmm.png'),
  deployOption: {

  }
};
