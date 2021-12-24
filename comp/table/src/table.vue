<template>
  <div class="table-views">
    <div class="header">
      <div
        v-for="(item, index) in columns"
        :key="index"
      >
        {{ item }}
      </div>
    </div>
    <div class="main">
      <div
        v-for="(item, index) in baseData"
        class="column"
        :key="index + 'w'"
      >
        <div
          v-for="(items, indexs) in item"
          :key="indexs + '内'"
        >
          {{ items }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import handle from '../../utils/index'

  export default {
    name: "ClTable",
    mixins: [handle],
    props: {
      category: String,
      sql: String,
      deployOption: Object,
      DSId: String | Number,
    },
    data() {
      return {
        compData: {
          fields: [],
          data: []
        },
        baseData: [],
        columns: [],
        options: [],
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
            this.baseData = res.data.table.rows;
            this.columns = res.data.table.columns;
            this.options = res.data.table.options;
            this.renderOption();
          })
        }, 1000);
      },
      renderOption() {
        /*let base = [];
        this.baseData && this.baseData.forEach((item, index) => {
          let a = new Object();
          this.columns.forEach((items, indexs) => {
            a[items] = item[indexs];
          });
          base.push(a)
        });
        this.compData.data = base;
        let fields = Array.apply(null,new Array(this.options.length))
          .map((item, index) => { return {'name': this.options[index],'key': this.columns[index]} });
        this.compData.fields = fields;
        console.log(this.compData);*/
      }
    }
  }
</script>

<style lang="scss" scoped>
  .table-views {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .header {
      width: 100%;
      height: 28px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #012E2E;
      & > div {
        color: #677A7A;
        font-size: 12px;
        flex: 1;
        padding-left: .07rem;
        padding-right: .07rem;
      }
      & > div:last-of-type {
        text-align: center;
      }
      & > div:not(:first-of-type):not(:last-of-type) {
        text-align: center;
      }
    }
    .main {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .column {
        width: 100%;
        height: 23px;
        display: flex;
        align-items: center;
        & > div {
          color: #A7C7C7;
          font-size: 14px;
          flex: 1;
          padding-left: .07rem;
          padding-right: .07rem;
          font-weight: 500;
          font-family: PingFangSC-Medium, DIN-MEDIUM;
        }
        & > div:last-of-type {
          text-align: center;
        }
        & > div:not(:first-of-type):not(:last-of-type) {
          text-align: center;
        }
      }
      .column:nth-child(2n) {
        background: #012E2E;
        & > div {
          color: #04E0E0;
        }
      }
    }
  }
</style>
