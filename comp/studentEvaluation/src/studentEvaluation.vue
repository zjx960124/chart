<template>
  <div class="student-evaluation">
    <div class="search-view">
      <div class="search-select grade">
        <el-select v-model="grade" @change="changeGrade">
          <el-option
            v-for="(item, index) in gradeOption"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="search-select time">
        <el-date-picker
          v-model="month"
          type="month"
          placeholder="选择月"
          format="yyyy-MM"
          value-format="yyyy-MM"
          @change="changeMonth"
        >
        </el-date-picker>
      </div>
    </div>
    <div class="center-bot-main">
      <div class="overflow-view">
        <div
          class="scroll-view"
          :style="{animationDuration: `${deployOption.animationTime}s` || '40s'}"
        >
          <div
            class="main-item"
            v-for="(item, index) in seriesData"
            :key="index + '0'"
          >
            <div class="item-label">
              <div class="rank" :class="'rank' + index">
                <span>{{ index !== 9 ? 'TOP0' + (index + 1) : 'TOP' + (index + 1) }}</span>
              </div>
              <div>{{ item[columns[1]] }}</div>
            </div>
            <div class="item-value">{{ item.value }}</div>
            <div class="item-icon">
              <dynamic-icon
                :half-num="0"
                :full-num="item.fullNum"
                :remaining-num="5 - item.fullNum"
                :half-icon="require('../../images/bjpftop5_img5.png')"
                :full-icon="require('../../images/bjpftop5_img4.png')"
                :back-icon="require('../../images/bjpftop5_img5.png')"
              ></dynamic-icon>
            </div>
          </div>
          <div
            class="main-item"
            v-for="(item, index) in seriesData"
            :key="index + '1'"
          >
            <div class="item-label">
              <div class="rank" :class="'rank' + index">
                <span>{{ index !== 9 ? 'TOP0' + (index + 1) : 'TOP' + (index + 1) }}</span>
              </div>
              <div>{{ item[columns[1]] }}</div>
            </div>
            <div class="item-value">{{ item.value }}</div>
            <div class="item-icon">
              <dynamic-icon
                :half-num="0"
                :full-num="item.fullNum"
                :remaining-num="5 - item.fullNum"
                :half-icon="require('../../images/bjpftop5_img5.png')"
                :full-icon="require('../../images/bjpftop5_img4.png')"
                :back-icon="require('../../images/bjpftop5_img5.png')"
              ></dynamic-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import dynamicIcon from "../../hat/src/dynamicIcon";

  export default {
    name: "StudentEvaluation",

    components: { dynamicIcon },

    props: {
      refName: String,
      styleOption: Object,
      theme: String,
      datasourceId: String | Number,
      legend: String,
      category: String,
      sql: String,
      deployOption: Object,
      DSId: String | Number,
    },

    data() {
      return {
        month: '',
        grade: '',
        gradeOption: [],
        seriesData: [],
        baseData: [],
        columns: [],
        timeout: null
      }
    },

    watch: {
      category: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.handleData();
        }
      },
      legend: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.handleData();
        }
      },
      theme: {
        handler: function (newV, oldV) {
          this.handleData();
        }
      },
      deployOption: {
        deep: true,
        handler: function (newV, oldV) {
          this.handleData();
        }
      },
      sql: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderEChart();
        }
      },
      datasourceId: {
        deep:true, //深度监听设置为 true
        handler: function (newV, oldV) {
          this.renderEChart();
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
            this.baseData = res.data['evaluation'].rows;
            this.columns = res.data['evaluation'].columns;
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
            a[items] = item[indexs];
          });
          base.push(a)
        });
        base.forEach((item, index) => {
          item.fullNum = parseInt(item.value / 20) > 5 ? 5 : parseInt(item.value / 20) ;
        })
        this.seriesData = base;
        console.log(this.seriesData);
      },
      changeGrade() {},
      changeMonth() {},
    }
  }
</script>

