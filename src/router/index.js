import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import OrderLayout from '@/layout/order'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    redirect: '/order'
  },

  {
    path: '/order',
    redirect: '/order/list',
    name: 'Order',
    component: OrderLayout,
    hidden: true,
    meta: {
      title: '工单'
    },
    children: [{
      path: 'list',
      redirect: '/order/list/main',
      name: 'OrderList',
      component: () => import('@/components/order-wrap'),
      meta: {
        title: '工单概览'
      },
      children: [
        {
          path: 'main',
          component: () => import('@/views/order-list/index')
        },
        {
          path: 'add',
          name: 'OrderAdd',
          component: () => import('@/views/order-add/index'),
          meta: {
            title: '新建工单'
          }
        },
        {
          path: 'edit',
          name: 'OrderEdit',
          component: () => import('@/views/order-edit/index'),
          meta: {
            title: '编辑工单'
          }
        },
        {
          path: 'upload',
          name: 'OrderUpload',
          component: () => import('@/views/preview-upload/index'),
          meta: {
            title: '上传文件'
          }
        }
      ]
    }]
  },

  {
    path: '/admin',
    name: 'Admin',
    component: Layout,
    redirect: '/admin/index',
    meta: { title: '控制面板' },
    children: [{
      path: 'index',
      name: 'admin',
      component: () => import('@/views/admin/index'),
      meta: { title: '用户管理', icon: 'user' }
      // children: [
      //   {
      //     path: 'user-list',
      //     name: 'users',
      //     component: () => import('@/views/admin/user-list'),
      //     meta: { title: '用户管理' }
      //   },
      //   {
      //     path: 'user-edit',
      //     name: 'userEdit',
      //     component: () => import('@/views/admin/user-edit'),
      //     meta: { title: '用户编辑' }
      //   }
      // ]
    }]
  },

  {
    path: '/template',
    component: Layout,
    redirect: '/template/index',
    children: [{
      path: 'index',
      name: 'template',
      component: () => import('@/views/order-template/index'),
      meta: { title: '工单模板', icon: 'example' }
    }]
  },

  // {
  //   path: '/manage',
  //   component: Layout,
  //   redirect: '/manage/index',
  //   children: [{
  //     path: 'index',
  //     name: 'manage',
  //     component: () => import('@/views/web-manage/index'),
  //     meta: { title: '网站管理', icon: 'manage' }
  //   }]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
