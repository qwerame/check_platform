import Vue from 'vue'
import VueRouter from 'vue-router'
import listView from "@/views/listView";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'listView',
    component: listView
  },
  {
    path: '/detailView',
    name: 'detailView',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/detailView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
