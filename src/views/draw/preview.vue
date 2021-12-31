<template>
  <div class="preview-view">
    <form-build :options="pageData"></form-build>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'Preview',
    data() {
      return {
        // pageData: {}
      }
    },
    computed: {
      pageData() {
        return JSON.parse(sessionStorage.getItem("pageData"))
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .preview-view {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    background: #000211;
    .btn {
      position: absolute;
      z-index: 2;
    }
  }
</style>
