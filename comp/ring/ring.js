import ClRing from './src/ring'

ClRing.install = function(Vue) {
  Vue.component(ClRing.name, ClRing);
};

/*export default {
  component: ClRing,
  name: '圆角环形图组件',
  deployOption: {
    legendBottom: 0,
    legendLeft: 'center',
    legendOrient: 'vertical'
  }
};*/
