<template>
  <el-dialog
    title="编辑图表"
    :visible.sync="currentVisible"
    width="80%"
    class="widget-deploy-dialog"
    @close="close"
  >
    <div class="widget-deploy">
      <div class="left">
        <el-collapse v-model="activeNames">
          <!--<el-collapse-item title="数据模型" name="1">
            <el-form
              :model="widgetItem.props"
              label-width="80px"
              label-position="left"
            >
              <el-form-item label="数据源">
                <el-select
                  v-model="widgetItem.props.dataModel"
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
            </el-form>
          </el-collapse-item>-->
          <el-collapse-item title="主题风格" name="2">
            <!--<div class="attr-item">
              <span>风格文件:</span>
              <el-select
                v-model="widgetItem.props.theme"
                @change="changeTheme"
              >
                <el-option
                  v-for="(item, index) in themeFileList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>-->
            <el-form
              :model="widgetItem.props"
              label-width="80px"
              label-position="left"
            >
              <el-form-item label="风格">
                <el-select
                  v-model="widgetItem.props.theme"
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
            <!--<div class="attr-item">
              <span>类目轴:</span>
              <el-select
                v-model="widgetItem.props.category"
                @change="changeCategory"
              >
                <el-option
                  v-for="(item, index) in dimension"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
            <div class="attr-item">
              <span>图例:</span>
              <el-select
                v-model="widgetItem.props.legend"
                @change="changeLegend"
              >
                <el-option
                  v-for="(item, index) in dimension"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>-->
            <el-form
              :model="widgetItem.props"
              label-width="80px"
              label-position="left"
            >
              <el-form-item label="类目轴">
                <el-select
                  v-model="widgetItem.props.category"
                  @change="changeCategory"
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
                  v-model="widgetItem.props.legend"
                  @change="changeLegend"
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
              :model="widgetItem.props.deployOption"
              class="chart-form"
            ></page-form>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="center">
        <el-form
          :model="widgetItem.props"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="数据集">
            <el-select
              v-model="widgetItem.props.DSId"
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
          <el-form-item label="sql">
            <el-input v-model="widgetItem.props.sql" size="small"></el-input>
          </el-form-item>
          <el-form-item label="数据源">
            <el-select
              v-model="widgetItem.props.datasourceId"
              @change="changeChartData"
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
        <div class="comp">
          <component
            :is="widgetItem.layout"
            :key="widgetItem.renderKey || '1'"
            :ref-name="widgetItem.renderKey"
            :style="widgetItem.props.styleOption"
            :theme="widgetItem.props.theme"
            :datasource-id="widgetItem.props.datasourceId"
            :legend="widgetItem.props.legend"
            :category="widgetItem.props.category"
            :sql="widgetItem.props.sql"
            :d-s-id="widgetItem.props.DSId"
            :deploy-option="widgetItem.props.deployOption"
          ></component>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sure">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'WidgetDeploy',
    props: {
      visible: Boolean,
      widgetItem: Object
    },
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
        },
        heightLightColor: {
          name: '非高亮背景色',
          precondition: 'hasBackground',
          type: 'colorPicker'
        }
      };
      return {
        chartOption,
        currentVisible: this.visible,
        deployOption: {},
        activeNames: '1',
        category: '',
        legend: '',
        sql: '',
        comp: '',
        refName: '',
        styleOption: '',
        dataModel: '',
        theme: '',
        themeFileList: this.$theme,
        dimension: [],
        dataSourceList: [],
        DSList: []
      }
    },
    created() {
    },
    methods: {
      init() {
        console.log(this.widgetItem);
        console.log(this.$cChart);
        let compProps = this.$cChart.find( item => item.component.name === this.widgetItem.layout );
        console.log(compProps)
        this.deployOption = {...compProps.deployOption, ...this.widgetItem.props.deployOption} || {};
        this.getDataSourceList();
        this.getDSList();
        this.getChartData();
      },
      changeChartData() {},
      changeTheme(val) {
        this.widgetItem.props.theme = val;
      },
      changeCategory() {},
      changeLegend() {},
      getDataSourceList() {
        this.http.get('/rest/report/data-source-info/list')
          .then(res => {
            console.log(res);
            this.dataSourceList = res.data;
          })
      },
      getDSList() {
        this.http.get('/rest/report/data-sql/list')
          .then(res => {
            this.DSList = res.data;
          })
      },
      getChartData() {
        this.http.get('/rest/report/sql', {
          datasourceId: this.widgetItem.props.dataModel,
          sql: this.widgetItem.props.sql
        })
          .then((res) => {
            let data = res.data;
            this.dimension = data.columns.splice(1, data.columns.length);
          })
      },
      /**
       * 修改数据集
       */
      changeDS(val) {
        let data = this.DSList.find((item, index) => {return item.id === val});
        this.widgetItem.props.sql = data.sqlValue;
        this.widgetItem.props.datasourceId = data.datasourceId;
        this.getChartData();
      },
      close() {
        this.currentVisible = false;
        this.$emit('update:visible', false);
      },
      sure() {
        this.$emit('update:visible', false);
        this.$emit('changeWidget', this.widgetItem);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .widget-deploy-dialog {
    font-size: 14px;
    height: 100vh;
    overflow-y: auto;
    .widget-deploy {
      display: flex;
      align-items: center;
      height: 75vh;
      overflow-y: auto;
      .left {
        height: 100%;
        width: 0;
        flex: 270;
        background: #ffffff;
        padding: 0 6px;
        overflow-y: auto;
        ::v-deep .el-collapse-item__content {
          padding-bottom: 0;
        }
      }
      .center {
        height: 100%;
        width: 0;
        flex: 1139;
        margin: 0 20px;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        text-align: left;
        .category {
          height: 48px;
          width: 100%;
          background: #ffffff;
          line-height: 48px;
          display: flex;
          padding: 0 20px;
          align-items: center;
          ::v-deep .el-input-group {
            width: 90%;
          }
        }
        .comp {
          flex: 1;
          height: calc(100% - 48px);
          width: 100%;
          background: #ffffff;
          padding: 20px;
          box-sizing: border-box;
          display: flex;
        }
      }
    }
  }
</style>
