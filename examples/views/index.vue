<template>
  <div class="deploy">
    <div class="main">
      <div class="left">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-menu
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
          </el-menu>
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
          <!--<el-collapse-item title="数据" name="3">
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
          </el-collapse-item>-->
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
        <!--<div class="category">
          <el-form
            :model="props"
            label-width="80px"
            label-position="left"
          >
            <el-form-item label="数据集">
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
            <el-form-item label="sql">
              <el-input v-model="props.sql" size="small"></el-input>
            </el-form-item>
            <el-form-item label="数据源">
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
        </div>-->
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
    name: 'Home',
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
          type: 'input'
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
          name: '是否显示X轴轴线',
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
          name: '是否显示Y轴轴线',
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
        activeNames: '3',
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
      this.themeFileList = this.$theme;
      this.comp = this.$cChart[0].component.name;
      this.compProps = this.$cChart.find( item => item.component.name === this.comp );
      /*Promise.all([this.getCompProps(), this.getDataSourceList(), this.getDSList()])
        .then(res => {
          this.props.sql && this.props.datasourceId && this.getChartData();
        })*/
    },
    methods: {
      /**
       * 数据源列表
       */
      getDataSourceList() {
        this.http.get('/rest/report/data-source-info/list')
          .then(res => {
            console.log(res);
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
            console.log(this.props);
          })
      },
      /**
       * 改变组件
       * @param index
       * @param indexPath
       */
      changeComp(index, indexPath) {
        this.comp = index;
        this.compProps = this.$cChart.find( item => item.component.name === index );
        this.props.deployOption = {...this.compProps.deployOption} || {};
        // this.getCompProps();
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
        this.http.get('/rest/report/sql', {
          datasourceId: this.props.datasourceId,
          sql: this.props.sql
        })
          .then((res) => {
            let data = res.data;
            this.dimension = data.columns.splice(1, data.columns.length);
            this.baseData = res.data.rows;
          })
      },
      /**
       * 修改数据集
       */
      changeDS(val) {
        let data = this.DSList.find((item, index) => {return item.id === val});
        console.log(data);
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
            layout: this.compProps.component.name,
            label: this.compProps.name,
            type: 'cChart',
            props: {
              ...this.props
            }
          })
        }
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
    padding: 15px 50px;
    background-color: #ededed;
    .main {
      flex: 1;
      height: 0;
      width: 100%;
      display: flex;
      .left {
        height: 100%;
        width: 0;
        flex: 370;
        background: #ffffff;
        padding: 0 6px;
        overflow-y: auto;
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
        flex: 1139;
        margin-left: 20px;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        text-align: left;
        .category {
          width: 100%;
          background: #ffffff;
          padding: 20px 20px 0;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
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
