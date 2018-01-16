<template>
    <div v-html="post" id="post" class="article article-content">
    </div>
</template>

<script>
import axios from 'axios'
import marked from 'marked'
import hljs from 'highlight.js'
import '../assets/css/zenburn.css'
import '../assets/css/article.css'
import { getSingleIssue } from '../api/index'

export default {
  data () {
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
    
    getSingleIssue('cobish', 'cobish.github.io', this.$route.params.id)
    .then(data => {
      this.post = marked(data.data.body);
    })
  }
}
</script>