<style lang="scss" scoped>
  .student-evaluation {
    display: flex;
    flex-direction: column;
    .search-view {
      flex-shrink: 0;
      height: 83px;
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      position: relative;
      margin-left: .12rem;
      margin-right: .12rem;
      width: calc(100% - .24rem);
      .search-select {
        background: url("../../images/jxzl_img1.png") no-repeat;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;
        ::v-deep.el-select {
          width: .61rem;
          height: .22rem;
          .el-input {
            height: 100%;
            .el-input__inner {
              height: 100%;
              background: transparent;
              border-color: #026161;
              padding-right: 0;
              padding-left: 7px;
              font-size: 10px;
              color: #04F9FA;
            }
            .el-input__suffix {
              right: -4px;
              .el-icon-arrow-up:before {
                content: '\e78f';
                color: #04F9FA;
              }
              .el-input__icon {
                line-height: 100%;
              }
            }
          }
        }
      }
      .grade {
        width: .77rem;
        height: .22rem;
      }
      .time {
        width: .98rem;
        height: .22rem;
        margin-left: 8px;
        ::v-deep.el-date-editor--month {
          width: .82rem;
          height: .22rem;
          .el-input__inner {
            height: .22rem;
            background: transparent;
            border-color: #026161;
            padding-right: 0;
            padding-left: 30px;
            font-size: 10px;
            color: #04F9FA;
          }
          .el-input__prefix {
            .el-input__icon {
              line-height: 22px;
              color: #04E1E1;
            }
          }
          .el-input__suffix {
            display: none;
          }
        }
      }
    }
    .search-view::after {
      content: '';
      position: absolute;
      width: 100%;
      left: 0;
      height: 2px;
      bottom: -1px;
      background: url("../../images/bjpftop5_img2.png") no-repeat;
      background-size: 100% 100%;
    }
    .center-bot-main {
      width: 100%;
      height: calc(100% - 83px);
      display: flex;
      align-items: center;
      justify-content: space-between;
      .overflow-view {
        width: 0;
        flex: 1;
        margin-left: .35rem;
        height: 100%;
        overflow-x: hidden;
        .scroll-view {
          width: fit-content;
          display: flex;
          align-items: center;
          height: 100%;
          animation-name: scrolly; // Q3
          animation-timing-function: linear; // 动画速度曲线，匀速
          animation-iteration-count: infinite; // 动画循环无限次播放
          .main-item {
            width: 1.1rem;
            height: 114px;
            background: url("../../images/bjpftop5_img3.png") no-repeat;
            background-size: 100% 100%;
            display: flex;
            flex-direction: column;
            align-content: space-between;
            padding-top: 14px;
            padding-bottom: 14px;
            margin-right: .38rem;
            .item-label {
              /*max-width: .67rem;*/
              width: 100%;
              font-size: 12px;
              color: #A7C7C7;
              text-align: center;
              align-self: center;
              font-family: "PingFang SC";
              /*margin-bottom: 18px;*/
              flex: 1;
              word-wrap: break-word;
              /*max-height: 30px;*/
              overflow-y: hidden;
              line-height: 16px;
              .rank {
                color: #026161;
                font-family: PMZD;
                font-size: 16px;
                font-style: italic;
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
            .item-value {
              font-family: DIN-MEDIUM;
              font-weight: 500;
              font-size: 24px;
              color: #D6731A;
              text-align: center;
              margin-bottom: 10px;
            }
            .item-icon {
              margin: 0 .2rem;
              height: 10px;
              justify-self: flex-end;
              ::v-deep.dynamic-view {
                .info {
                  img {
                    width: .1rem;
                    height: 9px;
                  }
                }
                .back {
                  img {
                    width: .1rem;
                    height: 9px;
                  }
                }
              }
            }
          }
          @keyframes scrolly {
            0% {
              transform: translate3d(0%, 0%, 0);
            }
            100% {
              transform: translate3d(-50%, 0%, 0);
            }
          }
        }
      }
    }
  }
</style>
