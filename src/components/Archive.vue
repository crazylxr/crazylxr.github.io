<template>
    <div id="archive">
        <ul>
          <li v-for="archive in archives">{{ archive.title }}</li>
        </ul>
    </div>
 </template>

<script>
import axios from "axios";
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
  }
};
</script>
