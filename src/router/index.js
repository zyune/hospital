import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '@/store';
import { getUserInfo } from '@/api/user';

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
          {
            path: 'paytype',
            name: 'PayTypeAdmin',
            component: () => import('@/components/admin/PayTypeAdmin/PayTypeAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'nonmedicineproject',
            name: 'NonMedicineProjectAdmin',
            component: () => import('@/components/admin/NonMedicineProjectAdmin/NonMedicineProjectAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'disease',
            name: 'DiseaseAdmin',
            component: () => import('@/components/admin/DiseaseAdmin/DiseaseAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'department',
            name: 'DepartmentAdmin',
            component: () => import('@/components/admin/DepartmentAdmin/DepartmentAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'arrangementrule',
            name: 'ArrangementRuleAdmin',
            component: () => import('@/components/admin/ArrangementRuleAdmin/ArrangementRuleAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'arrangement',
            name: 'ArrangementAdmin',
            component: () => import('@/components/admin/ArrangementRuleAdmin/ArrangementAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: 'outpatientdoctor/:roleId',
        name: 'OutPatientDoctor',
        component: () => import('@/views/OutPatientDoctor/OutPatientDoctor'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'techdoctor',
        name: 'TechDoctor',
        component: () => import('@/views/TechDoctor/TechDoctor'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'treatmentstation',
        name: 'TreatmentStation',
        component: () => import('@/views/TreatmentStation/TreatmentStation'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'cashier',
        name: 'Cashier',
        component: () => import('@/views/Cashier/Cashier'),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: 'finicialadmin',
        name: 'FinicialAdmin',
        component: () => import('@/views/FinicialAdmin/FinicialAdmin'),
        meta: {
          requiresAuth: true,
        },
        children: [
          {
            path: 'dailycheck',
            name: 'Dailycheck',
            component: () => import('@/components/finicialadmin/DailyCheck/DailyCheck'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'departmentworkloadanalysis',
            name: 'DepartmentWorkloadanalysis',
            component: () => import('@/components/finicialadmin/DepartmentWorkloadAnalysis/DepartmentWorkloadAnalysis'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'priceadmin',
            name: 'PriceAdmin',
            component: () => import('@/components/finicialadmin/PriceAdmin/PriceAdmin'),
            meta: {
              requiresAuth: true,
            },
          },
          {
            path: 'userworkloadanalysis',
            name: 'UserWorkloadAnalysis',
            component: () => import('@/components/finicialadmin/UserWorkloadAnalysis/UserWorkloadAnalysis'),
            meta: {
              requiresAuth: true,
            },
          },
        ],
      },
      {
        path: 'drugstation',
        name: 'DrugStation',
        component: () => import('@/views/DrugStation/DrugStation'),
        meta: {
          requiresAuth: true,
        },
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

const whiteList = ['/login'];
// 每次跳转前检查登陆状态，如果未登陆，则路由至登陆页面
router.beforeEach((to, from, next) => {
  // console.log('haha');
  // console.log(store.getters['user/currentUserId']);
  // console.log(store.getters['user/token'], to.matched);
  // if (to.matched.some((record) => record.meta.requiresAuth)) {
  //   console.log('00000');
  //   // this route requires auth, check if logged in
  //   // if not, redirect to login page.
  //   console.log('验证是否有token');
  //   console.log(store.getters['user/token']);
  //   if (!store.getters['user/token']) {
  //     console.log('111');
  //     next({
  //       path: '/login',
  //       query: {
  //         redirect: to.fullPath,
  //       },
  //     });
  //   } else if (store.getters['user/currentUserId'] === '') {
  //     console.log('111233');
  //     // 如果login后必定加载的信息还没被加载，则发送请求加载
  //     getUserInfo(store.getters['user/token']).then(
  //       (response) => {
  //         const data = response.data.data;
  //         console.log(data);
  //         store.commit('user/setName', data.datauserName);
  //         store.commit('user/setId', data.userId);
  //         store.commit('user/setAvatar', data.avatar);
  //         store.commit('user/setRoles', data.roles);
  //         next();
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  //   } else {
  //     next();
  //   }
  // } else {
  //   next();
  // }
  if (store.getters['user/token']) {
    if (to.path === '/login') {
      next('/');
    }
    if (store.getters['user/currentUserId'] === '') {
      // 如果login后必定加载的信息还没被加载，则发送请求加载
      getUserInfo(store.getters['user/token']).then(
        (response) => {
          const data = response.data.data;
          console.log(data);
          store.commit('user/setName', data.datauserName);
          store.commit('user/setId', data.userId);
          store.commit('user/setAvatar', data.avatar);
          store.commit('user/setRoles', data.roles);
          next();
        },
        (error) => {
          console.log(error);
        }
      );
    }
    next();
  } else {
    // 到登录页面
    // 没有token的情况下，可以进入白名单
    if (whiteList.indexOf(to.path) > -1) {
      next();
    } else {
      next('/login');
    }
  }
});

export default router;
