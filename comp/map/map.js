import ClMap from './src/map'

ClMap.install = function(Vue) {
  Vue.component(ClMap.name, ClMap);
};

export default {
  component: ClMap,
  name: '地图',
  backgroundImage: require('../assets/map.png'),
  deployOption: {
    showVisualMap: true,
    migration: true,
  }
};
