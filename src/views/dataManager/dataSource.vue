<template>
  <div class="data-source">
    <div class="search-view">
      <el-form :inline="true">
        <el-form-item label="数据库名称:">
          <el-input size="small" v-model="dataSourceName"></el-input>
        </el-form-item>
        <el-button type="primary" size="small" style="background: #15B2EB; border-color: #15B2EB"  icon="el-icon-search" @click="getList">查询</el-button>
      </el-form>
      <div class="btn-group">
        <el-button  icon="el-icon-upload" size="small" style="background: #15B2EB; border-color: #15B2EB" @click="uploadFile">文件上传</el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="createDataSource">新建数据源</el-button>
      </div>
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
        :data="dataSourceList"
        :page="page"
        @page-change="getList"
        @del="handelDelClick"
        @view="handleViewClick"
        @edit="handleEditClick"
      ></page-table>
    </div>
    <el-dialog
      :title="dialogType"
      :visible.sync="dataSourceVisible"
      width="40%"
      class="template-name-dialog"
      :close-on-click-modal="false"
      :before-close="close"
      center
    >
      <el-form
        :model="dataSourceForm"
        label-width="40px"
        label-position="left"
        ref="sourceForm"
      >
        <el-form-item label="名称">
          <el-input :disabled="dialogType === '查看数据源'" v-model="dataSourceForm.dataSourceName"></el-input>
        </el-form-item>
        <el-form-item label="驱动">
          <el-select :disabled="dialogType === '查看数据源'" style="width: 100%" v-model="dataSourceForm.dataSourceType">
            <el-option
              v-for="(item, index) in dataSourceTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="url">
          <el-input :disabled="dialogType === '查看数据源'" v-model="dataSourceForm.dataSourceUrl"></el-input>
        </el-form-item>
        <el-form-item label="用户">
          <el-input :disabled="dialogType === '查看数据源'" v-model="dataSourceForm.user"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input :disabled="dialogType === '查看数据源'" v-model="dataSourceForm.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button style="background: #15B2EB; border-color: #15B2EB" type="primary" size="small" @click="test">连接测试</el-button>
        <el-button v-show="dialogType !== '查看数据源'" @click="cancer" size="small">
          {{ dialogType !== '查看数据源' ? '取 消' : '关 闭'}}
        </el-button>
        <el-button type="primary" size="small" @click="sure">
          {{ dialogType !== '查看数据源' ? '保 存' : '确 定'}}
        </el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="文件上传"
      :visible.sync="uploadVisible"
      width="30%"
      class="template-upload-dialog"
      :close-on-click-modal="false"
      :before-close="uploadClose"
      center
    >
      <span style="margin-right: 8px">数据源</span>
      <el-select v-model="uploadId">
        <el-option
          v-for="(item, index) in dataSourceList"
          :key="index"
          :label="item.dataSourceName"
          :value="item.id"
        ></el-option>
      </el-select>
      <el-upload
        class="upload-demo"
        ref="upload"
        drag
        action=""
        :limit="1"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-change="changeUpload"
        :file-list="fileList"
        :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="uploadCancer">取 消</el-button>
        <el-button size="small" type="primary" @click="uploadSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'DataSource',
    data() {
      return {
        dataSourceName: '',
        dataSourceList: [],
        dataSourceTypeList: [
          { label: "MySQL采集适配器", value: 1 },
          { label: "Oracle采集适配器", value: 2 },
          { label: "SQL Server采集适配器", value: 3 }
        ],
        fields: [
          {
            name: "数据类别",
            key: "dataSourceType"
          },
          {
            name: "数据库名称",
            key: "dataSourceName"
          },
          {
            name: "创建时间",
            key: "createTime"
          }
        ],
        operation: [
          { name: "详情", key: "view", hidden: false },
          { name: "编辑", key: "edit", hidden: false },
          { name: "删除", key: "del", hasPopconfirm: true, hidden: false },
        ],
        page: {
          index: 1,
          size: 5,
          total: 0
        },
        dataSourceVisible: false,
        dialogType: '新增数据源',
        dataSourceForm: {
          user: '',
          password: '',
          dataSourceUrl: '',
          dataSourceType: '',
          dataSourceName: ''
        },
        rules: {
          dataSourceName: [
            { required: true, message: '请输入数据库名称', trigger: 'blur' }
          ],
          user: [
            { required: true, message: '请选择用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          dataSourceUrl: [
            { required: true, message: '请输入url', trigger: 'blur' }
          ],
          dataSourceType: [
            { required: true, message: '请选择驱动类型', trigger: 'change' }
          ]
        },
        uploadVisible: false,
        fileList: [],
        uploadId: ''
      }
    },
    mounted() {
      this.getList();
    },
    methods: {
      getList() {
        this.http.get('/rest/report/data-source-info/list')
          .then(res => {
            console.log(res);
            this.dataSourceList = res.data;
            this.page.total = res.data.length;
          })
      },
      createDataSource() {
        this.dialogType = '新增数据源';
        this.dataSourceVisible = true;
      },
      handleViewClick(data) {
        this.dataSourceForm = data;
        this.dialogType = '查看数据源';
        this.dataSourceVisible = true;
      },
      handelDelClick(data) {
        let param = { id: data.id };
        this.http.delete('/rest/report/data-source-info/', param)
          .then(res => {
            console.log(res);
          })
      },
      handleEditClick(data) {
        this.dataSourceForm = data;
        this.dialogType = '编辑数据源';
        this.dataSourceVisible = true;
      },
      test() {
        let param = {...this.dataSourceForm};
        this.http.post('/rest/report/data-source-info/test', param)
          .then(res => {
            console.log(res);
          })
      },
      cancer() {
        this.dataSourceForm = {
          root: '',
          password: '',
          dataSourceUrl: '',
          dataSourceType: ''
        };
        this.dataSourceVisible= false;
      },
      close() {
        this.dataSourceForm = {
          root: '',
          password: '',
          dataSourceUrl: '',
          dataSourceType: ''
        };
        this.dataSourceVisible = false;
      },
      sure() {
        if (this.dialogType === '查看数据源') {
          this.dataSourceForm = {
            root: '',
            password: '',
            dataSourceUrl: '',
            dataSourceType: ''
          };
          this.dataSourceVisible = false;
          return false;
        }
        this.$refs['sourceForm'].validate((valid) => {
          if (valid) {
            if (this.dialogType === '新增数据源') {
              let param = this.dataSourceForm;
              this.http.post('/rest/report/data-source-info/', param)
                .then(res => {
                  this.dataSourceForm = {
                    root: '',
                    password: '',
                    dataSourceUrl: '',
                    dataSourceType: ''
                  };
                  this.dataSourceVisible = false;
                })
            }
            if (this.dialogType === '编辑数据源') {
              let param = this.dataSourceForm;
              this.http.put('/rest/report/data-source-info/', param)
                .then(res => {
                  this.dataSourceForm = {
                    root: '',
                    password: '',
                    dataSourceUrl: '',
                    dataSourceType: ''
                  };
                  this.$message.success('保存成功');
                  this.dataSourceVisible = false;
                })
            }
          } else {
            return false;
          }
        });
      },
      uploadFile() {
        this.uploadVisible = true;
      },
      handlePreview() {},
      handleRemove() {},
      submitUpload() {},
      changeUpload(file, fileList) {
        this.fileList = fileList;
      },
      uploadClose() {
        this.fileList = [];
        this.uploadId = '';
        this.uploadVisible = false;
      },
      uploadCancer() {
        this.uploadVisible = false;
      },
      uploadSure() {
        if (!this.uploadId) {
          this.$message.error('数据源为空!');
          return false;
        }
        const form = new FormData();
        form.append("multipartFile", this.fileList[0].raw);
        form.append("datasourceId", this.uploadId);
        this.http.post('/rest/report/data-source-info/excel', form).then((res) => {
          this.$message.success('上传成功');
          this.uploadVisible = false;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .data-source {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #F0F2F5;
    padding: 0 12px;
    box-sizing: border-box;
    .search-view {
      height: 56px;
      width: 100%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 25px;
      padding-right: 25px;
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
      flex: 1;
      box-sizing: border-box;
      padding: .2rem;
      display: flex;
      flex-wrap: wrap;
      background: #ffffff;
      margin-bottom: 25px;
      overflow-y: auto;
      ::v-deep .el-table th.el-table__cell {
        background: #f2f3f8;
      }
    }
    ::v-deep .el-dialog__header {
      font-size: 12px;
      padding: 16px 20px;
    }
    ::v-deep .el-dialog__footer {
      font-size: 12px;
    }
    ::v-deep .el-dialog__body {
      padding-top: 10px;
      padding-bottom: 0;
    }
    .template-upload-dialog {
      text-align: left;
      .upload-demo {
        margin-top: 15px;
      }
    }
  }
</style>
