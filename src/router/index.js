import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'signin',
    component: () => import('@/views/SignIn.vue'),
  },
  {
    path: '/extraction',
    name: 'extraction',
    component: () => import('@/views/Extraction.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes,
});

export default router;
