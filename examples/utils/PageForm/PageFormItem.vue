<template>
  <el-form-item
    :label="field.name"
    :label-width="fieldLabelWidth"
    :prop="fieldKey"
    :style="`width:${width};${field.style}`"
    :rules="field.rules"
  >
    <slot :name="fieldKey" :field="field" :model="model">
      <!-- 下拉框-->
      <template v-if="field.type === 'select'">
        <template v-if="field.readonly">
          <el-select
            v-if="!field.hidden"
            class="formItem"
            :value="model[fieldKey]"
            :disabled="field.disabled"
            autocomplete="off"
            :multiple="field.props && field.props.multiple"
            :clearable="field.props && field.props.clearable"
            :collapse-tags="
              (field.props && field.props.collapseTags) ||
              !field.props ||
              field.props.collapseTags
            "
            :remote="field.props && field.props.remote"
            :filterable="field.props && field.props.filterable"
            :remote-method="field.remoteMethod"
            :loading="field.loading"
            :allow-create="field.props && field.props.allowCreate"
            :default-first-option="
              field.props && field.props.defaultFirstOption
            "
            :no-data-text="field.noDataText"
            :placeholder="field.placeholder ? field.placeholder : `请选择`"
            :style="{ width: field.width ? field.width : '100%' }"
            @change="hanldChange"
          >
            <el-option
              v-for="(enumItem, enumIndex) in field.enums"
              :key="enumIndex"
              :label="getLabel(enumItem, field.props)"
              :size="size"
              :value="getValue(enumItem, field.props)"
            />
          </el-select>
        </template>
        <template v-else>
          <el-select
            v-model="model[fieldKey]"
            class="formItem"
            :disabled="field.disabled"
            autocomplete="off"
            :multiple="field.props && field.props.multiple"
            :clearable="field.props && field.props.clearable"
            :collapse-tags="
              (field.props && field.props.collapseTags) ||
              !field.props ||
              field.props.collapseTags
            "
            :no-data-text="field.noDataText"
            :filterable="field.props && field.props.filterable"
            :allow-create="field.props && field.props.allowCreate"
            :default-first-option="
              field.props && field.props.defaultFirstOption
            "
            :placeholder="field.placeholder ? field.placeholder : `请选择`"
            :style="{ width: field.width ? field.width : '100%' }"
            suffix-icon="el-icon-date"
            @change="hanldChange"
          >
            <el-option
              v-for="(enumItem, enumIndex) in field.enums"
              :key="enumIndex"
              :label="getLabel(enumItem, field.props)"
              :size="size"
              :value="getValue(enumItem, field.props)"
            />
          </el-select>
        </template>
      </template>
      <!-- 单复选框 -->
      <template v-else-if="field.type === 'checkbox'">
        <el-checkbox
          v-if="!field.hidden"
          v-model="model[fieldKey]"
          :true-label="getEnum(field, 0).value"
          :false-label="getEnum(field, 1).value"
          :size="size"
          :border="field.border"
          @change="hanldChange"
          >{{ getEnum(field, 0).label }}</el-checkbox
        >
      </template>
      <!-- 多选框-->
      <template v-else-if="field.type === 'checkboxes'">
        <el-row>
          <el-checkbox
            v-if="field.hasCheckAll"
            v-model="checkAll"
            :indeterminate="isIndeterminate"
            :readonly="field.readonly"
            :disabled="field.disabled"
            :style="'margin-right: 10px;' + field.style"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="model[fieldKey]"
            :min="field.min"
            :max="field.max"
            style="display: inline-block"
            @change="hanldCheckboxesChange"
          >
            <el-checkbox
              v-for="(enumItem, enumIndex) in field.enums"
              :key="enumIndex"
              :size="size"
              :readonly="field.readonly"
              :disabled="field.disabled || getDisabled(enumItem, field.props)"
              :border="field.border"
              :label="getValue(enumItem, field.props)"
              >{{ getLabel(enumItem, field.props) }}</el-checkbox
            >
          </el-checkbox-group>
        </el-row>
      </template>
      <!-- 单选框-->
      <template v-else-if="field.type === 'radio'">
        <el-radio-group v-model="model[fieldKey]" v-if="!field.hidden">
          <el-radio
            v-for="(enumItem, enumIndex) in field.enums"
            :key="enumIndex"
            :label="getValue(enumItem, field.props)"
            :size="size"
            :readonly="field.readonly"
            :disabled="field.disabled"
            @change="hanldChange"
            >{{ getLabel(enumItem, field.props) }}</el-radio
          >
        </el-radio-group>
      </template>
      <!-- 级联 树形下拉框-->
      <template v-else-if="field.type === 'cascader'">
        <el-cascader
          v-if="!field.hidden"
          :ref="fieldKey"
          v-model="model[fieldKey]"
          class="formItem"
          collapse-tags
          autocomplete="off"
          clearable
          :readonly="field.readonly"
          :disabled="field.disabled"
          :show-all-levels="field.showAllLevels"
          :size="size"
          :props="field.props"
          :placeholder="field.placeholder ? field.placeholder : `请选择`"
          :options="field.enums"
          :style="'width:' + field.width ? field.width : '100%'"
          :filterable="field.filterable"
          @filter-method="filterMethod"
          @change="hanldCascaderChange"
        />
      </template>
      <!-- 日期控件 year/month/date/dates/week/datetime/datetimerange/daterange/monthrange-->
      <template v-else-if="datePickerType.indexOf(field.type) !== -1">
        <el-date-picker
          v-if="!field.hidden"
          v-model="model[fieldKey]"
          class="formItem"
          :format="field.format"
          autocomplete="off"
          :value-format="field.valueFormat"
          :size="size"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :picker-options="field.pickerOptions"
          :type="field.type"
          :placeholder="field.placeholder ? field.placeholder : `请选择`"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :style="'width:' + field.width ? field.width : '100%'"
          @change="hanldChange"
        />
      </template>
      <!-- 时间控件 -->
      <template v-else-if="field.type === 'time'">
        <el-time-picker
          v-if="!field.hidden"
          v-model="model[fieldKey]"
          class="formItem"
          autocomplete="off"
          :size="size"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :type="field.type"
          :placeholder="field.placeholder ? field.placeholder : `请选择`"
          :style="'width:' + field.width ? field.width : '100%'"
        />
      </template>
      <!-- 开关控件 -->
      <template v-else-if="field.type === 'switch'">
        <el-switch
          v-if="!field.hidden"
          v-model="model[fieldKey]"
          class="pageForm-switch"
          :active-value="getEnum(field, 0).value"
          :inactive-value="getEnum(field, 1).value"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :active-text="getEnum(field, 0).label"
          :inactive-text="getEnum(field, 1).label"
          :size="size"
          @change="hanldChange"
        />
      </template>
      <!-- 输入框-->
      <template v-else-if="field.type === 'number' || field.type == 'Number'">
        <el-input
          v-if="!field.hidden"
          v-model.number="model[fieldKey]"
          class="formItem"
          :clearable="field.props && field.props.clearable"
          autocomplete="off"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :placeholder="field.placeholder ? field.placeholder : `请输入`"
          type="number"
          :style="'width:' + field.width ? field.width : '100%'"
          @keyup.enter.native="enter"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </template>
      <!-- 文本域-->
      <template v-else-if="field.type === 'textarea'">
        <el-input
          v-if="!field.hidden"
          v-model.number="model[fieldKey]"
          class="formItem"
          autocomplete="off"
          :autosize="field.autosize ? field.autosize : true"
          :rows="field.rows ? rows : '3'"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :clearable="field.props && field.props.clearable"
          :placeholder="field.placeholder ? field.placeholder : `请输入`"
          type="textarea"
          :style="{ width: field.width ? field.width : '100%' }"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </template>
      <!-- 文件上传 -->
      <template v-else-if="field.type === 'upload'">
        <js-upload
          :files.sync="model[fieldKey]"
          :limit="field.props && field.props.limit ? field.props.limit : 1"
          :tip="field.props && field.props.tip ? field.props.tip : null"
          :multiple="field.props && field.props.multiple"
        />
      </template>
      <!-- 图片选择 -->
      <template v-else-if="field.type === 'chooseImg'">
        <el-input v-if="false" v-model="model[fieldKey]" />
        <div class="picture-card" @click.stop="handleChooseImg">
          <el-image
            class="upload--picture-card"
            :src="model[fieldKey]"
            fit="contain"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-plus" />
            </div>
          </el-image>
        </div>
      </template>
      <!-- 树形选择 -->
      <template v-else-if="field.type === 'treeSelect'">
        <tree-select
          v-if="!field.hidden"
          v-model="model[fieldKey]"
          :height="field.height || 400"
          :width="field.width || 200"
          :size="size"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :data="field.enums"
          :props="field.props"
          :multiple="field.multiple || false"
          :default-key="field.defaultKey"
          :clearable="field.props && field.props.clearable"
          :collapse-tags="field.props && field.props.collapseTags"
          :expand-click-node="field.props && field.props.expandClickNode"
          :check-click-node="field.props && field.props.checkClickNode"
          :check-strictly="field.props && field.props.checkStrictly"
          @getValue="hanldChange"
        />
      </template>
      <!-- 限制只能输入整型数据 -->
      <template
        v-else-if="field.type === 'Integer' || field.type === 'integer'"
      >
        <el-input
          v-if="!field.hidden"
          v-model.number="model[fieldKey]"
          class="formItem"
          type="text"
          :clearable="field.props && field.props.clearable"
          autocomplete="off"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :placeholder="field.placeholder ? field.placeholder : `请输入`"
          :style="'width:' + field.width ? field.width : '100%'"
          @keyup.enter.native="enter"
          @input="handleIntegerInput"
          @focus="onInputFocus"
          @blur="onInputBlur"
        />
      </template>
      <!-- 颜色选择 -->
      <template v-else-if="field.type === 'colorPicker'">
        <el-color-picker
          v-model="model[fieldKey]"
          :disabled="field.disabled"
          :show-alpha="field.showAlpha"
        >
        </el-color-picker>
      </template>
      <!-- 输入框-->
      <template v-else>
        <el-input
          v-if="!field.hidden"
          v-model="model[fieldKey]"
          class="formItem"
          autocomplete="off"
          :size="size"
          :readonly="field.readonly"
          :disabled="field.disabled"
          :placeholder="field.placeholder ? field.placeholder : '请输入'"
          :type="field.type"
          :clearable="field.props && field.props.clearable"
          :show-password="field.isPassword"
          :style="{ width: field.width ? field.width : '100%' }"
          @keyup.enter.native="enter"
          @input="onInputInput"
          @focus="onInputFocus"
          @blur="onInputBlur"
          @change="hanldChange"
        />
      </template>
    </slot>

    <!-- 选择图片 -->
    <choose-img
      ref="chooseImg"
      :visible.sync="chooseImgVisible"
      @chooseImgCallBack="chooseImgCallBack"
    />
  </el-form-item>
