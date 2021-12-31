<template>
  <div class="project-management">
    <div class="search-view">
      <el-form :inline="true">
        <el-form-item label="项目名称:">
          <el-input size="small" v-model="projectName"></el-input>
        </el-form-item>
        <!--<el-form-item label="项目编号:">
          <el-input size="small" v-model="projectCode"></el-input>
        </el-form-item>-->
        <el-button
          style="background: #15B2EB"
          size="small"
          icon="el-icon-search"
          type="primary"
          @click="getProjectList"
          class="search-btn"
        >查询</el-button>
        <!--<el-button size="small" icon="el-icon-refresh">重置</el-button>-->
      </el-form>
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="createProject"
        style="background: #1569EB"
        class="search-btn"
      >新增项目</el-button>
    </div>
    <div class="main-view">
      <div
        v-for="(item, index) in projectList"
        :key="index"
        class="item"
        @mouseover="activeId = index"
        @mouseleave="activeId = -1"
      >
        <div class="img-box">
          <img src="../../assets/img.png" class="project-img" alt="">
          <div class="operate-panel" v-show="activeId === index">
            <el-button
              type="primary"
              class="search-btn"
              style="background: #1569EB"
              @click="toEditProject(item)"
            >编辑</el-button>
            <!--<i class="el-icon-document-copy copy-icon"></i>-->
            <i class="el-icon-delete delete-icon" @click="deleteProject(item)"></i>
          </div>
        </div>
        <div class="content-box">
          <div class="content-box-li">
            <div class="name">{{ item.name }}</div>
            <div class="resolution">{{ item.createTime }}</div>
          </div>
          <!--<div class="content-box-li">
            <div>页面数：6</div>
            <div>2021-03-02</div>
          </div>-->
        </div>
      </div>
    </div>
    <el-dialog
      title="新增项目"
      :visible.sync="projectDialogVisible"
      width="30%"
      top="30vh"
      class="project-dialog"
      :close-on-click-modal="false"
      center
    >
      <el-form
        label-width="70px"
        label-position="left"
        ref="sourceForm"
      >
        <el-form-item label="项目名称">
          <el-input v-model="newProjectName"></el-input>
        </el-form-item>
        <el-form-item label="项目编号">
          <el-input v-model="newProjectCode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancer" size="small">取 消</el-button>
        <el-button type="primary" @click="sure" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "ProjectManagement",
    data() {
      return {
        projectName: '',
        projectField: '',
        projectCode: '',
        newProjectName: '',
        projectDialogVisible: false,
        newProjectCode: '',
        activeId: -1,
        projectList: [
        ]
      }
    },
    mounted() {
      this.getProjectList();
    },
    methods: {
      toEditProject(data) {
        this.$router.push({
            path: '/home/edit',
            query: {
              code: data.projectCode,
              id: data.id
            }
          }
        );
      },
      createProject() {
        this.newProjectName = '';
        this.newProjectCode = '';
        this.projectDialogVisible = true;
      },
      deleteProject(data) {
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = { id: data.id };
          this.http.delete('/rest/report/project', param).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getProjectList();
          });
        })
      },
      getProjectList() {
        let param = { name: this.projectName, projectCode: this.projectCode };
        this.http.get('/rest/report/project/list', param).then(res => {
          this.projectList = res.data || [];
        })
      },
      inputName(val) {
        this.newProjectCode = this.pinyin.getFullChars(val);
      },
      cancer() {
        this.projectDialogVisible = false;
      },
      sure() {
        if (this.newProjectName === '' && this.newProjectCode === '') {
          this.$message.error('名字,编号必填');
          return false;
        } else {
          let param = { name: this.newProjectName, projectCode: this.newProjectCode }
          this.http.post('/rest/report/project', param).then(res => {
            this.projectDialogVisible = false;
            this.getProjectList();
            this.$message.success('新增成功');
          })
        }
      },
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
      .search-btn {
        border: none;
      }
      .search-btn:hover {
        opacity: .8;
      }
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
              font-family: "PingFang SC";
              color: #333333;
            }
            .resolution {
              color: #999999;
              font-size: 12px;
              font-family: "PingFang SC";
            }
          }
        }
      }
    }
    .project-dialog {
      font-size: 12px;
    }
  }
</style>
