
const routes = [
  {
    path: '/app',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'cuenta', component: () => import('pages/cuenta.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('pages/entrar.vue')
  },
  {
    path: '/registro',
    component: () => import('pages/registro.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
