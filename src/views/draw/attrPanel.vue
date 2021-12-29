<template>
  <div class="attr-panel">
    <!--<el-tabs v-model="currentTab">
      <el-tab-pane label="容器属性" name="container" />
      <el-tab-pane label="画布属性" name="canvas" />
    </el-tabs>-->
    <el-menu
      :default-active="currentTab"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">容器属性</el-menu-item>
      <el-menu-item index="2">画布属性</el-menu-item>
    </el-menu>
    <div class="property-view">
      <el-form
        v-show="currentTab === '1'"
        size="small"
        label-width="100px"
      >
        <el-form-item label="容器排列方向">
          <el-select
            v-model="activeData.style.flexDirection"
            @change="(e) => optionChange(e, ['style','flexDirection'])"
          >
            <el-option
              v-for="(item, index) in arrangeOption"
              :key="index.toString()"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="容器内间距">
          <el-input-number @change="(e) => optionChange(e, ['style','padding'])" v-model="activeData.style.padding" />
        </el-form-item>
        <el-form-item label="容器占比">
          <el-input-number @change="(e) => optionChange(e, ['style','flex'])" v-model="activeData.style.flex" />
        </el-form-item>
        <el-form-item label="容器背景色">
          <el-color-picker @change="(e) => optionChange(e, ['style','backgroundColor'])" v-model="activeData.style.backgroundColor" show-alpha></el-color-picker>
        </el-form-item>
        <div v-show="activeType === 'container'">
          <el-form-item label="左边距">
            <el-input-number @change="(e) => optionChange(e, ['style','marginLeft'])" type="number" v-model="activeData.style.marginLeft" />
          </el-form-item>
          <el-form-item label="上边距">
            <el-input-number @change="(e) => optionChange(e, ['style','marginTop'])" type="number" v-model="activeData.style.marginTop" />
          </el-form-item>
          <el-form-item label="下边距">
            <el-input-number @change="(e) => optionChange(e, ['style','marginBottom'])" type="number" v-model="activeData.style.marginBottom" />
          </el-form-item>
          <el-form-item label="右边距">
            <el-input-number @change="(e) => optionChange(e, ['style','marginRight'])" type="number" v-model="activeData.style.marginRight" />
          </el-form-item>
          <el-form-item label="背景图(文件夹)">
            <el-select
              clearable
              v-model="activeData.style.backgroundGroup"
              @change="(e) => optionChange(e, ['style','flexDirection'])"
            >
              <el-option
                v-for="(item, key, index) in imgGroup"
                :key="key"
                :label="key"
                :value="key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="背景图(图片)">
            <el-select
              clearable
              v-model="activeData.style.backgroundImage"
              @change="(e) => optionChange(e, ['style','flexDirection'])"
            >
              <el-option
                v-for="(item, index) in imgGroup[activeData.style.backgroundGroup]"
                :key="item"
                :label="item"
                :value="item"
              >
                <span style="float: left">{{ item }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">预览</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-show="activeType === 'title'">
          <el-form-item label="内容">
            <el-input @change="(e) => optionChange(e, 'text')" v-model="activeData.text" placeholder="请输入容器内间距" />
          </el-form-item>
          <el-form-item label="内容颜色">
            <el-color-picker @change="(e) => optionChange(e, ['style','color'])" v-model="activeData.style.color"></el-color-picker>
          </el-form-item>
          <el-form-item label="字体大小">
            <el-input-number @change="(e) => optionChange(e, ['style','fontSize'])" v-model="activeData.style.fontSize" />
          </el-form-item>
          <el-form-item label="容器高度">
            <el-input-number @change="(e) => optionChange(e, ['style','height'])" v-model="activeData.style.height" />
          </el-form-item>
          <el-form-item label="字体位置">
            <el-select
              v-model="activeData.style.justifyContent"
              @change="(e) => optionChange(e, ['style','justifyContent'])"
            >
              <el-option
                v-for="(item, index) in positionList"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="字体样式">
            <el-select
              v-model="activeData.style.fontFamily"
              @change="(e) => optionChange(e, ['style','fontFamily'])"
            >
              <el-option
                v-for="(item, index) in fontFamilyList"
                :label="item"
                :value="item"
              >
                <span :style="{fontFamily: item}">{{ item }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标题背景图">
            <el-select
              v-model="activeData.style.backgroundImage"
              @change="(e) => optionChange(e, ['style','backgroundImage'])"
            >
              <el-option
                v-for="(item, index) in imgList"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="左边距">
            <el-input-number @change="(e) => optionChange(e, ['style','marginLeft'])" type="number" v-model="activeData.style.marginLeft" />
          </el-form-item>
          <el-form-item label="上边距">
            <el-input-number @change="(e) => optionChange(e, ['style','marginTop'])" type="number" v-model="activeData.style.marginTop" />
          </el-form-item>
          <el-form-item label="下边距">
            <el-input-number @change="(e) => optionChange(e, ['style','marginBottom'])" type="number" v-model="activeData.style.marginBottom" />
          </el-form-item>
          <el-form-item label="右边距">
            <el-input-number @change="(e) => optionChange(e, ['style','marginRight'])" type="number" v-model="activeData.style.marginRight" />
          </el-form-item>
        </div>
        <div v-show="activeType === 'chartContainer'">
          <el-form-item label="左边距(内)">
            <el-input-number @change="(e) => optionChange(e, ['style','paddingLeft'])" type="number" v-model="activeData.style.paddingLeft" />
          </el-form-item>
          <el-form-item label="上边距(内)">
            <el-input-number @change="(e) => optionChange(e, ['style','paddingTop'])" type="number" v-model="activeData.style.paddingTop" />
          </el-form-item>
          <el-form-item label="下边距(内)">
            <el-input-number @change="(e) => optionChange(e, ['style','paddingBottom'])" type="number" v-model="activeData.style.paddingBottom" />
          </el-form-item>
          <el-form-item label="右边距(内)">
            <el-input-number @change="(e) => optionChange(e, ['style','paddingRight'])" type="number" v-model="activeData.style.paddingRight" />
          </el-form-item>
        </div>
      </el-form>
      <el-form
        v-show="currentTab === '2'"
        size="small"
        label-width="100px"
      >
        <!--<el-form-item label="容器间隔:">
          <el-input-number v-model="formConf.gutter" />
        </el-form-item>-->
        <el-form-item label="画布排列方向:">
          <el-select
            v-model="formConf.flexDirection"
          >
            <el-option
              v-for="(item, index) in arrangeOption"
              :key="index.toString()"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板主题风格:">
          <el-select
            v-model="formConf.theme"
            @change="changeTemplateTheme"
          >
            <el-option
              v-for="(item, index) in themeFileList"
              :key="index.toString()"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: "AttrPanel",
    props: ['formConf', 'activeData'],
    data() {
      return {
        currentTab: '1',
        arrangeOption: [
          {
            label: '横向',
            value: 'row'
          },
          {
            label: '纵向',
            value: 'column'
          }
        ],
        positionList: ['center', 'left', 'right'],
        themeFileList: this.$theme,
        fontFamilyList: [],
        imgList: [],
        backImgList: [],
        imgGroup: null,
        currentGroupIndex: '',
        currentGroup: '',
        allImage: []
      }
    },
    watch: {
      activeData: {
        handler(news, olds) {
        },
        deep: true
      }
    },
    computed: {
      activeType() {
        return this.activeData.type || ''
      }
    },
    created() {
      /*let modulesFiles = require.context("@/cChart/conf/", true, /\.js$/);
      this.themeFileList = modulesFiles.keys().reduce((modules, modulePath) => {
        const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
        const value = modulesFiles(modulePath);
        modules.push({label: moduleName, value: moduleName})
        return modules;
      }, []);*/
      let fontFamilyFiles = require.context("@/assets/font/", true, /\.OTF|\.ttf|\.TTF$/);
      this.fontFamilyList = fontFamilyFiles.keys().reduce((modules, modulePath) => {
        const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1");
        modules.push(moduleName);
        return modules;
      }, []);
      let imgFiles = require.context("@/assets/dataV/", true, /\.jpg|\.png$/);
      this.imgList = imgFiles.keys().reduce((modules, modulePath) => {
        const moduleName = modulePath.replace(/^\.\/(.*)$/, "$1");
        modules.push(moduleName);
        return modules;
      }, []);
      let backImgFiles = require.context("@/assets/backV/", true, /\.jpg|\.png$/);
      this.backImgList = backImgFiles.keys().reduce((modules, modulePath) => {
        const moduleName = modulePath.replace(/^\.\/(.*)$/, "$1");
        modules.push(moduleName);
        return modules;
      }, []);
    },
    mounted() {
      this.requireImg();
    },
    methods: {
      handleSelect(val) {
        this.currentTab = val;
      },
      changeTemplateTheme(val) {
        this.$emit('changeTemplateTheme', val)
      },
      requireImg() {
        let imgFiles = require.context("@/assets/group/", true, /\.jpg|\.png$/);
        let group = imgFiles.keys().reduce((modules, modulePath) => {
          const moduleName = modulePath.replace(/^\.\/(.*)$/, "$1");
          modules.push(moduleName);
          return modules;
        }, []);
        let groups = Array.from(new Set(Array.from(group.map((item) => item.split('/')[0]))));
        let a = new Object();
        for (let i = 0; i < groups.length; i++) {
          let b = group.filter((item, index) => {
            return item.indexOf(groups[i]) > -1
          }).map((item) => item.split('/')[1]);
          a[groups[i]] = b;
        }
        this.allImage = group;
        this.imgGroup = a;
      },
      optionChange(value, key) {
        console.log(value);
        console.log(key);
        this.$emit('optionChange', key, value);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .attr-panel {
    .center-tabs {
      height: 40px;
    }
    .property-view {
      margin-top: 20px;
      box-sizing: border-box;
      padding: 0 15px;
      ::v-deep .el-form {
        .el-form-item {
          .el-form-item__content {
            display: flex;
            .el-input {
              width: auto;
            }
          }
        }
      }
    }
    .el-menu-demo {
      border-bottom: none;
      .el-menu-item {
        height: 40px;
        line-height: 40px;
        width: 50%;
        color: #666666;
        background: #DCE8F5;
      }
      .el-menu-item.is-active {
        border: none;
        border-top: 2px solid #1569EB;
        color: #1569EB;
        background: #ffffff;
      }
    }
    /*.el-menu--horizontal>.el-menu-item*/
  }
</style>
