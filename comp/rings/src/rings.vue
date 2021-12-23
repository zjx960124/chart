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
  import { Legend, fitChartSize } from '../../utils/construction'
  import * as themeConfig from '../../utils/style'
  import axios from 'axios'
  import _ from 'lodash'
  export default {
    name: 'ClRings',
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
    methods: {
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data.ring.rows;
            this.columns = res.data.ring.columns;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        if (this[this.refName + 'Chart']) {
          this[this.refName + 'Chart'].dispose();
        }
        this[this.refName + 'Chart'] = echarts.init(this.$refs[this.refName], this.theme);
        let legendData = Array.from(new Set(...new Array(1).fill(this.baseData.map((item) => item[1]))));
        let seriesData = [];
        legendData.forEach((item, index) => {
          seriesData.push(
            {
              name: item,
              itemStyle: this.deployOption.hasBackground && index !== this.deployOption.heightLightIndex ? {color: 'transparent'} : {},
              value: Number(this.baseData.filter((items, index) => { return items[1] === item}).map((item2, index2) => item2[0])[0]),
            }
          )
        });
        let option = {
          legend: new Legend(legendData, this.deployOption).getData(),
          series: [{
            type: 'pie',
            radius: [this.deployOption.pieRadiusStart || '45%', this.deployOption.pieRadiusEnd || '52%'],
            roseType: this.deployOption.pieRoseType,
            center: [this.deployOption.pieCenterLeft || '50%', this.deployOption.pieCenterTop || '45%'],
            label: {
              show: false,
              formatter: '{d}'
            },
            data: seriesData
          }]
        };
        this.deployOption.hasBackground && option.series.push(
          {
            type: 'pie',
            // radius: [this.deployOption.pieRadiusStart || '47%', this.deployOption.pieRadiusEnd || '50%'],
            radius: ['47%', '50%'],
            z: 1,
            center: [this.deployOption.pieCenterLeft || '50%', this.deployOption.pieCenterTop || '45%'],
            label: {
              show: false,
              formatter: '{d}'
            },
            hoverAnimation: false,
            data: [
              {
                value: 100,
                itemStyle: {
                  color: this.deployOption.heightLightColor,
                  label: {
                    show: false,
                  },
                  labelLine: {
                    show: false
                  }
                }
              }
            ]
          }
        );
        // 是否分组
        if (this.deployOption.itemNumber) {
          option.legend = new Legend(legendData, this.deployOption).splitArray(this.deployOption.itemNumber, this.deployOption);
          themeConfig[this.theme] && option.legend.map((item, index) => { return _.merge(item, themeConfig[this.theme].rings.legend) })
        }
        // 渲染主题
        option = this.theme && themeConfig[this.theme] ? _.merge(option, themeConfig[this.theme].rings) : option;
        console.log(option);
        this[this.refName + 'Chart'].setOption(option);
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
