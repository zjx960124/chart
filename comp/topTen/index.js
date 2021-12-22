import ClTopTen from './src/topTen'

ClTopTen.install = function(Vue) {
  Vue.component(ClTopTen.name, ClTopTen);
};

export default {
  component: ClTopTen,
  name: 'top10组件',
  backgroundImage: require('../assets/OATop10.png'),
  deployOption: {
    utils: '个'
  }
};
