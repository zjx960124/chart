import ClBattery from './src/battery'

ClBattery.install = function(Vue) {
  Vue.component(ClBattery.name, ClBattery);
};

export default {
  component: ClBattery,
  name: '电池图',
  deployOption: {
  }
};
