<template>
  <div class="draw-container" id="drawContainer">
    <div class="operate-view">
      <div>
        <el-button
          type="primary"
          icon="el-icon-back"
          style="background: #15B2EB; border-color: #15B2EB"
          size="small"
          @click="goBack"
        >
          返回
        </el-button>
      </div>
      <div>
        <!--<el-button type="primary" icon="el-icon-printer" size="small" @click="upload">上传</el-button>
        <el-button type="primary" icon="el-icon-printer" size="small" @click="download">导出html文件</el-button>-->
        <!--<div
          class="operate"
          @click="look"
        >
          生成图片
        </div>-->
        <div
          class="operate"
          @click="undo"
        >
          <img src="../../assets/static/undo.png" alt="">
          <span>撤销</span>
        </div>
        <div
          class="operate"
          @click="restore"
        >
          <img src="../../assets/static/restore.png" alt="">
          <span>恢复至已存储样式</span>
        </div>
        <div
          class="operate"
          @click="empty"
        >
          <img src="../../assets/static/delete.png" alt="">
          <span>清空</span>
        </div>
        <div
          v-show="currentType === 'template'" @click="uploadTemplate"
          class="operate">
          <img src="../../assets/static/copy.png" alt="">
          保存为模板
        </div>
        <div
          v-show="currentType === 'project' || currentType === 'page'" @click="savePage"
          class="operate">
          <img src="../../assets/static/copy.png" alt="">
          保存页面
        </div>
        <div
          class="operate"
          @click="generateJSON"
        >
          <img src="../../assets/static/json.png" alt="">
          下载JSON文件
        </div>
        <div
          class="operate"
          @click="look"
        >
          <img src="../../assets/static/preview.png" alt="">
          预览界面
        </div>
      </div>
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
                >
                  <div class="components-body">
                    <img :src="publicPath + element.backgroundImage" class="components-image"></img>
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
      <div
        class="center-view"
        ref="views"
        @mousedown="handleDown"
        @mousemove="handleDrag"
        @mouseup="handleUp"
      >
        <!--<div class="action-bar">
          <el-button icon="el-icon-video-play" type="text" @click="run">
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
        </el-button>
          <el-button class="delete-btn" icon="el-icon-delete" type="text" @click="empty">
          清空
        </el-button>
          <el-button type="danger" icon="el-icon-delete" size="small" @click="empty">清空</el-button>
        </div>-->
        <div
          ref="doms"
          class="doms"
          id="doms"
          :style="{'transform': matrix, 'width': drawingList.length > 0 ? 'fit-content' : '', 'height': drawingList.length > 0 ? 'fit-content' : ''}"
          @onmouseover="handleBuild"
          :class="[isCtrl ? 'event-ctrl' : '', isClick ? 'event-ctrl' : '']"
          @click.stop="isClick = !isClick"
        >
          <draggable
            class="drawing-board img-scroll"
            :list="drawingList"
            :animation="340"
            group="componentsGroup"
            :style="{flexDirection: formConf.flexDirection}"
            draggable=".drawing-row-item"
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
              @end="drag"
            />
          </draggable>
        </div>
      </div>
      <div class="right">
        <attr-panel
          :active-data="activeData"
          :form-conf="formConf"
          :show-field="!!drawingList.length"
          @changeTemplateTheme="themeOfAttrPanel"
          @optionChange="optionChange"
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
    <img
      v-show="url && generate"
      :src="url"
      style="position: fixed; z-index: 19; width: 100%; height: 100%; left: 0; top: 0"
      alt=""
      @click="generate = !generate"
    >
    <div
      v-show="previewShow"
      style="position: fixed; z-index: 9; width: 100vw; height: 100vh; left: 0; top: 0"
    >
      <el-button
        style="position: absolute; z-index: 10; left: 2vw; top: 2vh"
        size="small"
        @click="previewShow = false"
      >关闭</el-button>
      <el-button
        style="position: absolute; z-index: 10; left: 6vw; top: 2vh"
        size="small"
        @click="generateImage"
        type="primary"
      >
        生成缩略图
      </el-button>
      <div id="previewRow"></div>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import { deepClone, beautifierConf } from '@/utils/index';
  import loadBeautifier from '@/utils/loadBeautifier'
  import DraggableItem from "./draggableItem";
  import AttrPanel from "./attrPanel";
  import {titleCase, throttle} from '@/utils/index';
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
  import html2canvas from 'html2canvas';
  import previewView from './preview';
  import Vue from 'vue';
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
        // 页面数据
        projectCode: '',
        projectName: '',
        pageId: '',
        currentPageName: '',
        currentType: '',
        currentTempId: '',
        currentTempName: '',
        // 预览、生成缩略图
        previewShow: false,
        previewComp: null,
        url: null,
        generate: false,
        // 编辑区
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
        activeId: '',
        activeIndex: '',
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
        formData: {},
        drawerVisible: false,
        previewVisible: false,
        widgetDeployVisible: false,
        widgetItem: {},
        currentWidgetItem: {},
        templateTheme: '',
        templateNameDialogVisible: false,
        pageNameDialogVisible: false,
        dragFlag: false,
        activeNames: ['1', '2', '3'],
        // 拖拽缩放
        matrix: `matrix(0.5, 0, 0, 0.5, 0, 0)`,
        scaleX: 0.9,
        scaleY: 0.9,
        translateX: 0,
        translateY: 0,
        rotateX: 0,
        rotateY: 0,
        isDown: false,
        x: 0,
        y: 0,
        l: 0,
        t: 0,
        dragX: 0,
        dragY: 0,
        isCtrl: false,
        isClick: false,
        // 记录
        currentData: {},
        record: [],
        publicPath: ''
      }
    },
    created() {
      this.publicPath = process.env.VUE_APP_PUBLIC_PATH;
      this.currentType = sessionStorage.getItem('type');
      if (sessionStorage.getItem('type') === 'project') {
        this.currentPageName = sessionStorage.getItem('name');
        this.pageId = sessionStorage.getItem('id');
        this.projectCode = sessionStorage.getItem('code');
      }
      if (sessionStorage.getItem('type') === 'template') {
        this.currentTempName = sessionStorage.getItem('name');
        this.currentTempId = sessionStorage.getItem('id') || '';
        console.log(this.currentTempId);
      }
      if (sessionStorage.getItem('type') === 'page') {
        this.projectCode = sessionStorage.getItem('code');
        this.currentTempId = sessionStorage.getItem('id');
      }
      this.getCompData();
      /*this.$Bus.$on('drawOpen', (res) => {
        this.currentPageName = res.name;
        this.currentType = res.type;
        console.log(this.currentType);
        if (this.currentType === 'template') {
          this.currentTempId = res.name;
        }
        this.getCompData();
      });*/
    },
    beforeDestroy () {
      this.$Bus.$off('drawOpen');
    },
    mounted() {
      loadBeautifier(btf => {
        beautifier = btf
      });
      document.addEventListener('keydown', (e) => {
        if (e.which === 17) {
          this.isCtrl = true;
        }
        if (e.ctrlKey === true && e.keyCode === 83) {
          e.preventDefault();
          // 保存
          this.saveOperation();
        }
        if (e.ctrlKey === true && e.keyCode === 90) {
          e.preventDefault();
          // 保存
          this.undo();
        }
      });
      document.addEventListener('keyup', (e) => {
        if (e.which === 17) {
          this.isCtrl = false;
        }
      });
      this.$refs.views.addEventListener('mousewheel', this.handleScroll, false)
      || this.$refs.views.addEventListener('DOMMouseScroll', this.handleScroll, false);
      this.$refs.views.addEventListener('onMouseMove', this.handleDrag, false);
      this.$refs.doms.addEventListener('onmousedown', this.buildDown, false);
      window.addEventListener('mousewheel', function (e) {
        if (this.isCtrl) {
          e.preventDefault();
        }
      }, false);
      // 居中
      this.$nextTick(() => {
        this.translateX = (this.$refs.views.offsetWidth - (this.$refs.views.offsetWidth * this.scaleX )) / 2;
        this.translateY = (this.$refs.views.offsetHeight - (this.$refs.views.offsetHeight * this.scaleY )) / 2;
        let matrix = `matrix(${this.scaleX}, 0, 0, ${this.scaleY}, ${this.translateX}, ${this.translateY})`;
        this.matrix = matrix;
      });
    },
    methods: {
      getCompData() {
        Promise.all([this.http.get('/rest/report/chart/list'), this.http.get('/rest/report/template/list')]).then(([v1, v2]) => {
          this.drawingList = [];
          // 组件渲染
          this.leftElement = v1.data.map((item) => JSON.parse(item.code));
          // 模板渲染
          let data = v2.data;
          data.forEach((item) => {item.code = JSON.parse(item.code)});
          this.templateComponents = data.map(item => item.code.layouts[0]);
          // 初始化画布
          if (this.currentType === 'template' || this.currentType === 'page') {
            let currentTemplate = data.find((item, index) => item.id === Number(this.currentTempId) ) || null;
            console.log(currentTemplate)
            currentTemplate && this.addComponent(currentTemplate.code.layouts[0] || []);
            currentTemplate && this.setBaseCurrentData(currentTemplate.code.layouts[0] || []);
          }
          this.currentType === 'project' && this.getPageData();
        });
      },
      getPageData() {
        this.http.get('/rest/report/page', {
          projectCode: this.projectCode,
          id: this.pageId
        }).then(res => {
          let { code } = res.data;
          code = JSON.parse(code);
          this.drawingList = [];
          this.setBaseCurrentData(code.layouts[0]);
          this.addComponent(code.layouts[0]);
          this.formConf = code.conf;
        })
      },
      onEnd(obj) {
        if (obj.from !== obj.to) {
          this.fetchData(tempActiveData);
          this.activeData = tempActiveData;
          this.activeId = this.idGlobal;
          if (obj.from.__vue__.$attrs.group.pull === 'clone') {
            this.traverseIndex();
            this.recordDrag('add', this.findData(tempActiveData.formId));
          }
        }
        // obj.from.__vue__.$attrs.type && this.traverseKey();
        obj.from.__vue__.$attrs.type && this.traverseKey();
      },
      traverseIndex() {
        function alertArr(arr, parentIndex) {
          arr.forEach((item, index) => {
            item.compIndex = parentIndex !== undefined ? parentIndex + '-' + index : index;
            item.children && alertArr(item.children, item.compIndex);
          })
        }
        alertArr(this.drawingList);
      },
      /**
       * cons 是否初始化compIndex
       */
      traverseKey(cons) {
        let global = 0;
        function alertArr(arr, con, parentIndex) {
          arr.forEach((item, index) => {
            item.renderKey = `${++global}${+new Date()}`;
            con && (item.compIndex = parentIndex !== undefined ? parentIndex + '-' + index : index);
            item.children && alertArr(item.children, con, item.compIndex);
          })
        }
        alertArr(this.drawingList, cons);
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
        config.renderKey = `${config.formId}${+new Date()}`; // 改变renderKey后可以实现强制更新组件
        if (config.layout === 'colFormItem') {
          item.__vModel__ = `field${this.idGlobal}`
        }
        else if (config.layout === 'rowFormItem' || config.layout === 'rowFrame') {
          !Array.isArray(config.children) && (config.children = [])
          delete config.label // rowFormItem无需配置label属性
        }
        config.componentName = `row${this.idGlobal}`;
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
        if (type === 'temp') this.drawingList = [];
        const clone = this.cloneComponent(item);
        this.fetchData(clone);
        this.drawingList.push(clone);
        // 新增了初次渲染需要注入compIndex而关闭判断Haschart
        // clone.children && (this.isHasChart([clone]) && this.traverseKey(true));
        this.traverseKey(true);
        this.activeFormItem(clone)
      },
      setBaseCurrentData(data) {
        let clone = this.cloneComponent(data);
        this.currentData = deepClone(clone);
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
      activeFormItem(currentItem, index) {
        this.activeData = currentItem;
        this.activeId = currentItem.formId;
        this.activeIndex = currentItem.compIndex;
      },
      drawingItemCopy(item, list) {
        let clone = deepClone(item);
        clone = this.createIdAndKey(clone);
        list.push(clone);
        this.traverseKey(true);
        this.activeFormItem(clone);
        this.record.push({
          type: 'copy',
          data: clone
        });
      },
      drawingItemDelete(index, list) {
        let data = list.splice(index, 1)[0];
        this.record.push(
          {
          type: 'delete',
          data
        });
        this.$nextTick(() => {
          const len = this.drawingList.length;
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
        if (this.drawingList.length < 1) return false;
        this.drawingList[0].name = this.currentTempName;
        this.drawingList[0].theme = this.formConf.theme;
        let param = {
          code: JSON.stringify({
            layouts: deepClone(this.drawingList),
            conf: this.formConf
          }),
          name: this.currentTempName,
        };
        if(Number(this.currentTempId) !== -1) {
          param.id = this.currentTempId;
          this.http.put('/rest/report/template', param).then(res => {
            this.$message.success('保存成功');
            this.getCompData()
          })
        }else {
          this.http.post('/rest/report/template', param).then(res => {
            this.$message.success('保存成功');
            this.currentTempId = res.data.id;
            this.getCompData();
           });
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
        if (this.currentType === 'project') {
          let param = {
            code: JSON.stringify({
              layouts: deepClone(this.drawingList),
              conf: this.formConf
            }),
            name: this.currentPageName,
            id: this.pageId,
            projectCode: this.projectCode
          };
          this.http.post('/rest/report/page', param).then(res => {
            this.projectCode = res.data.id;
            this.$message.success('保存成功');
            this.getPageData();
          });
        }
        else if (this.currentType === 'page') {
          let param = {
            code: JSON.stringify({
              layouts: deepClone(this.drawingList),
              conf: this.formConf
            }),
            name: this.currentPageName,
            projectCode: this.projectCode
          };
          if (this.pageId) {
            param.id = this.pageId;
          }
          this.http.post('/rest/report/page', param).then(res => {
            this.pageId = res.data.id;
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
      },
      /**
       * 拖拽缩放
       */
      handleScroll(e) {
        if (this.isCtrl) {
          e.preventDefault();
          return false;
        }
        let direction = (e.deltaY || e.detail) > 0 ? .75 : 1.25;
        // 缩放
        let scaleX = this.scaleX * direction;
        let scaleY = this.scaleY * direction;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        let translateX = this.translateX;
        let translateY = this.translateY;
        let w = this.$refs.doms.offsetWidth;
        let h = this.$refs.doms.offsetHeight;
        let ratioL = (e.clientX - this.translateX) / w,
          ratioT = (e.clientY - this.translateY) / h;
        let ratioDelta = e.deltaY > 0 ? 0.9 : 1.1;
        let l = Math.round(e.clientX  - (w * ratioL * ratioDelta));
        let t = Math.round(e.clientY - (h * ratioT * ratioDelta));
        let matrix = `matrix(${scaleX}, 0, 0, ${scaleY}, ${l}, ${t})`;
        this.translateX = l;
        this.translateY = t;
        this.matrix = matrix;
      },
      handleDrag(e) {
        if (!this.isDown) return false;
        //获取x和y
        let nx = e.clientX;
        let ny = e.clientY;
        //计算移动后的左偏移量和顶部的偏移量
        let nl = nx - this.x;
        let nt = ny - this.y;
        let translateX = this.translateX + nl;
        let translateY = this.translateY + nt;
        let matrix = `matrix(${this.scaleX}, 0, 0, ${this.scaleY}, ${translateX}, ${translateY})`;
        this.matrix = matrix;
        this.dragX = translateX;
        this.dragY = translateY;
      },
      handleDown(e) {
        this.isClick = false;
        e.stopImmediatePropagation();
        let path = e.path || (e.composedPath && e.composedPath());
        if (path[0].className !== 'center-view') {
          return false;
        }
        // 初始移动
        this.dragX = 0;
        this.dragY = 0;
        //获取x坐标和y坐标 (相对于页面)
        this.x = e.clientX;
        this.y = e.clientY;

        //获取左部和顶部的偏移量 (相对于父容器)
        this.l = e.offsetX;
        this.t = e.offsetY;
        //开关打开
        if (
          this.translateX <= Number(e.offsetX)
          && Number(e.offsetX) <= (this.translateX + (this.$refs.doms.offsetWidth * this.scaleX))
          && this.translateY <= Number(e.offsetY)
          && Number(e.offsetY) <= (this.translateY + (this.$refs.doms.offsetHeight * this.scaleY))
        ) {
          if (this.isCtrl) {
            this.isDown = true;
          }
        } else {
          this.isDown = true;
        }
        //设置样式
      },
      handleUp() {
        this.isDown = false;
        this.dragX && (this.translateX = this.dragX);
        this.dragY && (this.translateY = this.dragY);
        /*this.translateX = JSON.parse(JSON.stringify(this.dragX));
        this.translateY = JSON.parse(JSON.stringify(this.dragY));
        this.dragX = 0;
        this.dragY = 0;*/
      },
      handleBuild() {
        this.isDown = false;
      },
      buildDown() {
      },
      /**
       * 保存
       */
      saveOperation() {
        this.currentData = deepClone(this.drawingList[0]);
        this.record = [];
      },
      optionChange(key, value) {
        this.record.push({name: key, value: value, index: this.activeIndex});
      },
      undo() {
        if (this.record.length === 0) return false;
        if (this.record.length === 1) {
          this.drawingList = [deepClone(this.currentData)];
          this.isHasChart(this.drawingList) && this.traverseKey();
          this.activeFormItem(this.drawingList[0]);
          this.record = [];
          return false;
        }
        else {
          const currentRecord = this.record[this.record.length - 1]; // 记录
          if (currentRecord.type === 'add') {
            // 结构
            let compIndex = currentRecord.data.compIndex.split('-');
            let indexLists = Array.from(new Array(compIndex.length),(item,index) => [compIndex[index]]);
            let parentData = null;
            compIndex.forEach((item, index) => {
              if (index <= compIndex.length - 2) {
                parentData = parentData ? parentData.children[item] : this.drawingList[item];
              }
            });
            parentData.children.splice(compIndex[compIndex.length - 1], 1);
            this.record.splice(this.record.length - 1,1);
            return
          }
          else if (currentRecord.type === 'move') {
            // 移动
            let positionNow = this.findData(currentRecord.to);
            let positionBefore = this.findData(currentRecord.from);
            let nowIndex = positionNow.children.findIndex((item) => item.formId === currentRecord.fromId);
            let beforeIndex = currentRecord.beforeNode;
            // 操作
            positionBefore.children.splice(beforeIndex, 0, positionNow.children.splice(nowIndex, 1)[0]);
            this.record.splice(this.record.length - 1,1);
            return;
          }
          else if (currentRecord.type === 'copy') {
            let compIndex = currentRecord.data.compIndex.split('-');
            let parent_copy = null;
            compIndex.forEach((item, index) => {
              if (index <= compIndex.length - 2) {
                parent_copy = parent_copy ? parent_copy.children[item] : this.drawingList[item];
              }
            });
            parent_copy.children.splice(parent_copy.children.length - 1, 1);
            this.record.splice(this.record.length - 1,1);
            return;
          }
          else if (currentRecord.type === 'delete') {
            let compIndex = currentRecord.data.compIndex.split('-');
            let parent_copy = null;
            compIndex.forEach((item, index) => {
              if (index <= compIndex.length - 2) {
                parent_copy = parent_copy ? parent_copy.children[item] : this.drawingList[item];
              }
            });
            parent_copy.children.splice(compIndex[compIndex.length - 1], 0, currentRecord.data);
            this.record.splice(this.record.length - 1,1);
            return;
          }
          else if (currentRecord.name) {
            // 属性
            let compIndex = currentRecord['index'].split('-');
            var data = null, datas;
            compIndex.forEach((item, index) => {
              if (index < compIndex.length - 1) {
                data = data ? data[item].children : this.drawingList[item].children;
              } else {
                data = data[item];
                datas = data;
              }
            });
            let record = this.record[this.record.length - 2];
            datas[record['name'][0]][record['name'][1]] = record['value'];
            this.record.splice(this.record.length - 1,1);
            return false;
          }
        }
      },
      /**
       * 移动
       */
      findData(key) {
        let data = null;
        function treeFind(tree, func) {
          for (const data of tree) {
            if (func(data)) return data;
            if (data.children) {
              const res = treeFind(data.children, func);
              if (res) return res
            }
          }
          return null
        }
        function func(data) {
          return data.formId === key;
        }
        return treeFind(this.drawingList, func);
      },
      findDataCompIndex(index) {
        let data = null;
        function treeFind(tree, func) {
          for (const data of tree) {
            if (func(data)) return data
            if (data.children) {
              const res = treeFind(data.children, func);
              if (res) return res
            }
          }
          return null
        }
        function func(data) {
          return data.compIndex === index;
        }
        return treeFind(this.drawingList, func);
      },
      recordDrag(type, data) {
        this.record.push({type, data});
      },
      drag(e, obj){
        // 采用formId锚点， compIndex会随着拖动而手动变化
        this.record.push({
          type: 'move',
          from: obj.formId,
          to: e.to.__vue__.$attrs.formId,
          beforeNode: this.activeData.compIndex.split('-')[this.activeData.compIndex.split('-').length - 1],
          fromId: this.activeId
        });
        this.traverseIndex();
      },
      /**
       * 恢复
       */
      restore() {
        this.drawingList = [deepClone(this.currentData)];
        this.isHasChart(this.drawingList) && this.traverseKey();
        this.activeFormItem(this.drawingList[0]);
        this.record = [];
      },
      /**
       * 生成图片
       */
      look() {
        this.previewShow = true;
        let data = {
          layouts: deepClone(this.drawingList),
          conf: this.formConf
        };
        sessionStorage.setItem("pageData", JSON.stringify(data));
        var Profile = Vue.extend(previewView);
        const component = new Profile().$mount();
        this.previewComp && document.getElementById('previewRow').removeChild(this.previewComp.$el);
        document.getElementById('previewRow').appendChild(component.$el);
        this.previewComp = component;
      },
      generateImage() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let scaleBy = window.devicePixelRatio;
        setTimeout(() => {
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          html2canvas(
            document.getElementsByClassName('preview-view')[0],
            {
              width: 1920, // canvas宽度
              height: 969,
              backgroundColor:null,//画出来的图片有白色的边框,不要可设置背景为透明色（null）
              useCORS: true,//支持图片跨域
              scale:scaleBy,//设置放大的倍数
              dpi: 300, // 处理模糊问题
              x: 0, //x坐标
              y: 0, //y坐标
            }
          ).then(canvas => {
            let img = new Image();
            let res = canvas.toDataURL('image/jpeg',1.0);// toDataURL :图片格base64
            this.url = res;
            this.generate = true;
            loading.close();
            console.log(this.url);
          });
        }, 2000)
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
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0 30px;
      div {
        height: 100%;
        display: flex;
        align-items: center;
        .operate {
          height: 32px;
          display: flex;
          line-height: 32px;
          align-items: center;
          font-size: 12px;
          padding: 0 4px;
          box-sizing: border-box;
          cursor: pointer;
          border-radius: 4px;
          img {
            margin-right: 5px;
          }
        }
        .operate + .operate {
          margin-left: 23px;
        }
        .operate:hover {
          background: #E0E0E0;
        }
      }
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
                aspect-ratio: 88 / 64;
              }
              .components-label {
                font-size: 12px;
                line-height: 12px;
                text-align: center;
                color: #333333;
                font-family: PingFangSC-Medium;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
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
                aspect-ratio: 134 / 80;
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

      .center-view {
        flex: 1274;
        background: #ffffff;
        height: 100%;
        width: 0;
        display: flex;
        flex-direction: column;
        margin: 0 20px;
        outline: none !important;
        position: relative;
        cursor: grab;
        overflow: hidden;
        user-select: none;

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

        .doms {
          flex: 1;
          transform-origin: 0px 0px 0px;
          background-color: azure;
          display: flex;
          .drawing-board {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            overflow: auto;
            ::v-deep .drawing-row-item {
              position: relative;
              cursor: move;
              -webkit-box-sizing: border-box;
              box-sizing: border-box;
              border: 1px dashed #ccc;
              border-radius: 3px;
              padding: 10px !important;
              /*padding: 0 2px;*/
              /*margin-bottom: 15px;*/
              /*margin-right: 15px;*/
              /*min-height: fit-content;*/
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
        .event-ctrl {
          pointer-events: none;
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


