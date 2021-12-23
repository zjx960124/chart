<template>
  <div class="component-gallery">
    <!--<div class="search-view">
      <el-form :inline="true">
        <el-form-item label="图表类型:">
          <el-input size="small" v-model="projectName"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-input size="small" v-model="projectCode"></el-input>
        </el-form-item>
        <el-button size="small" type="primary">查询</el-button>
        <el-button size="small">重置</el-button>
      </el-form>
    </div>-->
    <div class="main-view">
      <div
        v-for="(item, index) in tempList"
        :key="index.toString()"
        class="item"
        @mouseover="activeId = index"
        @mouseleave="activeId = -1"
      >
        <div class="img-box">
          <img :src="item.backgroundImage" class="project-img" alt="">
          <div class="operate-panel" v-show="activeId === index">
            <el-button type="primary" plain @click="toEditComp(item)">编辑组件</el-button>
          </div>
        </div>
        <div class="content-box">
          <div class="content-box-li">
            <div class="name">{{ item.name }}</div>
            <div class="resolution"></div>
          </div>
          <div class="content-box-li">
            <div>来源:</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TempManagement",
    data() {
      return {
        projectName: '',
        projectField: '',
        projectCode: '',
        activeId: -1,
        tempList: []
      }
    },
    mounted() {
      this.tempList = this.$cChart;
      console.log(this.tempList)
    },
    methods: {
      toEditComp(data) {
        this.$router.push({
          path: '/home/componentDeploy',
          query: {
            comp: data.component.name
            }
          }
        );
      }
    }
  }
</script>

<style lang="scss" scoped>
  .component-gallery {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .search-view {
      height: 56px;
      width: 100%;
      flex-shrink: 0;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 1.1rem;
      padding-right: 1.1rem;
      box-sizing: border-box;
      ::v-deep .el-form {
        display: flex;
        align-items: center;
        .el-form-item {
          margin-bottom: 0;
        }
      }
    }
    .main-view {
      background: rgb(240, 242, 245);
      flex: 1;
      box-sizing: border-box;
      padding: .2rem .8rem .2rem 1rem;
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      .item {
        min-width: 2.7rem;
        width: calc(16.6% - 1.25rem);
        height: fit-content;
        border-radius: 4px;
        margin-right: .2rem;
        margin-bottom: 20px;
        position: relative;
        cursor: pointer;
        .img-box {
          width: 100%;
          height: fit-content;
          overflow: hidden;
          position: relative;
          border-radius: 4px;
          height: fit-content;
          max-height: 202px;
          background: #000211;
          .project-img {
            width: 100%;
            aspect-ratio: auto 270 / 202;
            border-radius: 4px;
            transition: all 0.6s;
            cursor: pointer;
          }
          .operate-panel {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background: rgba(0, 0, 0, .5);
            display: flex;
            align-items: center;
            justify-content: center;
            .copy-icon {
              position: absolute;
              font-size: 24px;
              top: 20px;
              right: 70px;
              background: transparent;
              color: #ffffff;
            }
            .delete-icon {
              position: absolute;
              font-size: 24px;
              top: 20px;
              right: 30px;
              background: transparent;
              color: #ffffff;
            }
          }
        }
        .img-box:hover {
          .project-img {
            transform: scale(1.2);
          }
        }
        .content-box {
          width: 100%;
          padding: 0 12px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          .content-box-li {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #999999;
            font-size: 12px;
            .name {
              font-size: 14px;
              font-family: PingFangSC-Medium;
              color: #333333;
              margin-top: 6px;
              margin-bottom: 4px;
            }
            .resolution {
              color: #376AB8;
              font-size: 12px;
              font-family: "PingFang SC";
            }
          }
        }
      }
      .item:nth-child(6n +6) {
        margin-right: 0;
      }
    }
  }
</style>
