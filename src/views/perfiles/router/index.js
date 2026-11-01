const perfilesRouter = [
  {
    path: '/profiles',
    name: 'profiles',
    component: () => import('../views/ListadoView.vue')
  },
  {
    path: '/profiles/create',
    name: 'profilesCreate',
    component: () => import('../views/ListadoView.vue')
  },{
    path: '/profiles/edit',
    name: 'profilesEdit',
    component: () => import('../views/ListadoView.vue')
  },{
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ListadoView.vue')
  },
  // {
  //   path: '/secciones/editar/:id',
  //   name: 'editar-seccion',
  //   component: () => import('../views/EditarSeccion.vue')
  // }
]

export default perfilesRouter
