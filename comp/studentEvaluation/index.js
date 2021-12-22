import ClStudentEvaluation from './src/studentEvaluation'

ClStudentEvaluation.install = function(Vue) {
  Vue.component(ClStudentEvaluation.name, ClStudentEvaluation);
};

export default {
  component: ClStudentEvaluation,
  name: '学生月评TOP10组件',
  backgroundImage: require('../assets/shuffingTop10.png'),
  deployOption: {
    animationTime: 40,
  }
};
