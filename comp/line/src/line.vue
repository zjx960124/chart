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
  import {fitChartSize, Grid, Legend} from '../../utils/construction';
  import * as themeConfig from "../../utils/style";
  import _ from "lodash";
  import handle from "../../utils/index";
  export default {
    name: 'ClLine',
    mixins: [handle],
    props: {
      refName: String,
      styleOption: Object,
      theme: String,
      legend: String,
      category: String,
      deployOption: Object,
      DSId: String | Number,
    },
    data() {
      return {
        baseData: [],
        columns: [],
        timeout: null
      }
    },
    methods: {
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data.line.rows;
            this.columns = res.data.line.columns;
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
            type: 'line',
            data: this.baseData.filter((items, index) => { return items[legendIndex] === item}).map((item2, index2) => item2[0]),
            smooth: this.deployOption.smooth,
            lineStyle: {
              normal: {
                width: this.deployOption.lineWidth || 3,
              }
            },
          }
        });
        let option = {
          grid: new Grid(this.deployOption).getData(),
          tooltip: {
            trigger: 'axis',
            transitionDuration: 0,
            axisPointer: {
              type: 'cross',
              lineStyle: {
                type: 'dashed'
              },
              label: {
                backgroundColor: 'transparent'
              }
            }
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            splitLine: {
              show: this.deployOption.showXSplitLine
            },
            axisLine: {
              show: this.deployOption.showXAxisLine
            },
          },
          yAxis: {
            type: 'value',
            offset: 0,
            splitNumber: 5,
            nameTextStyle: {
              color: 'rgba(167, 199, 199, .8)',
              fontSize: 12,
              fontStyle: 'normal',
              fontWeight: '400',
              fontFamily: 'DIN-MEDIUM, sans-serif',
              align: 'right',
              verticalAlign: 'bottom',
              padding: [0, 6, 0, 0]
            },
            axisLabel: {
              show: true,
              rotate: 0,
              interval: 0, // {number}
              margin: 8,
              textStyle: {
                color: 'rgba(167, 199, 199, .8)',
                fontSize: fitChartSize(12),
                fontStyle: 'normal',
                fontWeight: '400',
                fontFamily: 'DIN-MEDIUM, sans-serif'
              }
            },
            splitLine: {
              show: this.deployOption.showYSplitLine
            },
            axisLine: {
              show: this.deployOption.showYAxisLine
            }
          },
          legend: new Legend(legendData, this.deployOption).getData(),
          series: seriesData
        };
        // 渲染主题
        option = this.theme && themeConfig[this.theme] ? _.merge(option, themeConfig[this.theme].line) : option;
        // merge只能合并index为0
        if (option.series.length > 1 && themeConfig[this.theme]) {
          option.series.map((item, index) => _.merge(item, themeConfig[this.theme].line.series[0]))
        }
        this[this.refName + 'Chart'].setOption(option);
        console.log(option);
      }
    }
  };
</script>
