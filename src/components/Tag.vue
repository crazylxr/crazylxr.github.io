<template>
<div id="tag" class="tag">
    <h2>目前总计{{ labels.length }}个标签</h2>
    <div class="tags">
        <a class="tag-item"  @click="handleClick(label)" v-for="label in labels">{{ label.name }}</a>
    </div>
</div>
</template>

<script>
import { getLabels } from '../api/index'
import '../assets/css/tag.css'

export default {
  data () {
    return {
      labels: []
    }
  },
  created: function () {
    getLabels()
      .then((data) => {
        this.labels = data.data;
      })
  },
  methods: {
    handleClick(label) {
      this.$router.push({ path: '/tags/' + label.name});
    }
  }
}
</script>
