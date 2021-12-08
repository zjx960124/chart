<template>
  <div
    :ref="refName"
    :style="{ ...styleOption }"
  >
  </div>
</template>
<script>
  import echarts from 'echarts';
  import axios from 'axios'
  export default {
    name: 'ClLine',

    props: {
      refName: String,
      styleOption: Object,
      theme: String,
      datasourceId: String | Number,
      legend: String,
      category: String,
      sql: String,
      deployOption: Object
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
      sql: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderEChart();
        }
      },
      datasourceId: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderEChart();
        }
      },
    },

    beforeDestroy() {
      // this[this.refName + 'Chart'].dispose();
      // this[this.refName + 'Chart'] = null;
    },

    methods: {
      renderEChart() {
        if (this.datasourceId && this.sql) {
          this.getData();
        } else {
          this.getMock();
        }
      },
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data.hat.rows;
            this.columns = res.data.hat.columns;
            this.handleData();
          })
        }, 1000);
      },
      getData() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.http.get('/rest/report/sql', {
            datasourceId: this.datasourceId,
            sql: this.sql
          }).then((res) => {
            this.baseData = res.data.rows;
            this.columns = res.data.columns;
            this.renderOption();
          })
        }, 1000)
      },
      renderOption() {
        if (this[this.refName + 'Chart']) {
          this[this.refName + 'Chart'].dispose();
        }
        this[this.refName + 'Chart'] = echarts.init(this.$refs[this.refName], this.theme);
        let xAxisIndex = this.columns.indexOf(this.category);
        let legendIndex = this.columns.indexOf(this.legend);
        let xAxisData = Array.from(new Set(...new Array(1).fill(this.baseData.map((item) => item[xAxisIndex]))));
        let legendData = Array.from(new Set(...new Array(1).fill(this.baseData.map((item) => item[legendIndex]))));
        let seriesData = legendData.map((item, index) => {
          return {
            name: item,
            type: 'line',
            data: this.baseData.filter((items, index) => { return items[legendIndex] === item}).map((item2, index2) => item2[0]),
            symbol: 'none',
            showAllSymbol: true,
            symbolSize: 0,
            /*lineStyle: {
              normal: {
                width: 3,
                color: this.deployOption.lineColor || '#04F9FA', // 线条颜色
              }
            },*/
            areaStyle: { //区域填充样式
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: "rgba(211, 222, 224, .2)"
                },
                  {
                    offset: 1,
                    color: "rgba(211, 222, 224, 0)"
                  }
                ], false),
              }
            },
          }
        })
        console.log(seriesData)
        let option = {
          tooltip: {
            trigger: 'axis',
            transitionDuration: 0,
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              },
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          xAxis: {
            type: 'category',
            data: xAxisData,
            axisLabel: {
              show: true,
              rotate: 0,
              margin: 8,
              textStyle: {
                color: 'rgba(167, 199, 199, .8)',
                fontSize: 11,
                fontStyle: 'normal',
                fontWeight: '400',
                fontFamily: 'DIN-MEDIUM, sans-serif'
              }
            },
            splitLine: {
              show: false,
              lineStyle: {
                width: 1,
                color: '#001414'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(0, 0, 0, 0)',
                width: 1
              }
            }
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
                fontSize: 11,
                fontStyle: 'normal',
                fontWeight: '400',
                fontFamily: 'DIN-MEDIUM, sans-serif'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                color: '#001414'
              }
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: 'rgba(0, 0, 0, 0)',
                width: 1
              }
            }
          },
          legend: {
            orient: 'horizontal',
            type: 'scroll',
            bottom: 5,
            itemHeight: 5,
            itemWidth: 5,
            itemGap: 25,
            icon: 'rect',
            selectedMode: true,
            textStyle: {
              padding: [0, 0, 0, 2],
              color: 'rgba(167, 199, 199, .8)',
              fontSize: 11,
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
            data: legendData
          },
          series: seriesData
        };
        this[this.refName + 'Chart'].setOption(option);
      },
      setTheme() {
        let str = this.theme;
        function jikj(str) {   return `../../conf/${str}.js`; }
        try {
          const cc = () => import(jikj());
        } catch (e) {}
        this.renderEChart();
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.setTheme();
      })
    }
  };
</script>
