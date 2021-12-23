<template>
  <div
    :ref="refName"
    :style="{ ...styleOption }"
  >
  </div>
</template>
<script>
  import echarts from 'echarts';
  import { fitChartSize } from '../../utils/construction';
  import axios from 'axios';
  import handle from "../../utils/index";
  export default {
    name: 'ClPie',
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
            this.baseData = res.data.pie.rows;
            this.columns = res.data.pie.columns;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        if (this[this.refName + 'Chart']) {
          this[this.refName + 'Chart'].dispose();
        }
        this[this.refName + 'Chart'] = echarts.init(this.$refs[this.refName], this.theme);
        let xAxisIndex = this.category ?  this.columns.indexOf(this.category) : 1;
        let legendIndex = this.legend ? this.columns.indexOf(this.legend) : 2;
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
    }
  };
</script>
