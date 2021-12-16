import ClMultiRows from './src/multiRows'

ClMultiRows.install = function(Vue) {
  Vue.component(ClMultiRows.name, ClMultiRows);
};

export default {
  component: ClMultiRows,
  name: '多行组件(办学规模)',
  deployOption: {}
};
