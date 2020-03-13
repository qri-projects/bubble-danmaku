import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'landing-page',
    //   component: require('@/components/LandingPage').default
    // },
    {
      path: '/danmaku',
      name: 'danmaku_1',
      component: require('@/components/DanmakuPage').default
    },
    {
      path: '/',
      name: 'danmaku',
      component: require('@/components/DanmakuPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
