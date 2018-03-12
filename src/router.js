import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import About from './views/About.vue'
import Put from './views/Put.vue'
import Get from './views/Get.vue'
import My from './views/My.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/put',
      name: 'put',
      component: Put
    },
    {
      path: '/get',
      name: 'get',
      component: Get
    },
    {
      path: '/my',
      name: 'my',
      component: My
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})
