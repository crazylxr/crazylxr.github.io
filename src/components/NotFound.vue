<template>
<div id="not-found">
    <div class="heart-body">
        <div class="heart-shape">
        </div>
    </div>
    <h1>
        <span class="item1">4</span>
        <span class="item2">0</span>
        <span class="item3">4</span>
    </h1>
    <p>博主吃饭去了，先回<router-link to="/"><span>主页</span></router-link>咯。。。。。</p>
</div>
</template>
<script>
    import '../assets/css/notfound.css'
    export default {
      data () {
        return {
          show: false,
          showLeft: false
        }
      }
    }
</script>
