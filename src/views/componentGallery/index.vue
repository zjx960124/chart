<template>
  <div class="component-gallery">
    <div class="search-view">
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
      <el-button type="primary" size="small">新建图表</el-button>
    </div>
    <div class="main-view">
      <div
        v-for="(item, index) in tempList"
        :key="index.toString()"
        class="item"
        @mouseover="activeId = index"
        @mouseleave="activeId = -1"
      >
        <div class="img-box">
          <img src="../../assets/img.png" class="project-img" alt="">
          <div class="operate-panel" v-show="activeId === index">
            <el-button type="primary" plain @click="toEditComp(item)">选择组件</el-button>
          </div>
        </div>
        <div class="content-box">
          <div class="content-box-li">
            <div class="name">{{ item.name }}</div>
            <div class="resolution">适用分辨率：1920*1080</div>
          </div>
          <div class="content-box-li">
            <div>领域：中职院校 页面数：6</div>
            <div>2021-03-02</div>
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
      background: #DCDCDC;
      flex: 1;
      box-sizing: border-box;
      padding: .2rem .8rem .2rem 1rem;
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      .item {
        min-width: 4.1rem;
        width: calc(25% - .25rem);
        height: 320px;
        background: #ffffff;
        border-radius: 4px;
        margin-right: .2rem;
        margin-bottom: .2rem;
        position: relative;
        cursor: pointer;
        .img-box {
          width: 100%;
          height: fit-content;
          max-height: 233px;
          overflow: hidden;
          position: relative;
          border-radius: 4px 4px 0 0;
          .project-img {
            width: 100%;
            height: 233px;
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
          height: 87px;
          padding: 0 16px;
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
              font-family: "PingFang SC";
              color: #333333;
            }
            .resolution {
              color: #376AB8;
              font-size: 12px;
              font-family: "PingFang SC";
            }
          }
        }
      }
    }
  }
</style>
