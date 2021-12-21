<template>
  <div class="d-s">
    <div class="search-view">
      <el-button size="small" type="primary" @click="getDSList">查询</el-button>
      <el-button type="primary" size="small" @click="createDS">新建数据集</el-button>
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
        :data="DSList"
        :page="page"
        @page-change="getDSList"
        @del="handelDelClick"
        @view="handleViewClick"
        @edit="handleEditClick"
      ></page-table>
    </div>
    <el-dialog
      :title="dialogType"
      :visible.sync="DSVisible"
      width="60%"
      class="template-name-dialog"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <el-form
        :model="DSForm"
        label-width="120px"
        label-position="left"
        ref="sourceForm"
      >
        <el-form-item label="名称">
          <el-input v-model="DSForm.name"></el-input>
        </el-form-item>
        <el-form-item label="sql">
          <el-input v-model="DSForm.sqlValue"></el-input>
        </el-form-item>
        <el-form-item label="数据源">
          <el-select v-model="DSForm.datasourceId" style="width: 100%">
            <el-option
              v-for="(item, index) in dataSourceList"
              :key="index"
              :label="item.dataSourceName"
              :value="item.id.toString()"
            ></el-option>
          </el-select>
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
    name: 'DS',
    data() {
      return {
        DSList: [],
        fields: [
          {
            name: "数据源",
            key: "datasourceId"
          },
          {
            name: "数据集名称",
            key: "name"
          },
          {
            name: "sql",
            key: "sqlValue"
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
        DSVisible: false,
        dialogType: '新增数据集',
        DSForm: {
          datasourceId: '',
          name: '',
          sqlValue: ''
        },
        dataSourceList: []
      }
    },
    created() {
      this.getDSList();
      this.getSourceList();
    },
    methods: {
      getDSList() {
        this.http.get('/rest/report/data-sql/list')
          .then(res => {
            this.DSList = res.data;
            // this.page.total = res.data.length;
          })
      },
      getSourceList() {
        this.http.get('/rest/report/data-source-info/list')
          .then(res => {
            this.dataSourceList = res.data;
          })
      },
      createDS() {
        this.dialogType = '新增数据集';
        this.DSVisible = true;
      },
      handleViewClick(data) {
        this.DSForm = data;
        this.dialogType = '查看数据集';
        this.DSVisible = true;
      },
      handelDelClick(data) {
        let param = { id: data.id };
        this.http.delete('/rest/report/data-sql', param)
          .then(res => {
            console.log(res);
          })
      },
      handleEditClick(data) {
        this.DSForm = data;
        this.dialogType = '编辑数据集';
        this.DSVisible = true;
      },
      cancer() {
        this.DSForm = {
          datasourceId: '',
          name: '',
          sqlValue: ''
        };
        this.DSVisible = false;
      },
      sure() {
        if (this.dialogType === '查看数据集') {
          this.DSForm = {
            datasourceId: '',
            name: '',
            sqlValue: ''
          };
          this.DSVisible = false;
          return false;
        }
        this.$refs['sourceForm'].validate((valid) => {
          if (valid) {
            if (this.dialogType === '新增数据集') {
              let param = this.DSForm;
              this.http.post('/rest/report/data-sql', param)
                .then(res => {
                  this.DSForm = {
                    datasourceId: '',
                    name: '',
                    sqlValue: ''
                  };
                  this.DSVisible = false;
                  this.getDSList();
                })
            }
            if (this.dialogType === '编辑数据集') {
              let param = this.DSForm;
              this.http.put('/rest/report/data-sql', param)
                .then(res => {
                  this.DSForm = {
                    datasourceId: '',
                    name: '',
                    sqlValue: ''
                  };
                  this.DSVisible = false;
                  this.getDSList();
                })
            }
          } else {
            return false;
          }
        });
      },
      close() {
        this.DSForm = {
          datasourceId: '',
          name: '',
          sqlValue: ''
        };
        this.DSVisible = false;
      },
    }
  }
</script>

<style lang="scss" scoped>
  .d-s {
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
      justify-content: flex-end;
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
    }
    ::v-deep .el-dialog__header {
      font-size: 12px;
      padding: 16px 20px;
    }
    ::v-deep .el-dialog__footer {
      font-size: 12px;
    }
  }
</style>
