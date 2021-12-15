<template>
  <div
    class="react-picture-viewer"
    ref="viewPort"
    @mouseleave="handleMouseLeave"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  >
    <slot
    ></slot>
  </div>
</template>

<script>

  export default {
    name: 'Viewport',
    props: {
      msg: String
    },
    data() {
      let state = {
        focus: false, // 鼠标是否按下，处于可拖动状态
        baseWidth: 0,
        baseHeight: 0,
        domWidth: 0, // 图片宽度
        domHeight: 0, // 图片高度
        startX: 0, // 鼠标按下时，距离 viewport 的初始 X 位置
        startY: 0, // 鼠标按下时，距离 viewport 的初始 Y 位置
        startLeft: 0, // 图片距离 viewport 的初始 Left
        startTop: 0, // 图片距离 viewport 的初始 Top
        currentLeft: 0, // 图片当前距离 viewport 的 left
        currentTop: 0, // 图片当前距离 viewport 的 top
        scale: 1 // 图片缩放比率 minimum - maximum
      };
      return {
        state,
        viewportDom: null,
        contentDom: null,
        option: {
          id: 'viewport',
          width: 1920,
          height: 969,
          minimum: 0.4,
          maximum: 8,
          rate: 10,
          center: true,
          contain: true, // 图片尺寸是否初始包含在视口范围内
          cover: true, // 图片尺寸是否平铺显示
          children: '',
          className: ''
        },
        drawingList: []
      }
    },
    mounted() {
      this.viewportDom = this.$refs.viewPort;
      this.contentDom = document.getElementsByClassName('img-scroll')[0];
      this.initViewport(this.$refs.viewPort.clientWidth, this.$refs.viewPort.clientHeight);
      // 这边需要将滚轮事件使用原生绑定来处理
      // 从而解决新版本 chrome 浏览器带来的 passive event listener
      // 在对图片进行滚动缩放时无法使用 e.preventDefault 来禁用浏览器滚动问题
      this.contentDom.addEventListener('wheel', this.handleMouseWheel, { passive: false });
      this.setState(
        {
          domWidth: this.contentDom.clientWidth,
          domHeight: this.contentDom.clientHeight,
          baseWidth: this.contentDom.clientWidth,
          baseHeight: this.contentDom.clientHeight
        }
      );
      console.log(this.state)
      this.initPicture()
    },
    methods: {
      setState(obj) {
        this.state = {...this.state, ...obj};
      },
      /**
       * 图片初始化，包括：
       * 1. 初始图片位置居中
       * 2. 记录初始图片尺寸
       * @param nextProps
       */
      initPicture(nextProps = {}) {
        nextProps = nextProps || this.option;

        const { center, contain, cover } = nextProps;
        // const callback = center ? this.changeToCenter : this.changeToBasePoint;

        // 对比viewPort contentDom 大小
        let scale = this.contrastDom();

        console.log(scale)
        this.state.scale = scale;
        console.log(this.state.scale)

        this.changeSize();
        this.changeToCenter();

        // 这块有个执行顺序
        // 必须是先确定尺寸，再确定位置
        if (contain) {
          // this.changeToContain(this.contentDom, callback)
        } else if (cover) {
          // this.changeToCover(this.contentDom, callback)
        } else {
          console.log(center)
          /*this._getImageOriginSize(this.contentDom).then(({ width: domWidth, height: domHeight }) => {
            /!*this.setState({
              scale: 1,
              domWidth,
              domHeight
            }, callback)*!/
            console.log(callback, domWidth, domHeight)
          }).catch(e => {
            console.error(e)
          })*/
        }
      },
      /**
       * 初始化拖拽区域
       */
      initViewport(width, height) {
        // 如果是字符串，就将字符串作为尺寸设置；否则是数字的话，就在后面加 px 设置
        this.viewportDom.style.width =  `${width}px`;
        this.viewportDom.style.height = `${height}px`;
      },
      /**
       * 设置图片位置为 center
       */
      changeToCenter() {
        console.log(this.state);
        const { domWidth, domHeight } = this.state;
        const [ viewportDom ] = [ this.viewportDom ]
        const [ viewPortWidth, viewPortHeight ] = [ viewportDom.clientWidth, viewportDom.clientHeight ]
        // 设置图片默认位置居中
        const [ top, left ] = [ (viewPortHeight - domHeight) / 2, (viewPortWidth - domWidth) / 2 ]
        const contentDom = this.contentDom;
        console.log(top, left);
        this.setState({
          currentLeft: left,
          currentTop: top,
          startLeft: left,
          startTop: top
        });
        contentDom.style.left = `${left}px`
        contentDom.style.top = `${top}px`
      },
      /**
       * 设置图片位置为基准点位置
       * 基准点位置，基于视口: top: 0 && left: 0
       */
      changeToBasePoint() {
        this.setState({
          currentLeft: 0,
          currentTop: 0,
          startLeft: 0,
          startTop: 0
        })
      },
      /**
       * 设置图片尺寸为 cover
       */
      changeToCover(src, callback) {
        src = src || this.props.src

        this._getImageOriginSize(src).then(({ width: imageOriginWidth, height: imageOriginHeight }) => {
          const { imageWidth, imageHeight } = this.recalcImageSizeToCover(imageOriginWidth, imageOriginHeight)
          this.setState({
            scale: 1,
            imageWidth,
            imageHeight
          }, () => { callback(imageWidth, imageHeight) })
        }).catch(e => {
          console.error(e)
        })
      },
      /**
       * 设置图片尺寸为 contain
       * @param src {String} 需要操作的图片的 src
       * @param callback {Function} changeToContain 完成后的回调函数，接受更新后的图片尺寸，即 imageWidth 和 imageHeight 两个参数
       */
      changeToContain(contentDom, callback) {
        contentDom = contentDom || this.contentDom;

        this._getImageOriginSize(contentDom).then(({ width: imageOriginWidth, height: imageOriginHeight }) => {
          const { imageWidth, imageHeight } = this.recalcImageSizeToContain(imageOriginWidth, imageOriginHeight);
          this.setState({
            scale: 1,
            imageWidth,
            imageHeight
          }, () => { callback(imageWidth, imageHeight) })
        }).catch(e => {
          console.error(e)
        })
      },
      /**
       * 获取图片原始尺寸信息
       * @param image
       * @returns {Promise<any>}
       * @private
       */
      _getImageOriginSize(contentDom) {
        contentDom = contentDom || this.contentDom;
        return new Promise(resolve => {
          let width = contentDom.clientWidth;
          let height = contentDom.clientHeight;
          resolve({
            width,
            height
          })
        })
      },
      /**
       * 获取鼠标当前相对于某个元素的位置
       * @param e        {object}    原生事件对象
       * @param target {DOMobject} 目标DOM元素
       * @return object 包括offsetLeft和offsetTop
       *
       * Tips:
       * 1.offset 相关属性在 display: none 的元素上失效，为0
       * 2.offsetWidth/offsetHeight 包括border-width，clientWidth/clientHeight不包括border-width，只是可见区域而已
       * 3.offsetLeft/offsetTop 是从当前元素边框外缘开始算，一直到定位父元素的距离，clientLeft/clientTop其实就是border-width
       */
      _getOffsetInElement(e, target) {
        let currentDOM = e.target || e.toElement;
        if (!this._inTargetArea(currentDOM, target)) return null;
        let left, top, right, bottom;
        const { left: x, top: y } = this._getOffset(target);
        left = e.clientX - x;
        top = e.clientY - y;
        right = target.offsetWidth - left;
        bottom = target.offsetHeight - top;
        return { top, left, right, bottom };
      },
      /**
       * 判断一个DOM元素是否包裹在另一个DOM元素中【父子关系或者层级嵌套都可以】
       * @param  {Object} DOM         事件对象中的event.target/或者是需要检测的DOM元素
       * @param  {Object} targetDOM   作为限制范围的DOM元素
       * @return {Boolean}            true----是包裹关系，false----不是包裹关系
       */
      _inTargetArea(DOM, targetDOM) {
        if (DOM === targetDOM) return true;
        let parent = DOM.parentNode;
        while (parent != null) {
          if (parent === targetDOM) return true;
          DOM = parent;
          parent = DOM.parentNode;
        }
        return false
      },
      /**
       * 获取某个 DOM 元素相对视口的位置信息
       * @param el {object} 目标元素
       * @return object {object} 位置信息对象
       */
      _getOffset (el) {
        const doc = document.documentElement
        const docClientWidth = doc.clientWidth
        const docClientHeight = doc.clientHeight
        let positionInfo = el.getBoundingClientRect();
        return {
          left: positionInfo.left,
          top: positionInfo.top,
          right: docClientWidth - positionInfo.right,
          bottom: docClientHeight - positionInfo.bottom
        }
      },
      /**
       * 处理滚轮缩放
       * @param e {Event Object} 事件对象
       */
      handleMouseWheel(e)  {
        // const contentDom = this.contentDom;
        const { minimum, maximum, rate } = this.option;
        const { scale } = this.state;
        // const { currentLeft, currentTop, scale } = this.state;
        // const [ domWidth, domHeight ] = [ contentDom.clientWidth, contentDom.clientHeight ] ;
        const event = e.nativeEvent || e;
        event.preventDefault();

        // 这块的 scale 每次都需要用 1 去加，作为图片的实时缩放比率
        let newScale = scale + event.wheelDelta / (12000 / rate);
        console.log(newScale);

        // 最小缩放至 minimum 就不能再缩小了
        // 最大放大至 maximum 倍就不能再放大了
        if ((newScale <= minimum && scale < 1) || (newScale >= maximum && scale > 1)) return;

        /*// 真实的图片缩放比率需要用尺寸相除
        let nextScale = domWidth * scale / originWidth;

        // 进行缩放比率检测
        // 如果小于最小值，使用原始图片尺寸和最小缩放值
        // 如果大于最大值，使用最大图片尺寸和最大缩放值
        nextScale = nextScale <= minimum ? minimum : nextScale >= maximum ? maximum : nextScale;*/

        // 缩放后Dom宽度，高度
        // let currentImageWidth = newScale * originWidth;
        // let currentImageHeight = newScale * originHeight;


        // let { left, top } = this._getOffsetInElement(e, this.contentDom);
        // let rateX = left / domWidth;
        // let rateY = top / domHeight;
        // let newLeft = rateX * currentImageWidth;
        // let newTop = rateY * currentImageHeight;

        this.setState({
          scale: newScale,
          // startLeft: currentLeft + (left - newLeft),
          // startTop: currentTop + (top - newTop),
          // currentLeft: currentLeft + (left - newLeft),
          // currentTop: currentTop + (top - newTop)
        })
        this.changeSize();
      },
      /**
       * 处理鼠标移出
       */
      handleMouseLeave() {
        this.handleMouseUp()
      },
      /**
       * 处理鼠标放开
       */
      handleMouseUp() {
        const { currentLeft, currentTop } = this.state;
        this.setState({
          focus: false,
          startX: 0,
          startY: 0,
          startLeft: currentLeft,
          startTop: currentTop
        })
      },
      /**
       * 处理鼠标按下
       * @param e
       */
      handleMouseDown(e) {
        const currentDOM = e.target || e.toElement;
        if (currentDOM !== this.contentDom) return;
        let { top: startY, left: startX } = this._getOffsetInElement(e, this.viewportDom);
        this.setState({
          focus: true,
          startX,
          startY
        })
      },
      /**
       * 处理鼠标移动
       * @param e
       */
      handleMouseMove(e) {
        const { focus, startX, startY, startTop, startLeft } = this.state;
        const contentDom = this.contentDom;
        if (!focus) return

        let { left: currentX, top: currentY } = this._getOffsetInElement(e, this.viewportDom)
        let [ diffX, diffY ] = [ currentX - startX, currentY - startY ]

        this.setState({
          currentLeft: startLeft + diffX,
          currentTop: startTop + diffY
        })
        contentDom.style.left = `${startLeft + diffX}px`
        contentDom.style.top = `${startTop + diffY}px`
      },
      /**
       * 对比viewPort, contentDom大小
       */
      contrastDom(viewportDom, contentDom) {
        contentDom = contentDom || this.contentDom;
        viewportDom = viewportDom || this.viewportDom;
        let viewPortLine = Math.sqrt(Math.pow(viewportDom.clientWidth,2) + Math.pow(viewportDom.clientHeight,2));
        let contentLine = Math.sqrt(Math.pow(contentDom.clientWidth,2) + Math.pow(contentDom.clientHeight,2));
        return 0.95 / (contentLine / viewPortLine);
      },
      /**
       * 调整尺寸
       * @param width
       * @param height
       */
      changeSize() {
        const contentDom = this.contentDom;
        const { baseWidth, baseHeight, scale} = this.state;
        const currentImageWidth = scale * baseWidth;
        const currentImageHeight = scale * baseHeight;
        // contentDom.style.maxWidth = imgDOM.style.maxHeight = 'none'
        contentDom.style.width = `${currentImageWidth}px`
        contentDom.style.height = `${currentImageHeight}px`
        this.setState({domWidth: currentImageWidth, domHeight: currentImageHeight});
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .react-picture-viewer {
    position: relative;
    display: block;
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  .react-picture-viewer .img-scroll {
    cursor: move;
    position: absolute;
    background: red;
  }
</style>
