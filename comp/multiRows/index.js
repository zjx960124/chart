import ClMultiRows from './src/multiRows'

ClMultiRows.install = function(Vue) {
  Vue.component(ClMultiRows.name, ClMultiRows);
};

export default {
  component: ClMultiRows,
  name: '办学规模',
  backgroundImage: require('../assets/bxgm.png'),
  deployOption: {}
};
