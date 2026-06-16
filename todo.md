# Elora Smart — TODO

## Conflictos del upgrade (resueltos)
- [x] Home.tsx: mantener implementación rica (2102 líneas) — ya está en su lugar
- [x] NotFound.tsx: mantener versión española — ya está en su lugar
- [x] package.json: añadir mysql2 (motion ya estaba) — mysql2 instalado

## Base de datos
- [x] Añadir tabla contact_submissions al schema de Drizzle
- [x] Añadir tabla club_elora_signups al schema de Drizzle
- [x] Ejecutar pnpm db:push para sincronizar el esquema

## Backend (tRPC)
- [x] Añadir procedimiento contact.submit (publicProcedure) — guardar en DB + notificar propietario
- [x] Añadir procedimiento clubElora.signup (publicProcedure) — guardar en DB + notificar propietario
- [x] Añadir helpers de query en server/db.ts para las nuevas tablas

## Frontend
- [x] Conectar formulario de contacto con trpc.contact.submit.useMutation()
- [x] Conectar formulario Club Elora con trpc.clubElora.signup.useMutation()
- [x] Mostrar estado de carga y errores en los formularios

## Correcciones TypeScript
- [x] Corregir error disableTransition en DashboardLayout.tsx (prop no existente en Sidebar)

## Verificación
- [x] Servidor arranca sin errores
- [x] Formularios guardan datos en la DB (contact.submit y clubElora.signup verificados)
- [x] Propietario recibe notificaciones (notifyOwner() integrado en ambos procedimientos)
- [x] pnpm db:push ejecutado — 3 tablas sincronizadas
- [x] Tests pasan (1/1 vitest)
- [x] Checkpoint guardado

## Panel de administración
- [x] Procedimientos tRPC admin.getContacts y admin.getClubSignups
- [x] Página /admin con tablas de datos (contactos y Club Elora)
- [x] Protección de la ruta /admin (solo acceso con contraseña o rol admin)
- [x] Checkpoint guardado con el panel admin

## Sistema WooCommerce completo
- [x] Añadir tabla products al schema de Drizzle
- [x] Añadir tabla orders al schema de Drizzle
- [x] Añadir tabla order_items al schema de Drizzle
- [x] Ejecutar pnpm db:push para sincronizar las nuevas tablas
- [x] Añadir helpers de DB para productos y pedidos en server/db.ts
- [x] Añadir procedimientos admin: getProducts, updateProduct, seedProducts
- [x] Añadir procedimientos admin: getOrders, getOrder, updateOrderStatus
- [x] Añadir procedimientos admin: getDashboardStats, getUsers, getContacts, getClubSignups
- [x] Añadir procedimiento orders.create (checkout público)
- [x] Actualizar CartPanel con checkout real (formulario + mutación tRPC)
- [x] Crear componente AdminLayout (sidebar oscuro estilo WooCommerce)
- [x] Crear página /admin — Dashboard con stats y pedidos recientes
- [x] Crear página /admin/productos — Gestión de productos (editar precio, stock, visibilidad)
- [x] Crear página /admin/pedidos — Lista de pedidos con filtros y cambio de estado
- [x] Crear página /admin/pedidos/:id — Detalle de pedido individual
- [x] Crear página /admin/clientes — Lista de usuarios registrados
- [x] Crear página /admin/contactos — Solicitudes de contacto con acciones de respuesta
- [x] Crear página /admin/club-elora — Miembros del Club Elora
- [x] Registrar todas las rutas admin en App.tsx
- [x] Instalar dotenv (dependencia faltante del servidor)

## Integración Redsys

- [x] Instalar redsys-easy y decimal.js
- [x] Crear server/redsys.ts con helper de firma y generación de formulario
- [x] Crear server/redsysWebhook.ts con handler IPN Express
- [x] Registrar webhook /api/redsys/notification en server/_core/index.ts
- [x] Añadir campos redsysOrderId y paymentStatus a tabla orders (db:push)
- [x] Añadir helpers linkRedsysOrder, updatePaymentStatus, getOrderByRedsysId en server/db.ts
- [x] Añadir procedimiento orders.initPayment en server/routers.ts
- [x] Actualizar CartPanel con flujo: carrito → datos → redirección TPV Redsys
- [x] Crear página /pago/ok (confirmación de pago exitoso)
- [x] Crear página /pago/ko (pago fallido o cancelado)
- [x] Registrar rutas /pago/ok y /pago/ko en App.tsx
- [x] Guardar credenciales Redsys como variables de entorno
- [x] Tests vitest para validar configuración Redsys (3/3 pasan)
