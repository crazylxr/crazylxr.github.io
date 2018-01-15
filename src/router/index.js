import Vue from 'vue'
import Router from 'vue-router'

// 全加载
 import Index from '../components/Index'
import Archive from '../components/Archive'
import Post from '../components/Post'
// 懒加载
// const Index = () => import('../components/Index')

Vue.use(Router)

export default new Router({
  routes: [
    { path: '/', component: Index },
    { path: '/archive', component: Archive},
    { path: '/post/:id', component: Post}]
})
