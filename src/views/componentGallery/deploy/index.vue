<template>
  <div class="deploy">
    <div class="header">
      <el-button @click="submitComp" type="primary" size="small">保存</el-button>
    </div>
    <div class="main">
      <div class="left">
        <el-collapse v-model="activeNames" @change="handleChange">
          <!--<el-menu
            default-active="1"
            class="el-menu-vertical-demo"
            @select="changeComp"
          >
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>图表选择</span>
              </template>
              <el-menu-item
                v-for="(item, index) in compList"
                :key="item.name"
                :index="item.component.name"
              >
                {{ item.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>-->
          <el-collapse-item title="图表选择" name="1">
            <div class="components-view">
              <div
                v-for="(element, index) in compList"
                :key="index"
                class="components-item"
                @click="changeComp(element)"
              >
                <div class="components-body">
                  <img :src="element.backgroundImage" class="components-image" />
                  <div class="components-label">{{ element.name }}</div>
                </div>
              </div>
            </div>
          </el-collapse-item>
          <!--<el-collapse-item title="数据模型" name="1">
            <el-form
              :model="props"
              label-width="120px"
              label-position="left"
            >
              <el-form-item label="数据源">
                <el-select
                  v-model="props.dataModel"
                  @change="changeChartData"
                  size="medium"
                >
                  <el-option
                    v-for="(item, index) in dataSourceList"
                    :key="index"
                    :label="item.dataSourceName"
                    :value="item.id.toString()"
                  ></el-option>
                </el-select>
              </el-form-item>
              &lt;!&ndash;<el-form-item>
                <el-button type="primary" size="small" @click="createDataModel">新增</el-button>
              </el-form-item>&ndash;&gt;
            </el-form>
          </el-collapse-item>-->
          <el-collapse-item title="主题风格" name="2">
            <el-form
              :model="props"
              label-width="120px"
              label-position="left"
            >
              <el-form-item label="风格">
                <el-select
                  v-model="props.theme"
                  @change="changeTheme"
                  size="medium"
                >
                  <el-option
                    v-for="(item, index) in themeFileList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="数据" name="3">
            <el-form
              :model="props"
              label-width="120px"
              label-position="left"
            >
              <el-form-item label="类目轴">
                <el-select
                  v-model="props.category"
                  size="medium"
                >
                  <el-option
                    v-for="(item, index) in dimension"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="图例">
                <el-select
                  v-model="props.legend"
                  size="medium"
                >
                  <el-option
                    v-for="(item, index) in dimension"
                    :key="index"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="样式" name="4">
            <page-form
              :fields="chartOption"
              label-position="left"
              :inline="false"
              :col-span="24"
              :model="props.deployOption"
              class="chart-form"
            ></page-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="center">
        <div class="category">
          <el-form
            :model="props"
            label-width="60px"
            label-position="right"
          >
            <el-form-item label="数据集:">
              <el-select
                v-model="props.DSId"
                @change="changeDS"
                size="medium"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in DSList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="sql:">
              <el-input v-model="props.sql" size="small"></el-input>
            </el-form-item>
            <el-form-item label="数据源:">
              <el-select
                v-model="props.datasourceId"
                size="medium"
                style="width: 100%"
              >
                <el-option
                  v-for="(item, index) in dataSourceList"
                  :key="index"
                  :label="item.dataSourceName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="comp">
          <component
            :is="comp"
            :ref-name="refName"
            :style="props.styleOption"
            :theme="props.theme"
            :datasource-id="props.datasourceId"
            :legend="props.legend"
            :category="props.category"
            :sql="props.sql"
            :deploy-option="props.deployOption"
            :d-s-id="props.DSId"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Deploy',
    data() {
      const chartOption = {
        gird: {
          name: '网格',
          type: 'input'
        },
        girdLeft: {
          name: '网格左间距',
          type: 'input'
        },
        girdTop: {
          name: '网格上间距',
          type: 'input'
        },
        girdRight: {
          name: '网格又间距',
          type: 'input'
        },
        girdBottom: {
          name: '网格下间距',
          type: 'input'
        },
        backgroundColor: {
          name: '背景颜色',
          type: 'colorPicker'
        },
        barWidth: {
          name: '柱子宽度',
          type: 'number'
        },
        legendTop: {
          name: '图例顶部距离',
          type: 'input'
        },
        legendBottom: {
          name: '图例底部距离',
          type: 'input'
        },
        legendLeft: {
          name: '图例左侧距离',
          type: 'input'
        },
        legendRight: {
          name: '图例右侧距离',
          type: 'input'
        },
        yAxisName: {
          name: 'Y轴名称',
          type: 'input'
        },
        lineColor: {
          name: '线条颜色',
          type: 'colorPicker'
        },
        pieCenterTop: {
          name: '饼图中点(顶部)',
          type: 'input'
        },
        pieCenterLeft: {
          name: '饼图中点(左侧)',
          type: 'input'
        },
        showXAxisLine: {
          name: '显示X轴轴线',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        showYAxisLine: {
          name: '显示Y轴轴线',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        showXSplitLine: {
          name: '显示X轴分隔线',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        showYSplitLine: {
          name: '显示Y轴分隔线',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        isTransverse: {
          name: '是否横向',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        legendOrient: {
          name: '图例布局朝向',
          type: 'select',
          enums: [
            {
              label: '横向',
              value: 'horizontal'
            },
            {
              label: '纵向',
              value: 'vertical'
            }
          ]
        },
        pieRadiusStart: {
          name: '半径起始值',
          type: 'input'
        },
        pieRadiusEnd: {
          name: '半径终止值',
          type: 'input'
        },
        pieRoseType: {
          name: '形状',
          type: 'select',
          enums: [
            {
              label: '常规图',
              value: false
            },
            {
              label: '玫瑰图',
              value: 'radius'
            }
          ]
        },
        itemNumber: {
          name: '分组数量',
          type: 'number'
        },
        utils: {
          name: '单位',
          type: 'input'
        },
        showVisualMap: {
          name: '视觉映射组件',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        migration: {
          name: '迁徙图',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        animationTime: {
          name: '动画播放时间',
          type: 'input'
        },
        smooth: {
          name: '平滑曲线',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        lineWidth: {
          name: '线条宽度',
          type: 'number'
        },
        barBorderRadius: {
          name: '柱子圆角',
          type: 'number'
        },
        barGap: {
          name: '柱子间距',
          type: 'input'
        },
        seriesLabelShow: {
          name: '显示图形文本标签',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        seriesLabelPosition: {
          name: '图形文本标签位置',
          type: 'select',
          precondition: 'seriesLabelShow',
          enums: [
            {
              label: '上',
              value: 'top'
            },
            {
              label: '下',
              value: 'bottom'
            },
            {
              label: '左',
              value: 'left'
            },
            {
              label: '右',
              value: 'right'
            }
          ]
        },
        hatBackSize: {
          name: '帽子数量',
          type: 'input'
        },
        hasBackground: {
          name: '背景图层',
          type: 'select',
          enums: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ]
        },
        heightLightIndex: {
          name: '高亮数据索引',
          precondition: 'hasBackground',
          type: 'number',
        }
      };
      return {
        chartOption,
        dataModelForm: {
          id: '',
          datasourceId: '',
          name: '',
          sqlValue: ''
        },
        comp: '',
        refName: 'row1',
        props: {
          theme: 'dark',
          category: '',
          legend: '',
          datasourceId: '',
          sql: '',
          styleOption: {
            flexDirection: '',
            display: 'flex',
            padding: '10',
            flex: 1,
            backgroundColor: '',
            color: ''
          },
          DSId: '',
          deployOption: {}
        },
        themeFileList: [],
        dataSourceList: [],
        DSList: [],
        activeNames: ['1', '2', '3', '4'],
        dimension: [],
        baseData: [],
        compPros: {},
      }
    },
    computed: {
      compList: function() {
        return this.$cChart
      }
    },
    created() {
      this.comp = this.$route.query.comp;
      this.compProps = this.$cChart.find( item => item.component.name === this.$route.query.comp );
      let modulesFiles = require.context("../../../../comp/conf/", true, /\.js$/);
      this.themeFileList = modulesFiles.keys().reduce((modules, modulePath) => {
        const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
        const value = modulesFiles(modulePath);
        modules.push({label: moduleName, value: moduleName})
        return modules;
      }, []);
      Promise.all([this.getCompProps(), this.getDataSourceList(), this.getDSList()])
      .then(res => {
        this.props.sql && this.props.datasourceId && this.getChartData();
      })
    },
    methods: {
      /**
       * 数据源列表
       */
      getDataSourceList() {
        this.http.get('/rest/report/data-source-info/list')
        .then(res => {
          this.dataSourceList = res.data;
        })
      },
      /**
       * 数据集列表
       */
      getDSList() {
        this.http.get('/rest/report/data-sql/list')
          .then(res => {
            this.DSList = res.data;
            // 默认请求数据
            // this.props.DSId = res.data[0].id;
            // this.props.datasourceId = res.data[0].datasourceId;
            // this.props.sql = res.data[0].sqlValue;
          })
      },
      /**
       * 获取组件配置
       */
      getCompProps() {
        this.http.get('/rest/report/chart/list', {name: this.comp})
        .then((res) => {
          let data = res.data.length > 0 ? JSON.parse(res.data[0].code).props : this.props;
          data.deployOption = {...this.compProps.deployOption, ...data.deployOption} || {};
          this.props = data;
        })
      },
      /**
       * 改变组件
       * @param index
       * @param indexPath
       */
      changeComp(data) {
        this.comp = data.component.name;
        this.compProps = this.$cChart.find( item => item.component.name === data.component.name );
        this.getCompProps();
      },
      /**
       * 改变类目轴
       * @param val
       */
      changeCategory(val) {
        this.category = val;
      },
      /**
       * 改变图例
       * @param val
       */
      changeLegend(val) {
        this.legend = val;
      },
      handleChange() {},
      /**
       * 改变风格文件
       * @param val
       */
      changeTheme(val) {},
      /**
       * 获取图表数据
       */
      getChartData() {
        if (!this.props.sql || !this.props.datasourceId) return false;
        this.http.get('/rest/report/sql/id', {
          id: this.props.DSId
        })
        .then((res) => {
          let data = res.data;
          this.dimension = data.columns.splice(1, data.columns.length);
          this.props.legend = this.dimension[0] || '';
          this.props.category = this.dimension[1] || '';
          this.baseData = res.data.rows;
        })
      },
      /**
       * 修改数据集
       */
      changeDS(val) {
        let data = this.DSList.find((item, index) => {return item.id === val});
        this.props.sql = data.sqlValue;
        this.props.datasourceId = data.datasourceId;
        this.getChartData();
      },
      /**
       * 提交组件修改
       */
      submitComp() {
        let param = {
          name: this.comp,
          code: JSON.stringify({
            backgroundImage: this.compProps.backgroundImage,
            layout: this.compProps.component.name,
            label: this.compProps.name,
            type: 'cChart',
            props: {
              ...this.props
            }
          })
        };
        this.http.post('/rest/report/chart', param)
        .then((res) => {
          console.log(res)
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .deploy {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    background: rgb(240, 242, 245);
    padding-bottom: 42px;
    .header {
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-shrink: 0;
      width: 100%;
      box-sizing: border-box;
      padding-right: 30px;
    }
    .main {
      flex: 1;
      height: 0;
      width: 100%;
      display: flex;
      .left {
        height: 100%;
        width: 0;
        flex: 304;
        background: #ffffff;
        padding: 0 11px;
        overflow-y: auto;
        .components-view {
          display: flex;
          flex-wrap: wrap;
          .components-item {
            display: inline-block;
            width: calc((100% - 15px) / 3);
            .components-body {
              box-sizing: border-box;
              cursor: pointer;
              .components-image {
                width: 100%;
                background: #000211;
                aspect-ratio: auto 88 / 64;
              }
              .components-label {
                font-size: 12px;
                line-height: 12px;
                text-align: center;
                color: #333333;
                font-family: PingFangSC-Medium;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              .svg-icon{
                color: #777;
                font-size: 15px;
              }
              &:hover {
                .components-label {
                  color: #1569EB;
                }
                .svg-icon {
                  color: #1569EB;
                }
              }
            }
          }
          .components-item:nth-child(3n + 2) {
            margin: 0 7px 10px;
          }
        }
        ::v-deep .el-collapse-item__content {
          padding-bottom: 0;
        }
        .el-menu-vertical-demo {
          text-align: left;
          border: none;
          ::v-deep .el-submenu {
            border: none;
          }
          ::v-deep .el-submenu__title {
            padding: 0 !important;
          }
        }
        ::v-deep .el-select {
          width: 100%;
          padding-right: 20px;
        }
      }
      .center {
        height: 100%;
        width: 0;
        flex: 1597;
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        text-align: left;
        background: rgb(240, 242, 245);
        .category {
          width: 100%;
          background: #ffffff;
          padding: 8px 20px;
          box-sizing: border-box;
          margin-bottom: 20px;
          height: 160px;
          ::v-deep .el-form-item {
            margin-bottom: 10px;
          }
        }
        .value {
          height: 48px;
          width: 100%;
          background: #ffffff;
          margin: 13px 0;
          line-height: 48px;
          padding-left: 20px;
          display: flex;
        }
        .comp {
          flex: 1;
          width: 100%;
          background: #ffffff;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
        }
      }
      .right {
        width: 0;
        height: 100%;
        flex: 150;
        background: #ffffff;
        .el-menu-vertical-demo {
          text-align: left;
        }
      }
    }
  }
</style>
