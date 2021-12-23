<template>
  <div class="page-table">
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      :fit="fit"
      :border="border"
      :element-loading-text="elementLoadingText"
      :element-loading-spinner="elementLoadingSpinner"
      :row-class-name="rowClassName"
      :cell-class-name="cellClassName"
      :max-height="maxHeight"
      :default-sort="defaultSort"
      :default-expand-all="defaultExpandAll"
      :class="limit ? 'limitHeight' : 'auto'"
      style="width: 100%"
      :height="tableHeight"
      :row-key="rowKey"
      :highlight-current-row="highlightCurrentRow"
      :reserve-selection="reserveSelection"
      :tree-props="treeProps"
      :lazy="lazy"
      :load="loadData"
      @selection-change="handleSelectionChange"
      @select="select"
      @select-all="selectAll"
      @row-click="rowClick"
      @row-dblclick="rowDbClick"
      @filter-change="filterChange"
      @sort-change="sortChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        v-if="type != 'index'"
        :type="type"
        :align="align"
        :width="selectionWidth"
        :selectable="selectableFunc"
        label
      />
      <el-table-column
        v-if="showNo"
        type="index"
        align="center"
        :width="80"
        label="序号"
        :index="tableIndex"
      />
      <template v-for="(field, index) in tableHeader">
        <el-table-column
          v-if="!field.formatter && !field.hidden"
          :key="index"
          :align="align"
          :fixed="field.fixed"
          :label="field.name"
          :prop="field.key"
          :column-key="field.key"
          :sortable="field.sortable || false"
          :filters="field.filters"
          :width="field.width || 'auto'"
          :min-width="field.minWidth"
        >
          <template slot-scope="scope">
            <!-- 图片 -->
            <template v-if="field.isImg">
              <el-image
                v-if="scope.row[field.key]"
                class="tableCellImg"
                :src="scope.row[field.key]"
              >
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
              </el-image>
              <i v-else class="el-icon-picture-outline" />
            </template>
            <!-- 插槽 -->
            <slot
              v-else-if="field.slot"
              :name="field.slot"
              :$index="scope.$index"
              :row="scope.row"
              :dataScope="scope"
              :type="field.type"
              :field="field"
            />
            <!-- 文字 -->
            <template v-else>
              <span v-if="scope.row[field.key]">{{
                scope.row[field.key]
              }}</span>
              <span v-else>-</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!field.hidden && field.formatter"
          :key="index"
          :align="align"
          :fixed="field.fixed"
          :label="field.name"
          :prop="field.key"
          :column-key="field.key"
          :sortable="field.sortable || true"
          :filters="field.filters"
          :width="field.width || 'auto'"
          :min-width="field.minWidth || '50'"
          :formatter="field.formatter"
        />
      </template>

      <el-table-column
        v-if="operation.length || showOperation"
        label="操作"
        :align="align"
        :fixed="operationFixed"
        :width="operationWidths ? operationWidths : operationWidth"
      >
        <template slot-scope="scope">
          <div class="operation">
            <template v-for="(op, index) in operation">
              <el-divider
                v-if="index !== 0 && !op.hidden"
                :key="op.key"
                direction="vertical"
              />
              <el-button
                v-if="
                  operationShow(op, scope.row, scope.$index) &&
                  !op.slot &&
                  !op.hidden &&
                  !op.hasPopconfirm
                "
                :key="op.key"
                :type="op.type || 'text'"
                :icon="op.icon"
                :disabled="loadingButtons[`${scope.$index}-${op.key}`]"
                :loading="loadingButtons[`${scope.$index}-${op.key}`]"
                :size="op.size || 'mini'"
                @click="hanldeOperation(op, scope.row, scope.$index, data)"
                >{{ op.name }}</el-button
              >

              <el-popconfirm
                v-if="
                  operationShow(op, scope.row, scope.$index) &&
                  !op.slot &&
                  !op.hidden &&
                  op.hasPopconfirm
                "
                :key="op.key"
                :title="op.popTitle || '是否删除该条记录?'"
                @confirm="hanldeOperation(op, scope.row, scope.$index, data)"
              >
                <el-button
                  slot="reference"
                  class="popconfirm-btn"
                  :type="op.type || 'text'"
                  :icon="op.icon"
                  :disabled="loadingButtons[`${scope.$index}-${op.key}`]"
                  :loading="loadingButtons[`${scope.$index}-${op.key}`]"
                  :size="op.size || 'mini'"
                  >{{ op.name }}</el-button
                >
              </el-popconfirm>
              <!-- <el-divider
                v-if="index !== operation.length - 1 && !op.hidden"
                :key="op.key"
                direction="vertical"
              /> -->
              <slot :name="op.slot" :$index="scope.$index" :row="scope.row" />
              <slot :name="op.key" :$index="scope.$index" :row="scope.row" />
            </template>

            <slot name="operation" :$index="scope.$index" :row="scope.row" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="isPage && page.total > 0" class="paginationBox">
      <el-pagination
        :background="device !== 'mobile'"
        :small="device === 'mobile'"
        class="pagination"
        ref="pagination"
        :layout="pageLayout"
        :page-size.sync="page.size"
        :pager-count="5"
        :page-sizes="page.sizes || [5, 10, 20, 30, 50]"
        :current-page.sync="page.index"
        :total="page.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "PageTable",
  filters: {},
  props: {
    /* 不触发按钮等待*/
    hideLoadingCall: {
      type: Boolean,
      default: true,
    },
    /* 表格的类型,索引,复选框,子集*/
    type: {
      type: String,
      default: "index" /* selection,expand*/,
    },
    /* 默认排序*/
    defaultSort: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /* 对齐方式 left/center/right*/
    align: {
      type: String,
      default: "left",
    },
    /* 最大高度*/
    maxHeight: {
      type: String,
      default: null,
    },
    /* 表格高度*/
    tableHeight: {
      type: Number | String,
    },
    selectionWidth: {
      type: Number,
      default: 30,
    },
    selectableFunc: {
      type: Function,
    },
    /* 是否是分页*/
    isPage: {
      type: Boolean,
      default: true,
    },
    /* 是否有边框*/
    border: {
      type: Boolean,
      default: false,
    },
    /* 表头字段*/
    fields: {
      type: Array,
      default: () => [],
    },
    /* 数据*/
    data: {
      type: Array,
      default: () => [],
    },
    /* 行样式*/
    rowClassName: {
      type: Function,
      default: undefined,
    },
    /* 列样式*/
    cellClassName: {
      type: Function,
      default: undefined,
    },
    /* 分页   例：{index: 1,size: 10,sizes: [10, 30, 50, 100],total: 0}
     */
    page: {
      type: Object,
      default: () => {
        return null;
      },
    },
    /* 列的宽度是否自撑开 */
    fit: {
      type: Boolean,
      default: true,
    },
    /* 序列号展示 */
    showNo: {
      type: Boolean,
      default: true,
    },
    /* 右侧操作列表*/
    operation: {
      type: Array,
      default: () => [],
    },
    /* 操作栏的宽度 */
    operationWidths: {
      type: Number,
      default: null,
    },
    /* 是否在加载*/
    loading: {
      type: Boolean,
      default: false,
    },
    /* 高度是否限制 */
    limit: {
      type: Boolean,
      default: false,
    },
    /*  是否固定按钮栏----true, left, right*/
    operationFixed: {
      type: [Boolean, String],
      default: "right",
    },
    /*  仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key） */
    reserveSelection: {
      type: Boolean,
      default: false,
    },
    rowKey: {
      type: [Function, String],
      default: "id",
    },
    // 是否要高亮当前行
    highlightCurrentRow: {
      type: Boolean,
      default: false,
    },
    /* 设置默认选中的数据 */
    selectedData: {
      type: Array,
      default: () => [],
    },
    /* 展示操作栏 */
    showOperation: {
      type: Boolean,
      default: false,
    },
    /* 是否默认展开所有行，当 Table 包含展开行存在或者为树形表格时有效 */
    defaultExpandAll: {
      type: Boolean,
      default: true,
    },
    treeProps: {
      type: Object,
      default: () => {
        return { children: "children", hasChildren: "hasChildren" };
      },
    },
    // 是否懒加载子节点数据
    lazy: {
      type: Boolean,
      default: false,
    },
    device: {
      type: String
    },
    pageLayout: {
      type: String,
      default: "total, sizes, prev, pager, next, jumper"
    }
  },
  data() {
    return {
      elementLoadingText: "正在加载中...",
      elementLoadingSpinner: "el-icon-loading",
      loadingButtons: {},
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      time: null
    };
  },
  computed: {
    tableHeader() {
      return this.fields.filter((x) => !x.hide);
    },
    operationWidth() {
      if (this.operationWidths) {
        return this.operationWidths;
      }
      var width = 0;
      try {
        width = eval(
          this.operation.map((x) => (x.name.length + 2) * 22).join("+")
        );
      } catch (error) {
        console.warn(error);
      }

      return `${width}px`;
    },
  },
  watch: {
    data() {
      this.$set(this, "loadingButtons", {});
    },
    selectedData: {
      handler(val) {
        this.multipleSelectionAll = val;
        this.$nextTick(() => {
          this.setSelectRow();
        });
      },
      immediate: true,
      deep: true,
    },
    data: {
      handler(val) {
        this.$nextTick(() => {
          this.setSelectRow();
        });
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    /**
     * 表格序列号的处理
     * */
    tableIndex(index) {
      return (this.page.index - 1) * this.page.size + index + 1;
    },
    /**
     * 操作按钮是否显示(默认显示)
     * @param {Object} op 操作按钮
     * @param {String} op.key 按钮的key
     * @param {String} op.name 按钮的名称
     * @param {Function} op.show 当前行是否显示
     * @param {Object} item 行数据
     * @param {Number}index 行索引
     * @returns {Boolean} 当前行是否显示该按钮
     */
    operationShow(op, item, index) {
      if (!op.show) {
        return true;
      }
      return op.show(item, index);
    },
    /**
     * 页面条数改变时
     * @param {Number} pageSize 目标分页大小
     */
    sizeChange(val) {
      this.changePageCoreRecordData();
      this.page.size = val;
      this.debounce(500)
      // let q = this.closureAjax();
      // q();
    },
    /**
     * 页码改变时
     * @param {Number} pageIndex 目标分页索引
     */
    currentChange(val) {
      this.changePageCoreRecordData();
      this.page.index = val;
      // let q = this.closureAjax();
      // q();
      this.debounce(500)
    },
    /**
     * 闭包
     */
    closureAjax() {
      let timer = null;
      let ajaxs = function () {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
          this.$emit("page-change")
        }, 500)
        return timer;
      }
      return ajaxs
    },
    /**
     * 延迟请求接口
     */
    debounce(delay) {
      console.log(1111111);
      let that = this;
      if(this.timer !== null) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        that.$emit("page-change")
      }, delay);
    },
    /**
     * 点击行时
     *
     */
    rowClick(row, column, event) {
      this.$emit("row-click", row, column, event);
    },
    /**
     * 当某一行被双击时会触发该事件
     *
     */
    rowDbClick(row, column, event) {
      this.$emit("row-dblclick", row, column, event);
    },
    /**
     * 勾选数据行的 Checkbox 时触发
     *
     */
    select(selection, row) {
      this.$emit("select", selection, row);
    },
    /**
     * 当用户手动勾选全选 Checkbox 时触发的事件
     *
     */
    selectAll(selection) {
      this.$emit("selectAll", selection);
    },
    /**
     * 筛选更变
     * @param {Object} param0
     * @param {Object} param0.column
     * @param {String} param0.prop
     * @param {String} param0.order
     */
    filterChange(filterObj) {
      this.$emit("filter-change", filterObj);
    },
    /**
     * 排序更变
     * @param {Object} param0
     * @param {Object} param0.column
     * @param {String} param0.prop
     * @param {String} param0.order
     */
    sortChange({ column, prop, order }) {
      this.$emit("sort-change", {
        sortDirection: order === "ascending" ? 0 : 1,
        sortField: prop,
      });
    },
    /**
     * 设置选中的方法
     */
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      const rowKey = this.rowKey;
      const selectAllIds = [];
      this.multipleSelectionAll.forEach((row) => {
        selectAllIds.push(row[rowKey]);
      });
      this.clearSelection();
      this.$nextTick(function () {
        for (var i = 0; i < this.data.length; i++) {
          if (selectAllIds.indexOf(this.data[i][rowKey]) >= 0) {
            this.toggleRowSelection(this.data[i]);
          }
        }
      });
    },
    /**
     * 复选框选中
     * @param {Array} val
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("selectionChange", val);
    },
    /**
     * 记忆选择核心方法
     */
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      const rowKey = this.rowKey;
      const _this = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length === 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      const selectAllIds = [];
      this.multipleSelectionAll.forEach((row) => {
        selectAllIds.push(row[rowKey]);
      });
      const selectIds = [];
      // 获取当前页选中的id
      this.multipleSelection.forEach((row) => {
        selectIds.push(row[rowKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[rowKey]) < 0) {
          _this.multipleSelectionAll.push(row);
        }
      });
      const noSelectIds = [];
      // 得到当前页没有选中的id
      this.data.forEach((row) => {
        if (selectIds.indexOf(row[rowKey]) < 0) {
          noSelectIds.push(row[rowKey]);
        }
      });
      noSelectIds.forEach((id) => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < _this.multipleSelectionAll.length; i++) {
            if (_this.multipleSelectionAll[i][rowKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              _this.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
    },
    handleCurrentChange(currentRow, oldCurrentRow) {
      this.$emit("current-change", currentRow, oldCurrentRow);
    },
    /**
     * 点击后事件开放
     * @param {String} key 事件名称
     * @param {Object} item 事件
     * @param {Number} index 索引
     * @param {Array<Object>} rows 行数据
     */
    hanldeOperation({ key, hideLoading }, item, index, rows) {
      if (!this.hideLoadingCall && !hideLoading) {
        this.$set(this.loadingButtons, `${index}-${key}`, true);
      }
      this.$emit(key, item, index, rows, () => {
        this.$set(this.loadingButtons, `${index}-${key}`, false);
      });
    },
    // 加载子节点数据的函数，lazy 为 true 时生效，函数第二个参数包含了节点的层级信息
    loadData(row, treeNode, resolve) {
      this.$emit("load", row, treeNode, resolve);
    },
    /**
     * 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
     */
    doLayoutTable() {
      this.$refs["table"].doLayout();
    },
    /**
     * 用于多选表格，切换某一行的选中状态
     * */
    toggleRowSelection(row) {
      this.$refs["table"].toggleRowSelection(row);
    },
    /**
     * 用于多选表格，清空用户的单页选择
     * */
    clearSelection() {
      this.$refs["table"].clearSelection();
    },
    /**
     * 用于多选表格，清空用户的所有选择
     * */
    clearAllSelection() {
      this.multipleSelectionAll = [];
      this.$refs["table"].clearSelection();
    },
    /**
     * 提交表格选择
     * */
    submitTableSelection() {
      this.changePageCoreRecordData();
      this.$emit("update:multipleSelection", this.multipleSelectionAll);
    },
    /**
     * 获取表格选择
     * */
    getTableSelection() {
      this.changePageCoreRecordData();
      return this.multipleSelectionAll;
    },
    /**
     *  将对应节点下的数据清空
     * */
    clearLazyTreeNode(id) {
      this.$set(this.$refs.table.store.states.lazyTreeNodeMap, id, []);
    },
    /**
     *  用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
     * */
    setCurrentRow(row) {
      this.$refs["table"].setCurrentRow(row);
    },
  },
};
</script>

<style lang="scss" scope>
.page-table {
  width: 100%;
  height: 100%;
  .tableCellImg {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: auto;
    min-height: 40px;
    background-color: #f7f7f7;
  }
  ::v-deep.el-table {
    max-height: calc(100% - 60px);
  }
}

.limitHeight {
  max-height: 450px;
  overflow: auto;
}

.auto {
  height: auto;
}

.pagination {
  padding: 0 32px;
  text-align: left;
}

.paginationBox {
  padding: 8px 0;
  overflow-x: auto;
  height: 46px;
  align-items: center;
  overflow-y: hidden;
}

.operation {
  /*display: flex;*/
  /*align-items: center;*/
  /*flex-direction: row;*/
  /*justify-content: start;*/

  button {
    margin-left: 0 !important;
    padding: 2px 6px;
    border-radius: 0;
    // border-right: 1px solid #dbdbdb;
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      border: none;
    }
  }
  .popconfirm-btn {
    padding-left: 6px !important;
  }
}

.el-table .cell {
  font-size: 12px;
  color: #9491B0;
  .operation {
    text-align: center;
  }
}
.el-table__header thead tr th {
  background-color: #ECEDF6;
  .cell {
    color: #7F7B9F;
  }
}
</style>
