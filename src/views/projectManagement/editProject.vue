<template>
  <div class="edit-project">
    <div class="detail-view">
      <div class="title">编辑项目</div>
      <div class="info">
        <div>项目名称：{{ projectInfo.name }}</div>
        <div>项目编号：{{ projectInfo.projectCode }}</div>
        <div>适配分辨率：1920*1080</div>
        <div>主题风格：深邃蓝</div>
      </div>
      <div class="info">
        <div>创建时间：{{ projectInfo.createTime }}</div>
        <!--<div>最近发布时间：2021-03-01</div>-->
        <div>页面数量：{{ this.pageList.length }}</div>
        <div class="operate">
          <el-button size="small" type="primary">切换主题</el-button>
          <el-button size="small" type="primary" @click="publish">发布</el-button>
          <el-button size="small" type="primary" @click="appendPage">新增界面</el-button>
        </div>
      </div>
    </div>
    <div class="main-view">
      <draggable class="page-draggable" v-model="pageList"  @start="onStart" @end="onEnd">
        <transition-group>
          <div
            v-for="(item, index) in pageList"
            :key="index"
            class="item"
            @mouseover="activeId = index"
            @mouseleave="activeId = -1"
          >
            <div class="img-box">
              <img src="../../assets/img.png" class="project-img" alt="">
              <div class="operate-panel" v-show="activeId === index">
                <el-button type="primary" plain @click="toEditProjectPage(item)">编辑</el-button>
                <el-button @click="previewPage(item)">预览</el-button>
                <i class="el-icon-document-copy copy-icon"></i>
                <i class="el-icon-delete delete-icon" @click="deletePage(item)"></i>
              </div>
            </div>
            <div class="content-box">
              <div class="content-box-li">
                <div class="name">{{ item.name }}</div>
                <div class="resolution">福州商旅学校</div>
              </div>
              <div class="content-box-li">
                <div>类型：全校</div>
                <div>2021-03-02</div>
              </div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>
  </div>
</template>

<script>
  import { saveAs } from 'file-saver'
  import draggable from 'vuedraggable';

  export default {
    name: 'EditProject',
    components: {
      draggable
    },
    data() {
      return {
        projectCode: '',
        projectId: '',
        activeId: '',
        pageList: [],
        projectInfo: '',
        currentName: ''
      }
    },
    created() {
      this.projectCode = this.$route.query.code;
      this.projectId = this.$route.query.id;
      this.getPageList();
      this.getProject();
    },
    mounted() {
    },
    beforeDestroy() {
      console.log(this.currentName)
      this.currentName && this.$Bus.$emit('drawOpen',{type: 'project', name: this.currentName});
    },
    methods: {
      getPageList() {
        this.http.get('/rest/report/page/list', {projectCode: this.projectCode}).then(res => {
          this.pageList = res.data || [];
        })
      },
      getProject() {
        let param = { projectCode: this.projectCode, id: this.projectId }
        this.http.get('/rest/report/project', param).then(res => {
          console.log(res);
          this.projectInfo = res.data;
        })
      },
      toEditProjectPage(data) {
        this.currentName = data.name;
        this.$router.push({
            path: '/home/editPage',
            query: {
              code: this.projectCode,
              id: data.id
            }
        });
        this.$once('hook:beforeDestroy', () => {

        })
      },
      deletePage(data) {
        let param = { id: data.id };
        this.http.delete('/rest/report/page', param).then(res => {
          this.getPageList();
        })
      },
      previewPage(data) {
        let formData = JSON.parse(data.code);
        this.$store.commit('setPageData', formData);
        sessionStorage.setItem("pageData", JSON.stringify(formData));
        const routeData = this.$router.resolve({
          name: "preview"
        });
        window.open(routeData.href, "_blank");
      },
      appendPage() {
        this.$router.push({
            path: '/home/templateSelect',
            query: {
              code: this.projectCode
            }
          }
        );
      },
      publish() {
        let code = new Array(1).fill(this.pageList.map((item) => JSON.parse(item.code)));
        let codeStr = JSON.stringify(code[0]);
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'cs.json');
      },
      onStart() {},
      onEnd() {}
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
      padding-bottom: 20px;
      .title {
        height: 36px;
        width: 100%;
        line-height: 42px;
        border-bottom: 1px solid #DCE6F5;
        text-align: left;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #333333;
        cursor: pointer;
      }
      .info {
        width: 100%;
        margin-top: 20px;
        font-size: 14px;
        color: #999999;
        & > div {
          display: inline-block;
          margin-right: 20px;
          float: left;
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
      .page-draggable {
        width: 100%;
        height: 100%;
        & > span {
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          .item {
            min-width: 4.1rem;
            width: calc(25% - .2rem);
            height: 320px;
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
              height: 87px;
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
    }
  }
</style>
