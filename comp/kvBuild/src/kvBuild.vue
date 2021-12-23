<template>
  <div class="kv-view">
    <div
      v-for="(item, index) in compData"
      :key="index"
      class="item"
    >
      <div class="label">{{ item[columns[1]] }}</div>
      <div class="value">{{ item[columns[0]] | locale }}</div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import handle from '../../utils/index';
  export default {
    name: "KvBuild",
    mixins: [handle],
    props: {
      deployOption: Object,
      DSId: String | Number,
    },
    data() {
      return {
        compData: [],
        baseData: [],
        columns: [],
        timeout: null
      }
    },
    methods: {
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data['kvBuild'].rows;
            this.columns = res.data['kvBuild'].columns;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        let base = [];
        this.baseData && this.baseData.forEach((item, index) => {
          let a = new Object();
          this.columns.forEach((items, indexs) => {
            a[items] = item[indexs];
          });
          base.push(a)
        });
        this.compData = base;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .kv-view {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      width: 2.22rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      .label {
        color: #D2FAFA;
        font-size: 14px;
        background: url("../../images/xssj_sqzbyrs_img1.png") no-repeat;
        background-size: 100% 100%;
        width: 1.43rem;
        height: 20px;
        line-height: 18px;
        font-style: italic;
        margin-bottom: 7px;
        font-family: "PingFang SC";
        font-weight: bold;
        text-align: center;
      }
      .value {
        font-size: 20px;
        color: #04E0E0;
        background: url("../../images/xssj_sqzbyrs_img2.png") no-repeat;
        background-size: 100% 100%;
        width: 100%;
        font-family: DIN-MEDIUM;
        font-weight: 500;
        height: 57px;
        text-align: center;
        line-height: 57px;
      }
    }
  }
</style>
