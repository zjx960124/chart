const modulesFiles = require.context("/comp/", true,  /.js$/);

let comp = [];

modulesFiles.keys().forEach(key => {
  if (key === './index.js') return;
  modulesFiles(key).default && (comp = comp.concat(modulesFiles(key).default))
});

const install = function(Vue, opts = {}) {

  comp.forEach(component => {
    Vue.component(component.component.name, component.component);
  });
  Vue.prototype && (Vue.prototype.$cChart = comp);

};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
}
