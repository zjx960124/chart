<template>
  <div class="jzgxlfb-view">
    <div
      class="jzgxlfb-item"
      v-for="(item, index) in compData"
    >
      <div class="label">{{ item[columns[1]] }}</div>
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
      <div class="value">{{ item[columns[0]] }}</div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import DynamicIcon from './dynamicIcon';
  import handle from '../../utils/index';
  export default {
    name: 'ClHat',
    mixins: [handle],
    components: { DynamicIcon },
    props: {
      refName: String,
      styleOption: Object,
      deployOption: Object,
      DSId: String | Number
    },
    data() {
      return {
        baseData: [],
        columns: [],
        compData: [],
        timeout: null
      }
    },
    methods: {
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data.hat.rows;
            this.columns = res.data.hat.columns;
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
        let all = 0;
        base.forEach(item => { all += Number(item[this.columns[0]]) });
        let baseNum = parseInt(all / (Number(this.deployOption.hatBackSize) || 8));
        base.forEach((item, index) => {
          item.backSize = Number(this.deployOption.hatBackSize) || 8;
          item.fullNum = parseInt(item[this.columns[0]] / baseNum);
          item.halfNum = item[this.columns[0]] % baseNum / baseNum >= 0.5 ? 1 : 0;
          item.remainingNum = item.backSize - item.fullNum - item.halfNum;
        });
        this.compData = base;
        console.log(this.compData)
      }
    },
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
