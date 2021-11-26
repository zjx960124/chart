// form-build.js
const componentObj = {
  'rowFrame': function generateFrameComponent(h, obj, conf, gutter, bool, vm) {
    let key = conf.flexDirection === 'row' && 'margin-right' || 'margin-bottom';
    let gutters = !bool && { [key]: gutter + 'px' } || {};
    let children = [];
    if (obj.children) {
      children = obj.children.map((item, index) => {
        let func = item.type === 'cChart' ? componentObj['cChart'] : componentObj[item.layout];
        let component = func? func.call(vm, h, item, obj.style, gutter, obj.children.length === index + 1, vm) : null;
        return component;
      })
    }
    return h('div', {
      style: {
        ...obj.style,
        ...gutters
      },
      ref: obj.componentName,
    }, children)
  },
  'cChart': function generateChartComponent(h, obj, conf, gutter, bool, vm) {
    return h(obj.layout, {
      props: {
        refName: 'build' + obj.componentName,
        styleOption: obj.props.styleOption,
        ...obj.props
      }
    })
  },
};

const pageBuild = {
  name: 'PageBuild',
  props: {
    options: {
      type: Object,
      required: true
    },
  },
  watch: {
    'options': {
      deep:true, //深度监听设置为 true
      handler: function (newV, oldV) {
        // this.renderEChart();
      }
    }
  },
  render(h) {
    const options = this.options || {};
    const layouts = options.layouts || [];
    const conf = options.conf || {};
    const childComp = [];
    const layoutComponents = layouts.map((item, index) => {
      let func = item.type === 'cChart' ? componentObj['cChart'] : componentObj[item.layout];
      return func ? func.call(this, h, item, conf, conf.gutter, layouts.length === index + 1, this) : null;
    });
    childComp.push(layoutComponents);
    return h('div', {
      attrs: {class: 'flex-view'},
      style: {
        display: 'flex',
        flex: 1,
        flexDirection: conf.flexDirection
      }
    }, [childComp]);
  },
}

export default {
  component: pageBuild,
  name: '解析器',
}
