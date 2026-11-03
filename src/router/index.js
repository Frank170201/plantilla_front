// composables
import { createRouter, createWebHistory } from 'vue-router'
import { useUtils } from '@/plugins/utils'
import perfilesRouter from "@/views/perfiles/router";
import rolesRouter from "@/views/roles/router";
import rutasRouter from "@/views/rutas/router";
import { LocalStorage } from '@/utils/LocalStorage'
import faqRouter from '@/views/faq/router';
import marketApi from '@/services/mercado.services';

const { canNavigate } = useUtils()

const routes = [
  {path:'/acceso',name:'accessLanding',component:()=>import('@/views/market/MarketPanel.vue'),meta:{requiresAuth:true,marketRole:'landing'}},
  {path:'/administracion',name:'marketAdmin',component:()=>import('@/views/market/AdminPanel.vue'),meta:{requiresAuth:true,marketRole:'admin'}},
  {path:'/mi-cuenta',name:'customerAccount',component:()=>import('@/views/market/CustomerAccount.vue'),meta:{requiresAuth:true,marketRole:'customer'}},
  {
    path: '/',
    name: 'marketCatalog',
    component: () => import('@/views/market/MarketCatalog.vue'),
  },
  {
    path: '/mi-negocio',
    name: 'marketPanel',
    component: () => import('@/views/market/MarketPanel.vue'),
    meta: { requiresAuth: true, marketRole:'merchant' },
  },
  {
    path: '/institucional',
    component: () => import('@/layouts/PublicLayout.vue'),
    children: [

    ]
  },
  {
    path: '/',
    component: () => import('@/layouts/DashboardLayout.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import(/* webpackChunkName: "home" */ '@/views/DashboardView.vue'),
      },
      ...perfilesRouter,
      ...rolesRouter,
      ...rutasRouter,
      ...faqRouter,
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/AboutView.vue'),
      },
    ],
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/registro-exitoso',
    name: 'registro-exitoso',
    component: () => import('@/views/RegistroExitoso.vue'),
  },
  {
    path: '/verificar',
    name: 'verificar',
    component: () => import('@/views/verificar.vue'),
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    component: () => import('@/views/ForbiddenView.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    name: '404',
    component: () => import('@/views/ForbiddenView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Rutas públicas
  const params = new URLSearchParams(window.location.search);
  const origen = params.get('origin_app');

  if (!requiresAuth && LocalStorage.token && to.name === 'login' && !origen && !to.query.access_error) {
    return next({ name: 'accessLanding' });
  }

  if (!requiresAuth) {
    return next();
  }

  // Rutas privadas
  if (!LocalStorage.token) {
    return next('/login');
  }

  if (to.meta.marketRole) {
    try {
      const {data}=await marketApi.access();
      if(to.meta.marketRole==='landing' || data.role!==to.meta.marketRole)return next(data.home);
      return next();
    } catch(error) {
      if(error.response?.status===401){LocalStorage.token=null;LocalStorage.refresh_token=null;}
      return next({name:'login',query:{access_error:'1'}});
    }
  }

  if (to.name !== 'marketPanel'  && LocalStorage.token && !(await canNavigate(to))) {
    LocalStorage.token = null;
    LocalStorage.refresh_token = null;
    return next('/forbidden');
  }

  return next();
});

export default router
