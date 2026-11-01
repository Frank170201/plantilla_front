# Mercado San Miguelito

Primera etapa del proyecto, integrada en los repositorios `back` y `front` de `Documents/Plantilla base`. Se conservaron sus credenciales, historial Git, ramas y remotos. Los cambios no se han publicado en GitHub.

## Funciones de esta entrega

- Catálogo público en `/`, con paginación y disponibilidad.
- Panel del vendedor en `/mi-negocio`, usando la sesión de la plantilla.
- Registro de comercios y consulta limitada a su propietario autenticado.
- Alta y edición de productos: categoría, unidad de venta, precio, imagen HTTPS y visibilidad.
- Entradas y salidas con hasta tres decimales, motivo e historial.
- Actualización de saldo y movimiento en una transacción; bloqueo de fila y restricciones PostgreSQL para impedir existencias negativas.

Los pedidos, reservas, entregas, carga de fotos y cobro de suscripciones quedan para las siguientes etapas. El catálogo todavía no ofrece acciones de compra. Las imágenes se ingresan mediante URL. No se ha establecido un límite comercial de puestos por vendedor.

Las rutas heredadas `/users`, `/users/create` y `/users/edit` no se registran en esta etapa: sus pantallas dependen de un servicio de administración de correo ausente en la plantilla. Sus archivos se conservan para adaptarlos después. El inicio de sesión existente se conserva.

## Ejecutar

Requisitos: Node.js, PostgreSQL y Redis; la autenticación de la plantilla utiliza Redis. Las dependencias existentes se copiaron para la verificación local. Para una instalación limpia usa `npm ci` en cada carpeta.

1. En `back`, copia `.env.market.example` a `.env` y configura una base **exclusiva de desarrollo** y una clave secreta aleatoria. No uses una base de producción.
2. La plantilla incluye servicios adicionales de correo, captcha y sesiones. Completa su configuración si el flujo de autenticación que uses los necesita; consulta también `.env.example`.
3. Ejecuta `npm run migrate` en `back`. Se ejecutan las migraciones existentes y la nueva `20261101000000-market.js`. No se ejecutaron migraciones sobre una base del usuario durante esta entrega.
4. Configura los usuarios iniciales de la plantilla antes de usar el panel. Revisa sus seeders antes de ejecutarlos: contienen configuración heredada que debe adaptarse al proyecto.
5. Ejecuta `npm start` en `back`.
6. En `front`, copia `.env.example` a `.env.local`; la API debe apuntar a `http://localhost:8000/api`. Ejecuta `npm run dev` y abre `http://localhost:3000`.

## Verificación

- Backend: `npm test`. Prueba validaciones, rechazo de acceso a comercios ajenos, saldos insuficientes y uso conjunto de transacción y bloqueo. Usa dobles de los modelos; no sustituye pruebas de integración con PostgreSQL ni verifica la autenticación heredada.
- Frontend: `npm run build`.

Verificación de esta entrega: cinco pruebas del módulo aprobadas y compilación de producción completada. La importación completa del backend se comprobó con configuración local de Redis; no implica conexión efectiva a PostgreSQL, Redis ni servicios de correo. La plantilla conserva dependencias voluminosas que generan avisos de tamaño de paquetes durante la compilación.

## API agregada

Las rutas privadas requieren el middleware de autenticación existente y obtienen el propietario desde `req.usuario.id`; el cuerpo de la petición no puede elegirlo.

| Método | Ruta bajo `/api` | Uso |
| --- | --- | --- |
| GET | `/public/mercado/productos?page=1` | Catálogo público, 24 productos por página |
| GET / POST | `/mercado/comercios` | Mis comercios / registrar |
| GET / POST | `/mercado/comercios/:commerceId/productos` | Listar / crear productos |
| PUT | `/mercado/comercios/:commerceId/productos/:productId` | Editar datos y visibilidad; no cambia existencias |
| GET / POST | `/mercado/comercios/:commerceId/productos/:productId/movimientos` | Historial / entrada o salida |

Un movimiento recibe `{ "delta": -1.5, "reason": "Venta presencial" }`. Los valores negativos representan salidas. El saldo se calcula en el servidor.

