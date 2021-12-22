import ClOAPreview from './src/OAPreview'

ClOAPreview.install = function(Vue) {
  Vue.component(ClOAPreview.name, ClOAPreview);
};

export default {
  component: ClOAPreview,
  name: 'OA流程一览',
  backgroundImage: require('../assets/OAyl.png'),
  deployOption: {}
};
