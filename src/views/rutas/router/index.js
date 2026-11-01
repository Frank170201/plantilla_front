const rutasRouter = [
  {
    path: '/paths',
    name: 'paths',
    component: () => import('../views/ListadoView.vue')
  },
  {
    path: '/paths/create',
    name: 'pathsCreate',
    component: () => import('../views/ListadoView.vue')
  },{
    path: '/paths/edit',
    name: 'pathsEdit',
    component: () => import('../views/ListadoView.vue')
  }
]

export default rutasRouter
