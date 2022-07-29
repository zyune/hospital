import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home/Home'),
    redirect: '/home/main',
    children: [
      {
        path: 'main',
        name: 'Main',
        component: () => import('@/views/Main/Main'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'waiting',
        name: 'Waiting',
        component: () => import('@/views/Waiting/Waiting'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'admin',
        name: 'Admin',
        component: () => import('@/views/Admin/Admin'),
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: 'user',
            name: 'User',
            component: () => import('@/components/admin/UserAdmin/UserAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'schedule',
            name: 'ScheduleAdmin',
            component: () => import('@/components/admin/ScheduleAdmin/ScheduleAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'registrationlevel',
            name: 'RegistrationLevelAdmin',
            component: () => import('@/components/admin/RegistrationLevelAdmin/RegistrationLevelAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login/Login'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/caller',
    name: 'Caller',
    component: () => import('@/views/Caller/Caller'),
    meta: {
      requiresAuth: false,
    },
  },
];

const router = new VueRouter({
  routes,
});

export default router;
