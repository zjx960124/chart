<template>
  <div id="app">
    <page-build :options="pageData"></page-build>
  </div>
</template>

<script>
  export default {
    name: 'App',
    data() {
      return {
        baseIndex: 0,
        pageList: [],
        pageData: {}
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      getData() {
        this.http.get("/cs.json").then(res=> {
          console.log(res);
          this.pageList = res;
          this.pageData = this.pageList[this.baseIndex];
        }).catch(err => {
        });
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    width: 100vw;
    height: 100vh;
    overflow-x: hidden;
  }
  * {
    margin: 0;
    padding: 0;
  }
</style>
