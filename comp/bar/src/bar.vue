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
    name: 'ClBar',

    props: {
      refName: String,
      styleOption: Object,
      theme: String,
      dataModel: String,
      legend: String,
      category: String,
      sql: String,
      deployOption: Object
    },

    data() {
      return {
        baseData: [],
        columns: []
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
      }
    },

    beforeDestroy() {
      // this[this.refName + 'Chart'].dispose();
      // this[this.refName + 'Chart'] = null;
    },

    methods: {
      renderEChart() {
        /*this.http.get('/rest/report/sql', {
          datasourceId: this.dataModel,
          sql: this.sql
        }).then((res) => {
          this.baseData = res.data.rows;
          this.columns = res.data.columns;
          this.renderOption();
        })*/
        axios.get('/mock.json').then((res) => {
          this.baseData = res.data.bar.rows;
          this.columns = res.data.bar.columns;
          this.renderOption();
        })
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
            type: 'bar',
            barWidth: this.deployOption.barWidth || 6,
            data: this.baseData.filter((items, index) => { return items[legendIndex] === item}).map((item2, index2) => item2[0]),
          }
        })
        let option = {
          legend: {
            data: legendData,
            itemHeight: 5,
            itemWidth: 5,
            itemGap: 25,
            bottom: this.deployOption.legendBottom || 0,
            type: 'scroll',
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
          },
          xAxis: {
            type: 'category',
            data: xAxisData
          },
          yAxis: {
            type: 'value',
            name: this.deployOption.yAxisName || ''
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
