<template>
  <div class="data-format">
    <div class="search-view">
      <el-form :inline="true">
        <el-form-item label="数据格式名称:">
          <el-input size="small" v-model="name"></el-input>
        </el-form-item>
        <el-button size="small" icon="el-icon-search" type="primary" plain @click="getList">查询</el-button>
      </el-form>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="create">新增</el-button>
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
        label-width="40px"
        label-position="left"
        ref="sourceForm"
      >
        <el-form-item label="名称">
          <el-input :disabled="dialogType === '查看数据格式'" v-model="dataFormatForm.name"></el-input>
        </el-form-item>
        <el-form-item label="脚本">
          <!--<el-input type="textarea" autosize v-model="dataFormatForm.script"></el-input>-->
          <codemirror
            class="vue-codemirror"
            v-model="dataFormatForm.script"
            :options="sqlOptions"
            style="text-align: left"
          ></codemirror>
        </el-form-item>
        <el-form-item label="描述">
          <el-input :disabled="dialogType === '查看数据格式'" v-model="dataFormatForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="dialogType !== '查看数据格式'" @click="cancer">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { codemirror } from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'
  import 'codemirror/mode/sql/sql.js' // sql高亮 配置mode为x-sql
  export default {
    name: "dataFormat",

    components: {
      codemirror
    },

    data() {
      return {
        name: '',
        dataFormatList:[],
        fields: [
          {
            name: "数据格式名称",
            key: "name"
          },
          {
            name: "描述",
            key: "description"
          },
          {
            name: "脚本",
            key: "script"
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
          name: '',
          script: '',
          description: ''
        },
        dialogType: '新增数据格式',
        dataFormatVisible: false,
        sqlOptions: {
          tabSize: 4, // tab四个空格
          theme: 'default', // 主题样式
          lineNumbers: true, // 是否显示行数
          styleActiveLine: true, // line 选择是否高亮
          matchBrackets: true, // 括号匹配
          mode: 'text/x-sql', // 实现vue代码高亮
          readOnly: false, // 只读
        },
        rules: {
          name: [
            { required: true, message: '请输入数据格式名称', trigger: 'blur' }
          ],
          script: [
            { required: true, message: '请输入脚本', trigger: 'blur' }
          ],
          description: [
            { required: true, message: '请输入描述', trigger: 'blur' }
          ]
        },
      }
    },

    mounted() {
      this.getList();
    },

    methods: {
      getList() {
        let param = {
          name: this.name,
          page: this.page.index,
        };
        this.http.get('/rest/report/groovy/page', param)
          .then(res => {
            this.dataFormatList = res.data.content;
            this.page.total = res.data.totalElements;
        });
      },
      create() {
        this.dataFormatVisible = true;
        this.dialogType = '新增数据格式';
      },
      handelDelClick(data) {
        let param = { id: data.id };
        this.http.delete('/rest/report/groovy', param)
          .then(res => {
            this.$message.success(res.data.msg);
            this.getList();
        })
      },
      handleEditClick(data) {
        this.dataFormatForm = data;
        this.dialogType = '编辑数据格式';
        this.dataFormatVisible = true;
      },
      cancer() {
        this.dataFormatForm = {
          name: '',
          script: '',
          description: ''
        };
        this.dataFormatVisible = false;
      },
      close() {
        this.dataFormatForm = {
          name: '',
          script: '',
          description: ''
        };
        this.dataFormatVisible = false;
      },
      sure() {
        this.$refs['sourceForm'].validate((valid) => {
          if (valid) {
            if (this.dialogType === '新增数据格式') {
              let param = this.dataFormatForm;
              this.http.post('/rest/report/groovy', param)
                .then(res => {
                  this.dataFormatForm = {
                    name: '',
                    script: '',
                    description: ''
                  };
                  this.dataFormatVisible = false;
                  this.getList();
                })
            }
            if (this.dialogType === '编辑数据格式') {
              let param = this.dataFormatForm;
              this.http.put('/rest/report/groovy', param)
                .then(res => {
                  this.dataFormatForm = {
                    name: '',
                    script: '',
                    description: ''
                  };
                  this.dataFormatVisible = false;
                  this.getList();
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
