import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Print from '@/layout/print'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will become nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will not redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard', affix: true }
      }
    ]
  },
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
    component: Layout,
    redirect: '/comic/list'
  },

  {
    path: '/customer',
    component: Layout,
    redirect: '/customer/list',
    name: 'Customer',
    meta: { title: 'Qu???n l?? kh??ch h??ng', icon: 'el-icon-s-custom' },
    children: [
      {
        path: 'list',
        name: 'CustomerList',
        component: () => import('@/views/customer/index'),
        meta: { title: 'Danh s??ch kh??ch h??ng' }
      },
      {
        path: 'create',
        name: 'CustomerCreate',
        component: () => import('@/views/customer/create'),
        meta: { title: 'T???o kh??ch h??ng' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'CustomerEdit',
        component: () => import('@/views/customer/edit'),
        meta: { title: 'S???a th??ng tin kh??ch h??ng', noCache: true, activeMenu: '/customer/list' },
        hidden: true
      }
    ]
  },

  {
    path: '/comic',
    component: Layout,
    redirect: '/comic/list',
    name: 'Comic',
    meta: { title: 'Qu???n l?? truy???n tranh', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'list',
        name: 'ComicList',
        component: () => import('@/views/comic/index'),
        meta: { title: 'Danh s??ch truy???n tranh' }
      },
      {
        path: 'create',
        name: 'ComicCreate',
        component: () => import('@/views/comic/create'),
        meta: { title: 'Th??m truy???n m???i' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'ComicEdit',
        component: () => import('@/views/comic/edit'),
        meta: { title: 'S???a th??ng tin truy???n', noCache: true, activeMenu: '/comic/list' },
        hidden: true
      },
      {
        path: ':id(\\d+)',
        name: 'ComicDetail',
        component: () => import('@/views/comic/detail'),
        meta: { title: 'Th??ng tin chi ti???t truy???n', noCache: true, activeMenu: '/comic/list' },
        hidden: true
      }
    ]
  },

  {
    path: '/rent',
    component: Layout,
    name: 'Cart',
    meta: { icon: 'el-icon-shopping-cart-2' },
    redirect: '/rent/select-comic',
    children: [
      {
        path: 'select-comic',
        name: 'SelectComic',
        component: () => import('@/views/rent/select-comic'),
        meta: { title: 'Thu?? truy???n', activeMenu: '/rent/select-comic' }
      },
      {
        path: 'select-customer',
        name: 'SelectCustomer',
        component: () => import('@/views/rent/select-customer'),
        meta: { title: 'Ch???n KH', activeMenu: '/rent/select-comic' },
        hidden: true
      },
      {
        path: 'checkout',
        name: 'CartCheckout',
        component: () => import('@/views/rent/checkout'),
        meta: { title: 'Ho?? ????n', activeMenu: '/rent/select-comic' },
        hidden: true
      }
    ]
  },

  {
    path: '/return',
    component: Layout,
    redirect: '/return/list',
    name: 'Return',
    meta: { icon: 'el-icon-sold-out' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/rent/index.vue'),
        meta: { title: 'Tr??? truy???n' }
      },
      {
        path: 'detail/:id(\\d+)',
        name: 'RentDetail',
        component: () => import('@/views/rent/detail'),
        meta: { title: 'Danh s??ch ', activeMenu: '/return/list' },
        hidden: true
      }
    ]
  },

  {
    path: '/print',
    component: Print,
    hidden: true,
    name: 'Print',
    redirect: '/return/list',
    children: [
      {
        path: 'checkout/:id(\\d+)',
        name: 'PrintCheckout',
        component: () => import('@/views/rent/print'),
        meta: { title: 'In phi???u thu??' }
      },
      {
        path: 'return/:id(\\d+)',
        name: 'PrintReturn',
        component: () => import('@/views/rent/print-return'),
        meta: { title: 'In phi???u tr???' }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/analysis',
    component: Layout,
    redirect: '/analysis/list',
    name: 'Analysis',
    meta: { title: 'Th???ng k??', icon: 'el-icon-s-data', roles: ['ROLE_ADMIN'] },
    children: [
      {
        path: 'listCustomerRenting',
        name: 'CustomerRentingList',
        component: () => import('@/views/analysis/CustomerRenting'),
        meta: { title: 'KH ??ang thu?? truy???n', roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'listComicRenting',
        name: 'ComicRentingList',
        component: () => import('@/views/analysis/ComicRenting'),
        meta: { title: 'Truy???n ??ang ???????c thu??', roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'topComic',
        name: 'TopComic',
        component: () => import('@/views/analysis/TopComic'),
        meta: { title: 'Top 5 truy???n hot', roles: ['ROLE_ADMIN'] }
      }
    ]
  },

  {
    path: '/account',
    component: Layout,
    redirect: '/account/list',
    name: 'Account',
    meta: { title: 'Qu???n l?? t??i kho???n', icon: 'el-icon-user' },
    children: [
      {
        path: 'list',
        name: 'AccountList',
        component: () => import('@/views/account/index'),
        meta: { title: 'Danh s??ch t??i kho???n', roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'create',
        name: 'AccountCreate',
        component: () => import('@/views/account/create'),
        meta: { title: 'T???o t??i kho???n', roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'AccountEdit',
        component: () => import('@/views/account/edit'),
        meta: { title: 'S???a th??ng tin', roles: ['ROLE_ADMIN'], activeMenu: '/account/list' },
        hidden: true
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'change-password',
        name: 'PasswordChange',
        component: () => import('@/views/account/password-change'),
        meta: { title: 'Thay ?????i m???t kh???u', roles: ['ROLE_ADMIN', 'ROLE_USER'], icon: 'el-icon-lock' }
      }
    ]
  },

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
