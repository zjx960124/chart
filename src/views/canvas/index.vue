<template>
  <div class="canvas-view">
    <div
      class="view"
      ref="views"
      @mousedown="handleDown"
      @mousemove="handleDrag"
      @mouseup="handleUp"
    >
      <div class="dom" ref="doms" :style="{'transform': matrix}">
        文字
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Canvas",
    data() {
      return {
        matrix: `matrix(0.5, 0, 0, 0.5, 0, 0)`,
        scaleX: 0.5,
        scaleY: 0.5,
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
        dragY: 0
      }
    },
    mounted() {
      this.$refs.views.addEventListener('mousewheel', this.handleScroll, false);
      this.$refs.views.addEventListener('onMouseMove', this.handleDrag, false);
      this.$refs.views.addEventListener('onmousedown', this.handleDown, false);
      // 居中
      this.$nextTick(() => {
        this.translateX = (this.$refs.views.offsetWidth - (this.$refs.doms.offsetWidth * this.scaleX )) / 2;
        this.translateY = (this.$refs.views.offsetHeight - (this.$refs.doms.offsetHeight * this.scaleY )) / 2;
        let matrix = `matrix(${this.scaleX}, 0, 0, ${this.scaleY}, ${this.translateX}, ${this.translateY})`;
        this.matrix = matrix;
      })
    },
    methods: {
      handleScroll(e) {
        let direction = e.deltaY > 0 ? 'up' : 'down';
        let scale = 1.25; // 倍率
        // 缩放
        let scaleX = direction === 'up' ? this.scaleX * .75 : this.scaleX * scale;
        let scaleY = direction === 'up' ? this.scaleY * .75 : this.scaleY * scale;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
        // 计算缩放的引起的translate 上近下远
        let translateX = this.translateX;
        let translateY = this.translateY;
        let w = this.$refs.doms.offsetWidth;
        let h = this.$refs.doms.offsetHeight;
        let t = this.$refs.views.getBoundingClientRect().top;
        let l = this.$refs.views.getBoundingClientRect().left;
        console.log(l, t);
        let matrix = `matrix(${scaleX}, 0, 0, ${scaleY}, ${this.translateX}, ${this.translateY})`;
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
        console.log(nx, ny, nl, nt, matrix);
        this.matrix = matrix;
        this.dragX = translateX;
        this.dragY = translateY;
      },
      handleDown(e) {
        //获取x坐标和y坐标
        this.x = e.clientX;
        this.y = e.clientY;

        //获取左部和顶部的偏移量
        this.l = e.offsetX;
        this.t = e.offsetY;
        console.log(e)
        //开关打开
        this.isDown = true;
        //设置样式
      },
      handleUp() {
        this.isDown = false;
        this.translateX = this.dragX;
        this.translateY = this.dragY;
        this.dragX = 0;
        this.dragY = 0;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .canvas-view {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .view {
      width: 90%;
      height: 80%;
      outline: none !important;
      position: relative;
      background-color: #DCE6F5;
      cursor: grab;
      overflow: hidden;
      user-select: none;
      .dom {
        width: 100%;
        height: 100%;
        transform-origin: 0px 0px 0px;
        background-color: azure;
      }
    }
  }
</style>
