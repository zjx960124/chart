import {fitChartSize, getStringSize} from "./construction";
import echarts from "echarts";

const walden = {
  bar: {
    xAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: fitChartSize(10),
        formatter: function (params) {
          if (typeof params === 'number') {
            return params;
          }
          let newString = getStringSize(params);
          return newString
        }
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        fontSize: fitChartSize(10),
        formatter: function (params) {
          let isNumber = (num) => Object.prototype.toString.call(num) === '[object Number]';
          if (typeof params === 'number') {
            return params;
          }
          let newString = getStringSize(params);
          return newString
        }
      }
    },
    legend: {
      itemHeight: 4,
      itemWidth: 4,
      textStyle: {
        padding: [0, 0, 0, 2],
        color: 'rgba(167, 199, 199, .8)',
        fontSize: fitChartSize(10),
        fontWeight: '500',
        fontFamily: 'DINPro-Medium, PingFang SC, sans-serif'
      }
    },
  },
  line: {
    xAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
        fontSize: fitChartSize(10),
        formatter: function (params) {
          if (typeof params === 'number') {
            return params;
          }
          let newString = getStringSize(params);
          return newString
        }
      }
    },
    yAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          color: 'rgba(167, 199, 199, .8)',
          fontSize: fitChartSize(10),
          fontStyle: 'normal',
          fontWeight: '400',
          fontFamily: 'DIN-MEDIUM, sans-serif'
        },
        formatter: function (params) {
          let isNumber = (num) => Object.prototype.toString.call(num) === '[object Number]';
          if (typeof params === 'number') {
            return params;
          }
          let newString = getStringSize(params);
          return newString
        }
      }
    },
    legend: {
      show: false
    },
    series: [{
      symbol: 'circle',
      showSymbol: false,
      symbolSize: 6,
      areaStyle: {
        normal: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
            offset: 0,
            color: "rgba(4, 249, 250,.48)"
          },
            {
              offset: 1,
              color: "rgba(4, 249, 250, 0)"
            }
          ], false),
        }
      },
      itemStyle: {
        borderColor: "#04F9FA",
        borderWidth: 2,
        opacity: 1,
      },
      emphasis: {
        scale: false,
        itemStyle: {
          color: '#001926',
          borderWidth: 2,
          opacity: 1,
        },
      },
    }]
  },
  rings: {
    legend: {
      itemHeight: 4,
      itemWidth: 4,
      textStyle: {
        padding: [0, 0, 0, 2],
        color: 'rgba(167, 199, 199, .8)',
        fontSize: fitChartSize(10),
        fontWeight: '500',
        fontFamily: 'DINPro-Medium, PingFang SC, sans-serif'
      }
    },
    series: {
      // radius: ["45%", "52%"],
      labelLine: {
        show: false,
      },
    },
  },
  battery: {}
};

export {
  walden
}
