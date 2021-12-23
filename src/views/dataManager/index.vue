<template>
  <div class="data-manager">
    <div class="left">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-vertical-demo"
        @select="changeActiveIndex"
      >
        <el-menu-item index="1">
          <i class="el-icon-menu"></i>
          <span slot="title">数据源</span>
        </el-menu-item>
        <el-menu-item index="2">
          <i class="el-icon-document"></i>
          <span slot="title">数据集</span>
        </el-menu-item>
        <el-menu-item index="3">
          <i class="el-icon-document"></i>
          <span slot="title">数据格式</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
      <data-source v-if="activeIndex === '1'"></data-source>
      <d-s v-if="activeIndex === '2'"></d-s>
      <data-format v-if="activeIndex === '3'"></data-format>
    </div>
  </div>
</template>

<script>
  import DataSource from './dataSource'
  import DS from './DS'
  import DataFormat from "./dataFormat";
  export default {
    name: 'index',
    components: {DataFormat, DS, DataSource },
    data() {
      return{
        activeIndex: '1'
      }
    },
    methods: {
      changeActiveIndex(val) {
        this.activeIndex = val;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .data-manager {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .left {
      width: 0;
      height: 100%;
      flex: 240;
      .el-menu-vertical-demo {
        width: 100%;
        height: 100%;
        overflow-y: auto;
        .el-menu-item {
          text-align: left;
        }
      }
    }
    .right {
      width: 0;
      height: 100%;
      flex: 1680;
      background: #F0F2F5;
    }
  }
</style>
