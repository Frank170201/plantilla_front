# Accesos de Kiosko / KiosApp

El servidor determina el acceso usando los roles de la base de datos y los comercios asignados. Las decisiones del navegador no conceden permisos de administración.

| Cuenta | Inicio |
| --- | --- |
| ROLE_ADMIN | `/administracion` |
| ROLE_MERCHANT o propietario de un comercio | `/mi-negocio` |
| Cliente | `/mi-cuenta` |

## Administrador

- Indicadores globales de usuarios, comercios y productos.
- Registro y edición de comercios, con asignación de propietario.
- Creación de cuentas de comerciante y cliente.
- Consulta de usuarios y productos de todos los comercios.

La creación de cuenta guarda la contraseña con bcrypt y crea el rol y el método de autenticación dentro de una transacción. El formulario no permite crear administradores ni cambiar contraseñas existentes.

## Comerciante

Administra solamente los comercios que posee. Puede registrar su comercio, publicar productos y gestionar inventario e historial. Un cliente no puede registrar comercios sin que el administrador le conceda acceso de comerciante o le asigne un negocio.

## Cliente

Tiene un espacio separado y acceso al catálogo. Los pedidos, reservas, direcciones y cobro de suscripciones todavía no están implementados.

## Validación

`npm test` en backend cubre validaciones, separación de cuentas, permisos del administrador e inventarios ajenos. `npm run build` en frontend verifica la compilación. No se requieren migraciones adicionales para esta etapa.
