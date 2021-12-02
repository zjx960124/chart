import ClPie from './src/pie'

ClPie.install = function(Vue) {
  Vue.component(ClPie.name, ClPie);
};

export default {
  component: ClPie,
  name: '饼图组件',
  deployOption: {
    legendRight: '',
    legendTop: '',
    pieCenterLeft: '',
    pieCenterTop: ''
  }
};
