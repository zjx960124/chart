import current from 'element-ui/packages/table/src/store/current'

const fitChartWidth = (size, defalteWidth = 1920) => {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (!clientWidth) return size;
  let scale = (clientWidth / defalteWidth);
  return `${(size*scale).toFixed(10)}vw`;
}
const fitChartHeight = (size, defalteHeight = 1080) => {
  let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (!clientHeight) return size;
  let scale = (clientHeight / defalteHeight);
  return `${(size*scale).toFixed(10)}vh`;
}

const componentObj = {
  'input': function generateInputComponent(h, formData = {}, obj, vm)  {
    const key = obj.key || '';
    let children = [];

    if (obj.children) { // input有子集
      children = obj.children.map((item) => {
        let component
        if (item.type === 'span') {  //复合型输入框情况
          component = h('span', {
            slot: item.slot
          }, [item.text])
        } else {
          let func = componentObj[item.type]
          component = func? func.call(vm, h, formData, item, vm) : null
        }
        return component
      })
    }

    return h('el-input', {
      props: {
        value: key? formData[key] : '',
        ...obj.props
      },
      style: obj.style,
      on: {
        ...translateEvents(obj.events, vm), //时间绑定
        input(val) {
          if (key) {
            formData[key] = val
          }
        }
      },
      slot: obj.slot
    }, children)
    //事件bind
    function translateEvents(events = {}, vm, formData = {}) {
      const result = {}
      for (let event in events) {
        result[event] = events[event].bind(vm, vm, formData);
      }

      return result
    }
  },
  'select': function generateSelectComponent(h, formData = {}, obj, vm)  {
    const key = obj.key || '';
    let components = [];

    if (obj.children) {
      components = obj.children.map(item => {
        if (item.type === 'optionGroup') {
          return h('el-option', {
            props: item.props? item.props : item
          }, item.children.map(child => {
            return h('Option', {
              props: child.props ? child.props : child
            })
          }))
        } else {
          return h('el-option', {
            props: item.props? item.props : item
          })
        }
      })
    }

    return h('el-select', {
      props: {
        value: key? formData[key] : '',
        ...obj.props
      },
      style: obj.style,
      on: {
        ...translateEvents(obj.events, vm), //时间绑定
        input(val) {
          if (key) {
            formData[key] = val
          }
        }
      },
      slot: obj.slot
    }, components)
    //事件bind
    function translateEvents(events = {}, vm, formData = {}) {
      const result = {}
      for (let event in events) {
        result[event] = events[event].bind(vm, vm, formData);
      }
      return result
    }
  },
  'radio': function generateRadioComponent(h, formData = {}, obj, vm) {
    let key = obj.key || '';
    let components = [];

    if (obj.children) {
      components = obj.children.map(item => {
        if (item.type === 'optionGroup') {
          return h('el-option', {
            props: item.props? item.props : item
          }, item.children.map(child => {
            return h('Option', {
              props: child.props ? child.props : child
            })
          }))
        } else {
          return h('el-radio', {
            props: item.props? item.props : item
          }, item.text)
        }
      })
    }

    return h('el-radio-group', {
      props: {
        value: key? formData[key] : '',
        ...obj.props
      },
      style: obj.style,
      on: {
        ...translateEvents(obj.events, vm), //时间绑定
        input(val) {
          if (key) {
            formData[key] = val
          }
        }
      },
      slot: obj.slot
    }, components)
    //事件bind
    function translateEvents(events = {}, vm, formData = {}) {
      const result = {}
      for (let event in events) {
        result[event] = events[event].bind(vm, vm, formData);
      }
      return result
    }
  },
  'collapse': function generateCollapseComponent(h, formData = {}, obj, vm)  {
    const key = obj.key || '';
    let children = [];

    if (obj.children) { // input有子集
      children = obj.children.map((item) => {
        let component
        if (item.type === 'span') {  //复合型输入框情况
          component = h('span', {
            slot: item.slot
          }, [item.text])
        } else {
          let func = componentObj[item.type]
          component = func? func.call(vm, h, formData, item, vm) : null
        }
        return component
      })
    }

    return h('el-collapse', {
      props: {
        ...obj.props,
      },
      style: obj.style,
      slot: obj.slot
    }, children)
    //事件bind
    function translateEvents(events = {}, vm, formData = {}) {
      const result = {}
      for (let event in events) {
        result[event] = events[event].bind(vm, vm, formData);
      }

      return result
    }
  },
  'collapse-item': function generateCollapseComponent(h, formData = {}, obj, vm)  {
    const key = obj.key || '';
    let children = [];

    if (obj.children) { // input有子集
      children = obj.children.map((item) => {
        let component
        if (item.type === 'span') {  //复合型输入框情况
          component = h('span', {
            slot: item.slot
          }, [item.text])
        } else {
          // let func = componentObj[item.type]
          // component = func? func.call(vm, h, formData, item, vm) : null
          component = h('div', {}, [item.text])
        }
        return component
      })
    }
    console.log(obj)
    return h('el-collapse-item', {
      props: {
        ...obj.props,
        title: obj.props.title
      },
      domProps: {
        title: obj.title
      },
      style: obj.style,
      slot: obj.slot
    }, children)
  },
  'formItem': function generateFormItemComponent(h, option, component, formData) {
    return h('el-form-item', {
      style: option.style ? option.style : '',
      props: {
        model: option.key,
        label: option.label
      }
    }, [component])
  },
  'col': function generateColComponent(h, option, component, formData) {
    console.log(arguments)
    return h('el-col', {
      props: option.props
    }, [component])
  },
  'events': function generateEventsComponent(h, formData = {}, obj, vm) {
    const components = [];
    if(obj.submit) {
      const submit = h('el-button', {
        props: obj.submit.props,
        style: obj.submit.style,
        class: obj.submit.className,
        on: {
          click() {
            //提交前校验
            console.log(formData)
            vm.$refs[obj.ref].validate((valid) => {
              if (valid) {
                obj.submit.success.call(vm, formData, vm)
              } else {
                obj.submit.fail.call(vm, formData, vm)
              }
            })
          }
        }
      }, [obj.submit.text])

      components.push(submit)
    }
    if (obj.reset) {
      const reset = h('el-button', {
        props: obj.reset.props,
        style: {
          ...obj.reset.style,
        },
        class: obj.reset.className,
        on: {
          click() {
            console.log(formData)
            vm.$refs[obj.ref].resetFields() //重置表单
            obj.reset.success.call(vm, formData, vm);
          }
        }
      }, [obj.reset.text])

      components.push(reset)
    }

    return h('el-col',{
      class: 'vue-events',
      style: {
        ...obj.style
      }
    }, components)
  },
  'div': function generateDivComponent(h, obj, vm) {
    const key = obj.key || '';
    let children = [];
    if (obj.children) { // input有子集
      children = obj.children.map((item) => {
        let func = componentObj[item.type];
        let component = func? func.call(vm, h, item, vm) : null;
        return component;
      })
    }
    return h('div', {
      props: {
        ...obj.props,
      },
      class: obj.className,
      style: obj.style,
      slot: obj.slot
    }, children)
  },
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
    if (obj.style.backgroundImage) {
      backOption = {
        background: 'url('+ require(`../../../assets/backV/${obj.style.backgroundImage}`) +') no-repeat',
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
    if (obj.style.backgroundImage) {
      backOption = {
        background: 'url('+ require(`../../../assets/dataV/${obj.style.backgroundImage}`) +') no-repeat',
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
export default componentObj
