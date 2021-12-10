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
  export default {
    name: 'ClBar',

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
      }
    },

    beforeDestroy() {
      // this[this.refName + 'Chart'].dispose();
      // this[this.refName + 'Chart'] = null;
    },

    methods: {
      renderEChart() {
        if (this.DSId) {
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
            this.baseData = res.data.bar.rows;
            this.columns = res.data.bar.columns;
            this.renderOption();
          })
        }, 1000);
      },
      getData() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.http.get('/rest/report/sql/id', {
            id: this.DSId
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
        let xAxisIndex = this.category ?  this.columns.indexOf(this.category) : 2;
        let legendIndex = this.legend ? this.columns.indexOf(this.legend) : 1;
        let xAxisData = Array.from(new Set(...new Array(1).fill(this.baseData.map((item) => item[xAxisIndex]))));
        let legendData = Array.from(new Set(...new Array(1).fill(this.baseData.map((item) => item[legendIndex]))));
        let seriesData = legendData.map((item, index) => {
          return {
            name: item,
            type: 'bar',
            barWidth: this.deployOption.barWidth || 6,
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
            bottom: this.deployOption.legendBottom || 0,
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
              fontSize: fitChartSize(12)
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
              fontSize: fitChartSize(12)
            },
            name: this.deployOption.yAxisName || '',
            data: new xAxis(xAxisData).getData()
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

<style lang="scss" scoped>

</style>
