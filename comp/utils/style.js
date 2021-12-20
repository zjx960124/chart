import {fitChartSize, getStringSize} from "./construction";

const walden = {
  bar: {
    xAxis: {
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
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
  }
};

export {
  walden
}
