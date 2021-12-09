<template>
  <div>
    <el-upload
      ref="uploader"
      :on-exceed="onExceed"
      :disabled="disabled"
      :limit="limit"
      :action="`${baseUrl}/vue/account/file/upload`"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :on-success="onSuccess"
      :on-error="onError"
      :file-list="files"
      :class="{hide:hideUploadEdit}"
      :multiple="multiple&&limit>1"
      with-credentials
      :auto-upload="true"
    >
      <i slot="default" class="el-icon-plus" />
      <template v-if="tip!=null">
        <div slot="tip">
          {{ tip }}
        </div>
      </template>
      <!--<div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail"
                     :src="file.url" alt="">
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <template v-if="!disabled">
                        <span class="el-upload-list__item-delete">
                            <i class="el-icon-download"></i>
                        </span>
                        <span class="el-upload-list__item-delete">
                            <i class="el-icon-delete"></i>
                        </span>
                    </template>
                </span>
            </div>-->
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'KxUpload',
  props: {
    /* 最大数*/
    limit: { type: Number, default: null },
    /* 文件*/
    files: {
      type: Array, default: () => []
    },
    /* 是否可多选*/
    multiple: {
      type: Boolean, default: true
    },
    /* 提示*/
    tip: {
      type: [String, Number],
      default: null
    },
    /* 是否禁用*/
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      baseUrl: '',
      dialogVisible: false,
      dialogImageUrl: ''
    }
  },
  computed: {
    hideUploadEdit() {
      return this.files.length >= this.limit
    }
  },
  methods: {
    /**
             * 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
             * @param file
             * @param files
             */
    handleChange(file, files) {
      this.$emit('update:files', files)
      this.$emit('change', files)
    },
    /**
             * 上传成功后
             * @param response
             * @param file
             * @param fileList
             */
    onSuccess(response, file, files) {
      if (response.success) {
        file.id = response.data
        this.$emit('update:files', files)
      }
    },
    onError(err, file, files) {
      this.$emit('update:files', files)
      if (err &&
                    err.message &&
                    err.message.indexOf('unauthorized') > -1) {
        this.$message.error('尚未登录')
        return this.$router.push('/login')
      }
      this.$message.error('上传失败')
    },
    handleRemove(file, files) {
      this.$emit('update:files', files)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file, files) {
      console.log(file, files)
    },
    onExceed() {
      this.$message({
        message: `最多可上传${this.limit}张图片`,
        type: 'warning'
      })
    }
  }

}
</script>
<style>
    .hide .el-upload--picture-card {
        display: none;
    }
</style>
