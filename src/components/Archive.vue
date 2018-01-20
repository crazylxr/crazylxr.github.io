<template>
    <div id="archive">
        <ListTitle :archives="archives"></ListTitle>
    </div>
 </template>

<script>
import '../assets/css/list.css'
import { getIssuesForRepo } from '../api/index'
import ListTitle from './ListTitle.vue'
import CONFIG from '../assets/config'

export default {
  data() {
    return {
      archives: []
    };
  },
  components: { ListTitle },
  created: function() {
    console.log('fff', this.archives)
    getIssuesForRepo(CONFIG.owner, CONFIG.repo)
      .then(data => {
        this.archives = this.translatePostData(data.data);
      });
  },
  methods: {
    /*
     * 为了按年归档，把年也加入到数组里，然后用类别渲染出来
     */
    translatePostData(posts) {
      // 如果没有文章直接返回
      if (posts.length === 0) {
        return
      }

      const archives = [];
      let year = new Date(posts[0].created_at).getFullYear();

      archives.push(year);

      posts.forEach((item) => {
        const itemYear = new Date(item.created_at).getFullYear();

        if (year != itemYear) {
          archives.push(itemYear);
          year = itemYear;
        }else{
          archives.push(item);
        }
      })

      return archives;
    }
  }
};
</script>
