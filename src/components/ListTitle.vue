<template>
    <div id="list">
        <ul class="list">
            <li class="list-post" v-for="(archive, index) in archives">
                <h2 class="title" v-if="typeof archive !== 'object'">{{ archive }}</h2>
                <div  @click="handleClick(archive)" v-else>
                    <a href="#">{{ archive.title }}</a>
                    <span class="date-long">{{ archive.created_at.substr(0, 10) }}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import '../assets/css/list.css'
import { getIssuesForRepo } from '../api/index'
import CONFIG from '../assets/config'

export default {
  props: [ 'archives' ],
  methods: {
    handleClick (archive) {
      this.$router.push({ path: '/post/' + archive.number})
    }
  }
}
</script>
