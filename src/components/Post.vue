<template>
    <div v-html="post" id="post" class="article article-content">
    </div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import hljs from 'highlight.js'
import '../assets/zenburn.css'
import '../assets/article.css'

export default {
  data () {
    console.log(this.$route.params)
    return {
      post: {}
    }
  },
  created: function () {
    marked.setOptions({
      highlight: code => {
        return hljs.highlightAuto(code).value;
      }
    })
    console.log(this.$router);

    axios.get('https://api.github.com/repos/cobish/cobish.github.io/issues/' + this.$route.params.id)
    .then(data => {
      this.post = marked(data.data.body);
    })
  }
}
</script>
