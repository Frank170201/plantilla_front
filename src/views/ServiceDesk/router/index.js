const atencionUsuarioRouter = [
  {
    path: "/atencion-usuario",
    name: "atencion-usuario",
    component: () => import("../views/AtencionUsuariosView.vue"),
  },
  {
    path: "/atencion-usuario/ticket/:id",
    name: "ticket-detalle",
    component: () => import("../views/TicketDetalleView.vue"),
  },
  // Soporte y seguimiento
  {
    path: "/atencion-usuario/soporte-seguimiento",
    name: "soporte-seguimiento",
    component: () => import("../views/SoporteSeguimiento/SoporteSeguimientoView.vue"),
  },
  {
    path: "/atencion-usuario/ticket/:id/asignacion-seguimiento",
    name: "ticket-asignacion-seguimiento",
    component: () => import("../views/SoporteSeguimiento/TicketAsignacionSeguimientoView.vue"),
  },
  // Configuración soporte
  {
    path: "/configuracion-soporte-usuario",
    name: "configuracion-soporte-usuario",
    component: () => import("../views/configuracionSoporte/ConfiguracionView.vue"),
  }
];

export default atencionUsuarioRouter;