</template>

<script>
const datePickerType = [
  "year",
  "month",
  "date",
  "dates",
  "week",
  "datetime",
  "datetimerange",
  "daterange",
  "monthrange",
];
import jsUpload from "../JsUpload";
import chooseImg from "../common/selectPicture";
import treeSelect from "../TreeSelect";

export default {
  components: { jsUpload, chooseImg, treeSelect },
  props: {
    /* 字段的键名 */
    fieldKey: {
      type: String,
      default: null,
    },
    /* 字段的配置 */
    field: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /* 数据模型 */
    model: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /* 输入框的大小 */
    size: {
      type: String,
      default: "small",
    },
    width: {
      type: String,
      default: "100%",
    },
    /* 标签宽度 */
    labelWidth: {
      type: String,
      default: undefined,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      datePickerType,
      checkAll: false,
      isIndeterminate: false,
      chooseImgVisible: false,
    };
  },
  computed: {
    /** 前面文字的宽度 */
    fieldLabelWidth() {
      return this.labelWidth || `${this.field.name.length * 20}px`;
    },
  },
  methods: {
    handleCheckAllChange(value, el) {
      if (value) {
        this.field.enums.forEach((x) => {
          const value = this.getValue(x, this.field.props);
          if (this.model[this.fieldKey].indexOf(value) === -1) {
            this.model[this.fieldKey].push(value);
          }
        });
      } else {
        this.isIndeterminate = false;
        this.model[this.fieldKey] = [];
      }
    },
    hanldCheckboxesChange(value) {
      const checkedCount = value.length;
      this.checkAll = checkedCount === this.field.enums.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.field.enums.length;
      if (this.field.change) {
        this.field.change(value, this.field, this.fieldKey, this.model);
      } else {
        this.$emit("change", value, this.field, this.fieldKey, this.model);
      }
    },
    /**
     * 监听数组更变状态
     * @param value
     */
    hanldChange(value) {
      if (this.field.change) {
        this.field.change(value, this.field, this.fieldKey, this.model);
      } else {
        this.$emit("change", value, this.field, this.fieldKey, this.model);
      }
    },
    onInputFocus() {
      this.$emit("focus", this.field, this.fieldKey, this.model);
    },
    onInputBlur() {
      this.$emit("blur", this.field, this.fieldKey, this.model);
    },
    onInputInput(value) {
      this.$emit("input", value, this.field, this.fieldKey, this.model);
    },
    hanldCascaderChange(value) {
      if (this.field.change) {
        this.field.change(value, this.field, this.fieldKey, this.model);
        // this.$refs.cascader.toggleDropDownVisible()
      } else {
        this.$emit("change", value, this.field, this.fieldKey, this.model);
        // this.$refs.cascader.toggleDropDownVisible()
      }
      if (!this.field.props.multiple) {
        this.$refs[this.fieldKey].dropDownVisible = false;
      }
    },
    handleIntegerInput(value) {
      this.model[this.fieldKey] = value.replace(/[^\d]/g, "");
    },
    /**
     * 自定义搜索逻辑，第一个参数是节点node，第二个参数是搜索关键词keyword，通过返回布尔值表示是否命中
     */
    filterMethod(node, keyword) {
      this.$emit("filterMethod", node, keyword);
    },
    /**
     * 返回key对应的数据源配置的key
     * @param {Object} props 数据源配置
     * @param {String} key 键
     * @param {any} 值
     */
    getProp(props, key) {
      if (!props) {
        return key;
      }
      return props[key] || key;
    },
    /**
     * 获取列表的名称
     * @param {Object} enumItem
     * @param {Object} props
     * @returns {String}
     */
    getLabel(enumItem, props) {
      return enumItem[this.getProp(props, "label")];
    },
    /**
     * 获取列表的值
     * @param {Object} enumItem
     * @param {Object} props
     * @returns {String}
     */
    getValue(enumItem, props) {
      return enumItem[this.getProp(props, "value")];
    },
    getDisabled(enumItem, props) {
      return enumItem[this.getProp(props, "disabled")];
    },
    /**
     * 获取列表的子集
     * @param {Object} enumItem
     * @param {Object} props
     * @returns {String}
     */
    getChildren(enumItem, props) {
      return enumItem[this.getProp(props, "children")];
    },
    /**
     *
     * @param {Object} field
     * @param {Number} index
     */
    getEnum(field, index) {
      return field.enums[index];
    },
    enter() {
      this.$emit("enter");
    },
    /**
     *图片选择
     */
    handleChooseImg() {
      if (!this.disabled) {
        this.chooseImgVisible = true;
        this.$refs.chooseImg.init();
      }
    },
    chooseImgCallBack(imgUrl) {
      this.model[this.fieldKey] = imgUrl;
      this.$emit(
        "chooseImgCallBack",
        imgUrl,
        this.field,
        this.fieldKey,
        this.model
      );
    },
  },
};
</script>

<style lang="scss">
.picture-card {
  width: 64px;
  height: 64px;
  background-color: #f7f7f7;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
}
.upload--picture-card {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  cursor: pointer;
  vertical-align: top;
}

.el-form--inline .el-form-item {
  display: flex;
}
.el-form--inline .el-form-item__content {
  flex: 1;
  padding-right: 15px;
  overflow: hidden;
}

.pageForm label {
  font-weight: 400;
}

.pageForm-switch {
  margin-bottom: 3px;
}

.formItem {
}
</style>
