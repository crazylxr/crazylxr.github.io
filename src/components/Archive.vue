<template>
    <div id="archive">
        <ul class="list">
          <li class="list-post" v-for="archive in archives" @click="handleClick(archive)">{{ archive.title }}</li>
        </ul>
    </div>
 </template>

<script>
import '../assets/css/list.css'
import { getIssuesForRepo } from '../api/index'

export default {
  data() {
    return {
      archives: []
    };
  },
  created: function() {
    getIssuesForRepo('cobish', 'cobish.github.io')
      .then(data => {
        this.archives = data.data;
      });
  },
  methods: {
    handleClick (archive) {
      this.$router.push({ path: '/post/' + archive.number})
    }
  }
};
</script>
