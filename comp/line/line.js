import ClLine from './src/line'

ClLine.install = function(Vue) {
  Vue.component(ClLine.name, ClLine);
};

export default {
  component: ClLine,
  name: '折线图组件',
};
