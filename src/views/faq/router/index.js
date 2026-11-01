const faqRouter = [
    {
        path: '/configuracion-preguntas-frecuentes',
        name: 'preguntas-frecuentes',
        component: () => import('../views/FAQAuthView.vue')
    },
  ]
  
  export default faqRouter
  