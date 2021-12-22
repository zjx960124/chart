import ClLine from './src/line'

ClLine.install = function(Vue) {
  Vue.component(ClLine.name, ClLine);
};

export default {
  component: ClLine,
  name: '折线图组件',
  backgroundImage: require('../assets/line.png'),
  deployOption: {
    showXSplitLine: false,
    showYSplitLine: true,
    showXAxisLine: false,
    showYAxisLine: false,
    smooth: true,
    girdLeft: '5%',
    girdTop: 20,
    girdRight: '2%',
    girdBottom: 40,
    lineWidth: 3
  }
};
