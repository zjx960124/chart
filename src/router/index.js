import Vue from 'vue'
import Router from 'vue-router'
import Menu from '@/components/menu';

Vue.use(Router);


const constantRoutes = [
  {
    path: '/',
    redirect: '/home/projectManagement'
  },
  {
    path: '/home',
    component: Menu,
    children: [
      {
        path: 'projectManagement',
        name: 'projectManagement',
        component: () => import('@/views/projectManagement/index'),
        meta: {
          title: '项目管理',
          icon: ''
        }
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/projectManagement/editProject'),
        meta: {
          title: '项目编辑',
          icon: ''
        }
      },
      {
        path: 'templateSelect',
        name: 'templateSelect',
        component: () => import('@/views/projectManagement/templateSelect'),
        meta: {
          title: '模板选择',
          icon: ''
        }
      },
      {
        path: 'editPage',
        name: 'editPage',
        component: () => import('@/views/draw/index'),
        meta: {
          title: '编辑器',
          icon: ''
        }
      },
      {
        path: 'tempManagement',
        name: 'tempManagement',
        component: () => import('@/views/tempManagement/index'),
        meta: {
          title: '模板管理',
          icon: ''
        }
      },
      {
        path: 'componentGallery',
        name: 'componentGallery',
        component: () => import('@/views/componentGallery/index'),
        meta: {
          title: '组件库',
          icon: ''
        }
      },
      {
        path: 'componentDeploy',
        name: 'componentDeploy',
        component: () => import('@/views/componentGallery/deploy/index'),
        meta: {
          title: '组件编辑',
          icon: ''
        }
      },
      {
        path: 'dataManager',
        name: 'dataManager',
        component: () => import('@/views/dataManager/index'),
        meta: {
          title: '数据管理',
          icon: ''
        }
      },
    ]
  },
  {
    path: '/preview',
    name: 'preview',
    component: () => import('@/views/draw/preview')
  },
  {
    path: '/development',
    name: 'development',
    component: () => import('../../examples/views/index')
  }
];

const router = new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
});

export default router
