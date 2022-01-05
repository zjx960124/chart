<template>
  <div class="project-management">
    <div class="search-view">
      <el-form :inline="true">
        <el-form-item label="模板名称:">
          <el-input size="small" v-model="templateName"></el-input>
        </el-form-item>
        <el-button size="small" style="background: #15B2EB; border: none" icon="el-icon-search" type="primary" @click="getTempList">查询</el-button>
        <!--<el-button size="small" @click="reset">重置</el-button>-->
      </el-form>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="createTemplate">新建模板</el-button>
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
          <img :src="item.image" class="project-img" alt="">
          <div class="operate-panel" v-show="activeId === index">
            <el-button
              type="primary"
              class="search-btn"
              style="background: #1569EB"
              @click="toEditTemp(item)"
            >编辑</el-button>
            <!--<i class="el-icon-document-copy copy-icon"></i>-->
            <i class="el-icon-delete delete-icon" v-show="index !== tempList.length - 1" @click="deleteTemp(item)"></i>
          </div>
        </div>
        <div class="content-box">
          <div class="content-box-li">
            <div class="name">{{ item.name }}</div>
            <div class="resolution">{{ item.createTime }}</div>
            <!--<div class="resolution">适用分辨率：1920*1080</div>-->
          </div>
          <!--<div class="content-box-li">
            <div></div>
            <div>{{ item.createTime }}</div>
          </div>-->
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
        templateName: '',
        tempId: '',
        tempName: '',
        activeId: -1,
        tempList: []
      }
    },
    created() {
      this.getTempList();
    },
    mounted() {
    },
    beforeDestroy() {
      this.$Bus.$emit('drawOpen',{type: 'template', id: this.tempId, name: this.tempName});
    },
    methods: {
      toEditTemp(data) {
        sessionStorage.setItem("type", 'template');
        sessionStorage.setItem("id", data.id);
        sessionStorage.setItem("name", data.name);
        this.$router.push(
          {
            path: '/home/editPage/',
          }
        );
      },
      getTempList() {
        let param = { name: this.templateName };
        this.http.get('/rest/report/template/list', param).then((res) => {
          this.tempList = res.data || [];
          this.tempList.push(
            {
              name: '空模板',
              id: -1,
              createTime: '',
              image: require('../../assets/img.png')
            }
          )
        })
      },
      reset() {
        this.templateName = '';
        this.getTempList();
      },
      deleteTemp(data) {
        this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: data.id
          };
          this.http.delete('/rest/report/template', param).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTempList()
          })
        })
      },
      createTemplate() {
        this.$router.push(
          {
            path: '/home/editPage/',
          }
        );
      }
    }
  }
</script>

<style lang="scss" scoped>
  .project-management {
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
      align-content: flex-start;
      .item {
        min-width: 4.1rem;
        width: calc(25% - .25rem);
        height: 290px;
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
            .delete-icon:hover {
              opacity: .9;
            }
            .search-btn {
              border: none;
            }
            .search-btn:hover {
              opacity: .8;
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
          height: 57px;
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
              font-family: PingFangSC-Medium;
              color: #333333;
            }
            .resolution {
              color: #999999;
              font-size: 12px;
              font-family: PingFangSC-Medium;
            }
          }
        }
      }
    }
  }
</style>
