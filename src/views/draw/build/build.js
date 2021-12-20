import current from 'element-ui/packages/table/src/store/current'

const fitChartWidth = (size, defalteWidth = 1920) => {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (!clientWidth) return size;
  let scale = (clientWidth / defalteWidth);
  return `${(size*scale).toFixed(10)}px`;
};
const fitChartHeight = (size, defalteHeight = 1080) => {
  let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (!clientHeight) return size;
  let scale = (clientHeight / defalteHeight);
  return `${(size*scale).toFixed(10)}px`;
};

const componentObj = {
  'rowFrame': function generateFrameComponent(h, obj, conf, bool, parentDirection, vm) {
    let currentDirection = parentDirection;
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
    if (obj.children.length > 0) {
      children = obj.children.map((item, index) => {
        let func = item.type === 'cChart' ? componentObj['cChart'] : componentObj[item.layout];
        let component = func? func.call(
          vm, h, item, conf, obj.children.length === index + 1, obj.style.flexDirection || 'row', vm
        ) : null;
        return component;
      })
    }
    // 背景图
    let backOption = {};
    if (obj.style.backgroundGroup && obj.style.backgroundImage) {
      backOption = {
        background: 'url('+ require(`../../../assets/group/${obj.style.backgroundGroup}/${obj.style.backgroundImage}`) +') no-repeat',
        backgroundSize: '100% 100%'
      }
    }
    // 画布
    if (obj.type === 'canvas') {
      delete obj.style.width;
      delete obj.style.height;
      obj.style.flex = 1;
    }
    // 解决元素被撑大问题
    let flexObj = {};
    if (obj.type !== 'cChart' && obj.type !== 'chartContainer') {
      flexObj = currentDirection === 'row' ?
        { width: 0 } : { height: 0 } || {};
    }
    // 内联style自适应
    obj.style.marginLeft = fitChartWidth(obj.style.marginLeft, 1920);
    obj.style.marginRight = fitChartWidth(obj.style.marginRight, 1920);
    obj.style.marginTop = fitChartHeight(obj.style.marginTop, 1080);
    obj.style.marginBottom = fitChartHeight(obj.style.marginBottom, 1080);
    obj.style.paddingTop = fitChartHeight(obj.style.paddingTop, 1080);
    obj.style.paddingBottom = fitChartHeight(obj.style.paddingBottom, 1080);
    obj.style.paddingLeft = fitChartWidth(obj.style.paddingLeft, 1920);
    obj.style.paddingRight = fitChartWidth(obj.style.paddingRight, 1920);
    return h('div', {
      style: {
        ...obj.style,
        ...backOption,
        ...flexObj
      },
      ref: obj.componentName,
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
    obj.style.marginLeft = fitChartWidth(obj.style.marginLeft, 1920);
    obj.style.marginRight = fitChartWidth(obj.style.marginRight, 1920);
    obj.style.marginTop = fitChartHeight(obj.style.marginTop, 1080);
    obj.style.marginBottom = fitChartHeight(obj.style.marginBottom, 1080);
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
export default componentObj
