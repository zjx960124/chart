<template>
  <div class="ranking-view">
    <div class="ranking-left">
      <div
        class="ranking-item"
        v-for="(item, index) in rankingData[0]"
        :key="index"
      >
        <div class="item-left">
          <div class="item-icon" :class="index < 3 ? `icon${index}` : ''">{{ index + 1}}</div>
          <!--<img style="width: 16px; height: 16px" :src="require('../../assets/network/num' + (index + 1) + '.png')" alt="">-->
          <div class="item-label">{{ item[columns[1]] }}</div>
        </div>
        <div class="item-value">{{ item[columns[0]] }}<span>{{ deployOption.utils }}</span></div>
      </div>
    </div>
    <div class="ranking-right">
      <div
        class="ranking-item"
        v-for="(item, index) in rankingData[1]"
        :key="index"
      >
        <div class="item-left">
          <div class="item-icon">{{ index + 6}}</div>
          <!--<img style="width: 16px; height: 16px" :src="require('../../assets/network/num' + (index + 6) + '.png')" alt="">-->
          <div class="item-label">{{ item[columns[1]] }}</div>
        </div>
        <div class="item-value">{{ item[columns[0]] }}<span>{{ deployOption.utils }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: "TopTen",
    props: {
      category: String,
      sql: String,
      deployOption: Object,
      DSId: String | Number,
    },
    data() {
      return {
        rankingData: [],
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
        this.getMock();
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
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.baseData = res.data['top10'].rows;
            this.columns = res.data['top10'].columns;
            this.handleData();
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
            this.handleData();
          })
        }, 1000)
      },
      handleData() {
        let base = [];
        this.baseData && this.baseData.forEach((item, index) => {
          let a = new Object();
          this.columns.forEach((items, indexs) => {
            a[items] = item[indexs]
          });
          base.push(a)
        });
        console.log(base);
        this.rankingData = [];
        this.rankingData.push(base.slice(0, 5));
        this.rankingData.push(base.slice(5, base.length))
      }
    }
  }
</script>

<style lang="scss" scoped>
  .ranking-view {
    width: 100%;
    max-height: 100%;
    flex: 1;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .ranking-left {
      flex: 1;
      width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      margin-right: 20px;
      .ranking-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        max-height: 32px;
        margin-bottom: 25px;
        .item-left {
          display: flex;
          align-items: center;
          .item-icon {
            font-size: 12px;
            color: #ffffff;
            font-family: DIN-BOLD;
            margin-right: 5px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #025757;
            text-align: center;
            line-height: 16px;
          }
          .icon0 {
            background: #04E0E0 !important;
          }
          .icon1 {
            background: #03ADAD !important;
          }
          .icon2 {
            background: #027A7A !important;
          }
          .item-label {
            font-size: 12px;
            color: #A7C7C7;
            font-family: PingFangSC-Medium;
            margin-left: 5px;
            font-style: italic;
          }
        }
        .item-value {
          font-size: 16px;
          color: #04E0E0;
          font-family: DIN-MEDIUM;
          font-style: italic;
          span {
            font-size: 11px;
            color: #677A7A;
            margin-left: 2px;
          }
        }
      }
    }
    .ranking-right {
      flex: 1;
      width: 0;
      height: 100%;
      display: flex;
      flex-direction: column;
      .ranking-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex: 1;
        max-height: 32px;
        margin-bottom: 25px;
        .item-left {
          display: flex;
          align-items: center;
          .item-icon {
            font-size: 12px;
            color: #ffffff;
            font-family: DIN-BOLD;
            margin-right: 5px;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: #025757;
            text-align: center;
            line-height: 16px;
          }
          .icon0 {
            background: #04E0E0 !important;
          }
          .icon1 {
            background: #03ADAD !important;
          }
          .icon2 {
            background: #027A7A !important;
          }
          .item-label {
            font-size: 12px;
            color: #A7C7C7;
            font-family: PingFangSC-Medium;
            margin-left: 5px;
            font-style: italic;
          }
        }
        .item-value {
          font-size: 16px;
          color: #04E0E0;
          font-family: DIN-MEDIUM;
          font-style: italic;
          span {
            font-size: 11px;
            color: #677A7A;
            margin-left: 2px;
          }
        }
      }
    }

    .ranking-item::after {
      content: '';
      background: url("../../images/xslhzptop10_img1.png") no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: 2px;
      position: absolute;
      left: 0;
      bottom: -5px;
    }
  }
</style>
