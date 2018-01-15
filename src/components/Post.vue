<template>
    <div id="post">
{{ post }}
    </div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      post: {}
    }
  },
  created: function () {
    axios.get('https://api.github.com/repos/cobish/cobish.github.io/issues/1')
    .then(data => {
      this.post = data.data.body;
    })
  }
}
</script>
