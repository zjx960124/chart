<template>
  <div class="jzgxlfb-view">
    <div
      class="jzgxlfb-item"
      v-for="(item, index) in compData"
    >
      <div class="label">{{ item.name }}</div>
      <div class="icon">
        <dynamic-icon
          class="icon-view"
          :half-num="item.halfNum"
          :full-num="item.fullNum"
          :remaining-num="item.remainingNum"
          :back-size="item.backSize"
          :half-icon="require('../../images/mao2.png')"
          :full-icon="require('../../images/mao1.png')"
          :back-icon="require('../../images/backicon.png')"
        ></dynamic-icon>
      </div>
      <div class="value">{{ item.value }}</div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import DynamicIcon from './dynamicIcon'
  export default {
    name: 'ClHat',

    components: { DynamicIcon },

    props: {
      refName: String,
      styleOption: Object,
      deployOption: Object,
      datasourceId: String | Number,
      sql: String,
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

    beforeDestroy() {
      // this[this.refName + 'Chart'].dispose();
      // this[this.refName + 'Chart'] = null;
    },

    methods: {
      renderComp() {
        if (this.datasourceId && this.sql) {
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
          this.http.get('/rest/report/sql', {
            datasourceId: this.datasourceId,
            sql: this.sql
          }).then((res) => {
            this.baseData = res.data.rows;
            this.columns = res.data.columns;
            this.handleData();
          })
        }, 1000);
      },
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          new Promise.any([axios.get('/mock.json'), axios.get('/report/mock.json')]).then((res) => {
            this.baseData = res.data.hat.rows;
            this.columns = res.data.hat.columns;
            this.handleData();
          })
        }, 1000);
      },
      handleData() {
        let base = [];
        this.baseData.forEach((item, index) => {
          let a = new Object();
          this.columns.forEach((items, indexs) => {
            a[items] = item[indexs]
          });
          base.push(a)
        });
        console.log(base);
        let all = 0;
        base.forEach(item => { all += Number(item[this.columns[0]]) });
        console.log(all)
        let baseNum = parseInt(all / 8);
        base.forEach((item, index) => {
          item.backSize = 8;
          item.fullNum = parseInt(item[this.columns[0]] / baseNum);
          item.halfNum = item[this.columns[0]] % baseNum / baseNum >= 0.5 ? 1 : 0;
          item.remainingNum = item.backSize - item.fullNum - item.halfNum;
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
  .jzgxlfb-view {
    flex: 1;
    max-height: 100%;
    display: flex;
    flex-direction: column !important;
    justify-content: space-between;
    .jzgxlfb-item {
      position: relative;
      height: 40px;
      margin-left: .35rem;
      margin-right: .35rem;
      display: flex;
      align-items: center;
      .label {
        width: .48rem;
        flex-shrink: 0;
        font-size: 12px;
        color: #04F9FA;
        font-weight: 500;
        font-family: "PingFang SC";
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .label::after {
        content: '';
        position: absolute;
        background: url("../../images/dashed.png") no-repeat;
        background-size: 100% 100%;
        width: .35rem;
        height: 4px;
        bottom: -8px;
        left: .06rem;
      }
      .icon {
        flex: 1;
        height: 100%;
        margin-right: .22rem;
        margin-left: .20rem;
        min-width: 2.61rem;
        .icon-view {
          position: relative;
        }
        .icon-view::after {
          content: '';
          position: absolute;
          background: url("../../images/line.png") no-repeat;
          background-size: 100% 100%;
          height: 2px;
          width: 100%;
          bottom: 0;
          left: 0;
        }
      }
      .value {
        font-size: 14px;
        width: .21rem;
        text-align: right;
        flex-shrink: 0;
        color: #04E0E0;
        font-weight: 500;
        font-family: DIN-MEDIUM;
      }
    }
    .jzgxlfb-item:last-of-type {
      .icon {
        div.icon-view::after {
          content: '';
          width: 0;
        }
      }
    }
  }
</style>
