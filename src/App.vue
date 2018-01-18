<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  import './assets/css/reset.css'

  export default {
    name: 'app'
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #4fc08d;
   margin-top: 60px;
}
</style>
