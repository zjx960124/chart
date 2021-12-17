import ClTurnPage from './src/turnPage'

ClTurnPage.install = function(Vue) {
  Vue.component(ClTurnPage.name, ClTurnPage);
};

export default {
  component: ClTurnPage,
  name: '翻页图',
  deployOption: {}
};
