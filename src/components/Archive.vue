<template>
    <div id="archive">
        <ul class="list">
          <li class="list-post" v-for="archive in archives" @click="handleClick(archive)">{{ archive.title }}</li>
        </ul>
    </div>
 </template>

<script>
import axios from "axios";
import '../assets/list.css'

export default {
  data() {
    return {
      archives: []
    };
  },
  created: function() {
    axios
      .get("https://api.github.com/repos/cobish/cobish.github.io/issues")
      .then(data => {
        this.archives = data.data;
        console.log(data);
      });
  },
  methods: {
    handleClick (archive) {
      this.$router.push({ path: '/post/' + archive.number})
    }
  }
};
</script>
