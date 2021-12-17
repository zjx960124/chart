<template>
  <div class="turn-page-view">
    <div class="wljxtj-scroll">
      <div class="wljxtj-view rotatex">
        <div
          class="wljxtj-item"
          v-for="(item, index) in compData[0]"
        >
          <div class="rank" :class="'rank' + index"><span>{{ 'TOP0' + (index + 1)}}</span></div>
          <div class="label" :data-title="item['name']">{{ item['name'] }}</div>
        </div>
      </div>
      <div class="wljxtj-view rotatey">
        <div
          class="wljxtj-item"
          v-for="(item, index) in compData[1]"
        >
          <div class="rank" :class="'rank' + index"><span>{{ 'TOP0' + (index + 6)}}</span></div>
          <div class="label" :data-title="item['name']">{{ item['name'] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "TurnPage",

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
  .turn-page-view {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    .wljxtj-scroll:hover {
      .rotatex {
        animation-play-state:paused;
      }
      .rotatey {
        animation-play-state:paused;
      }
    }
    .wljxtj-scroll {
      width: 100%;
      height: 100%;
      overflow-y: hidden;
      overflow-x: hidden;
      -webkit-transform-style: preserve-3d;
      perspective: 800px;
      position: relative;
      cursor: pointer;
      .wljxtj-view {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        left: 0;
        top: 0;
        backface-visibility: hidden;
        .wljxtj-item {
          width: 100%;
          height: calc((100% - 40px) / 5);
          background: url("../../images/rmkc.png") no-repeat;
          background-size: 100% 100%;
          position: relative;
          text-align: left;
          .rank {
            margin-top: 10px;
            margin-bottom: 5px;
            margin-left: .1rem;
            color: #026161;
            font-family: PMZD;
            font-size: 16px;
            font-style: italic;
            span {
              position: relative;
            }
            span::after {
              content: '';
              position: absolute;
              width: 0;
              height: 0;
              border: 5px solid;
              border-color: transparent transparent transparent #D6731A;
              right: -18px;
              top: 5px;
            }
          }
          .label {
            color: #A7C7C7;
            font-size: 12px;
            font-family: PingFangSC-Medium;
            margin-left: .1rem;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
          .label:hover::after {
            content: attr(data-title);    //取到data-title属性的值
            padding: 2px 3px;
            /*border: 1px solid #ddd;*/
            background: black;
            border-radius: 5px;
            position: absolute;
            top: 15px;
            left: -.2rem;
            width: 1rem;
            word-wrap: break-word;
            z-index: 999;
          }
          div.rank0 {
            color: #04E0E0;
          }
          div.rank1 {
            color: #04C7C7;
          }
          div.rank2 {
            color: #039494;
          }
        }
        .wljxtj-item:not(:last-of-type) {
          margin-bottom: 10px;
        }
      }
      .rotatex {
        transition: 1s ease-in-out;
        transform-style: preserve-3d;
        position: absolute;
        animation: scrollChild 10s linear infinite;
      }
      .rotatey {
        transform: rotateY(0.5turn);
        transition: 1s ease-in-out;
        transform-style: preserve-3d;
        position: absolute;
        animation: scrollChilds 10s linear infinite;
        .wljxtj-item {
          .rank {
            color: #026161 !important;
          }
        }
      }
      @keyframes scrollChild {
        0% {
          transform: rotateY(0turn);
        }
        20% {
          transform: rotateY(0turn);
        }
        40% {
          transform: rotateY(0.5turn);
        }
        60% {
          transform: rotateY(0.5turn);
        }
        80% {
          transform: rotateY(0turn);
        }
        100% {
          transform: rotateY(0turn);
        }
      }
      @keyframes scrollChilds {
        0% {
          transform: rotateY(0.5turn);
        }
        20% {
          transform: rotateY(0.5turn);
        }
        40% {
          transform: rotateY(1turn);
        }
        60% {
          transform: rotateY(1turn);
        }
        80% {
          transform: rotateY(0.5turn);
        }
        100% {
          transform: rotateY(0.5turn);
        }
      }
    }
  }
</style>
