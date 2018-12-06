
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
      { path: 'entradas', component: () => import('pages/entradas.vue')},
      { path: 'productos', component: () => import('pages/productos.vue')},
      { path: 'cuenta', component: () => import('pages/cuenta.vue')},
      { path: 'pedido', component: () => import('pages/pedido.vue')},
      { path: 'pedidos2', component: () => import('pages/pedidos2.vue')},
      { path: 'pedido2', component: () => import('pages/pedido2.vue')},
      { path: 'proveedores', component: () => import('pages/proveedor.vue')},
    ]
  },
  {
    path: '/app/recibo',
    component: () => import('pages/recibo.vue')
  },
  {
    path: '/app/reporte/comprador', 
    component:() => import('pages/reportComprador')
  },
  {
    path: '/app/reporte/producto', 
    component:() => import('pages/reportProducto')
  },
  {
    path: '/app/reporte/venta', 
    component:() => import('pages/reportVenta')
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
