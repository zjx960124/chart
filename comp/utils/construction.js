/**
 * 图例
 * @param legendData
 * @constructor
 */
class Legend {
  constructor(legendData) {
    this.baseData = legendData;
  }
  getData() {
    return this.baseData;
  }
  splitArray(arrLength, option) {
    let result = [];
    this.baseData.reduce((x, y, index, arr) => {
      if (x.length < arrLength) {
        x.push({name: y})
      } else {
        result.push({
          data: x,
          left: option.legendLeft,
          bottom: Number(option.legendBottom) + (result.length * 24)
        });
        x = [];
        x.push({name: y});
      }
      index === arr.length - 1 && result.push({
        data: x,
        left: option.legendLeft,
        bottom: Number(option.legendBottom) + (result.length * 24)
      })
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
      left: option.girdLeft,
      top: option.girdTop,
      right: option.girdRight,
      bottom: option.girdBottom
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
  if (!clientWidth) return size;
  let scale = (clientWidth / defalteWidth);
  return Number((size*scale).toFixed(3));
}
const fitChartHeight = (size, defalteHeight = 1080) => {
  let clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  if (!clientHeight) return size;
  let scale = (clientHeight / defalteHeight);
  return Number((size*scale).toFixed(3));
}

/**
 * 防抖
 */
const debounce = (fn, delay) => {
  console.log('触发');
  let timer
  return function (...args) {
    console.log('触发');
    if (timer) {
      console.log('取消触发');
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
}
