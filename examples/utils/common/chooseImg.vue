<template>
  <!-- 选择oss上的图片 -->
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    title="选择图片"
    v-bind="$attrs"
    width="960px"
    custom-class="app-dialog"
    :before-close="close"
    append-to-body
    v-on="$listeners"
  >
    <div v-loading="loading" class="app-container-dialog">
      <el-upload
        ref="upload"
        :action="addressOss"
        accept="image/gif, image/jpeg, image/jpg, image/bmp, image/png"
        list-type="picture-card"
        :file-list="fileList"
        :before-upload="beforeUpload"
        :data="dataOss"
        :on-success="uploadSuccess"
        :on-error="uploadError"
      >
        <i slot="default" class="el-icon-plus" />
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt>
          <span class="el-upload-list__item-actions">
            <span
              title="选择"
              class="el-upload-list__item-preview"
              @click="handleChoose(file)"
            >
              <i class="el-icon-thumb" />
            </span>
            <span
              title="删除"
              class="el-upload-list__item-delete"
              @click="handleRemove(file)"
            >
              <i class="el-icon-delete" />
            </span>
          </span>
        </div>
      </el-upload>
    </div>
  </el-dialog>
</template>

<script>
import { getOssInfo, getOssList, deleteFile } from '@/api/common'

export default {
  props: {
    chooseImgData: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      dataOss: {
        key: '',
        ossAccessKeyId: '',
        policy: '',
        signature: '',
        bucket: 'haiyan-app',
        success_action_status: '200'
      },
      addressOss: '',
      fileList: [],
      contentH: 600,
      loading: true
    }
  },
  watch: {
    chooseImgData(value, oldvalue) {
      this.dialogData = value
    }
  },
  methods: {
    init() {
      this.$nextTick(function () {
        this.getOssList()
        this.getOssInfo()
      })
    },
    close() {
      this.fileList = []
      this.$emit('update:visible', false)
    },
    getOssList() {
      const args = {
        path: 'haiyan-web/beeplat-admin/'
      }
      this.loading = true
      this.fileList = []
      getOssList(args).then((response) => {
        this.fileList = response.data.map((item, index) => {
          return {
            name: `图片${index}`,
            url: `${item}`
          }
        })
        this.loading = false
      })
    },
    getOssInfo() {
      const args = {
        path: 'haiyan-web/beeplat-admin'
      }
      getOssInfo(args).then((response) => {
        const ossInfo = response.data
        this.addressOss = ossInfo.host // 上传地
        this.dataOss = {
          ossAccessKeyId: ossInfo.accessid,
          policy: ossInfo.policy,
          signature: ossInfo.signature,
          bucket: 'haiyan-app',
          success_action_status: '200'
        }
      })
    },
    beforeUpload(file) {
      const fileName = 'haiyan-web/beeplat-admin/' + file.uid + file.name
      this.dataOss.key = fileName
    },
    beforeRemove(file, fileList) {},
    handleRemove(file) {
      this.$confirm('是否删除该图片？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const fileName = (file.url + '').replace(
          'https://haiyan-app.oss-cn-shanghai.aliyuncs.com/',
          ''
        )
        const params = {
          key: fileName
        }
        deleteFile(params).then((response) => {
          this.getOssList()
          this.$message.success('删除成功')
        })
      })
    },
    uploadError(err, file, fileList) {
      this.$message.error('图片上传失败！')
    },
    uploadSuccess(err, file, fileList) {
      this.getOssList()
      this.$message.success('图片上传成功！')
    },
    handleChoose(file) {
      this.$emit('chooseImgCallBack', file.url)
      this.close()
    }
  }
}
</script>

<style>
.el-form {
  overflow: hidden;
}

.el-upload-list--picture-card .el-upload-list__item,
.el-upload--picture-card {
  width: 120px;
  height: 120px;
  line-height: 120px;
  background-color: #f7f7f7;
}

.el-upload-list--picture-card
  .el-upload-list__item-actions
  .el-upload-list__item-delete,
.el-upload-list--picture-card
  .el-upload-list__item-actions
  .el-upload-list__item-preview {
  cursor: pointer;
}

.app-container-dialog {
  overflow-y: auto;
}
</style>
