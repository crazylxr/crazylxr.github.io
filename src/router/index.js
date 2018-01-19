import Vue from 'vue'
import Router from 'vue-router'
// 全加载
import Index from '../components/Index'
import Archive from '../components/Archive'
import Post from '../components/Post'
import Tag from '../components/Tag'
import TagList from '../components/TagList'
import NotFound from '../components/NotFound.vue'
// 懒加载
// const Index = () => import('../components/Index')

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Index },
    { path: '/archive', component: Archive },
    { path: '/post/:id', component: Post },
    { path: '/tags', component: Tag },
    { path: '/tags/:label', component: TagList },
    { path: '*', component: NotFound}]
})
