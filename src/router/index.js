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
    meta: { title: 'Quản lý khách hàng', icon: 'el-icon-user-solid' },
    children: [
      {
        path: 'list',
        name: 'CustomerList',
        component: () => import('@/views/customer/index'),
        meta: { title: 'Danh sách khách hàng' }
      },
      {
        path: 'create',
        name: 'CustomerCreate',
        component: () => import('@/views/customer/create'),
        meta: { title: 'Tạo khách hàng' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'CustomerEdit',
        component: () => import('@/views/customer/edit'),
        meta: { title: 'Sửa thông tin khách hàng', noCache: true, activeMenu: '/customer/list' },
        hidden: true
      }
    ]
  },

  {
    path: '/comic',
    component: Layout,
    redirect: '/comic/list',
    name: 'Comic',
    meta: { title: 'Quản lý truyện tranh', icon: 'el-icon-notebook-2' },
    children: [
      {
        path: 'list',
        name: 'ComicList',
        component: () => import('@/views/comic/index'),
        meta: { title: 'Danh sách truyện tranh' }
      },
      {
        path: 'create',
        name: 'ComicCreate',
        component: () => import('@/views/comic/create'),
        meta: { title: 'Thêm truyện mới' }
      },
      {
        path: 'edit/:id(\\d+)',
        name: 'ComicEdit',
        component: () => import('@/views/comic/edit'),
        meta: { title: 'Sửa thông tin truyện', noCache: true, activeMenu: '/comic/list' },
        hidden: true
      },
      {
        path: ':id(\\d+)',
        name: 'ComicDetail',
        component: () => import('@/views/comic/detail'),
        meta: { title: 'Thông tin chi tiết truyện', noCache: true, activeMenu: '/comic/list' },
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
        meta: { title: 'Thuê truyện', activeMenu: '/rent/select-comic' }
      },
      {
        path: 'select-customer',
        name: 'SelectCustomer',
        component: () => import('@/views/rent/select-customer'),
        meta: { title: 'Chọn KH', activeMenu: '/rent/select-comic' },
        hidden: true
      },
      {
        path: 'checkout',
        name: 'CartCheckout',
        component: () => import('@/views/rent/checkout'),
        meta: { title: 'Hoá đơn', activeMenu: '/rent/select-comic' },
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
        meta: { title: 'Trả truyện' }
      },
      {
        path: 'detail/:id(\\d+)',
        name: 'RentDetail',
        component: () => import('@/views/rent/detail'),
        meta: { title: 'Danh sách ', activeMenu: '/return/list' },
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
        meta: { title: 'In phiếu thuê' }
      },
      {
        path: 'return/:id(\\d+)',
        name: 'PrintReturn',
        component: () => import('@/views/rent/print-return'),
        meta: { title: 'In phiếu trả' }
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
    meta: { title: 'Thống kê', icon: 'el-icon-s-data', roles: ['ROLE_ADMIN'] },
    children: [
      {
        path: 'listCustomerRenting',
        name: 'CustomerRentingList',
        component: () => import('@/views/analysis/CustomerRenting'),
        meta: { title: 'KH đang thuê truyện', roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'listComicRenting',
        name: 'ComicRentingList',
        component: () => import('@/views/analysis/ComicRenting'),
        meta: { title: 'Truyện đang được thuê', roles: ['ROLE_ADMIN'] }
      },
      {
        path: 'topComic',
        name: 'TopComic',
        component: () => import('@/views/analysis/TopComic'),
        meta: { title: 'Top 5 truyện hot', roles: ['ROLE_ADMIN'] }
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
