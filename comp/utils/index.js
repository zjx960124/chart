import axios from 'axios'
const echartMixin = {
  watch: {
    category: {
      deep:true, //深度监听设置为 true
      handler: function (newV, oldV) {
        this.renderOption();
      }
    },
    legend: {
      deep:true, //深度监听设置为 true
      handler: function (newV, oldV) {
        this.renderOption();
      }
    },
    theme: {
      handler: function (newV, oldV) {
        this.renderOption();
      }
    },
    deployOption: {
      deep: true,
      handler: function (newV, oldV) {
        this.renderOption();
      }
    },
    DSId: {
      handler: function (newV, oldV) {
        this.renderEChart();
      }
    }
  },
  methods: {
    setTheme() {
      let str = this.theme;
      function jikj(str) {   return `../../conf/${str}.js`; }
      try {
        const cc = () => import(jikj());
      } catch (e) {}
      this.renderEChart();
    },
    renderEChart() {
      if (this.DSId) {
        this.getData();
      } else {
        this.getMock();
      }
    },
    getData() {
      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      this.timeout = setTimeout(() => {
        this.http.get('/rest/report/sql/id', {
          id: this.DSId
        }).then((res) => {
          this.baseData = res.data.rows;
          this.columns = res.data.columns;
          this.renderOption();
        })
      }, 1000)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.setTheme();
    })
  }
};

export default echartMixin
