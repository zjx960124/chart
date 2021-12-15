const modulesFiles = require.context("../comp", true,  /.js$/);

let comp = [];

modulesFiles.keys().forEach(key => {
  if (key === './index.js' || key === './utils/index.js' || key.indexOf("utils") > -1 ) return;
  modulesFiles(key).default && (comp = comp.concat(modulesFiles(key).default))
});

let themeFiles = require.context("../comp/conf/", true, /\.js$/);
let themeFileList = themeFiles.keys().reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
  const value = themeFiles(modulePath);
  modules.push({label: moduleName, value: moduleName});
  return modules;
}, []);


const install = function(Vue, opts = {}) {

  comp.forEach(component => {
    Vue.component(component.component.name, component.component);
  });
  Vue.prototype && (Vue.prototype.$cChart = comp);
  Vue.prototype && (Vue.prototype.$theme = themeFileList);
  // Vue.prototype && (Vue.prototype.$conf = confFileList);
  Vue.filter('locale', function (val) {
    return Number.isFinite(val) ? val.toLocaleString('zh', { style: 'decimal' }) : 0;
  })

};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
}
