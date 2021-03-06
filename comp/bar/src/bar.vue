<template>
  <div
    :ref="refName"
    :style="{ ...styleOption }"
  >
  </div>
</template>

<script>
  import echarts from 'echarts';
  import axios from 'axios';
  import { xAxis, Grid, debounce, fitChartSize, fitChartHeight } from '../../utils/construction';
  import * as themeConfig from '../../utils/style';
  import handle from "../../utils/index"
  export default {
    name: 'ClBar',

    mixins: [handle],

    props: {
      refName: String,
      styleOption: Object,
      theme: String,
      legend: String,
      category: String,
      deployOption: Object,
      datasourceId: String | Number,
      sql: String,
      DSId: String | Number,
    },

    data() {
      return {
        baseData: [],
        columns: [],
        timeout: null
      }
    },

    watch: {
      category: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderOption();
        }
      },
      legend: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderOption();
        }
      },
      theme: {
        handler: function (newV, oldV) {
          this.renderOption();
        }
      },
      deployOption: {
        deep: true,
        handler: function (newV, oldV) {
          this.renderOption();
        }
      },
      DSId: {
        handler: function (newV, oldV) {
          this.renderEChart();
        }
      }
    },

    methods: {
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data.bar.rows;
            this.columns = res.data.bar.columns;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        if (this[this.refName + 'Chart']) {
          this[this.refName + 'Chart'].dispose();
        }
        this[this.refName + 'Chart'] = echarts.init(this.$refs[this.refName], this.theme);
        let xAxisIndex = this.category ?  this.columns.indexOf(this.category) : 2;
        let legendIndex = this.legend ? this.columns.indexOf(this.legend) : 1;
        let xAxisData = Array.from(new Set(...new Array(1).fill(this.baseData.map((item) => item[xAxisIndex]))));
        let legendData = Array.from(new Set(...new Array(1).fill(this.baseData.map((item) => item[legendIndex]))));
        let seriesData = legendData.map((item, index) => {
          return {
            name: item,
            type: 'bar',
            barWidth: this.deployOption.barWidth || 6,
            barGap: this.deployOption.barGap || '100%',
            label: {
              show: this.deployOption.seriesLabelShow || false,
              distance: 5,
              position: this.deployOption.seriesLabelPosition || 'top',
              fontSize: fitChartSize(12),
              fontFamily: "DIN-Medium",
              fontWeight: 500,
              formatter: function (params) {
                return params.value.toLocaleString('zh', { style: 'decimal' });
              }
            },
            itemStyle: {
              barBorderRadius: this.deployOption.barBorderRadius
            },
            data: this.baseData.filter((items, index) => { return items[legendIndex] === item}).map((item2, index2) => item2[0]),
          }
        });
        let option = {
          grid: new Grid(this.deployOption).getData(),
          legend: {
            data: legendData,
            itemHeight: 5,
            itemWidth: 5,
            itemGap: 25,
            fontSize: fitChartSize(12),
            bottom: fitChartSize(this.deployOption.legendBottom) || 0,
            type: 'scroll',
            selectedMode: true,
            textStyle: {
              padding: [0, 0, 0, 2],
              color: 'rgba(167, 199, 199, .8)',
              fontSize: fitChartSize(11),
              fontWeight: '500',
              fontFamily: 'DINPro-Medium, PingFang SC, sans-serif'
            },
            tooltip: {
              show: true
            },
            borderRadius: 0,
            pageIconColor: '#04F9FA',
            pageIconInactiveColor: 'transparent',
            pageTextStyle: {
              color: '#04F9FA'
            },
          },
          xAxis: {
            type: this.deployOption.isTransverse ? 'value' : 'category',
            axisLine: {
              show: this.deployOption.showXAxisLine
            },
            splitLine: {
              show: this.deployOption.showXSplitLine
            },
            axisLabel: {
              fontSize: fitChartSize(10)
            },
            data: new xAxis(xAxisData).getData()
          },
          yAxis: {
            type: this.deployOption.isTransverse ? 'category' : 'value',
            axisLine: {
              show: this.deployOption.showYAxisLine
            },
            splitLine: {
              show: this.deployOption.showYSplitLine
            },
            axisLabel: {
              fontSize: fitChartSize(10)
            },
            name: this.deployOption.yAxisName || '',
            data: new xAxis(xAxisData).getData()
          },
          series: seriesData
        };
        // x轴全渲染
        this.deployOption.isTransverse ? option.yAxis.interval = 0 : option.xAxis.interval;
        // 渲染主题
        option = this.theme && themeConfig[this.theme] ? _.merge(option, themeConfig[this.theme].bar) : option;
        this[this.refName + 'Chart'].setOption(option);
      },
    },
  };
</script>

<style lang="scss" scoped>

</style>
