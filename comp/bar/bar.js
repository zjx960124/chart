import ClBar from './src/bar'

ClBar.install = function(Vue) {
  Vue.component(ClBar.name, ClBar);
};

export default {
  component: ClBar,
  name: '柱状图组件',
  deployOption: {
    barWidth: 6,
    legendBottom: 0,
    legendLeft: 0,
    legendRight: 0,
    yAxisName: ''
  }
};
