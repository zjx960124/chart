<template>
  <div class="data-format">
    <div class="search-view">
      <el-form :inline="true">
        <el-form-item label="数据格式名称:">
          <el-input size="small" v-model="dataFormatName"></el-input>
        </el-form-item>
        <el-button size="small" type="primary" @click="getList">查询</el-button>
        <el-button size="small" type="primary" @click="create">新增</el-button>
      </el-form>
    </div>
    <div class="main-view">
      <page-table
        ref="tablePage"
        style="height: 100%"
        type="index"
        :show-no="false"
        :fields="fields"
        :operation="operation"
        :border="true"
        align="center"
        :data="dataFormatList"
        :page="page"
        @page-change="getList"
        @del="handelDelClick"
        @edit="handleEditClick"
      ></page-table>
    </div>
    <el-dialog
      :title="dialogType"
      :visible.sync="dataFormatVisible"
      width="60%"
      class="template-name-dialog"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <el-form
        :model="dataFormatForm"
        label-width="120px"
        label-position="left"
        ref="sourceForm"
      >
        <el-form-item label="名称">
          <el-input v-model="dataFormatForm.dataFormatName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancer">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "dataFormat",

    data() {
      return {
        dataFormatName: '',
        dataFormatList:[],
        fields: [
          {
            name: "数据格式名称",
            key: "dataSourceType"
          },
          {
            name: "描述",
            key: "dataSourceName"
          }
        ],
        operation: [
          { name: "编辑", key: "edit", hidden: false },
          { name: "删除", key: "del", hasPopconfirm: true, hidden: false },
        ],
        page: {
          index: 1,
          size: 5,
          total: 0
        },
        dataFormatForm: {
          dataFormatName: '',
          description: ''
        },
        dialogType: '新增数据格式',
        dataFormatVisible: false
      }
    },

    mounted() {
    },

    methods: {
      getList() {},
      create() {},
      handelDelClick(data) {
        let param = { id: data.id };
        this.http.delete('/rest/report/data-source-info/', param)
          .then(res => {
            console.log(res);
          })
      },
      handleEditClick(data) {
        this.dataFormatForm = data;
        this.dialogType = '编辑数据格式';
        this.dataSourceVisible = true;
      },
      cancer() {
        this.dataFormatForm = {
          dataFormatName: '',
          description: ''
        };
      },
      close() {
        this.dataFormatForm = {
          dataFormatName: '',
          description: ''
        };
        this.dataSourceVisible = false;
      },
      sure() {
        this.$refs['sourceForm'].validate((valid) => {
          if (valid) {
            if (this.dialogType === '新增数据格式') {
              let param = this.dataSourceForm;
              this.http.post('/rest/report/data-source-info/', param)
                .then(res => {
                  this.dataFormatForm = {
                    dataFormatName: '',
                    description: ''
                  };
                  this.dataFormatVisible = false;
                })
            }
            if (this.dialogType === '编辑数据格式') {
              let param = this.dataSourceForm;
              this.http.put('/rest/report/data-source-info/', param)
                .then(res => {
                  this.dataFormatForm = {
                    dataFormatName: '',
                    description: ''
                  };
                  this.dataFormatVisible = false;
                })
            }
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .data-format {
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
      .btn-group {
        height: 100%;
        display: flex;
        align-items: center;
      }
    }
    .main-view {
      background: #DCDCDC;
      flex: 1;
      box-sizing: border-box;
      padding: .2rem .8rem .2rem 1rem;
      display: flex;
      flex-wrap: wrap;
    }
    ::v-deep .el-dialog__header {
      font-size: 12px;
      padding: 16px 20px;
    }
    ::v-deep .el-dialog__footer {
      font-size: 12px;
    }
    .template-upload-dialog {
      text-align: left;
      .upload-demo {
        margin-top: 15px;
      }
    }
  }
</style>
