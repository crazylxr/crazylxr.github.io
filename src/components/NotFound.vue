<template>
<div id="not-found">
    <div class="img_404">
        <img src="http://120.78.133.198/usr/uploads/2018/01/3429802653.png" alt="404">
    </div>
    <div class="tip">
        <img src="http://120.78.133.198/usr/uploads/2018/01/2132576433.png" alt="雷达"/>
        <p>你访问的页面不存在或者暂时无法访问，您可以通过以下方式进行操作</p>
    </div>
    <div class="oprator">
        <button class="btn" @click="handleClick()">原地复活</button>
        <button class="toHome_btn btn" @click="handleClick('/')">回到首页</button>
    </div>
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
      },
      methods: {
          handleClick (route) {
              if (route) {
                  this.$router.push({ path: route});
              }else {
                  location.reload();
              }
          }
      }    
    }
</script>
