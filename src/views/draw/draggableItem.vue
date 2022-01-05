<script>
  import draggable from 'vuedraggable'
  import echartMixin from './build/mixins';

  const components = {
    /*itemBtns(h, currentItem, index, list) {
      const { copyItem, deleteItem } = this.$listeners;
      return `[
        <span class="drawing-item-copy" title="复制" onClick={event => {
        copyItem(currentItem, list); event.stopPropagation()
      }}>
    <i class="el-icon-copy-document" />
        </span>,
        <span class="drawing-item-delete" title="删除" onClick={event => {
        deleteItem(index, list); event.stopPropagation()
      }}>
    <i class="el-icon-delete" />
        </span>
    ]`
    },*/
    vnBtns(h, currentItem, index, list) {
      const { copyItem, deleteItem, editItem } = this.$listeners;
      let copyBtn = h('span', {
        class: 'drawing-item-copy',
        props: {
          title: '复制',
        },
        on: {
          click: () => {
            copyItem(currentItem, list);
            event.stopPropagation();
          }
        }
      }, [h('i', {class: 'el-icon-copy-document'}, [])]);
      let deleteBtn = h('span', {
        class: 'drawing-item-delete',
        props: {
          title: '删除',
        },
        on: {
          click: () => {
            deleteItem(index, list);
            event.stopPropagation();
          }
        }
      }, [h('i', {class: 'el-icon-delete'}, [])]);
      let editBtn = h('span', {
        class: 'drawing-item-edit',
        props: {
          title: '编辑',
        },
        on: {
          click: () => {
            editItem(index, list, currentItem);
            event.stopPropagation();
          }
        }
      }, [h('i', {class: 'el-icon-edit'}, [])]);
      return currentItem.type === 'chartContainer' ? [copyBtn, editBtn, deleteBtn] : [copyBtn, deleteBtn];
    }
  };
  const layoutt = {
    rowFrame(h, currentItem, index, list, parentDirection) {
      const { activeItem, end } = this.$listeners;
      const config = currentItem;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = currentItem.children.length > 0 && renderChildren.apply(this, arguments) || null;
      let name = h('span', { class: 'component-name' }, config.componentName);
      let minHeight = config.type !== 'canvas' ? {minHeight: '60px'} : {};
      let draggable = h('draggable', {
        on: {
          'end': (e) => {
            e.stopPropagation();
            end(e, currentItem);
          }
        },
        props: {
          animation: 340,
          group: 'componentsGroup',
          list: config.children || []
        },
        attrs: {
          animation: 340,
          group: 'componentsGroup',
          list: config.children || [],
          formId: config.formId
        },
        style: {
          width: '100%',
          ...config.style,
          ...minHeight
        },
        class: 'drag-wrapper'
      }, child);
      if (config.type === 'canvas') {
        draggable = h('draggable', {
          props: {
            animation: 340,
            group: 'componentsGroup',
            list: config.children || []
          },
          attrs: {
            animation: 340,
            group: 'componentsGroup',
            list: config.children || []
          },
          style: {
            width: '100%',
            height: '100%',
            flexDirection: config.style.flexDirection,
            display: 'flex',
          },
          class: 'drag-wrapper'
        }, child)
      }
      // let back = config.style.backgroundImg && require(`../../assets/backV/${config.style.backgroundImg}`) || '';
      // 编辑额外配置项
      let otherOption = {};
      if ( config.type === 'chartContainer' || config.type === 'title' || config.type === 'canvas' || config.type === 'container') {
        otherOption['padding'] = '10px'
      }
      // 拼接单位
      let utils = {};
      if (config.type === 'container') {
        utils.marginTop = config.style.marginTop.toString() + 'px';
        utils.marginBottom = config.style.marginBottom.toString() + 'px';
        utils.marginLeft = config.style.marginLeft.toString() + 'px';
        utils.marginRight = config.style.marginRight.toString() + 'px';
      }

      // 背景图
      let backOption = {};
      if (config.style.backgroundGroup && config.style.backgroundImage) {
        backOption = {
          background: 'url('+ require(`../../assets/group/${config.style.backgroundGroup}/${config.style.backgroundImage}`) +') no-repeat',
          backgroundSize: '100% 100%'
        }
      }

      // 解决元素被撑大问题
      let flexObj = {};
      if (config.type !== 'cChart' && config.type !== 'chartContainer' && config.type !== 'canvas') {
        flexObj = parentDirection === 'row' ?
          { width: 0 } : { height: 0 } || {};
      }

      return h('div', {
        on: {
          click: (e) => {
            e.stopPropagation();
            activeItem(currentItem);
          }
        },
        style: {
          ...config.style,
          ...backOption,
          ...otherOption,
          ...utils,
          ...flexObj
        },
        class: className,
        key: config.renderKey,
      }, [name, draggable, ...components.vnBtns.apply(this, arguments)]);
    },
    cChart(h, currentItem, index, list, conf, templateTheme) {
      const config = currentItem;
      const { activeItem } = this.$listeners;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let name = h('span', { class: 'component-name' }, config.componentName);
      // chart
      return h(config.layout, {
        props: {
          refName: config.componentName,
          ...config.props,
          theme: templateTheme || conf.theme || config.props.theme,
        }
      })
    },
    title(h, currentItem, index, list) {
      const { activeItem } = this.$listeners;
      const config = currentItem;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = renderChildren.apply(this, arguments);
      let name = h('span', { class: 'component-name' }, config.componentName);
      // 背景图
      let backOption = {};
      if (config.style.backgroundImage) {
        backOption = {
          background: 'url('+ require(`../../assets/dataV/${config.style.backgroundImage}`) +') no-repeat',
          backgroundSize: '100% 100%'
        }
      }
      let utils = {};
      utils.marginTop = config.style.marginTop && config.style.marginTop.toString() + 'px';
      utils.marginBottom = config.style.marginBottom && config.style.marginBottom.toString() + 'px';
      utils.marginLeft = config.style.marginLeft && config.style.marginLeft.toString() + 'px';
      utils.marginRight = config.style.marginRight && config.style.marginRight.toString() + 'px';
      return h('div', {
        on: {
          click: () => {
            event.stopPropagation();
            activeItem(currentItem);
          }
        },
        style: {
          ...config.style,
          padding: config.style.padding + 'px',
          fontSize: config.style.fontSize + 'px',
          height: config.style.height + 'px',
          // background: 'url('+ back +') 100% 100% no-repeat',
          ...backOption,
          ...utils
        },
        class: className,
        key: config.renderKey,
      }, [config.text, name, ...components.vnBtns.apply(this, arguments)]);
    }
  };
  function renderChildren(h, currentItem, index, list, conf, templateTheme) {
    const config = currentItem; // config parent
    if (!Array.isArray(config.children)) return null;
    return config.children.map((el, i) => {
      let layout = layoutt[el.layout];
      if (layout && el.type !== 'cChart') {
        return layout.call(this, h, el, i, config.children, currentItem.style.flexDirection)
      }
      if (el.type === 'cChart') {
        const layoutc = layoutt.cChart;
        return layoutc.call(this, h, el, i, config.children, this.formConf, this.templateTheme);
      }
      return layoutIsNotFound.call(this)
    })
  }
  function layoutIsNotFound() {
    throw new Error(`没有与${this.currentItem.layout}匹配的layout`)
  }
  export default {
    name: "DraggableItem",
    /*mixins: [echartMixin],*/
    components: {
      draggable
    },
    watch: {
      'drawingList': {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          // this.renderEChart();
        }
      }
    },
    props: [
      'currentItem',
      'index',
      'drawingList',
      'activeId',
      'formConf',
      'templateTheme'
    ],
    render(h) {
      const layout = layoutt[this.currentItem.layout];
      if (layout && this.currentItem.type !== 'cChart') {
        return layout.call(this, h, this.currentItem, this.index, this.drawingList, this.formConf.flexDirection)
      }
      /*if (this.currentItem.type === 'cChart') {
        const cChartLayout = layoutt.cChart;
        return cChartLayout.call(this, h, this.currentItem, this.index, this.drawingList, this.formConf, this.templateTheme)
      }*/
      return layoutIsNotFound.call(this)
    }
  }
</script>

