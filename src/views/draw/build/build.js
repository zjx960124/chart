import current from 'element-ui/packages/table/src/store/current'

let fitChartWidth = (size, defalteWidth = 1920) => {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (!clientWidth || !size) return size;
  let scale = (clientWidth / defalteWidth);
  return `${parseFloat(size*scale).toFixed(8)}px`;
};
let fitChartHeight = (size, defalteHeight = 1080) => {
  let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (!clientHeight || !size) return size;
  let scale = (clientHeight / defalteHeight);
  return `${parseFloat(size*scale).toFixed(8)}px`;
};

const componentObj = {
  'rowFrame': function generateFrameComponent(h, obj, conf, bool, parentDirection, vm) {
    let currentDirection = parentDirection;
    let current = obj;
    // bool gutters
    /*if (obj.children.length > 1 && obj.children[0].type !== 'title') {
      currentDirection = obj.type === 'canvas' ? conf.flexDirection : obj.style.flexDirection;
    }
    let key = currentDirection === 'row' && 'margin-right' || 'margin-bottom';
    let gutters = !bool && { [key]: conf.gutter + 'px' } || {};
    let border = obj.children.length > 1 && obj.children[0].type !== 'container' && {'border': '1px solid #04E0E0'} || {};
    gutters = {...gutters};*/
    let children = [];
    // 子元素
    if (current.children.length > 0) {
      children = current.children.map((item, index) => {
        let func = item.type === 'cChart' ? componentObj['cChart'] : componentObj[item.layout];
        let component = func? func.call(
          vm, h, item, conf, current.children.length === index + 1, current.style.flexDirection || 'row', vm
        ) : null;
        return component;
      })
    }
    // 背景图
    let backOption = {};
    if (current.style.backgroundGroup && current.style.backgroundImage) {
      backOption = {
        background: 'url('+ require(`../../../assets/group/${current.style.backgroundGroup}/${current.style.backgroundImage}`) +') no-repeat',
        backgroundSize: '100% 100%'
      }
    }
    // 画布
    if (current.type === 'canvas') {
      delete current.style.width;
      delete current.style.height;
      current.style.flex = 1;
    }
    // 解决元素被撑大问题
    let flexObj = {};
    if (current.type !== 'cChart' && current.type !== 'chartContainer') {
      flexObj = currentDirection === 'row' ?
        { width: 0 } : { height: 0 } || {};
    }
    // 内联style自适应
    let border = {};
    if (current.type === 'container') {
      border = {
        marginTop: fitChartHeight(current.style.marginTop),
        marginBottom: fitChartHeight(current.style.marginBottom),
        marginLeft: fitChartWidth(current.style.marginLeft),
        marginRight: fitChartWidth(current.style.marginRight)
      }
    }
    if (current.type === 'chartContainer') {
      border = {
        paddingTop: fitChartHeight(current.style.paddingTop),
        paddingBottom: fitChartHeight(current.style.paddingBottom),
        paddingLeft: fitChartWidth(current.style.paddingLeft),
        paddingRight: fitChartWidth(current.style.paddingRight)
      }
    }
    return h('div', {
      style: {
        ...current.style,
        ...backOption,
        ...border
      },
      ref: current.renderKey,
      key: current.renderKey,
    }, children)
  },
  'title': function generateTitleComponent(h, obj, conf, bool, parentDirection, vm) {
    // 背景图
    let backOption = {};
    if (obj.style.backgroundImage) {
      backOption = {
        background: 'url('+ require(`../../../assets/dataV/${obj.style.backgroundImage}`) +') no-repeat',
        backgroundSize: '100% 100%'
      }
    }
    let border = {
      marginTop: fitChartHeight(obj.style.marginTop),
      marginBottom: fitChartHeight(obj.style.marginBottom),
      marginLeft: fitChartWidth(obj.style.marginLeft),
      marginRight: fitChartWidth(obj.style.marginRight)
    };
    return h('div', {
      style: {
        ...obj.style,
        fontSize: obj.style.fontSize + 'px',
        height: obj.style.height + 'px',
        ...backOption,
        ...border
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
export default componentObj
