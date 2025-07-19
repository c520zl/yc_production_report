import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/modules/user';

// 公共路由
const publicRoutes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  }
];

// 私有路由（需登录访问）
const privateRoutes = [
  {
    path: '/',
    name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '数据看板' }
      },
      {
        path: 'reports/production',
        component: () => import('@/views/reports/production.vue'),
        meta: { title: '生产报表' }
      },
      {
        path: 'profile',
        component: () => import('@/views/profile/index.vue'),
        meta: { title: '个人中心' }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...publicRoutes, ...privateRoutes],
  scrollBehavior: () => ({ top: 0 })
});

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const token = localStorage.getItem('token');
  console.log('路由守卫 - 目标路由:', to.name, '路径:', to.path, '当前token:', token);

  // 未登录访问私有路由，重定向到登录页
  if (!token && to.name !== 'login') {
    console.log('未登录，重定向到登录页');
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // 已登录访问登录页，重定向到主页
  if (token && to.name === 'login') {
    console.log('已登录，重定向到dashboard');
    return next({ name: 'dashboard' });
  }

  console.log('允许访问目标路由:', to.name);
  next();
});

export default router;