import ClRings from './src/rings'

ClRings.install = function(Vue) {
  Vue.component(ClRings.name, ClRings);
};

export default {
  component: ClRings,
  name: '环形图',
  backgroundImage: require('../assets/ring.png'),
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
    itemNumber: '',
    hasBackground: false,
    heightLightIndex: '',
    heightLightColor: 'transparent'
  }
};
