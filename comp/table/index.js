import ClTable from './src/table'

ClTable.install = function(Vue) {
  Vue.component(ClTable.name, ClTable);
};

export default {
  component: ClTable,
  name: '表格图',
  deployOption: {
  }
};
