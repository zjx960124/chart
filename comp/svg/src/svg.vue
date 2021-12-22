<template>
  <div
    :ref="refName"
    class="svg-view"
    :style="{ ...styleOption }"
  >
    <div
      class="zzmm-item"
      v-for="item in compData"
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="svg_draw"
          class="svg-draw"
          width="61px"
          height="34px"
          baseProfile="full"
          version="1.1"
          style="display: block"
          v-html="item.svgString"
        >
        </svg>
      </div>
      <div class="item-child">
        <div class="item-icon"></div>
        <div class="item-info">
          <div class="item-label">{{ item[columns[1]] }}</div>
          <div class="item-value">{{ item[columns[0]] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import handle from '../../utils'
  export default {
    name: 'ClSvg',

    mixins: [handle],

    props: {
      refName: String,
      styleOption: Object,
      deployOption: Object,
      datasourceId: String | Number,
      sql: String,
      DSId: String | Number,
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
      renderEChart() {
        console.log(this.DSId);
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
        }, 1000);
      },
      getMock() {
        axios.get('/report/mock.json').then((res) => {
          this.baseData = res.data.zzmm.rows;
          this.columns = res.data.zzmm.columns;
          this.renderOption();
        })
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
        base.forEach((item, index) => {
          let x2 = 19 + Math.sin((2 * Math.PI / 360) * (3.6 * Number(item[this.columns[2]]) )) * 10;
          let y2 = 17 - Math.cos((2 * Math.PI / 360) * (3.6 * Number(item[this.columns[2]]) )) * 10;
          let direction = parseInt(item[this.columns[2]]) > 50 ? 1 : 0;
          item.svgString = `
                      <circle cx="19" cy="17" r="10" fill="#134B50"></circle>
                      <path d="M19 17 L19 7 A 10 10, 0, ${direction}, 1, ${parseInt(x2)} ${parseInt(y2)} L19 17 Z" fill="#04F9FA"></path>
                      <text x="39" y="21" font-size="12" font-family="DIN-MEDIUM" font-weight="500" text-anchor="middle" fill="#D6731A">${parseInt(item[this.columns[2]])}</text>
                      <text x="49" y="21" font-size="9" font-family="DIN-MEDIUM" font-weight="500" text-anchor="middle" fill="#D6731A">%</text>`
        });
        this.compData = base;
      }
    },
  }
</script>

<style lang="scss" scoped>
  .svg-view {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .zzmm-item {
      /*width: 33%;*/
      min-width: 26%;
      height: 80px;
      .svg-draw {
        background: url("../../images/jszzmm_img2.png") no-repeat;
        background-size: 100% 100%;
      }
      .item-child {
        height: 38px;
        display: flex;
        align-items: center;
        flex: 1;
        flex-shrink: 0;
        justify-content: flex-start;
        margin-top: 8px;
        .item-icon {
          background: url("../../images/jszzmm_img3.png") no-repeat;
          width: .09rem;
          height: 27px;
          background-size: 100% 100%;
          flex-shrink: 0;
        }
        .item-info {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          text-align: left;
          .item-label {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            font-weight: 400;
            color: #A7C7C7;
          }
          .item-value {
            background: #134B50;
            height: 16px;
            line-height: 16px;
            text-align: center;
            padding: 0 .1rem;
            color: #04F9FA;
            font-size: 14px;
            font-family: DIN-MEDIUM;
          }
        }
      }
    }
  }
</style>
