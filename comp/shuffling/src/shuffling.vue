<template>
  <div class="shuffling">
    <el-carousel height="100%">
      <el-carousel-item class="a" v-for="(item, index) in compData" :key="index">
        <div
          class="shuffling-item"
          v-for="(items, indexs) in item"
          :class="items[columns[2]]"
          :key="indexs"
        >
          <div class="label">{{ items[columns[1]] }}</div>
          <div class="value">{{ items[columns[0]] }} <span>天</span></div>
          <div class="icon"></div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Shuffling",

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
            this.baseData = res.data.shuffling.rows;
            this.columns = res.data.shuffling.columns;
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
        for(let i = 0, len = base.length; i < len; i+=6){
          this.compData.push(base.slice(i,i+6));
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
  .shuffling {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    ::v-deep .el-carousel {
      width: 100%;
      height: 100%;
      .a {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .shuffling-item {
          width: calc((100% - 20px) / 3);
          height: calc((100% - 10px) / 2);
          background: url("../../images/xyxl_img4.png") no-repeat;
          background-size: 100% 100%;
          position: relative;
          text-align: left;
          .label {
            color: #92ADAD;
            font-size: 14px;
            font-family: "PingFang SC";
            font-weight: 500;
            margin-top: 20px;
            margin-left: .2rem;
            margin-bottom: 20px;
            max-width: 1.1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .value {
            font-size: 24px;
            font-family: DIN;
            font-weight: 500;
            margin-left: .2rem;
            color: #E9EDED;
            & > span {
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #677A7A;
            }
          }
          .icon {}
        }
        div.nice {
          background: url("../../images/xyxl_img5.png") no-repeat;
          background-size: 100% 100%;
          .label {
            color: #03ADAD;
            font-size: 14px;
            font-family: "PingFang SC";
            font-weight: 500;
            margin-top: 20px;
            margin-left: .2rem;
            margin-bottom: 20px;
          }
          .value {
            font-size: 24px;
            font-family: DIN;
            font-weight: 500;
            margin-left: .2rem;
            color: #04E0E0;
            & > span {
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #027A7A;
            }
          }
          .icon {
            width: 14px;
            height: 18px;
            background: url("../../images/xyxl_img6.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 17px;
            right: 18px;
          }
        }
        div.warning {
          background: url("../../images/xyxl_img6(1).png") no-repeat;
          background-size: 100% 100%;
          .label {
            color: #A35714;
            font-size: 14px;
            font-family: "PingFang SC";
            font-weight: 500;
            margin-top: 20px;
            margin-left: .2rem;
            margin-bottom: 20px;
          }
          .value {
            font-size: 24px;
            font-family: DIN;
            font-weight: 500;
            margin-left: .2rem;
            color: #D6731A;
            & > span {
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 400;
              color: #703C0D;
            }
          }
          .icon {
            width: 18px;
            height: 16px;
            background: url("../../images/xyxl_img7.png") no-repeat;
            background-size: 100% 100%;
            position: absolute;
            top: 17px;
            right: 18px;
          }
        }
        .shuffling-item:nth-child(2) {
          margin: 0 10px 10px 10px;
        }
        .shuffling-item:nth-child(5) {
          margin: 0 10px 0 10px;
        }
      }
    }
  }
</style>
