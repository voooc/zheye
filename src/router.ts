import { createRouter, createWebHistory } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import store from './store'
import CreatePost from './views/CreatePost.vue'
import ColumnDetail from './views/ColumnDetail.vue'
const routerHistory = createWebHistory()
const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiredAlreadyLogin: true }
    },
    {
      path: '/create',
      name: 'create',
      component: CreatePost,
      // 只有登录的用用户才可以创建
      meta: { requiredLogin: true }
    },
    // 动态路由
    {
      path: '/column/:id',
      name: 'column',
      component: ColumnDetail
    }
  ]
})
// 前置守卫：检查是否已经登录
router.beforeEach((to, from, next) => {
  if (to.meta.requiredLogin && !store.state.user.isLogin) {
    next({ name: 'login' })
  } else if (to.meta.requiredAlreadyLogin && store.state.user.isLogin) {
    next('/')
  } else {
    next()
  }
})
export default router
