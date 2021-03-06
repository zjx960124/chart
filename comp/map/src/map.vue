<template>
  <div
    :ref="refName"
    :style="{ ...styleOption }"
  />
</template>

<script>
  import echarts from 'echarts';
  import 'echarts/map/js/china.js';
  import axios from "axios";
  const fjJson = require('../../conf/mapData/fj.json');
  import { provincialCapital } from "../../conf/mapData/province";
  import handle from '../../utils/index';
  export default {
    name: "ClMap",
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
        provinceData: [],
        timeout: null,
        type: 'china',
        chart: null,
        seriesData: [
          {
            name: '生源分布',
            type: 'map',
            geoIndex: 0,
            itemStyle: {
              normal: {
                borderWidth: 2,//边际线大小
                borderColor:'#00ffff',//边界线颜色
                areaColor:'#09295b'//默认区域颜色
              },
            },
            data: []
          }
        ]
      }
    },
    beforeDestroy() {
      if (!this.chart) {
        return;
      }
      this.chart.dispose();
      this.chart = null;
      clearInterval(this.timer);
      this.timer = null;
    },
    methods: {
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data.migration.rows;
            this.columns = res.data.migration.columns;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        if (this[this.refName + 'Chart']) {
          this[this.refName + 'Chart'].dispose();
        }
        this[this.refName + 'Chart'] = echarts.init(this.$refs[this.refName], this.theme);
        let seriesData = [];
        let distributionData = {
          name: '生源分布',
          type: 'map',
          geoIndex: 0,
          zlevel: 2,
          data: this.baseData.map((item, index) => { return {name: item[1], value: item[0]}})
        };
        seriesData.push(distributionData);
        this.deployOption.migration && seriesData.push(...this.handleMigrationData());
        let option = {
          backgroundColor: '#000211',
          tooltip: {
            show: true,
            formatter: function (params) {
              return (
                '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;'
                + (isNaN(params.value) ? '0' : params.value) + '人&nbsp;&nbsp;'
              )
            }
          },
          geo: {
            map: 'china',
            backgroundColor: 'transparent',
            center: [105.185312, 35.116778], // 中国
            zoom: 1.2,
            roam: false,
            label: {
              normal: {
                show: false
              },
              emphasis: { show: true, fontSize: '12', color: 'rgba(0,0,0,0.7)' }
            },
            /*itemStyle: {
              normal: {
                borderWidth: 1,//边际线大小
                borderType: 'solid',
                borderColor: '#04c7c7',//边界线颜色
                areaColor: 'rgba(19, 75, 80, .5)'//默认区域颜色
              },
              emphasis: {
                color: '#04c7c7', //悬浮背景
                borderType: 'solid',
              }
            },*/
            itemStyle: {
              normal: {
                //          	color: '#ddd',
                borderColor: "rgba(147, 235, 248, 1)",
                borderWidth: 1,
                areaColor: {
                  type: "radial",
                  x: 0.5,
                  y: 0.5,
                  r: 0.8,
                  colorStops: [
                    {
                      offset: 0,
                      color: "rgba(175,238,238, 0)", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "rgba(	47,79,79, .1)", // 100% 处的颜色
                    },
                  ],
                  globalCoord: false, // 缺省为 false
                },
                shadowColor: "rgba(128, 217, 248, 1)",
                // shadowColor: 'rgba(255, 255, 255, 1)',
                shadowOffsetX: -2,
                shadowOffsetY: 2,
                shadowBlur: 10,
              },
              emphasis: {
                areaColor: "#389BB7",
                borderWidth: 0,
              },
            },
          },
          visualMap: {
            show: this.deployOption.showVisualMap,
            type: 'piecewise',
            min: 0,
            max: 500,
            splitNumber: 4,
            left: 0,
            right: 20,
            bottom: 30,
            itemGap: 10,
            textGap: 4,
            itemWidth: 10,
            itemHeight: 10,
            itemSymbol: 'rect',
            showLabel: true,
            // text: ['高', '低'],
            seriesIndex: 0,
            textStyle: {
              color: '#039494',
              fontSize: '10',
              fontFamily: "DINPro-Medium"
            },
            calculable: true,
            align: 'left',
            // inRange: {
            //   color: ['#00cdd4', '#00a2ad', '#007a87', '#005461']
            // },
            // pieces: [
            //   { min: 1, max: 200, label: '0-200', color: '#ff0000' },
            //   { min: 201, label: '>200', color: '#0000ff' }
            // ]
          },
          series: seriesData
        };
        this[this.refName + 'Chart'].setOption(option);
        /*const _this = this;
        if (_this.timer) {
          clearInterval(_this.timer);
          _this.timer = null
        }*/
        /*_this.timer = setInterval(() => {
          if (_this.type === 'china') {
            _this.chart.setOption({
              title: '地图',
              tooltip: {
                show: true,
                formatter: function (params) {
                  return (
                    '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;' + (isNaN(params.value) ? '0' : params.value) + '人&nbsp;&nbsp;'
                  )
                }
              },
              geo: {
                // map: this.mapName,
                map: 'fj',
                backgroundColor: 'transparent',
                // center: [105.185312, 35.116778], // 中国
                center: [118.316239, 25.765302], // 福建
                zoom: 1,
                roam: false,
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: { show: true, fontSize: '12', color: 'rgba(0,0,0,0.7)' }
                },
                itemStyle: {
                  normal: {
                    borderWidth: 1,//边际线大小
                    borderType: 'solid',
                    borderColor:'#04c7c7',//边界线颜色
                    areaColor:'rgba(19, 75, 80, .5)'//默认区域颜色
                  },
                  emphasis: {
                    color: '#04c7c7', //悬浮背景
                    borderType: 'solid',
                  }
                  // emphasis: {
                  //     areaColor: '#f2d5ad',
                  //     shadowOffsetX: 0,
                  //     shadowOffsetY: 0,
                  //     borderWidth: 0
                  // }
                }
              },
              visualMap: {
                show: false,
                type: 'piecewise',
                min: 0,
                max: 200,
                splitNumber: 4,
                right: 20,
                bottom: 30,
                itemGap: 10,
                textGap: 4,
                itemWidth: 10,
                itemHeight: 10,
                itemSymbol: 'rect',
                showLabel: true,
                // text: ['高', '低'],
                textStyle: {
                  color: '#039494',
                  fontSize: '10',
                  fontFamily: "DINPro-Medium"
                },
                calculable: true,
                align: 'left',
                inRange: {
                  color: ['#00cdd4', '#00a2ad', '#007a87', '#005461']
                },
                pieces: [
                  // { value: 0, label: '0', color: '#ffffff' },
                  { min: 1, max: 200, label: '0-200', color: 'rgba(0, 205, 212, .6)' },
                  /!*{ min: 201, max: 400, label: '201 到 400', color: '#00a2ad' },
                  { min: 401, max: 600, label: '401 到 600', color: '#007a87' },*!/
                  { min: 201, label: '>200', color: '#04c7c7' }
                ]
              },
              series: _this.provinceData
            })
          } else {
            _this.chart.setOption({
              title: '地图',
              tooltip: {
                show: true,
                formatter: function (params) {
                  return (
                    '&nbsp;&nbsp;' + params.name +
                    '&nbsp;&nbsp;&nbsp;' + (isNaN(params.value) ? '0' : params.value) +
                    '人&nbsp;&nbsp;'
                  )
                }
              },
              geo: {
                map: this.mapName,
                // map: 'fj',
                backgroundColor: 'transparent',
                center: [105.185312, 35.116778], // 中国
                // center: [118.316239, 26.075302], // 福建
                zoom: 1.2,
                roam: false,
                label: {
                  normal: {
                    show: false
                  },
                  emphasis: { show: true, fontSize: '12', color: 'rgba(0,0,0,0.7)' }
                },
                itemStyle: {
                  normal: {
                    borderWidth: 1,//边际线大小
                    borderType: 'solid',
                    borderColor:'#04c7c7',//边界线颜色
                    areaColor:'rgba(19, 75, 80, .5)'//默认区域颜色
                  },
                  emphasis: {
                    color: '#04c7c7', //悬浮背景
                    borderType: 'solid',
                  }
                  // emphasis: {
                  //     areaColor: '#f2d5ad',
                  //     shadowOffsetX: 0,
                  //     shadowOffsetY: 0,
                  //     borderWidth: 0
                  // }
                }
              },
              visualMap: {
                show: this.showVisualMap,
                type: 'piecewise',
                min: this.visualMapMin,
                max: this.visualMapMax,
                splitNumber: 4,
                right: 20,
                bottom: 30,
                itemGap: 10,
                textGap: 4,
                itemWidth: 10,
                itemHeight: 10,
                itemSymbol: 'rect',
                showLabel: true,
                // text: ['高', '低'],
                textStyle: {
                  color: '#039494',
                  fontSize: '10',
                  fontFamily: "DINPro-Medium"
                },
                calculable: true,
                align: 'left',
                inRange: {
                  color: ['#00cdd4', '#00a2ad', '#007a87', '#005461']
                },
                pieces: [
                  // { value: 0, label: '0', color: '#ffffff' },
                  { min: 1, max: 200, label: '0-200', color: 'rgba(0, 205, 212, .6)' },
                  /!*{ min: 201, max: 400, label: '201 到 400', color: '#00a2ad' },
                  { min: 401, max: 600, label: '401 到 600', color: '#007a87' },*!/
                  { min: 201, label: '>200', color: '#04c7c7' }
                ]
              },
              series: _this.seriesData
            })
          }
          _this.type = _this.type === 'fj' ? 'china' : 'fj'
        }, 3000)*/
        /*_this.chart.on('mouseover', function(a) {
          if (_this.timer) {
            clearInterval(_this.timer)
            _this.timer = null
          }
        })
        _this.chart.on('mouseout', function() {
          if (_this.timer === null) {
            _this.timer = setInterval(() => {
              if (_this.type === 'china') {
                _this.chart.setOption({
                  title: EChartCommon.getDefaultChartTitle(this.title),
                  tooltip: {
                    show: true,
                    formatter: function (params) {
                      // console.log(params)
                      // const value = isNaN(params.value) ? '0' : params.value
                      // console.log(value)
                      return (
                        '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;' + (isNaN(params.value) ? '0' : params.value) + '人&nbsp;&nbsp;'
                      )
                    }
                  },
                  grid: EChartCommon.getCustomBarGrid(
                    _this.grid[0],
                    _this.grid[1],
                    _this.grid[2],
                    _this.grid[3]
                  ),
                  geo: {
                    // map: this.mapName,
                    map: 'fj',
                    backgroundColor: 'transparent',
                    // center: [105.185312, 35.116778], // 中国
                    center: [118.316239, 25.765302], // 福建
                    zoom: 1,
                    roam: false,
                    label: {
                      normal: {
                        show: false
                      },
                      emphasis: { show: true, fontSize: '12', color: 'rgba(0,0,0,0.7)' }
                    },
                    itemStyle: {
                      normal: {
                        borderWidth: 1,//边际线大小
                        borderType: 'solid',
                        borderColor:'#04c7c7',//边界线颜色
                        areaColor:'rgba(19, 75, 80, .5)'//默认区域颜色
                      },
                      emphasis: {
                        color: '#04c7c7', //悬浮背景
                        borderType: 'solid',
                      }
                      // emphasis: {
                      //     areaColor: '#f2d5ad',
                      //     shadowOffsetX: 0,
                      //     shadowOffsetY: 0,
                      //     borderWidth: 0
                      // }
                    }
                  },
                  visualMap: {
                    show: this.showVisualMap,
                    type: 'piecewise',
                    min: this.visualMapMin,
                    max: this.visualMapMax,
                    splitNumber: 4,
                    right: 20,
                    bottom: 30,
                    itemGap: 10,
                    textGap: 4,
                    itemWidth: 10,
                    itemHeight: 10,
                    itemSymbol: 'rect',
                    showLabel: true,
                    // text: ['高', '低'],
                    textStyle: {
                      color: '#039494',
                      fontSize: '10',
                      fontFamily: "DINPro-Medium"
                    },
                    calculable: true,
                    align: 'left',
                    inRange: {
                      color: ['#00cdd4', '#00a2ad', '#007a87', '#005461']
                    },
                    pieces: [
                      // { value: 0, label: '0', color: '#ffffff' },
                      { min: 1, max: 200, label: '0-200', color: 'rgba(0, 205, 212, .6)' },
                      /!*{ min: 201, max: 400, label: '201 到 400', color: '#00a2ad' },
                      { min: 401, max: 600, label: '401 到 600', color: '#007a87' },*!/
                      { min: 201, label: '>200', color: '#04c7c7' }
                    ]
                  },
                  series: _this.provinceData
                })
              } else {
                _this.chart.setOption({
                  title: EChartCommon.getDefaultChartTitle(this.title),
                  tooltip: {
                    show: true,
                    formatter: function (params) {
                      // console.log(params)
                      // const value = isNaN(params.value) ? '0' : params.value
                      // console.log(value)
                      return (
                        '&nbsp;&nbsp;' + params.name + '&nbsp;&nbsp;&nbsp;' + (isNaN(params.value) ? '0' : params.value) + '人&nbsp;&nbsp;'
                      )
                    }
                  },
                  grid: EChartCommon.getCustomBarGrid(
                    _this.grid[0],
                    _this.grid[1],
                    _this.grid[2],
                    _this.grid[3]
                  ),
                  geo: {
                    map: 'china',
                    // map: 'fj',
                    backgroundColor: 'transparent',
                    center: [105.185312, 35.116778], // 中国
                    // center: [118.316239, 26.075302], // 福建
                    zoom: 1.2,
                    roam: false,
                    label: {
                      normal: {
                        show: false
                      },
                      emphasis: { show: true, fontSize: '12', color: 'rgba(0,0,0,0.7)' }
                    },
                    itemStyle: {
                      normal: {
                        borderWidth: 1,//边际线大小
                        borderType: 'solid',
                        borderColor:'#04c7c7',//边界线颜色
                        areaColor:'rgba(19, 75, 80, .5)'//默认区域颜色
                      },
                      emphasis: {
                        color: '#04c7c7', //悬浮背景
                        borderType: 'solid',
                      }
                      // emphasis: {
                      //     areaColor: '#f2d5ad',
                      //     shadowOffsetX: 0,
                      //     shadowOffsetY: 0,
                      //     borderWidth: 0
                      // }
                    }
                  },
                  visualMap: {
                    show: this.showVisualMap,
                    type: 'piecewise',
                    min: this.visualMapMin,
                    max: this.visualMapMax,
                    splitNumber: 4,
                    right: 20,
                    bottom: 30,
                    itemGap: 10,
                    textGap: 4,
                    itemWidth: 10,
                    itemHeight: 10,
                    itemSymbol: 'rect',
                    showLabel: true,
                    // text: ['高', '低'],
                    textStyle: {
                      color: '#039494',
                      fontSize: '10',
                      fontFamily: "DINPro-Medium"
                    },
                    calculable: true,
                    align: 'left',
                    inRange: {
                      color: ['#00cdd4', '#00a2ad', '#007a87', '#005461']
                    },
                    pieces: [
                      // { value: 0, label: '0', color: '#ffffff' },
                      { min: 1, max: 200, label: '0-200', color: 'rgba(0, 205, 212, .6)' },
                      /!*{ min: 201, max: 400, label: '201 到 400', color: '#00a2ad' },
                      { min: 401, max: 600, label: '401 到 600', color: '#007a87' },*!/
                      { min: 201, label: '>200', color: '#04c7c7' }
                    ]
                  },
                  series: _this.seriesData
                })
              }
              _this.type = _this.type === 'fj' ? 'china' : 'fj'
            }, 3000)
          }
        })*/
      },
      handleMigrationData() {
        let linesData = {
          "type": "lines",
          "zlevel": 2,
          "effect": {
            "show": true,
            "period": 4,
            "trailLength": 0.02,
            "symbol": "arrow",
            "symbolSize": 5
          },
          "lineStyle": {
            "normal": {
              "width": 1,
              "opacity": 0.6,
              "curveness": 0.2,
              "color": "#00ffff"
            }
          },
          "tooltip": {
            "trigger": "item"
          },
          data: this.baseData.map((item, index) => {
            return {
              "fromName": item[1],
              "toName": "福建",
              "value": item[0],
              "coords": [
                provincialCapital[item[1]],
                provincialCapital['福建']
              ]
            }
          })
        };
        return [
          linesData,
          {
            "name": "来源",
            "type": "effectScatter",
            "coordinateSystem": "geo",
            "zlevel": 2,
            "rippleEffect": {
              "period": 4,
              "brushType": "stroke",
              "scale": 4
            },
            "tooltip": {
              "trigger": "item"
            },
            "label": {
              "normal": {
                "show": true,
                "position": "left",
                "color": "#00ffff",
                "offset": [
                  -5,
                  5
                ],
                "formatter": "{b}"
              },
              "emphasis": {
                "show": true
              }
            },
            "hoverAnimation": true,
            "symbol": "circle",
            "symbolSize": 5,
            "itemStyle": {
              "normal": {
                "show": false,
                "color": "#00ffff"
              }
            },
            "data": [
              {
                "name": "江苏",
                "value": [
                  "119.68",
                  "33.199",
                  19
                ]
              },
              {
                "name": "安徽",
                "value": [
                  "117.229",
                  "31.917",
                  17
                ]
              },
              {
                "name": "上海",
                "value": [
                  "121.465",
                  "31.289",
                  25
                ]
              },
              {
                "name": "湖北",
                "value": [
                  "114.39",
                  "30.663",
                  31
                ]
              },
              {
                "name": "福建",
                "value": [
                  "119.454",
                  "25.922",
                  22
                ]
              },
              {
                "name": "浙江",
                "value": [
                  "119.531",
                  "29.877",
                  19
                ]
              },
              {
                "name": "陕西",
                "value": [
                  "109.116",
                  "34.2",
                  18
                ]
              },
              {
                "name": "河南",
                "value": [
                  "113.467",
                  "34.623",
                  15
                ]
              },
              {
                "name": "山东",
                "value": [
                  "116.972",
                  "36.737",
                  12
                ]
              },
              {
                "name": "广东",
                "value": [
                  "113.511",
                  "23.22",
                  12
                ]
              },
              {
                "name": "四川",
                "value": [
                  "103.953",
                  "30.762",
                  10
                ]
              },
              {
                "name": "江西",
                "value": [
                  "116.005",
                  "28.663",
                  9
                ]
              },
              {
                "name": "重庆",
                "value": [
                  "106.438",
                  "29.581",
                  8
                ]
              },
              {
                "name": "贵州",
                "value": [
                  "106.71",
                  "26.564",
                  4
                ]
              },
              {
                "name": "山西",
                "value": [
                  "112.593",
                  "37.867",
                  4
                ]
              },
              {
                "name": "湖南",
                "value": [
                  "113.082",
                  "28.257",
                  4
                ]
              },
              {
                "name": "吉林",
                "value": [
                  "125.815",
                  "44.258",
                  3
                ]
              },
              {
                "name": "广西",
                "value": [
                  "107.88",
                  "22.863",
                  2
                ]
              },
            ]
          },
          {
            "name": "学校",
            "type": "scatter",
            "coordinateSystem": "geo",
            "zlevel": 2,
            "tooltip": {
              "trigger": "item"
            },
            "label": {
              "normal": {
                "show": true,
                "position": "right",
                "color": "#00ffff",
                "formatter": "{b}",
                "textStyle": {
                  "color": "#00ffff"
                }
              },
              "emphasis": {
                "show": true
              }
            },
            "symbol": "circle",
            "symbolSize": 20,
            "itemStyle": {
              "normal": {
                "show": true,
                "color": "#EE0000"
              }
            },
            "data": [
              {
                "name": "福州",
                "value": [
                  "119.454",
                  "25.922"
                ]
              }
            ]
          },
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
