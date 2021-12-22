import ClBubble from './src/bubble'

ClBubble.install = function(Vue) {
  Vue.component(ClBubble.name, ClBubble);
};

export default {
  component: ClBubble,
  name: '气泡图',
  backgroundImage: require('../assets/bubble.png'),
  deployOption: {}
};
