import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'add',
        component: () => import(/* webpackChunkName: "add" */ './views/addItem.vue')
    },
    {
      path: '/overdue',
      name: 'overdue',
      component: () => import( './views/overdueData.vue')
    },
      {
          path: '/ready',
          name: 'ready',
          component: () => import('./views/readyData.vue')
      },
      {
          path: '/complete',
          name: 'complete',
          component: () => import( './views/completeData.vue')
      },
      {
          path: '/detail',
          name: 'detail',
          component: () => import('./views/detail.vue')
      },
      {
          path: '/rubbish',
          name: 'rubbish',
          component: () => import('./views/rubbish.vue')
      },
      {
          path: '/edit',
          name: 'edit',
          component: () => import('./views/editPage.vue')
      }
  ]
})
