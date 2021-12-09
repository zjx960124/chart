<template>
  <el-row :gutter="0">
    <el-form
      ref="form"
      class="pf-form"
      :model="model"
      :label-width="labelWidth"
      :label-position="labelPosition"
      :size="size"
      :disabled="disabled"
      :inline="inline"
      @submit.native.prevent
    >
      <template v-for="field in modelFields">
        <el-col
          v-if="!field.hidden && model.hasOwnProperty(field.key)"
          :key="field.key"
          :span="field.colSpan || colSpan || 12"
        >
          <slot :name="`item-${field.key}`" :field="field" :model="model">
            <page-form-item
              :field="field"
              :label-width="labelWidth"
              :size="size"
              :model="model"
              :disabled="disabled"
              :field-key="field.key"
              @enter="enter"
              @change="change"
              @chooseImgCallBack="chooseImgCallBack"
            >
              <template :slot="field.key" slot-scope="{ field, model }">
                <slot :name="field.key" :field="field" :model="model" />
              </template>
            </page-form-item>
          </slot>
        </el-col>
      </template>
      <slot v-if="modelFields.length" name="last-btns" />
    </el-form>
  </el-row>
</template>
<script>
import PageFormItem from './PageFormItem'

export default {
  name: 'PageForm',
  components: {
    PageFormItem
  },
  props: {
    /* label对齐方式 "left" "right" "top"*/
    labelPosition: {
      type: String,
      default: 'left'
    },
    /* 宽度*/
    colSpan: {
      type: Number,
      default: 24
    },
    inline: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    labelWidth: {
      type: [Number, String],
      default: '120px'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default: () => {
        return {}
      }
    },
    fields: {
      type: [Object, Array],
      default: () => {
        return []
      }
    }
  },
  data() {
    return { data: null }
  },
  computed: {
    modelFields() {
      if (Object.prototype.toString.call(this.fields) === '[object Object]') {
        const result = []
        for (const k in this.fields) {
          const v = this.fields[k]
          v.key = k
          result.push(v)
        }
        return result
      } else {
        return this.fields
      }
    }
  },
  watch: {
    // model: {
    //   handler(newVal) {
    //     console.log(JSON.stringify(newVal));
    //   },
    //   deep: true,
    // },
    // fields: {
    //   handler(newVal) {
    //     console.log(JSON.stringify(newVal));
    //   },
    //   deep: true,
    // },
  },
  methods: {
    /** 数据提交 */
    submit() {
      const promise = new Promise((resolve, reject) => {
        this.$refs['form'].validate((valid, validateObj) => {
          if (valid) {
            var data = {}
            // model的属性
            for (const key in this.fields) {
              // 字段
              const field = this.fields[key]
              // model字段的值
              const modelValue = this.model[key]

              // 数据格式化
              const formatter = field.valueFormatter
                ? field.valueFormatter
                : (v) => v

              if (field.fields) {
                if (!modelValue) {
                  reject(validateObj)
                  return false
                }
                field.fields.forEach((x, index) => {
                  data[x] = formatter(modelValue[index], this.model)
                })
              } else {
                const value = formatter(modelValue, this.model)
                data[key] = value
              }
            }
            data = Object.assign(this.model, data)
            resolve(data)
          } else {
            reject(validateObj)
            return false
          }
          return valid
        })
      })

      return promise
    },
    /** 数据重置 */
    reset() {
      this.$refs['form'].resetFields()
    },
    enter() {
      this.$emit('enter')
    },
    change(value, field, fieldKey, model) {
      this.$emit('change', value, field, fieldKey, model)
    },
    chooseImgCallBack(imgUrl, field, fieldKey, model) {
      this.$emit('chooseImgCallBack', imgUrl, field, fieldKey, model)
    }
  }
}
</script>
<style lang="scss">
.pf-form {
  .el-col-12 {
    min-height: 52px;
  }
  .el-select,
  .el-cascader {
    width: 100%;
  }
  .el-textarea .el-textarea__inner {
    min-height: 71px !important;
  }
  .el-checkbox {
    margin-right: 15px;
  }
  .el-checkbox__label {
    padding-left: 8px;
  }
  .el-radio-group {
    padding-left: 3px;
  }
}
</style>
