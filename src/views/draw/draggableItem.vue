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
  }
  const layoutt = {
    /*rowFormItem(h, currentItem, index, list) {
      const { activeItem } = this.$listeners
      const config = currentItem
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item'
      let child = renderChildren.apply(this, arguments);
      return (
        <el-col span={24}>
        <el-row gutter={0} class={className}
      nativeOnClick={event => { activeItem(currentItem); event.stopPropagation() }}>
    <span class="component-name">{config.componentName}</span>
        <draggable list={config.children || []} animation={340}
      group="componentsGroup" class="drag-wrapper">
        {child}
        </draggable>
      {components.itemBtns.apply(this, arguments)}
    </el-row>
      </el-col>
    )
    },*/
    elForm(h, currentItem, index, list) {
      const { activeItem } = this.$listeners;
      const config = currentItem;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = renderChildren.apply(this, arguments);
      let name = h('span', { class: 'component-name' }, config.componentName);
      let draggable = h('draggable', {
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
          ...config.style
        },
        class: 'drag-wrapper'
      }, [child]);
      let form = h('el-form', {
        attrs: {
        },
        style: {
          width: '100%',
          height: '100%',
          ...config.style
        },
      }, [draggable]);
      return h('div', {
        on: {
          click: () => {
            activeItem(currentItem);
            event.stopPropagation();
          }
        },
        style: {
          ...config.style,
          padding: config.style.padding + 'px'
        },
        class: className,
      }, [name, form, ...components.vnBtns.apply(this, arguments)]);
    },
    elInput(h, currentItem, index, list) {
      const { activeItem } = this.$listeners;
      const config = currentItem;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = renderChildren.apply(this, arguments);
      let vNode = h('el-input', {
        props: {
          ...config.props,
        },
        attrs: {
          value: config.props.value
        },
        style: config.style,
        slot: config.slot
      }, child);
      return h('el-form-item', {
        attrs: {
          label: '输入框'
        }
      }, [vNode, ...components.vnBtns.apply(this, arguments)]);
    },
    elRadio(h, currentItem, index, list) {
      const { activeItem } = this.$listeners;
      const config = currentItem;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = renderChildren.apply(this, arguments);
      let vNode = h('el-radio', {
        props: {
          ...config.props,
        },
        attrs: {
          value: config.props.value
        },
        style: config.style,
        slot: config.slot
      }, child);
      return h('el-form-item', {
        attrs: {
          label: '输入框'
        }
      }, [vNode, ...components.vnBtns.apply(this, arguments)]);
    },
    echart(h, currentItem, index, list) {
      const config = currentItem;
      const { activeItem } = this.$listeners;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let name = h('span', { class: 'component-name' }, config.componentName);
      return h('div', {
        on: {
          click: () => {
            activeItem(currentItem);
            event.stopPropagation();
          }
        },
          class: className,
          style: {
            ...config.style,
          },
        attrs: {
          id: currentItem.componentName
        },
        ref: currentItem.componentName
        },[name, ...components.vnBtns.apply(this, arguments)]
      )
    },
    elTabs(h, currentItem, index, list) {
      const { activeItem } = this.$listeners;
      const config = currentItem;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = renderChildren.apply(this, arguments);
      let vNode = h('el-tabs', {
        props: {
          ...config.props,
        },
        style: config.style,
        slot: config.slot
      }, child);
      return h('div', {
        on: {
          click: () => {
            activeItem(currentItem);
            event.stopPropagation();
          }
        },
        class: className,
      }, [vNode, ...components.vnBtns.apply(this, arguments)]);
    },
    elTabPane(h, currentItem, index, list) {
      return h('el-tab-pane', {
        props: {
          ...currentItem.props,
        },
        style: currentItem.style,
        slot: currentItem.slot
      }, [])
    },
    elMenu(h, currentItem, index, list) {
      const { activeItem } = this.$listeners;
      const config = currentItem;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = renderChildren.apply(this, arguments);
      let vNode = h('el-menu', {
        props: {
          ...config.props,
        },
        on: {
        },
        mode: {
          value: config.props.mode
        },
        style: config.style,
        slot: config.slot
      }, child);
      return h('div', {
        on: {
          click: () => {
            activeItem(currentItem);
            event.stopPropagation();
          }
        },
        class: className,
      }, [vNode, ...components.vnBtns.apply(this, arguments)]);
    },
    elMenuItem(h, currentItem, index, list) {
      let i = h('i', {
        class: currentItem.iconClassName
      }, []);
      let span = h('span', {
        props: {
          ...currentItem.props
        }
      }, currentItem.content);
      return h('el-menu-item', {
        props: {
          index: (index + 1).toString()
        }
      }, [i, span])
    },
    // chart
    clSub(h, currentItem, index, list) {
      const config = currentItem;
      const { activeItem } = this.$listeners;
      return h('cl-sub', {
        props: {
          refName: config.componentName,
          styleOption: config.style,
          chartData: config.data
        }
      })
    },
    clDis(h, currentItem, index, list) {
      const config = currentItem;
      const { activeItem } = this.$listeners;
      const renderKey = config.formId + new Date();
      return h('cl-dis', {
        props: {
          refName: config.componentName,
          styleOption: config.style,
          chartData: config.data,
          sql: config.sql,
          dataModel: config.dataModel,
          category: config.category,
          legend: config.legend
        }
      })
    },
    clPie(h, currentItem, index, list) {
      const config = currentItem;
      const { activeItem } = this.$listeners;
      const renderKey = config.formId + new Date();
      return h('cl-pie', {
        props: {
          refName: config.componentName,
          styleOption: config.style,
          chartData: config.data
        }
      })
    },
    clLine(h, currentItem, index, list) {
      const config = currentItem;
      const { activeItem } = this.$listeners;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = renderChildren.apply(this, arguments);
      let name = h('span', { class: 'component-name' }, config.componentName);
      let childNode = h('cl-line', {
        props: {
          refName: config.componentName,
          styleOption: config.style,
          chartData: config.data,
          sql: config.sql,
          dataModel: config.dataModel,
          category: config.category,
          legend: config.legend
        }
      })
      return h('div', {
        on: {
          click: () => {
            activeItem(currentItem);
            event.stopPropagation();
          }
        },
        style: {
          ...config.style,
          padding: '10px'
        },
        class: className,
      }, [name, childNode, ...components.vnBtns.apply(this, arguments)]);
    },
    rowFrame(h, currentItem, index, list) {
      const { activeItem } = this.$listeners;
      const config = currentItem;
      const className = this.activeId === config.formId
        ? 'drawing-row-item active-from-item'
        : 'drawing-row-item';
      let child = renderChildren.apply(this, arguments);
      let name = h('span', { class: 'component-name' }, config.componentName);
      let minHeight = config.type !== 'canvas' ? {minHeight: '60px'} : {};
      let draggable = h('draggable', {
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
          ...config.style,
          ...minHeight
        },
        class: 'drag-wrapper'
      }, child);
      // let back = config.style.backgroundImg && require(`../../assets/backV/${config.style.backgroundImg}`) || '';
      // 背景图
      let backOption = {};
      if (config.style.backgroundImage) {
        backOption = {
          background: 'url('+ require(`../../assets/backV/${config.style.backgroundImage}`) +') no-repeat',
          backgroundSize: '100% 100%'
        }
      }
      return h('div', {
        on: {
          click: () => {
            activeItem(currentItem);
            event.stopPropagation();
          }
        },
        style: {
          ...config.style,
          padding: config.style.padding + 'px',
          // background: 'url('+ back +') 100% 100% no-repeat',
          ...backOption
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
      return h('div', {
        on: {
          click: () => {
            activeItem(currentItem);
            event.stopPropagation();
          }
        },
        style: {
          ...config.style,
          padding: config.style.padding + 'px',
          fontSize: config.style.fontSize + 'px',
          // background: 'url('+ back +') 100% 100% no-repeat',
          ...backOption
        },
        class: className,
        key: config.renderKey,
      }, [config.text, name, ...components.vnBtns.apply(this, arguments)]);
    }
  };
  function renderChildren(h, currentItem, index, list, conf, templateTheme) {
    const config = currentItem; // config parent
    if (!Array.isArray(config.children)) return null
    return config.children.map((el, i) => {
      const layout = layoutt[el.layout]
      if (layout && el.type !== 'cChart') {
        return layout.call(this, h, el, i, config.children)
        // return layout.call(this, h, el, i, list, config)
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
    mixins: [echartMixin],
    components: {
      draggable
    },
    watch: {
      'drawingList': {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderEChart();
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
      const layout = layoutt[this.currentItem.layout]
      if (layout && this.currentItem.type !== 'cChart') {
        return layout.call(this, h, this.currentItem, this.index, this.drawingList, this.formConf, this.templateTheme)
      }
      if (this.currentItem.type === 'cChart') {
        const cChartLayout = layoutt.cChart;
        return cChartLayout.call(this, h, this.currentItem, this.index, this.drawingList, this.formConf, this.templateTheme)
      }
      return layoutIsNotFound.call(this)
    }
  }
</script>

