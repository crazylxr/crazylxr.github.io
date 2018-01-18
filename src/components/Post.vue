<template>
<div id="post" class="article article-content">
    <div class="title">
        <h1>{{ title }}</h1>
    </div>
    <p class="meta">{{ meta }}</p>
    <div class="content" v-html="content"></div>
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
      title: '',
      meta: '',
      content: ''
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
        this.title = data.data.title;
        this.meta = data.data.created_at.substr(0, 10);
      this.content = marked(data.data.body);
    })
  },
  computed: {
    meta: function () {
      return this.meta.substr(0, 10)
    }
  }
}
</script>

<style>
    .title h1{
        text-align: center;
    }
</style>
