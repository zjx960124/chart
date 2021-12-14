<template>
  <div
    :ref="refName"
    :style="{ ...styleOption }"
  >
  </div>
</template>

<script>
  import handle from '../../utils'
  import echarts from 'echarts'
  import { Legend } from '../../utils/construction'
  import axios from 'axios'
  export default {
    name: 'ClRing',
    mixins: [handle],
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
    methods: {
      renderEChart() {
        axios.get('/mock.json').then((res) => {
          this.baseData = res.data.ring.rows;
          this.columns = res.data.ring.columns;
          this.renderOption();
        })
      },
      renderOption() {
        if (this[this.refName + 'Chart']) {
          this[this.refName + 'Chart'].dispose();
        }
        this[this.refName + 'Chart'] = echarts.init(this.$refs[this.refName], this.theme);
        let legendData = Array.from(new Set(...new Array(1).fill(this.baseData.map((item) => item[1]))));
        let seriesData = [];
        let color = [
          '#04E0E0',
          '#039494',
          '#D3DEE0',
          '#D6731A',
          '#048FFA',
          '#D6961A'
        ];
        legendData.forEach((item, index) => {
          seriesData.push(
            {
              name: item,
              itemStyle: {
                normal: {
                  borderWidth: 10,
                  borderRadius: 0,
                  shadowBlur: 5,
                  borderColor: color[index]
                }
              },
              value: Number(this.baseData.filter((items, index) => { return items[1] === item}).map((item2, index2) => item2[0])[0]),
            }
            ,{
            value: .5,
              name: '',
              itemStyle: {
              normal: {
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
                color: 'rgba(0, 0, 0, 0)',
                  borderColor: 'rgba(0, 0, 0, 0)',
                  borderWidth: 0,
              },
            },
          }
          )
        })
        let option = {
          // legend: new Legend(legendData).splitArray(this.deployOption.itemNumber || legendData.length, this.deployOption),
          legend: new Legend(legendData, this.deployOption).getData(),
          series: {
            type: 'pie',
            radius: ["49%", "51%"],
            center: ['50%', '45%'],
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
  }
</script>

<style lang="scss" scoped>

</style>
