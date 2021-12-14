import ClStudentEvaluation from './src/studentEvaluation'

ClStudentEvaluation.install = function(Vue) {
  Vue.component(ClStudentEvaluation.name, ClStudentEvaluation);
};

export default {
  component: ClStudentEvaluation,
  name: '学生月评TOP10组件',
  deployOption: {
    animationTime: 40,
  }
};
