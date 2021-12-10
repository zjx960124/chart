import ClRings from './src/rings'

ClRings.install = function(Vue) {
  Vue.component(ClRings.name, ClRings);
};

export default {
  component: ClRings,
  name: '环形图组件',
  deployOption: {
    legendBottom: '',
    legendLeft: '',
    legendTop: 'center',
    legendRight: 'center',
    legendOrient: 'vertical',
    pieCenterLeft: '',
    pieCenterTop: '',
    pieRadiusStart: '',
    pieRadiusEnd: '',
    pieRoseType: false,
    itemNumber: ''
  }
};
