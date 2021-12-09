<template>
  <el-dialog
    v-dialogDrag
    :close-on-click-modal="false"
    title="选择图片"
    v-bind="$attrs"
    width="920px"
    custom-class="app-dialog"
    :before-close="close"
    append-to-body
    v-on="$listeners"
  >
    <div v-loading="loading" class="selectPicture-dialog">
      <el-upload
        ref="upload"
        action=""
        accept="image/gif, image/jpeg, image/jpg, image/bmp, image/png"
        list-type="picture-card"
        :file-list="fileList"
        :auto-upload="false"
        :before-upload="beforeUpload"
        :on-change="changeUpload"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :on-remove="onRemove"
      >
        <i slot="default" class="el-icon-plus" />
        <div slot="file" slot-scope="{ file }">
          <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
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
// import { uploadIcon, getIconList, deleteIcon } from "@/api/common";

export default {
  data() {
    return {
      fileList: [],
      loading: true,
      baseUrl: process.env.VUE_APP_BASE_API,
    };
  },
  methods: {
    init() {
      this.$nextTick(function () {
        this.getIconList();
      });
    },
    close() {
      this.fileList = [];
      this.$emit("update:visible", false);
    },
    getIconList() {
      this.loading = true;
      this.fileList = [];
      getIconList({}).then((response) => {
        const { data } = response;
        if (!data) {
          this.loading = false;
          this.fileList = [];
          return;
        }
        this.fileList = data.map((item, index) => {
          var newItem = {};
          if (item.includes("http://") || item.includes("https://")) {
            newItem = {
              name: `图片${index}`,
              url: `${item}`,
            };
          } else {
            var newUrl = `${this.baseUrl}/rest/paas/icon?path=${item}`;
            newItem = {
              name: `图片${index}`,
              url: newUrl,
            };
          }
          return newItem;
        });
        this.loading = false;
      });
    },
    beforeUpload(file) {
      const isLtSize = file.size / 1024 / 1024 < 1;
      if (!isLtSize) {
        this.$message.error("上传图片大小不能超过1MB");
        return false;
      }
    },
    changeUpload(file, fileList) {
      const form = new FormData();
      form.append("multipartFile", file.raw);
      uploadIcon(form).then(() => {
        this.$message.success("上传成功");
        this.getIconList();
      });
    },
    uploadError(err, file, fileList) {
      this.$message.error("图片上传失败！");
    },
    uploadSuccess(err, file, fileList) {
      this.$message.success("图片上传成功！");
      this.getIconList();
    },
    onRemove(file, fileList) {},
    handleRemove(file) {
      this.$confirm("确认删除该图片？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        var path = "";
        if (file.url.includes("http://") || file.url.includes("https://")) {
          path = file.url;
        } else {
          path = file.url.split("=")[1];
        }
        const params = {
          path: path,
        };
        deleteIcon(params).then((response) => {
          this.$message.success("删除成功");
          this.getIconList();
        });
      });
    },
    handleChoose(file) {
      this.$emit("chooseImgCallBack", file.url);
      this.close();
    },
  },
};
</script>

<style lang="scss">
.selectPicture-dialog {
  height: calc(100vh - 200px);
  overflow-y: auto;
  & > div {
    height: 100%;
  }
  .el-upload-list--picture-card .el-upload-list__item,
  .el-upload--picture-card {
    width: 100px;
    height: 100px;
    line-height: 100px;
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
}
</style>
