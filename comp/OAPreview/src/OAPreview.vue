<template>
  <div class="center-top">
    <div class="view">
      <div
        class="item"
        v-for="item in [0, 1, 2]"
      >
        <div class="label"><span class="spans">{{ compData[item][columns[1]] }}(个)</span></div>
        <div class="value">{{ compData[item][columns[0]] | locale }}</div>
      </div>
    </div>
    <div class="back" :style="`width: ${backWidth}px`"></div>
    <div class="oa-circle"></div>
    <div class="views">
      <div
        class="item"
        v-for="item in [3, 4]"
      >
        <div class="label"><span class="spans">{{ compData[item][columns[1]] }}(个)</span></div>
        <div class="value">{{ compData[item][columns[0]] | locale }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "OAPreview",

    props: {
      refName: String,
      styleOption: Object,
      deployOption: Object,
      datasourceId: String | Number,
      sql: String,
    },

    data() {
      return {
        // 背景图大小
        backWidth: (document.documentElement.clientHeight / 1080) * 316,
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
            this.baseData = res.data.OA.rows;
            this.columns = res.data.OA.columns;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        let base = [];
        this.baseData.forEach((item, index) => {
          let a = new Object();
          this.columns.forEach((items, indexs) => {
            a[items] = item[indexs]
          });
          base.push(a)
        });
        this.compData = base;
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
  .center-top {
    width: 100%;
    max-height: 100%;
    height: fit-content;
    margin-bottom: 20px;
    flex-direction: column;
    background: #000211;
    position: relative;
    justify-content: space-between;
    overflow-y: hidden;
    .view {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: .3rem;
      padding-right: .3rem;
      box-sizing: border-box;
      height: fit-content;
      flex-shrink: 0;
      .item {
        width: 2.22rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .label {
          color: #D2FAFA;
          font-size: 14px;
          font-style: italic;
          font-family: "PingFang SC";
          width: 1.43rem;
          height: 20px;
          line-height: 24px;
          margin-bottom: 7px;
          text-align: center;
          position: relative;
          .spans {
            position: relative;
          }
          .spans::after {
            content: '';
            position: absolute;
            background: url("../../images/xxkqxq_img2.png");
            width: .05rem;
            height: 11px;
            top: 4px;
            left: -.11rem;
          }
          .spans::before {
            content: '';
            position: absolute;
            background: url("../../images/xxkqxq_img2.png");
            width: .05rem;
            height: 11px;
            top: 4px;
            right: -.11rem;
          }
        }
        .value {
          color: #04E0E0;
          background: url("../../images/oalcqkyl_img2.png") no-repeat;
          background-size: 100% 100%;
          width: 1rem;
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 18px;
          font-family: DIN-MEDIUM;
          font-weight: 500;
        }
      }
    }
    .back {
      /*width: 3.16rem;*/
      aspect-ratio: auto 1 / 1;
      margin: 15px auto;
      background: url("../../images/oalcqkyl_img3.png") no-repeat;
      background-size: 100% 100%;
      animation: spin 9s linear infinite;
    }
    .oa-circle {
      position: absolute;
      width: 1.46rem;
      aspect-ratio: auto 146 / 144;
      top: 50%;
      left: 50%;
      margin-top: -.76rem;
      margin-left: -.72rem;
      background: url("../../images/oaliucheng.png") no-repeat;
      background-size: 100% 100%;
    }
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
        transition: all 5s;
      }
    }
    .views {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding-left: .3rem;
      padding-right: .3rem;
      box-sizing: border-box;
      height: fit-content;
      flex-shrink: 0;
      .item {
        width: 2.22rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        .label {
          color: #D2FAFA;
          font-size: 14px;
          font-style: italic;
          font-family: "PingFang SC";
          width: 1.43rem;
          height: 20px;
          line-height: 24px;
          margin-bottom: 7px;
          text-align: center;
          .spans {
            position: relative;
          }
          .spans::after {
            content: '';
            position: absolute;
            background: url("../../images/xxkqxq_img2.png");
            width: .05rem;
            height: 11px;
            top: 4px;
            left: -.11rem;
          }
          .spans::before {
            content: '';
            position: absolute;
            background: url("../../images/xxkqxq_img2.png");
            width: .05rem;
            height: 11px;
            top: 4px;
            right: -.11rem;
          }
        }
        .value {
          color: #04E0E0;
          background: url("../../images/oalcqkyl_img4.png") no-repeat;
          background-size: 100% 100%;
          width: 100%;
          height: 60px;
          text-align: center;
          line-height: 60px;
          font-size: 18px;
          font-family: DIN-MEDIUM;
          font-weight: 500;
        }
      }
    }
  }
</style>
