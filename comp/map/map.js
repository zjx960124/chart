import ClMap from './src/map'

ClMap.install = function(Vue) {
  Vue.component(ClMap.name, ClMap);
};

export default {
  component: ClMap,
  name: '基础地图组件',
  deployOption: {
  }
};
