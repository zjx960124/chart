import ClRollingTable from './src/rollingTable'

ClRollingTable.install = function(Vue) {
  Vue.component(ClRollingTable.name, ClRollingTable);
};

export default {
  component: ClRollingTable,
  name: '滚动表格',
  backgroundImage: require('../assets/shuffing.png'),
  deployOption: {}
};
