<template>
  <div
    class="svg-teacher-view"
    :ref="refName"
    :style="{ ...styleOption }"
  >
    <div
      class="item"
      v-for="(item, index) in compData"
    >
      <div class="item-icon"></div>
      <div class="item-info">
        <div class="item-label" :data-title="item.name">{{ item.name }}</div>
        <div class="item-value">{{ item[columns[0]] }}<span class="util">人</span></div>
      </div>
      <div class="item-chart" style="width: 42px; height: 42px;">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="svg_draw"
          width="42px"
          height="42px"
          baseProfile="full"
          version="1.1"
          style="position: absolute; left: 0; top: 0"
          v-html="item.svgString"
        >
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import handle from "../../utils/index";
  export default {
    name: "SvgTeacher",
    mixins: [handle],
    props: {
      refName: String,
      styleOption: Object,
      deployOption: Object,
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
      getMock() {
        axios.get('/report/mock.json').then((res) => {
          this.baseData = res.data.svg2.rows;
          this.columns = res.data.svg2.columns;
          this.renderOption();
        })
      },
      renderOption() {
        let base = [];
        this.baseData.forEach((item, index) => {
          let a = new Object();
          this.columns.forEach((items, indexs) => {
            a[items] = item[indexs]
          })
          base.push(a)
        });
        base.forEach((item, index) => {
          let x2 = 19 + Math.sin((2 * Math.PI / 360) * (3.6 * Number(item[this.columns[2]]) )) * 10;
          let y2 = 17 - Math.cos((2 * Math.PI / 360) * (3.6 * Number(item[this.columns[2]]) )) * 10;
          let direction = parseInt(item[this.columns[2]]) > 50 ? 1 : 0;
          item.svgString = `
                      <circle cx="19" cy="17" r="10" fill="#134B50"></circle>
                      <path d="M19 17 L19 7 A 10 10, 0, ${direction}, 1, ${parseInt(x2)} ${parseInt(y2)} L19 17 Z" fill="#04F9FA"></path>
                      <text x="18" y="38" font-size="12" font-family="DIN-MEDIUM" font-weight="500" text-anchor="middle" fill="#D6731A">${parseInt(Number(item[this.columns[2]]))}</text>
                      <text x="28" y="37" font-size="9" font-family="DIN-MEDIUM" font-weight="500" text-anchor="middle" fill="#D6731A">%</text>`
        });
        this.compData = base;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .svg-teacher-view {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: calc((100% - .1rem) / 2);
      height: fit-content;
      .item-icon {
        background: url("../../images/jszzmm_img3.png") no-repeat;
        background-size: 100% 100%;
        width: .11rem;
        aspect-ratio: auto 11 / 24; //就添加这一行
        flex-shrink: 0;
      }
      .item-info {
        height: 100%;
        display: flex;
        flex: 1;
        max-width: .48rem;
        flex-direction: column;
        justify-content: space-between;
        .item-label {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          font-weight: 400;
          color: #A7C7C7;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: .48rem;
        }
        .item-label:hover::after {
          content: attr(data-title);    //取到data-title属性的值
          padding: 2px 3px;
          background: black;
          border-radius: 5px;
          position: absolute;
          top: 15px;
          left: -.2rem;
          width: 1rem;
          word-wrap: break-word;
        }
        .item-value {
          text-align: left;
          color: #04E0E0;
          font-size: 14px;
          font-family: DIN-MEDIUM;
          font-weight: 500;
          .util {
            color: #677A7A;
            font-size: 11px;
          }
        }
      }
      .item-chart {
        background: url("../../images/jszzmm_img2.png") no-repeat;
        background-size: 100% 100%;
        margin-left: .08rem;
        position: relative;
      }
    }
    .item:nth-child(2n +1) {
      margin-right: .1rem;
    }
  }
</style>
