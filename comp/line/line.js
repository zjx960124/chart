import ClLine from './src/line'

ClLine.install = function(Vue) {
  Vue.component(ClLine.name, ClLine);
};

export default {
  component: ClLine,
  name: '折线图组件',
  deployOption: {
    showXSplitLine: false,
    showYSplitLine: true,
    showXAxisLine: false,
    showYAxisLine: false,
    smooth: true,
    lineWidth: 5
  }
};
