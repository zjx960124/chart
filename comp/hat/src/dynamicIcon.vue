<template>
  <div class="dynamic-view">
    <div class="back">
      <img
        :src="backIcon"
        alt=""
        v-for="item in backSize"
      >
    </div>
    <div class="info">
      <img
        :src="fullIcon"
        alt=""
        v-for="item in fullNum"
      >
      <img
        :src="halfIcon"
        alt=""
        v-for="item in halfNum"
      >
      <img
        :src="backIcon"
        alt=""
        v-for="item in remainingNum"
      >
    </div>
  </div>
</template>

<script>
  export default {
    name: 'DynamicIcon',
    data() {
      return {
      }
    },
    props: {
      backSize: {
        type: Number,
        default: 5
      },
      halfNum: {
        type: Number,
        default: 0
      },
      fullNum: {
        type: Number,
        default: 0
      },
      remainingNum: {
        type: Number,
        default: 0
      },
      halfIcon: {
        type: String,
        default: '../../../assets/build/mao2.png'
      },
      fullIcon: {
        type: String,
        default: '../../../assets/build/mao1.png'
      },
      backIcon: {
        type: String,
        default: '../../../assets/build/backicon.png'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dynamic-view {
    width: 100%;
    height: 100%;
    position: relative;
    .back {
      width: 100%;
      height: 100%;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: absolute;
      img {
        width: .2rem;
        height: 16px;
      }
    }
    .info {
      width: 100%;
      height: 100%;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: absolute;
      img {
        width: .2rem;
        height: 16px;
      }
    }
  }
</style>
