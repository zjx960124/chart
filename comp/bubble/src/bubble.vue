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
  import { getScale, fitChartHeight } from '../../utils/construction';
  import handle from '../../utils/index';
  export default {
    name: "ClBubble",
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
            this.baseData = res.data.bubble.rows;
            this.columns = res.data.bubble.columns;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        if (this[this.refName + 'Chart']) {
          this[this.refName + 'Chart'].dispose();
        }
        this[this.refName + 'Chart'] = echarts.init(this.$refs[this.refName], this.theme);
        let base = [];
        this.baseData && this.baseData.forEach((item, index) => {
          let a = new Object();
          this.columns.forEach((items, indexs) => {
            a[items] = item[indexs]
          });
          base.push(a)
        });
        let sortData = base.sort((a, b) => {
          return Number(a[this.columns[0]]) - Number(b[this.columns[0]])
        });
        let position = [
          [0, 65],
          [39, 55],
          [99, 129],
          [126, 92],
          [60, 95],
          [188, 155],
          [165, 90],
          [190, 30]
        ]; // 定位
        let valueInterval = []; // 值范围
        let colorOption = [
          '#039494',
          '#04C7C7',
          '#D6731A',
          '#00FFFF',
          '#039494',
          '#04C7C7',
          '#D6731A',
          '#00FFFF'
        ]; // 颜色
        let adorn = [
          {
            name: "",
            value: 37,
            color: "#D3DEE0",
            position: [25, 122],
            fontSize: "11",
            number: "2",
          },
          {
            name: "",
            value: 37,
            color: "#D3DEE0",
            position: [74, 145],
            fontSize: "11",
            number: "2",
          },
          {
            name: "",
            value: 37,
            color: "#D3DEE0",
            position: [85, 40],
            fontSize: "11",
            number: "2",
          }
        ]; // 装饰物
        // 处理数据
        let reslult = [];
        for (let i = 0; i < sortData.length; i++) {
          valueInterval.push(this.random(60 * getScale(), 80 * getScale()));
        }
        valueInterval = valueInterval.sort(function (a, b) { return a - b });
        sortData.forEach((item, index) => {
          reslult.push(
            {
              name: item[this.columns[1]],
              value: valueInterval[index],
              color: colorOption[index],
              position: position[index],
              fontSize: "11",
              number: "2",
            }
          )
        });
        reslult = reslult.concat(adorn);
        let datas = [];
        // 渲染数据，并写入chart
        reslult.map((item, index) => {
          datas.push({
            name: item.name,
            value: item.position,
            symbolSize: item.value,
            /*label: {
              normal: {
                formatter: function(param) {
                  console.log(param);
                  var newParamsName = ""; //返回文字格式
                  /!*
                  var paramsNameNumber = param.name.length; //获取显示文字长度
                  var number = parseInt(item.number); //超过多少字换行
                  var rowNumber = Math.ceil(paramsNameNumber / number); //最多能显示几行
                  if (paramsNameNumber > number) {
                    //如果长度大于每行最多显示的字数
                    for (var p = 0; p < rowNumber; p++) {
                      //循环次数就是行数
                      var tempStr = ""; //每次截取的字符
                      var start = p * number; //截取的起点
                      var end = start + number; //截取的终点
                      if (p == rowNumber - 1) {
                        //最后一行就不换行了
                        tempStr = param.name.substring(start);
                      } else {
                        tempStr = param.name.substring(start, end) + "\n";
                      }
                      newParamsName += tempStr; //拼接字符串
                    }
                  } else {
                    newParamsName = param.name; //如果小于每行最多显示的字数就返回原来的字符串
                  }*!/
                  newParamsName = param.data.symbolSize + "\n" + param.name;
                  return newParamsName;
                },
                show: true,
                textStyle: {
                  fontSize: 11,
                  fontFamily: "DIN-Medium",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  opacity: 1,
                },
              },
            },*/
            itemStyle: {
              normal: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 0.7, [{
                  offset: 0.5,
                  color: "rgba(27, 54, 72, 0.5)",
                },
                  {
                    offset: 1,
                    color: item.color,
                  },
                ]),
                opacity: 1,
                borderWidth: 0,
                borderColor: item.color,
              },
            },
          });
        });
        let keys = this.columns[0];
        let option = {
          backgroundColor: '#000211',
          grid: {
            show: false,
            top: 10,
            bottom: 10,
          },
          xAxis: [{
            gridIndex: 0,
            type: "value",
            show: false,
            min: 0,
            max: 200,
            nameLocation: "middle",
            nameGap: 5,
          }, ],
          yAxis: [{
            gridIndex: 0,
            min: 0,
            show: false,
            max: 200,
            nameLocation: "middle",
            nameGap: 30,
          }, ],
          series: [{
            type: "scatter",
            symbol: "circle",
            symbolSize: 120,
            label: {
              normal: {
                show: true,
                formatter: function (value, index) {
                  let names = '';
                  if (value.name.length > 4) {
                    names = value.name.substring(0, 4) + "\n" + value.name.substring(4, value.name.length);
                  } else {
                    names = value.name;
                  }
                  if (value.name === '') return '';
                  return `{value|${sortData[value.dataIndex][keys]}}\n{name|${names}}`;
                },
                rich: {
                  value: {
                    color: '#A7C7C7',
                    fontWeight: '400',
                    fontFamily: 'DIN-MEDIUM',
                    align: 'center',
                    fontSize: fitChartHeight(18),
                    lineHeight: fitChartHeight(32)
                  },
                  name: {
                    color: '#A7C7C7',
                    fontWeight: '400',
                    fontFamily: 'PingFangSC-Regular',
                    align: 'center',
                    fontSize: fitChartHeight(14)
                  },
                },
                color: "#A7C7C7",
                textStyle: {
                  fontSize: "11",
                },
              },
            },
            animationDurationUpdate: 500,
            animationEasingUpdate: 500,
            animationDelay: function(idx) {
              // 越往后的数据延迟越大
              return idx * 100;
            },
            data: datas,
          }],
        };
        this[this.refName + 'Chart'].setOption(option);
      },
      random (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        let result = Math.floor(Math.random() * (max - min + 1)) + min;
        return result;
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
  }
</script>

<style scoped>

</style>
