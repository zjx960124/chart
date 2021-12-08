import ClRings from './src/rings'

ClRings.install = function(Vue) {
  Vue.component(ClRings.name, ClRings);
};

export default {
  component: ClRings,
  name: '环形图组件',
  deployOption: {
    legendBottom: 0,
    legendLeft: 'center',
  }
};
