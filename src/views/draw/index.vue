<template>
  <div class="draw-container">
    <div class="operate-view">
      <el-button type="primary" icon="el-icon-printer" size="small" @click="goBack">返回</el-button>
      <el-button type="primary" icon="el-icon-printer" size="small" @click="savePage">保存页面</el-button>
      <el-button type="primary" icon="el-icon-printer" size="small" v-show="currentType !== 'project'" @click="uploadTemplate">保存模板</el-button>
      <el-button type="primary" icon="el-icon-printer" size="small" @click="generateJSON">导出json文件</el-button>
      <!--<el-button type="primary" icon="el-icon-printer" size="small" @click="upload">上传</el-button>-->
      <!--<el-button type="primary" icon="el-icon-printer" size="small" @click="download">导出html文件</el-button>-->
      <el-button type="primary" icon="el-icon-printer" size="small" @click="preview">预览界面</el-button>
      <el-button type="primary" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
    </div>
    <div class="draw-view">
      <div class="left">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="元件" name="1">
            <div>
              <draggable
                class="components-draggable"
                :list="leftComponents"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-item-widget"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in leftComponents"
                  :key="index"
                  class="components-item-widget"
                  @click="addComponent(element)"
                >
                  <div class="components-body back">
                    {{ element.label }}
                  </div>
                </div>
              </draggable>
            </div>
          </el-collapse-item>
          <el-collapse-item title="组件" name="2">
            <div>
              <draggable
                class="components-draggable"
                :list="leftElement"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                type="zj"
                draggable=".components-item"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in leftElement"
                  :key="index"
                  class="components-item"
                  @click="addComponent(element)"
                >
                  <div class="components-body">
                    <img :src="element.backgroundImage" class="components-image"></img>
                    <div class="components-label">{{ element.label }}</div>
                  </div>
                </div>
              </draggable>
            </div>
          </el-collapse-item>
          <el-collapse-item title="模板" name="3">
            <div>
              <draggable
                class="components-draggable"
                :list="templateComponents"
                :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
                :clone="cloneComponent"
                draggable=".components-template"
                :sort="false"
                @end="onEnd"
              >
                <div
                  v-for="(element, index) in templateComponents"
                  :key="index"
                  class="components-template"
                  @click="addComponent(element, 'temp')"
                >
                  <div class="components-body">
                    <div class="components-image"></div>
                    <div class="components-label">{{ element.name }}</div>
                  </div>
                </div>
              </draggable>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="center">
        <!--<div class="action-bar">
        &lt;!&ndash;<el-button icon="el-icon-video-play" type="text" @click="run">
          运行
        </el-button>
        <el-button icon="el-icon-view" type="text" @click="showJson">
          查看json
        </el-button>
        <el-button icon="el-icon-download" type="text" @click="download">
          导出vue文件
        </el-button>
        <el-button class="copy-btn-main" icon="el-icon-document-copy" type="text" @click="copy">
          复制代码
        </el-button>&ndash;&gt;
        &lt;!&ndash;<el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>&ndash;&gt;
        <el-button type="danger" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
        </div>-->
        <draggable
          class="drawing-board img-scroll"
          :list="drawingList"
          :animation="340"
          group="componentsGroup"
          :style="{flexDirection: formConf.flexDirection}"
          :disabled="dragFlag"
        >
          <draggable-item
            v-for="(item, index) in drawingList"
            :key="item.renderKey"
            :drawing-list="drawingList"
            :current-item="item"
            :active-id="activeId"
            :index="index"
            :form-conf="formConf"
            :template-theme="templateTheme"
            @activeItem="activeFormItem"
            @copyItem="drawingItemCopy"
            @deleteItem="drawingItemDelete"
            @editItem="editItem"
          />
        </draggable>
      </div>
      <div class="right">
        <attr-panel
          :active-data="activeData"
          :form-conf="formConf"
          :show-field="!!drawingList.length"
          @changeTemplateTheme="themeOfAttrPanel"
        ></attr-panel>
      </div>
    </div>
    <widget-deploy
      :visible.sync="widgetDeployVisible"
      v-if="widgetDeployVisible"
      ref="widget"
      :widget-item="widgetItem"
      @changeWidget="changeWidget"
    ></widget-deploy>
    <el-dialog
      title="提示"
      :visible.sync="templateNameDialogVisible"
      width="30%"
      class="template-name-dialog"
      :close-on-click-modal="false"
    >
      <span>模板名称：</span><el-input v-model="currentTempName" size="small"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancer">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="pageNameDialogVisible"
      width="30%"
      class="template-name-dialog"
      :close-on-click-modal="false"
    >
      <span>页面名称：</span><el-input v-model="currentPageName" size="small"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancerPage">取 消</el-button>
        <el-button type="primary" @click="surePage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import { deepClone, beautifierConf } from '@/utils/index';
  import loadBeautifier from '@/utils/loadBeautifier'
  import DraggableItem from "./draggableItem";
  import AttrPanel from "./attrPanel";
  import {titleCase} from '@/utils/index';
  import {
    makeUpHtml, vueTemplate, vueScript, cssStyle
  } from './generateCode/index'
  import { makeUpJs } from './generateCode/utils'
  import { makeUpCss } from './generateCode/style'
  import { saveAs } from 'file-saver'
  import WidgetDeploy from './widgetDeploy'
  import Viewport from '../viewport'
  let tempActiveData;
  let beautifier;
  let tempContainer = null;
  export default {
    name: "Draw",
    components: {
      Viewport,
      WidgetDeploy,
      AttrPanel,
      DraggableItem,
      draggable
    },
    data() {
      return {
        leftComponents: [
          {
            layout: 'rowFrame',
            label: '画布',
            type: 'canvas',
            style: {
              flexDirection: 'row',
              display: 'flex',
              width: '1920px',
              height: '1080px',
              backgroundColor: ''
            },
            children: [],
          },
          {
            layout: 'rowFrame',
            label: '容器',
            type: 'container',
            style: {
              flexDirection: 'column',
              display: 'flex',
              padding: '10',
              flex: 2,
              backgroundColor: '',
              backgroundImage: '',
              backgroundGroup: '',
              marginTop: 0,
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
            },
            children: [],
          },
          {
            layout: 'title',
            label: '标题',
            type: 'title',
            text: '标题',
            style: {
              flexDirection: 'row',
              display: 'flex',
              width: '100%',
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              color: '#b4d6d6',
              fontSize: 12,
              fontFamily: 'PingFangSC-Medium',
              backgroundImage: '',
              backgroundGroup: '',
              marginTop: 0,
              marginBottom: 0,
              marginLeft: 0,
              marginRight: 0,
            },
            children: [],
          },
        ],
        leftElement: [],
        templateComponents: [],
        cChartContainer: {
          layout: 'rowFrame',
          label: 'cChart容器',
          type: 'chartContainer',
          style: {
            flexDirection: 'row',
            display: 'flex',
            flex: 2,
            backgroundColor: '',
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            paddingLeft: 5,
            paddingTop: 30,
            paddingBottom: 10,
            paddingRight: 5
          },
          children: [],
        },
        drawingList: [],
        activeData: {
          layout: 'rowFrame',
          tagIcon: 'row',
          label: '行布局框',
          layoutTree: true,
          document: 'https://element.eleme.cn/#/zh-CN/component/layout#row-attributes',
          style: {
            flexDirection: 'row',
            display: 'flex',
            padding: '10',
            flex: 2,
            backgroundColor: '#E1FFFF',
          },
          children: [],
          type: 'default',
          justify: 'start',
          align: 'top'
        },
        activeId: '',
        formConf: {
          span: 24,
          gutter: 10,
          flexDirection: 'row',
          theme: ''
        },
        idGlobal: 0,
        dialogVisible: false,
        showFileName: false,
        operationType: '',
        generateConf: null,
        formData: {
          ref: '',
          hasForm: false,
          style: {},
          props: {},
          className: '',
          formItem: [
            {
              type: 'div',
              className: 'cross-frame',
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                flexWarp: 'wrap',
                boxSizing: 'border-box',
                border: '1px solid blue',
                marginRight: '5px'
              }
            },
            {
              type: 'div',
              className: 'cross-frame',
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'row',
                flexWarp: 'wrap',
                boxSizing: 'border-box',
                border: '1px solid blue',
                marginRight: '5px'
              }
            },
            {
              type: 'div',
              className: 'cross-frame',
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                flexWarp: 'wrap',
                boxSizing: 'border-box',
                border: '1px solid blue'
              },
              children: [
                {
                  type: 'div',
                  className: 'cross-frame',
                  style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWarp: 'wrap',
                    boxSizing: 'border-box',
                    border: '1px solid blue',
                    marginBottom: '5px'
                  },
                },
                {
                  type: 'div',
                  className: 'cross-frame',
                  style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWarp: 'wrap',
                    boxSizing: 'border-box',
                    border: '1px solid blue',
                    marginBottom: '5px'
                  },
                },
                {
                  type: 'div',
                  className: 'cross-frame',
                  style: {
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'row',
                    flexWarp: 'wrap',
                    boxSizing: 'border-box',
                    border: '1px solid blue'
                  },
                }
              ]
            },
          ]
        },
        drawerVisible: false,
        previewVisible: false,
        widgetDeployVisible: false,
        widgetItem: {},
        currentWidgetItem: {},
        templateTheme: '',
        currentTempId: '',
        currentTempName: '',
        templateNameDialogVisible: false,
        currentPageName: '',
        pageNameDialogVisible: false,
        dragFlag: false,
        projectCode: '',
        currentType: '',
        activeNames: ['1', '2', '3']
      }
    },
    created() {
      this.$Bus.$on('drawOpen', (res) => {
        console.log(res);
        res.type === 'project' && (this.currentPageName = res.name, this.currentType = 'project');
      })
      this.getCompData();
      /*document.addEventListener("keydown", () => {
        let e = event.keyCode;
        if (e === 17) {
          this.dragFlag = true;
        }
      })
      document.addEventListener("keyup", () => {
        let e = event.keyCode;
        if (e === 17) {
          this.dragFlag = false;
        }
      })*/
    },
    beforeDestroy () {
      this.$Bus.$off('drawOpen');
    },
    mounted() {
      console.log(this.currentPageName);
      loadBeautifier(btf => {
        beautifier = btf
      })
    },
    methods: {
      getCompData() {
        Promise.all([this.http.get('/rest/report/chart/list'), this.http.get('/rest/report/template/list')]).then(([v1, v2]) => {
          this.drawingList = [];
          this.leftElement = v1.data.map((item) => JSON.parse(item.code));
          console.log(this.leftElement)
          let data = v2.data;
          data.forEach((item) => {item.code = JSON.parse(item.code)});
          this.templateComponents = data.map(item => item.code.layouts[0]);
          let datas = data.find((item, index) => item.id === Number(this.$route.query.tempId) ) || [];
          this.$route.query.tempId && (this.addComponent(datas.code.layouts[0]), this.currentTempId = datas.id, this.currentTempName = datas.name);
          this.$route.query.id && this.getPageData();
        });
      },
      getPageData() {
        this.http.get('/rest/report/page', {
          projectCode: this.$route.query.code,
          id: this.$route.query.id
        }).then(res => {
          let { code } = res.data;
          code = JSON.parse(code);
          this.drawingList = [];
          this.addComponent(code.layouts[0]);
          this.formConf = code.conf;
        })
      },
      onEnd(obj) {
        if (obj.from !== obj.to) {
          this.fetchData(tempActiveData)
          this.activeData = tempActiveData
          this.activeId = this.idGlobal
        }
        obj.from.__vue__.$attrs.type && this.traverseKey();
      },
      traverseKey() {
        let global = 0;
        function alertArr(arr, con) {
          arr.forEach((item, index) => {
            item.renderKey = `${++global}${+new Date()}`;
            item.children && alertArr(item.children, con);
          })
        }
        alertArr(this.drawingList);
      },
      cloneComponent(origin) {
        const clone = deepClone(origin);
        let config = clone;
        config.theme && (this.formConf.theme = config.theme, this.templateTheme = config.theme);
        if (config.type === 'cChart' && config.props.theme === '') config.props.theme = this.formConf.theme;
        config.type === 'cChart' && (tempContainer = deepClone(this.cChartContainer), this.createIdAndKey(tempContainer));
        this.createIdAndKey(config);
        tempContainer && (tempContainer.children = [config], tempActiveData = tempContainer) || (tempActiveData = config);
        tempContainer = null;
        return tempActiveData
      },
      createIdAndKey(item) {
        const config = item
        config.formId = ++this.idGlobal
        config.renderKey = `${config.formId}${+new Date()}` // 改变renderKey后可以实现强制更新组件
        if (config.layout === 'colFormItem') {
          item.__vModel__ = `field${this.idGlobal}`
        }
        else if (config.layout === 'rowFormItem' || config.layout === 'rowFrame') {
          !Array.isArray(config.children) && (config.children = [])
          delete config.label // rowFormItem无需配置label属性
        }
        config.componentName = `row${this.idGlobal}`
        if (config.layout === 'echart') {
          config.componentName = 'echart' + config.componentName
        }
        if (Array.isArray(config.children)) {
          config.children = config.children.map(childItem => this.createIdAndKey(childItem))
        }
        return item
      },
      addComponent(item, type = null) {
        if (item.length < 1) return false;
        if (type) this.drawingList = [];
        const clone = this.cloneComponent(item)
        this.fetchData(clone);
        this.drawingList.push(clone);
        clone.children && (this.isHasChart([clone]) && this.traverseKey());
        this.activeFormItem(clone)
      },
      isHasChart(data) {
        let flag = false;
        function recursiveData (data) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].type === 'cChart') {
              flag = true;
              return flag;
            }
            if (data[i].children && data[i].children.length > 0) {
              recursiveData(data[i].children);
            }
          }
          return flag;
        }
        return recursiveData(data);
      },
      fetchData(component) {
        const { dataType, method, url } = component
        if (dataType === 'dynamic' && method && url) {
          this.setLoading(component, true)
          this.$axios({
            method,
            url
          }).then(resp => {
            this.setLoading(component, false)
            this.setRespData(component, resp.data)
          })
        }
      },
      activeFormItem(currentItem) {
        this.activeData = currentItem;
        this.activeId = currentItem.formId
      },
      drawingItemCopy(item, list) {
        let clone = deepClone(item)
        clone = this.createIdAndKey(clone)
        list.push(clone)
        this.traverseKey()
        this.activeFormItem(clone)
      },
      drawingItemDelete(index, list) {
        list.splice(index, 1)
        this.$nextTick(() => {
          const len = this.drawingList.length
          if (len) {
            this.traverseKey();
            this.activeFormItem(this.drawingList[len - 1])
          }
        })
      },
      editItem(index, list, item) {
        this.widgetDeployVisible = true;
        this.currentWidgetItem = item.children[0];
        this.widgetItem = deepClone(item.children[0]);
        this.$nextTick(() => {
          this.$refs.widget.init();
        })
      },
      changeWidget(data) {
        // tool 确认修改后改变对象
        this.getChidlren(this.currentWidgetItem.formId, data, this.drawingList);
      },
      getChidlren(id, replaceData, data) {
        let hasFound = false, result = null, arr = [], newData = deepClone(data) ;
        function handleTreeData (data, idValue, targetObj) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].formId === idValue) {
              data[i] = targetObj;
            }
            if (data[i].children && data[i].children.length > 0) {
              handleTreeData(data[i].children, idValue, targetObj);
            }
          }
          return data;
        }
        this.drawingList = handleTreeData(newData, id, replaceData);
      },
      themeOfAttrPanel(val) {
        this.drawingList[0].theme = val;
        this.templateTheme = val;
        this.traverseKey();
      },
      empty() {
        this.$confirm('确定要清空所有组件吗？', '提示', { type: 'warning' }).then(
          () => {
            this.drawingList = []
            this.idGlobal = 100
          }
        )
      },
      /**
       * 预览
       */
      preview() {
        this.drawingList[0].theme = this.formConf.theme;
        this.formData = {
          layouts: deepClone(this.drawingList),
          conf: this.formConf
        }
        this.$store.commit('setPageData', this.formData);
        sessionStorage.setItem("pageData", JSON.stringify(this.formData));
        const routeData = this.$router.resolve({
          name: "preview"
        });
        window.open(routeData.href, "_blank");
      },
      /**
       * 导出
       */
      download(data) {
        const func = this['execDownload']
        this.generateConf = {
          fileName: 'cs',
          type: 'file'
        }
        func && func(data)
      },
      execDownload(data) {
        const codeStr = this.generateCode();
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, data.fileName);
      },
      generateCode() {
        const { type } = this.generateConf;
        this.AssembleFormData();
        // const script = vueScript(makeUpJs(this.formData, type))
        const html = vueTemplate(makeUpHtml(this.formData, type))
        // const css = cssStyle(makeUpCss(this.formData))
        return beautifier.html(html, beautifierConf.html)
      },
      run() {
        const func = this[`exec${titleCase('run')}`];
        this.generateConf = {fileName: undefined, type: 'file'};
        func && func(data)
      },
      execRun(data) {
        this.AssembleFormData();
        this.drawerVisible = true
      },
      AssembleFormData() {
        this.formData = {
          layouts: deepClone(this.drawingList),
          conf: this.formConf
        }
      },
      /**
       * 上传
       */
      upload() {
        let param = {
          "json": JSON.stringify({
            layouts: deepClone(this.drawingList),
            conf: this.formConf
          }),
          "name": "a",
          "id": "1"
        }
        this.http.post('/rest/report/json', param).then(res => {
        })
      },
      /**
       * 上传模板
       */
      uploadTemplate() {
        this.templateNameDialogVisible = true;
      },
      fetchTemplate() {
        this.drawingList[0].name = this.currentTempName;
        this.drawingList[0].theme = this.formConf.theme;
        let param = {
          code: JSON.stringify({
            layouts: deepClone(this.drawingList),
            conf: this.formConf
          }),
          name: this.currentTempName,
        }
        if (this.$route.query.tempId) {
          param.id = this.$route.query.tempId;
          this.http.put('/rest/report/template', param).then(res => { this.getCompData() })
        } else {
          this.http.post('/rest/report/template', param).then(res => { this.getCompData() });
        }
      },
      /**
       * 保存页面
       */
      savePage() {
        this.pageNameDialogVisible = true;
      },
      fetchPage() {
        this.drawingList[0].theme = this.formConf.theme;
        if (!this.$route.query.id && !this.projectCode) {
          let param = {
            code: JSON.stringify({
              layouts: deepClone(this.drawingList),
              conf: this.formConf
            }),
            name: this.currentPageName,
            projectCode: this.projectCode || this.$route.query.code
          };
          this.http.post('/rest/report/page', param).then(res => {
            console.log(res)
            this.projectCode = res.data.id;
            this.$message.success('保存成功');
            this.getPageData();
          });
        } else {
          let param = {
            code: JSON.stringify({
              layouts: deepClone(this.drawingList),
              conf: this.formConf
            }),
            id: this.$route.query.id,
            name: this.currentPageName,
            projectCode: this.$route.query.code
          };
          this.http.post('/rest/report/page', param).then(res => {
            console.log(res);
            this.$message.success('保存成功');
            this.getPageData();
          });
        }
      },
      /**
       * 返回
       */
      goBack() {
        this.$router.go(-1);
      },
      cancer() {
        this.templateNameDialogVisible = false;
      },
      sure() {
        if (!this.currentTempName) {
          this.$message.error('模板名称为必填！');
          return false;
        }
        this.templateNameDialogVisible = false;
        this.fetchTemplate();
      },
      cancerPage() {
        this.pageNameDialogVisible = false;
      },
      surePage() {
        if (!this.currentPageName) {
          this.$message.error('页面名称为必填！');
          return false;
        }
        this.pageNameDialogVisible = false;
        this.fetchPage();
      },
      /**
       * 生成json
       */
      generateJSON() {
        let codeStr = JSON.stringify([{
          layouts: deepClone(this.drawingList),
          conf: this.formConf
        }]);
        const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'cs.json');
      }
    }
  }
