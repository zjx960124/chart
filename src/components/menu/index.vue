<template>
  <div class="container">
    <div class="menu-view">
      <div class="logo">
        <img src="../../assets/other_images/proj-logo.png">
      </div>
      <div class="menu-main">
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          background-color="#221E2C"
          text-color="#CCCCCC"
          active-text-color="#FFFFFF"
          @select="handleSelect"
        >
          <el-menu-item index="2">项目管理</el-menu-item>
          <el-menu-item index="3">模板管理</el-menu-item>
          <el-menu-item index="4">组件库</el-menu-item>
          <el-menu-item index="5">数据管理</el-menu-item>
        </el-menu>
      </div>
      <div class="other">
        <img src="../../assets/other_images/proj-logo.png">
      </div>
    </div>
    <div class="page-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Menu",
    data() {
      return {
        activeIndex: '2'
      }
    },
    mounted() {
      let routeList = ['/home/projectManagement', '/home/tempManagement', '/home/componentGallery' ,'/home/dataManager'];
      this.activeIndex = (routeList.findIndex((value) => value === this.$route.path) + 2).toString();
    },
    methods: {
      handleSelect(val) {
        if (val === '2') this.$router.push('/home/projectManagement')
        if (val === '3') this.$router.push('/home/tempManagement')
        if (val === '4') this.$router.push('/home/componentGallery')
        if (val === '5') this.$router.push('/home/dataManager')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .menu-view {
      height: 56px;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 100px;
      padding-right: 100px;
      box-sizing: border-box;
      flex-shrink: 0;
      background: #221E2C;
      .logo {
        color: #FFFFFF;
        font-size: 24px;
      }
      .menu-main {
        height: 100%;
        ::v-deep .el-menu-demo {
          height: 100%;
          li.el-menu-item {
            height: 56px;
            line-height: 56px;
            border-bottom: none;
            font-family: PingFangSC-Medium;
          }
        }
      }
      .other {
        opacity: 0;
        font-size: 24px;
      }
    }
    .page-view {
      width: 100vw;
      height: calc(100% - 56px);
      flex: 1;
      display: flex;
      overflow-y: auto;
    }
  }
</style>
