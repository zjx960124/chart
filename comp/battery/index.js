import ClBattery from './src/battery'

ClBattery.install = function(Vue) {
  Vue.component(ClBattery.name, ClBattery);
};

export default {
  component: ClBattery,
  name: '电池图',
  backgroundImage: require('../assets/battery.png'),
  deployOption: {
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
    seriesLabelShow: false,
    seriesLabelPosition: 'top'
  }
};
