<template>
    <div id="post">

    </div>
</template>

<script>
    import Router from 'vue-router'
export default {
  data () {
    return {
      post: {}
    }
  },
  created: function () {
    console.log($route.params.id);
  }
}
</script>
