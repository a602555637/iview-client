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
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'content_management',
        meta: {
          icon: 'md-grid',
          title: '内容管理'
        },
        component: () => import('@/view/content/Index.vue')
      },
      {
        path: 'tags',
        name: 'tags_management',
        meta: {
          icon: 'md-grid',
          title: '标签管理'
        },
        component: () => import('@/view/components/tables/tables.vue')
      }
    ]
  },
  // 文章管理 标签： 热门 || 精华
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-albums',
      title: '文章管理'
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'user_management',
        meta: {
          icon: 'ios-people',
          title: '用户管理'
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  }
]
