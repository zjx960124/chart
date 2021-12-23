// form-build.js
const componentObj = {
  /*'rowFrame': function generateFrameComponent(h, obj, conf, gutter, bool, vm) {
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
  },*/
  'rowFrame': function generateFrameComponent(h, obj, conf, bool, parentDirection, vm) {
    let currentDirection = parentDirection;
    let key = currentDirection === 'row' && 'margin-right' || 'margin-bottom';
    if (obj.children.length > 1 && obj.children[0].type !== 'title') {
      currentDirection = obj.type === 'canvas' ? conf.flexDirection : obj.style.flexDirection;
    }
    let gutters = !bool && { [key]: conf.gutter + 'px' } || {};
    let border = obj.children.length > 1 && obj.children[0].type !== 'container' && {'border': '1px solid #04E0E0'} || {};
    gutters = {...gutters};
    let children = [];
    if (obj.children) {
      children = obj.children.map((item, index) => {
        let func = item.type === 'cChart' ? componentObj['cChart'] : componentObj[item.layout];
        let component = func? func.call(vm, h, item, conf, obj.children.length === index + 1, currentDirection, vm) : null;
        return component;
      })
    }
    // 背景图
    let backOption = {};
    let backV = '../../../assets/backV/';
    if (obj.style.backgroundImage) {
      backOption = {
        background: 'url('+ require(`${backV}${obj.style.backgroundImage}`) +') no-repeat',
        backgroundSize: '100% 100%'
      }
    }
    // 画布
    if (obj.type === 'canvas') {
      delete obj.style.width;
      delete obj.style.height;
      obj.style.flex = 1;
    }
    obj.marginTop = fitChartHeight(obj.marginTop, 1080);
    obj.marginBottom = fitChartHeight(obj.marginBottom, 1080);
    return h('div', {
      style: {
        ...gutters,
        ...obj.style,
        ...backOption,
        // border: obj.type === 'chartContainer' || obj.children.length === 0 ? '1px solid #04E0E0' : ''
      },
      ref: obj.componentName,
    }, children)
  },
  'title': function generateTitleComponent(h, obj, conf, bool, parentDirection, vm) {
    // 背景图
    let backOption = {};
    let dataV = '../../../assets/dataV/';
    if (obj.style.backgroundImage) {
      backOption = {
        background: 'url('+ require(`${dataV}${obj.style.backgroundImage}`) +') no-repeat',
        backgroundSize: '100% 100%'
      }
    }
    return h('div', {
      style: {
        ...obj.style,
        fontSize: obj.style.fontSize + 'px',
        ...backOption
      },
      ref: obj.componentName,
    }, [obj.text])
  },
  'cChart': function generateChartComponent(h, obj, conf, gutter, bool, vm) {
    return h(obj.layout, {
      props: {
        refName: 'build' + obj.componentName,
        styleOption: obj.props.styleOption,
        ...obj.props,
        theme: conf.theme || obj.props.theme
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
};

// tool 暂不管理解析器与组件库绑定
/*export default {
  component: pageBuild,
  name: '解析器',
}*/
