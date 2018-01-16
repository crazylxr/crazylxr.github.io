<template>
    <div id="home">
        <div class="log">
         </div>
        <div class="home">
            <div class="link">
                <router-link to="/archive"><a href="#">归档</a></router-link>
                <a href="#">标签</a>
            </div>
        </div>
   </div>
</template>
<script>
export default {
  name: "index",
  data() {
    return {
    };
  },
  methods: {
  }
};
</script>
<style>
.home {
    position: fixed;
    display: flex;
    width: 500px;
    height: 500px;
    left: 50%;
    top: 50%;
    margin-left: -250px;
    margin-top: -250px;
    justify-content: center;
    align-items: center;
}
</style>