</script>

<style lang="scss" scoped>
  .draw-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #F0F2F5;

    .operate-view {
      flex: 55;
      height: 0;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      box-sizing: border-box;
      padding: 0 30px;
    }

    .draw-view {
      flex: 912;
      height: 0;
      flex-shrink: 0;
      display: flex;
      margin-bottom: 17px;
      .left {
        flex: 304;
        height: 100%;
        flex-shrink: 0;
        overflow-y: auto;
        background: #ffffff;
        .type-title {
          width: 100%;
          height: 40px;
          line-height: 40px;
          text-align: center;
          color: #333333;
          font-size: 16px;
        }
        .components-draggable{
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: flex-start;
          .components-item {
            display: inline-block;
            width: 32%;
            transition: transform 0ms !important;
            .components-body {
              box-sizing: border-box;
              cursor: pointer;
              .components-image {
                width: 100%;
                background: #000211;
                aspect-ratio: auto 88 / 64;
              }
              .components-label {
                font-size: 12px;
                line-height: 12px;
                text-align: center;
                color: #333333;
                font-family: PingFangSC-Medium;
              }
              .svg-icon{
                color: #777;
                font-size: 15px;
              }
              &:hover {
                border: 1px dashed #1569EB;
                color: #1569EB;
                .svg-icon {
                  color: #1569EB;
                }
              }
            }
          }
          .components-item-widget {
            display: inline-block;
            width: 48%;
            margin: 1%;
            height: 40px;
            box-sizing: border-box;
            cursor: pointer;
            transition: transform 0ms !important;
            .back {
              background: #F0F5FA;
              height: 100%;
              line-height: 40px;
              &:hover {
                border: 1px dashed #1569EB;
                color: #1569EB;
                .svg-icon {
                  color: #1569EB;
                }
              }
            }
          }
          .components-template {
            display: inline-block;
            width: 48%;
            margin: 1%;
            box-sizing: border-box;
            cursor: pointer;
            transition: transform 0ms !important;
            .components-body {
              box-sizing: border-box;
              cursor: pointer;
              .components-image {
                width: 100%;
                background: #000211;
                aspect-ratio: auto 134 / 80;
              }
              .components-label {
                font-size: 12px;
                line-height: 12px;
                text-align: center;
                color: #333333;
                font-family: PingFangSC-Medium;
                margin: 10px 0;
              }
              .svg-icon{
                color: #777;
                font-size: 15px;
              }
              &:hover {
                border: 1px dashed #1569EB;
                color: #1569EB;
                .svg-icon {
                  color: #1569EB;
                }
              }
            }
          }
          .components-item:nth-child(3n + 2) {
            margin:0 2% 15px;
          }
        }
        ::v-deep .el-collapse-item__content {
          padding-left: 12px;
          padding-right: 12px;
          padding-bottom: 15px;
        }
        ::v-deep .el-collapse-item__header {
          padding-left: 16px;
        }
      }

      .center {
        flex: 1274;
        background: #ffffff;
        height: 100%;
        width: 0;
        display: flex;
        flex-direction: column;
        margin: 0 20px;

        .action-bar{
          position: relative;
          height: 42px;
          text-align: right;
          padding: 0 15px;
          box-sizing: border-box;;
          border: 1px solid #f1e8e8;
          background: #ffffff;
          border-top: none;
          border-left: none;
          width: 100%;
          .delete-btn{
            color: #F56C6C;
            line-height: 1;
            white-space: nowrap;
            cursor: pointer;
            background: #FFF;
            border: 1px solid #DCDFE6;
            -webkit-appearance: none;
            text-align: center;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            outline: 0;
            margin: 0;
            -webkit-transition: .1s;
            transition: .1s;
            font-weight: 500;
            padding: 12px 20px;
            font-size: 14px;
            border-radius: 4px;
            display: inline-block;
          }
        }

        .operate-view {
          height: 42px;
          padding: 0 15px;
          text-align: right;
          border: 1px solid #f1e8e8;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }

        .drawing-base {
          width: 100%;
          flex: 1;
          display: flex;
          overflow: hidden;
          /*position: relative;*/
        }

        .drawing-board {
          /*min-width: 100%;
          min-height: 100%;
          width: fit-content;
          height: fit-content;*/
          /*flex: 1;*/
          width: 100%;
          height: 100%;
          /*display: flex;*/
          padding: 50px;
          box-sizing: border-box;
          overflow: auto;
          /*position: absolute;*/
          ::v-deep .drawing-row-item {
            position: relative;
            cursor: move;
            -webkit-box-sizing: border-box;
            box-sizing: border-box;
            border: 1px dashed #ccc;
            border-radius: 3px;
            padding: 0 2px;
            /*margin-bottom: 15px;*/
            margin-right: 15px;
            min-height: fit-content;
            .component-name {
              position: absolute;
              top: 0;
              left: 0;
              font-size: 12px;
              color: #bbb;
              display: inline-block;
              padding: 0 6px;
              line-height: 20px;
            }
            .drawing-item-copy {
              display: none;
              position: absolute;
              top: -10px;
              width: 22px;
              height: 22px;
              line-height: 22px;
              text-align: center;
              border-radius: 50%;
              font-size: 12px;
              border: 1px solid;
              cursor: pointer;
              z-index: 1;
            }
            .drawing-item-delete {
              display: none;
              position: absolute;
              top: -10px;
              width: 22px;
              height: 22px;
              line-height: 22px;
              text-align: center;
              border-radius: 50%;
              font-size: 12px;
              border: 1px solid;
              cursor: pointer;
              z-index: 1;
            }
            .drawing-item-edit {
              display: none;
              position: absolute;
              top: -10px;
              width: 22px;
              height: 22px;
              line-height: 22px;
              text-align: center;
              border-radius: 50%;
              font-size: 12px;
              border: 1px solid;
              cursor: pointer;
              z-index: 1;
            }
            .drag-wrapper .drawing-row-item {
              /*margin-top: 20px;*/
            }
          }
          ::v-deep .drawing-row-item > .drag-wrapper {
            margin: 0 !important;
          }
          ::v-deep .active-from-item > .drawing-item-copy {
            display: initial;
          }
          ::v-deep .active-from-item > .drawing-item-delete {
            display: initial;
          }
          ::v-deep .active-from-item > .drawing-item-edit {
            display: initial;
          }
          ::v-deep .drag-wrapper > .drawing-row-item {
            margin-right: 0;
          }
          ::v-deep .drawing-row-item.active-from-item {
            border: 1px dashed #409EFF;
            .drawing-item-copy {
              right: 46px;
              border-color: #409EFF;
              color: #409EFF;
              background: #fff;
            }
            .drawing-item-delete {
              right: 14px;
              border-color: #F56C6C;
              color: #F56C6C;
              background: #fff;
            }
            .drawing-item-edit {
              right: 78px;
              border-color: #409EFF;
              color: #409EFF;
              background: #fff;
            }
          }
        }
      }

      .right {
        flex: 304;
        flex-shrink: 0;
        height: 100%;
        background: #ffffff;
      }
    }

    .dialog {
      font-size: 12px;
      ::v-deep .flex-view {
        height: 80vh;
      }
    }

    .template-name-dialog {
      font-size: 12px;
    }
  }
</style>


