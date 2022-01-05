<template>
  <div class="rolling-table-view">
    <div class="table-header">
      <div
        v-for="(item, index) in columns"
        :key="index"
      >
        {{ item }}
      </div>
    </div>
    <div
      class="scroll-view"
      ref="scroll"
      :style="{maxHeight: maxHeight}"
    >
      <div
        class="table-content"
        :class="exceedHeight ? 'animation' : ''"
        :style="{ animationDuration: `${rows.length}s` }"
        ref="content"
      >
        <div
          v-for="(item, index) in rows"
          class="column"
          :key="index + 'w'"
        >
          <div
            v-for="(items, indexs) in item"
            :key="indexs + 'n'"
          >
            {{ items }}
          </div>
        </div>
        <div class="copy-view">
          <div
            v-if="exceedHeight"
            v-for="(item, index) in rows"
            class="column-copy"
            :key="index + 'w1'"
          >
            <div
              v-for="(items, indexs) in item"
              :key="indexs + 'n1'"
            >
              {{ items }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  import handle from "../../utils/index";
  export default {
    name: "ClRollingTable",
    mixins: [handle],
    props: {
      refName: String,
      styleOption: Object,
      deployOption: Object,
      DSId: String | Number
    },
    data() {
      return {
        rows: [],
        columns: [],
        compData: [],
        timeout: null,
        exceedHeight: false,
        maxHeight: ''
      }
    },
    methods: {
      getMock() {
        if (this.timeout) {
          clearTimeout(this.timeout)
        }
        this.timeout = setTimeout(() => {
          axios.get(`/report/mock.json`).then((res) => {
            this.rows = res.data.rollingTable.rows;
            this.columns = res.data.rollingTable.columns;
            this.$nextTick(() => {
              this.renderOption();
            });
          })
        }, 1000);
      },
      renderOption() {
        let viewHeight = this.$refs.scroll.offsetHeight;
        let contentHeight = this.$refs.content.offsetHeight;
        console.log(viewHeight)
        console.log(contentHeight)
        // this.maxHeight = viewHeight + 'px';
        console.log(contentHeight >= viewHeight)
        this.exceedHeight = contentHeight >= viewHeight
      }
    }
  }
</script>

<style lang="scss" scoped>
  .rolling-table-view {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .table-header {
      width: 100%;
      height: 28px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #012E2E;
      flex-shrink: 0;
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
    .scroll-view {
      width: 100%;
      flex: 1;
      height: 0;
      flex-shrink: 0;
      overflow-y: hidden;
      display: flex;
      .table-content {
        width: 100%;
        display: flex;
        height: fit-content;
        flex-direction: column;
        justify-content: space-between;

        .column {
          width: 100%;
          padding: 5px 0;
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

        .column:nth-child(2n + 0) {
          background: #012E2E;

          & > div {
            color: #04E0E0;
          }
        }

        .column-copy {
          width: 100%;
          height: 23px;
          padding: 5px 0;
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

        .copy-view {
          .column-copy:nth-child(2n + 0) {
            background: #012E2E;

            & > div {
              color: #04E0E0;
            }
          }
        }
      }
      .table-content:hover {
        cursor: pointer;
      }
      .animation {
        animation-name: scrollX;
        animation-timing-function: linear; // 动画速度曲线，匀速
        animation-iteration-count: infinite; // 动画循环无限次播放
      }
      .animation:hover {
        animation-play-state: paused;
      }
      @keyframes scrollX {
        0% {
          transform: translate3d(0%, 0%, 0);
        }
        100% {
          transform: translate3d(0%, -50%, 0);
        }
      }
    }
  }
</style>
