<template>
  <div
    :ref="refName"
    :style="{ ...styleOption }"
  >
  </div>
</template>
<script>
  import echarts from 'echarts';
  export default {
    name: 'ClPie',

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
      deployOption: {
        deep: true,
        handler: function (newV, oldV) {
          console.log(newV)
          this.renderOption();
        }
      }
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
        this.http.get('/rest/report/sql', {
          datasourceId: this.dataModel,
          sql: this.sql
        }).then((res) => {
          this.baseData = res.data.rows;
          this.columns = res.data.columns;
          this.renderOption();
        })
      },
      renderOption() {
        if (this[this.refName + 'Chart']) {
          this[this.refName + 'Chart'].dispose();
        }
        this[this.refName + 'Chart'] = echarts.init(this.$refs[this.refName]);
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
          backgroundColor: this.deployOption.backgroundColor || "#000211",
          color: [
            '#04E0E0',
            '#039494',
            '#D3DEE0',
            '#D6731A',
            '#048FFA',
            '#D6961A'
          ],
          legend: {
            orient: 'vertical',
            type: 'scroll',
            selectedMode: true,
            right: 120,
            top: 'center',
            bottom: 0,
            itemHeight: 8,
            itemWidth: 8,
            itemGap: 12,
            icon: 'rect',
            textStyle: {
              padding: [0, 0, 0, 2],
              color: 'rgba(167, 199, 199, .8)',
              fontWeight: 500,
              fontSize: 11,
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
              if (value.length > 7) {
                return value.substring(0, 6) + '...'
              } else {
                return value
              }
            },
            data: legendData
          },
          series: {
            type: 'pie',
            radius: ["45%", "52%"],
            center: ['30%', '55%'],
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
