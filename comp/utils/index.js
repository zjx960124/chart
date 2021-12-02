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
    }
  },
  methods: {
    setTheme() {
      console.log(this.theme);
      let str = this.theme;
      function jikj(str) {   return `../../conf/${str}.js`; }
      try {
        const cc = () => import(jikj());
      } catch (e) {}
      this.renderEChart();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setTheme();
    })
  }
}

export default echartMixin
