import Main from '@/components/main'

export default [
  // 菜单分 3 种情况：
  // 链接式跳转 =》 doc
  // 内嵌子页面 =》 Main Layout -> children
  // 一级菜单添加的路由 (hideInMenu hideInbread)

  // 内容管理
  {
    path: '/content',
    name: 'article_management',
    meta: {
      icon: 'logo-buffer',
      title: '文章管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'content_management',
        meta: {
          icon: 'md-grid',
          title: '内容管理',
          notCache: true
        },
        component: () => import('@/view/content/Index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'md-grid',
          title: '标签管理',
          notCache: true
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },

  // 文章管理 标签： 热门 || 精华
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-albums',
      title: '文章管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'user_management',
        meta: {
          icon: 'ios-people',
          title: '用户管理',
          notCache: true
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },

  // 菜单管理
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'md-settings',
      title: '菜单管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'menu_management',
        meta: {
          icon: 'ios-menu',
          title: '用户管理',
          notCache: true
        },
        component: () => import('@/view/menu/index.vue')
      }
    ]
  },

  // 权限管理
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'md-checkbox',
      title: '权限管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'roles_management',
        meta: {
          icon: 'md-key',
          title: '角色权限',
          notCache: true
        },
        component: () => import('@/view/roles/index.vue')
      }
    ]
  }
]
