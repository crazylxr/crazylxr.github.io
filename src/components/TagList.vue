<template>
    <div id="tag-list">
        <ListTitle :archives="archives"></ListTitle>
    </div>
</template>

<script>
import ListTitle from './ListTitle.vue'
import { fetchIssuesForLabel } from '../api/index.js'

export default {
  data () {
    return {
      archives: []
    }
  },
  components: { ListTitle },
  created () {
    const label = this.$route.params.label;

    fetchIssuesForLabel(label)
      .then(data => {
        this.archives = [label].concat(data.data);
      })
  }
}
 </script>
