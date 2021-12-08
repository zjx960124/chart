<template>
  <div
    :ref="refName"
    :style="{ ...styleOption }"
  >
  </div>
</template>
<script>
  import echarts from 'echarts';
  import { fitChartSize } from '../../utils/construction'
  import axios from 'axios'
  export default {
    name: 'ClPie',

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
      deployOption: {
        deep: true,
        handler: function (newV, oldV) {
          console.log(newV)
          this.renderOption();
        }
      },
      theme: {
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
      setTheme() {
        let str = this.theme + '.js';
        function jikj(str) {   return `../../conf/${str}`; }
        try {
          const cc = () => import(jikj());
        } catch (e) {}
        this.renderEChart();
      },
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
          axios.get(`${process.env.VUE_APP_REPORT_PATH}/mock.json`).then((res) => {
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
            value: Number(this.baseData.filter((items, index) => { return items[legendIndex] === item}).map((item2, index2) => item2[0])[0]),
          }
        })
        let option = {
          /*backgroundColor: this.deployOption.backgroundColor ? this.deployOption.backgroundColor : "#000211",*/
          /*color: [
            '#04E0E0',
            '#039494',
            '#D3DEE0',
            '#D6731A',
            '#048FFA',
            '#D6961A'
          ],*/
          legend: {
            orient: 'vertical',
            // type: 'scroll',
            selectedMode: true,
            right: this.deployOption.legendRight || fitChartSize(100),
            top: this.deployOption.legendTop || 'center',
            bottom: 0,
            itemHeight: 8,
            itemWidth: 8,
            itemGap: 12,
            icon: 'rect',
            textStyle: {
              padding: [0, 0, 0, 2],
              color: 'rgba(167, 199, 199, .8)',
              fontWeight: 500,
              fontSize: fitChartSize(11),
              fontFamily: 'DIN-MEDIUM,sans-serif'
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
            formatter: function (value) {
              value = value.toString()
              if (value.length > 12) {
                return value.substring(0, 6) + '...'
              } else {
                return value
              }
            },
            data: legendData
          },
          series: {
            type: 'pie',
            center: [this.deployOption.pieCenterLeft || '50%', this.deployOption.pieCenterTop || '55%'],
            label: {
              show: false,
              formatter: '{d}'
            },
            labelLine: {
              show: false,
              lineStyle: {
                color: '#D3DEE0'
              }
            },
            data: seriesData
          }
        };
        this[this.refName + 'Chart'].setOption(option);
      },
    },

    mounted() {
      this.$nextTick(() => {
        this.setTheme();
      })
    }
  };
</script>
