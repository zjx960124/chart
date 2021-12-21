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
    yAxisName: '',
    showXAxisLine: false,
    showYAxisLine: false,
    showXSplitLine: false,
    showYSplitLine: false,
    girdLeft: '5%',
    girdTop: 20,
    girdRight: '2%',
    girdBottom: 40,
    isTransverse: false,
    barBorderRadius: 0,
    barGap: '100%',
    seriesLabelShow: false,
    seriesLabelPosition: 'top'
  }
};
