<template>
  <div class="multi-rows">
    <div
      class="item"
      v-for="(item, index) in compData"
      :key="index"
    >
      <div class="item-icon"></div>
      <div class="item-info">
        <div class="item-label" :data-title="item.name">{{ item.name }}</div>
        <div class="item-value">{{ item.value | locale }}</div>
      </div>
    </div>
    <!--<div class="center-bot-bot">
      <div
        class="item"
        v-for="(item, index) in bxgm2"
      >
        <div class="item-icon"></div>
        <div class="item-info">
          <div class="item-label">{{ item.type }}</div>
          <div class="item-value">{{ item.countResult | locale}}</div>
        </div>
      </div>
      <div class="item">
        <div class="item-icon"></div>
        <div class="item-info">
          <div class="item-label">占地面积(亩)</div>
          <div class="item-value">103.2</div>
        </div>
      </div>
      <div class="item">
        <div class="item-icon"></div>
        <div class="item-info">
          <div class="item-label">建筑面积(m²)</div>
          <div class="item-value">53596.6</div>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "MultiRows",

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

    watch: {
      deployOption: {
        deep: true,
        handler: function (newV, oldV) {
          this.handleData();
        }
      },
    },

    mounted() {
      this.$nextTick(() => {
        this.renderEChart();
      });
    },

    methods: {
      renderEChart() {
        if (this.DSId) {
          this.getData();
        } else {
          this.getMock();
        }
      },
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
