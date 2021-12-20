<template>
  <div class="rolling-pie-view">
    <div class="scroll-view">
      <div class="scroll-item">
        <div>
          <div
            class="jsyxfb-item"
            v-for="(item, index) in compData"
            :key="index"
            :ref="refName + index"
          >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "RollingPie",

    props: {
      refName: String,
      styleOption: Object,
      deployOption: Object,
      datasourceId: String | Number,
      sql: String,
      legend: String,
      category: String,
    },

    data() {
      return {
        baseData: [],
        columns: [],
        compData: [],
        timeout: null
      }
    },

    watch: {
      deployOption: {
        deep: true,
        handler: function (newV, oldV) {
          this.renderComp();
        }
      },
      sql: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderComp();
        }
      },
      datasourceId: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderComp();
        }
      },
    },

    methods: {
      renderComp() {
        if (this.datasourceId && this.sql) {
          this.getMock();
        } else {
          this.getMock();
        }
      },
      getData() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          this.http.get('/rest/report/sql', {
            datasourceId: this.datasourceId,
            sql: this.sql
          }).then((res) => {
            this.baseData = res.data.rows;
            this.columns = res.data.columns;
            this.renderOption();
          })
        }, 1000);
      },
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data.turnPage.rows;
            this.columns = res.data.turnPage.columns;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        this.compData = [];
        let base = [];
        this.baseData.forEach((item, index) => {
          let a = new Object();
          this.columns.forEach((items, indexs) => {
            a[items] = item[indexs]
          });
          base.push(a)
        });
        for(let i = 0, len = base.length; i < len; i+=5){
          this.compData.push(base.slice(i,i+5));
        }
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.renderComp();
      })
    }
  }
</script>

<style lang="scss" scoped>
  .rolling-pie-view {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    .scroll-view {
      width: 100%;
      height: 100%;
      overflow: hidden;
      .yx-scroll {
        width: 100%;
        display: flex;
        height: fit-content;
        flex-wrap: wrap;
        animation: scrollyx 30s linear infinite;
        cursor: pointer;
        & > div {
          display: flex;
          flex-wrap: wrap;
          height: fit-content;
          .jsyxfb-item {
            width: 1.43rem;
            height: 163px;
          }
        }
      }
      .yx-scrolls {
        width: 100%;
        height: fit-content;
        display: flex;
        flex-wrap: wrap;
        animation: scrollyy 30s linear infinite;
        .jsyxfb-item {
          width: 1.43rem;
          height: 163px;
          float: left;
        }
      }
      .yx-scroll:hover {
        animation-play-state:paused;
      }
      .yx-scrolls:hover {
        animation-play-state:paused;
      }
      .seamless-warp {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .jsyxfb-item {
          width: 1.43rem;
          height: 163px;
          float: left;
        }
      }
    }
    @keyframes scrollyx {
      0% {
        transform: translate3d(0, 0%, 0);
      }
      100% {
        transform: translate3d(0, -50%, 0);
      }
    }
    @keyframes scrollyy {
      0% {
        transform: translate3d(0, 15%, 0);
      }
      100% {
        transform: translate3d(0, -105%, 0);
      }
    }
  }
</style>
