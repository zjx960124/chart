function Legend(legendData) {
  this.baseData = legendData
}

Legend.prototype = {
  constructor: Legend,
  getData: function () {
    return this.baseData;
  },
  splitArray: function (arrLength, option) {
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
};

export default Legend
