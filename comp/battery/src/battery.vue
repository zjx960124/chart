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
  import handle from '../../utils'
  export default {
    name: 'ClBattery',

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
            this.baseData = res.data.battery.rows;
            this.columns = res.data.battery.columns;
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
        let
          base = this.baseData.map(item => Number(item[0])),
          max = Math.ceil(Math.max(...base) / 100) * 100, // 取最大值(则算100倍数)
          baseData = new Array(base.length).fill(max), // 最大电量和背景框
          // 高亮区
          countData = Array.apply(null,new Array(base.length)).map((item, index) => {
            return {
              value: base[index],
              itemStyle: {
                normal: {
                  color: "#04F9FA"
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  distance: 10,
                  offset: [0, 0],
                  textStyle: {
                    color: '#04F9FA',
                    fontFamily: 'DIN-MEDIUM'
                  },
                },
              }
            }
          });
        let backSeries = [
          {
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "rgba(87,220,222,0.3)"
              }
            },
            symbolRepeat: "fixed",
            symbolMargin: 4,
            symbol: "rect",
            symbolClip: true,
            symbolSize: [38, 2],
            symbolPosition: "start",
            symbolOffset: [0, 5],
            data:  baseData,
            width: 1,
            z: 0,
          },
          {
            type: "bar",
            // barGap: "-100%", // 设置外框粗细
            name: '边框',
            data: baseData,
            barWidth: 48,
            emphasis: {
              label: {
                show: false
              },
            },
            itemStyle: {
              color: "transparent", // 填充色
              borderWidth: 1,
              borderColor: '#002E2E',
              label: {
                show: false,
              }
            },
            z: 0
          },
          {
            // 分隔
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "#026161"
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top',
                distance: 10,
                offset: [0, 0],
                textStyle: {
                  color: '#026161',
                  fontFamily: 'DIN-MEDIUM'
                },
              },
            },
            emphasis: {
              itemStyle: {
                color: "#04F9FA"
              },
              label: {
                color: '#04F9FA',
                normal: {
                  color: '#04F9FA'
                }
              }
            },
            symbolRepeat: "fixed",
            symbolMargin: 4,
            symbol: "rect",
            symbolClip: true,
            fontSize: 12,
            symbolSize: [38, 2],
            symbolPosition: "start",
            symbolOffset: [0,5],
            data: countData,
            width: 1,
            z: 99,
          }
        ];
        let tip = {
          trigger: 'axis',
          confine: true,
          transitionDuration: 0,
          axisPointer: {
            type: 'none'
          },
          formatter: (params) => {
            if (params.name !== '') {
              return params[2].name + ' : ' + bzkqDatas[params[2].dataIndex];
            }
          }
        };
        let option = {
          backgroundColor: '#000211',
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
            type: 'category',
            axisLine: {
              show: this.deployOption.showXAxisLine
            },
            splitLine: {
              show: this.deployOption.showXSplitLine
            },
            axisLabel: {
              fontSize: fitChartSize(10)
            },
            axisTick: {
              show: false,
            },
            data: new xAxis(xAxisData).getData()
          },
          yAxis: {
            type: 'value',
            axisLine: {
              show: this.deployOption.showYAxisLine
            },
            splitLine: {
              show: this.deployOption.showYSplitLine
            },
            axisLabel: {
              fontSize: fitChartSize(10)
            },
            axisTick: {
              show: false,
            },
            name: this.deployOption.yAxisName || '',
            data: new xAxis(xAxisData).getData()
          },
          series: backSeries
        };
        // 渲染主题
        option = this.theme && themeConfig[this.theme] ? _.merge(option, themeConfig[this.theme].bar) : option;
        this[this.refName + 'Chart'].setOption(option);
      },
    },

  };
</script>

<style lang="scss" scoped>

</style>
