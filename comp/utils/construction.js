/**
 * 图例
 * @param legendData
 * @constructor
 */
class Legend {
  constructor(legendData, option) {
    this.baseData = {
      data: legendData,
      left: option.legendLeft,
      top: option.legendTop,
      bottom: option.legendBottom,
      right: option.legendRight,
      orient: option.legendOrient,
    };
  }
  getData() {
    return this.baseData;
  }
  splitArray(arrLength, option) {
    let result = [];
    this.baseData.data.reduce((x, y, index, arr) => {
      if (x.length < Number(arrLength)) {
        x.push({name: y})
      } else {
        result.push({
          data: x,
          left: option.legendOrient === 'vertical' ?
            fitChartSize(option.legendLeft) + (result.length * 88)
            : fitChartSize(option.legendLeft)
          ,
          orient: option.legendOrient,
          bottom: option.legendOrient === 'horizontal' ?
            fitChartSize(option.legendBottom) + (result.length * 24) :
            fitChartSize(option.legendBottom),
        });
        x = [];
        x.push({name: y});
      }
      index === arr.length - 1 && result.push({
        data: x,
        left: option.legendOrient === 'vertical' ?
          fitChartSize(option.legendLeft) + (result.length * 88)
          : fitChartSize(option.legendLeft),
        orient: option.legendOrient,
        bottom: option.legendOrient === 'horizontal' ?
          fitChartSize(option.legendBottom) + (result.length * 24) :
          fitChartSize(option.legendBottom),
      });
      return x
    }, []);
    return result;
  }
}

/**
 * x轴(category)
 */
class xAxis {
  constructor(xAxisData) {
    this.baseData = xAxisData;
  }
  getData() {
    return this.baseData;
  }
}

/**
 * 绘图网格
 */
class Grid {
  constructor(option) {
    this.baseData = {
      left: fitChartSize(option.girdLeft),
      top: fitChartSize(option.girdTop),
      right: fitChartSize(option.girdRight),
      bottom: fitChartSize(option.girdBottom)
    }
  }
  getData() {
    return this.baseData;
  }
}

/**
 * 文字图表自适应
 * @param size
 * @param defalteWidth
 * @returns {number|*}
 */
const fitChartSize = (size, defalteWidth = 1920) => {
  let clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if (!clientWidth || !isNumber(size)) return size;
  let scale = (clientWidth / defalteWidth);
  return Number((size*scale).toFixed(8));
};
const fitChartHeight = (size, defalteHeight = 1080) => {
  let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (!clientHeight) return size;
  let scale = (clientHeight / defalteHeight);
  return Number((size*scale).toFixed(3));
};

function isNumber(val) {
  let regPos = /^\d+(\.\d+)?$/; //非负浮点数
  let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}

function getScale() {
  let w = document.documentElement.clientWidth / 1920;
  let h = document.documentElement.clientHeight / 1080;
  return w < h ? w : h
}


/**
 * 防抖
 */
const debounce = (fn, delay) => {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

export {
  Legend,
  xAxis,
  Grid,
  debounce,
  fitChartSize,
  fitChartHeight,
  getScale,
}
