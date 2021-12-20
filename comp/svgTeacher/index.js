import ClSvgTeacher from './src/svgTeacher'

ClSvgTeacher.install = function(Vue) {
  Vue.component(ClSvgTeacher.name, ClSvgTeacher);
};

export default {
  component: ClSvgTeacher,
  name: 'svg结构图',
  deployOption: {

  }
};
