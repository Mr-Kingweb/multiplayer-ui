import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    meta: {requiresAuth: true},
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 设置路由拦截
router.beforeEach((to, from, next) => {
  // 获取 meta 字段的值，判断是否需要进行拦截
  const requiresAuth = to.meta.requiresAuth;
  const key = to.query.key;
  if (requiresAuth && typeof key === 'string' && window.sessionStorage.getItem(key) === key) {
    next(); // 用户已认证，继续导航到目标路由
  }
  else if((requiresAuth && typeof key === 'string' && window.sessionStorage.getItem(key) !== key)||(requiresAuth && key === undefined)){
    next('/')
  }
  else {
    next(); // 不需要拦截的路由，直接导航到目标路由
  }
});
export default router
