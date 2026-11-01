const userRoutes = [
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/ListAuthView.vue')
  },
  {
    path: '/users/create',
    name: 'usersCreate',
    component: () => import('../views/CreateAuthView.vue')
  },
  {
    path: '/users/edit',
    name: 'usersEdit',
    component: () => import('../views/CreateAuthView.vue')
  }
]

export default userRoutes
