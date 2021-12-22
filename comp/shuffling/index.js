import ClShuffling from './src/shuffling'

ClShuffling.install = function(Vue) {
  Vue.component(ClShuffling.name, ClShuffling);
};

export default {
  component: ClShuffling,
  name: '轮播图',
  backgroundImage: require('../assets/shuffing.png'),
  deployOption: {}
};
