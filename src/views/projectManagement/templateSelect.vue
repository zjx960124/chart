<template>
  <div class="edit-project">
    <div class="detail-view">
      <div class="title">
        <i class="el-icon-arrow-left"></i>
        <span @click="returnPage" style="margin-right: 27px">返回</span>
        <div class="ring" style="font-weight: 600">新增版面</div>
      </div>
      <!--<div class="info">
        <div>项目名称：福州商旅学校</div>
        <div>领域：高职院校</div>
        <div>
          <span>项目编辑时分辨率:</span>
          <el-input size="small"></el-input>
        </div>
      </div>-->
      <!--<div class="info">
        <div>
          <span>模板名称：</span>
          <el-input size="small"></el-input>
        </div>
        <div>
          <span>类型：</span>
          <el-input size="small"></el-input>
        </div>
        <div>
          <span>主题风格：</span>
          <el-input size="small"></el-input>
        </div>
        <div>
          <el-button type="primary" size="small">查询</el-button>
          <el-button size="small">重置</el-button>
        </div>
      </div>-->
    </div>
    <div class="main-view">
      <div
        v-for="(item, index) in templateList"
        :key="index"
        class="item"
        @mouseover="activeId = index"
        @mouseleave="activeId = -1"
      >
        <div class="img-box">
          <img src="../../assets/img.png" class="project-img" alt="">
          <div class="operate-panel" v-show="activeId === index">
            <el-button type="primary" style="border: none" @click="toEditProjectPage(item)">应用</el-button>
          </div>
        </div>
        <div class="content-box">
          <div class="content-box-li">
            <div class="name">{{ item.name }}</div>
            <div class="resolution">{{ item.createTime }}</div>
          </div>
          <!--<div class="content-box-li">
            <div>类型：全校</div>
            <div>2021-03-02</div>
          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TemplateSelect',
    data() {
      return {
        projectCode: '',
        activeId: '',
        templateList: []
      }
    },
    created() {
      this.projectCode = this.$route.query.code;
      this.getTemplateList();
    },
    mounted() {
    },
    methods: {
      getTemplateList() {
        this.http.get('/rest/report/template/list').then(res => {
          this.templateList = res.data || [];
          this.templateList.push(
            {
              name: '空模板',
              createTime: ''
            }
          )
        })
      },
      toEditProjectPage(data) {
        console.log(this.projectData)
        this.$router.push({
            path: '/home/editPage',
            query: {
              tempId: data.id,
              code: this.projectCode
            }
          }
        );
      },
      returnPage() {
        this.$router.go(-1);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .edit-project {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .detail-view {
      width: 100%;
      flex-shrink: 0;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      padding-left: 1.1rem;
      padding-right: 1.1rem;
      box-sizing: border-box;
      .title {
        height: 56px;
        width: 100%;
        line-height: 56px;
        border-bottom: 1px solid #DCE6F5;
        text-align: left;
        font-size: 14px;
        font-family: PingFangSC-Bold;
        font-weight: 500;
        color: #333333;
        cursor: pointer;
        display: flex;
        align-items: center;
        .ring {
          position: relative;
        }
        .ring::after {
          position: absolute;
          content: '';
          left: -8px;
          top: 20px;
          width: 0;
          height: 0;
          border-top: 5px solid #1569EB;
          border-right: 5px solid transparent;
        }
      }
      .info {
        width: 100%;
        margin-top: 20px;
        font-size: 14px;
        color: #999999;
        display: flex;
        align-items: center;
        & > div {
          display: flex;
          align-items: center;
          ::v-deep .el-input {
            width: 208px;
            height: 28px;
            .el-input__inner {
              height: 28px;
              line-height: 28px;
            }
          }
        }
        div + div {
          margin-left: 30px;
        }
        .operate {
          float: right;
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
      align-content: flex-start;
      .item {
        min-width: 4.1rem;
        width: calc(25% - .2rem);
        height: 290px;
        background: #ffffff;
        border-radius: 4px;
        margin-right: .2rem;
        margin-bottom: .2rem;
        position: relative;
        cursor: pointer;
        .img-box {
          width: 100%;
          height: fit-content;
          max-height: 233px;
          overflow: hidden;
          position: relative;
          border-radius: 4px 4px 0 0;
          .project-img {
            width: 100%;
            height: 233px;
            transition: all 0.6s;
            cursor: pointer;
          }
          .operate-panel {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background: rgba(0, 0, 0, .5);
            display: flex;
            align-items: center;
            justify-content: center;
            .copy-icon {
              position: absolute;
              font-size: 24px;
              top: 20px;
              right: 70px;
              background: transparent;
              color: #ffffff;
            }
            .delete-icon {
              position: absolute;
              font-size: 24px;
              top: 20px;
              right: 30px;
              background: transparent;
              color: #ffffff;
            }
          }
        }
        .img-box:hover {
          .project-img {
            transform: scale(1.2);
          }
        }
        .content-box {
          width: 100%;
          height: 57px;
          padding: 0 16px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-around;
          .content-box-li {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #999999;
            font-size: 12px;
            .name {
              font-size: 14px;
              font-family: "PingFang SC";
              color: #333333;
            }
            .resolution {
              color: #376AB8;
              font-size: 12px;
              font-family: "PingFang SC";
            }
          }
        }
      }
    }
  }
</style>
