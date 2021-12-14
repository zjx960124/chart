import ClKvBuild from './src/kvBuild'

ClKvBuild.install = function(Vue) {
  Vue.component(ClKvBuild.name, ClKvBuild);
};

export default {
  component: ClKvBuild,
  name: '键值对组件(建筑学院)',
  deployOption: {}
};
