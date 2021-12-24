<template>
  <div class="multi-rows">
    <div
      class="item"
      v-for="(item, index) in compData"
      :key="index"
    >
      <div class="item-icon"></div>
      <div class="item-info">
        <div class="item-label" :data-title="item.name">{{ item[columns[1]] }}</div>
        <div class="item-value">{{ item[columns[0]] | locale }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import handle from "../../utils/index";

  export default {
    name: "MultiRows",
    mixins: [handle],
    props: {
      category: String,
      sql: String,
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
            this.baseData = res.data['multiRows'].rows;
            this.columns = res.data['multiRows'].columns;
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
        console.log(base);
        this.compData = base;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .multi-rows {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    /*height: 100%;*/
    .item {
      height: 40px;
      display: flex;
      align-items: center;
      flex: 1;
      flex-shrink: 0;
      padding-left: 30px;
      justify-content: flex-start;
      max-width: 25%;
      min-width: 24%;
      box-sizing: border-box;
      .item-icon {
        background: url("../../images/bxgm_img2.png") no-repeat;
        width: .15rem;
        height: 27px;
        background-size: 100% 100%;
      }
      .item-info {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .item-label {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          font-weight: 400;
          color: #A7C7C7;
        }
        .item-value {
          background: url("../../images/bxgm_img3.png") no-repeat;
          background-size: 100% 100%;
          height: 16px;
          line-height: 16px;
          text-align: center;
          min-width: .53rem;
          padding: 0 .15rem;
          color: #04E0E0;
          font-size: 14px;
          font-family: DIN-MEDIUM;
        }
      }
    }
    .center-bot-bot {
      padding: 0 .22rem;
      margin-bottom: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
  }
</style>
