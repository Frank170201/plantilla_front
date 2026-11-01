const rolesRouter = [
  {
    path: '/roles',
    name: 'roles',
    component: () => import('../views/ListadoView.vue')
  },
  {
    path: '/roles/create',
    name: 'rolesCreate',
    component: () => import('../views/ListadoView.vue')
  }
]

export default rolesRouter
