
const routes = [
  {
    path: '/',
    component: () => import('pages/entrar.vue')
  },
  {
    path: '/app',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'pedidos', component: () => import('pages/pedidos.vue')},
      { path: 'clientes', component: () => import('pages/clientes.vue')},
      { path: 'inventario', component: () => import('pages/inventario.vue')},
      { path: 'productos', component: () => import('pages/productos.vue')},
      { path: 'cuenta', component: () => import('pages/cuenta.vue')}
    ]
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
