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

## Mejoras checkout

- [x] Formulario con validaciones estrictas para España (CP 5 dígitos, teléfono +34, provincia)
- [x] Selector visual de método de pago (tarjeta / Bizum)
- [x] Campo de dirección completo (calle, número, piso, ciudad, provincia, CP)
- [x] Pasar método de pago elegido a Redsys (DS_MERCHANT_PAYMETHODS)

## Rediseño checkout v2

- [x] Paso de cálculo de envío (localidad, provincia, CP) con animación celebratoria "¡Envío gratis!"
- [x] Checkout escritorio a pantalla completa: formulario izquierda + resumen derecha
- [x] Mantener móvil intacto

## Banda lateral carrito + Admin pagos

- [x] Cambiar fondo banda lateral carrito de negro a crema/beige elegante
- [x] Formulario Club Elora integrado directamente en la banda lateral del carrito
- [x] Tabla payment_methods en DB con campos: id, name, type, enabled, config (JSON), position
- [x] Procedimientos tRPC admin: getPaymentMethods, updatePaymentMethod, togglePaymentMethod
- [x] Página /admin/pagos con tarjetas de configuración por método (Redsys/Bizum, Transferencia, PayPal, Contrareembolso)
- [x] Checkout muestra solo los métodos de pago activos según la configuración del admin
- [x] Ruta /admin/pagos registrada en App.tsx y sidebar admin

## Integración seQura

- [x] Crear server/sequra.ts con helper de API (startSequraSolicitation, confirmSequraOrder, verifySequraSignature)
- [x] Crear server/sequraWebhook.ts con handler IPN Express para confirmación de pagos
- [x] Registrar webhook /api/sequra/notification en server/_core/index.ts
- [x] Añadir campo sequraOrderUrl a tabla orders (db:push)
- [x] Añadir helpers linkSequraOrder, updateSequraPaymentStatus en server/db.ts
- [x] Añadir método de pago "sequra" al seed de payment_methods en server/db.ts
- [x] Añadir procedimiento orders.initSequraPayment en server/routers.ts
- [x] Actualizar CartPanel: tipo PayMethod incluye "sequra", botón de selección desktop y móvil, botón de pago naranja seQura
- [x] Actualizar handleSubmitPayment para redirigir a seQura cuando payMethod === "sequra"
- [x] Actualizar PagoOk.tsx para mostrar referencia seQura cuando method=sequra en URL
- [x] Guardar credenciales seQura como variables de entorno (SEQURA_MERCHANT_CODE, SEQURA_API_KEY, SEQURA_SECRET_KEY)

## Selector de cantidad en carrito
- [x] Selector de cantidad (+/-) en el carrito para pedir más de una unidad del mismo producto


## Navegación con URL en productos
- [x] Home.tsx: clic en producto navega a /producto/:slug (URL propia, botón atrás funciona)
- [x] Coleccion.tsx: clic en producto navega a /producto/:slug (URL propia, botón atrás funciona)

## Migración a Vercel con paridad total
- [ ] Auditar la aplicación actual y documentar las dependencias que deben conservarse sin cambios visibles.
- [ ] Preparar la configuración de compilación y rutas para Vercel sin modificar el diseño, contenido ni experiencia de usuario.
- [x] Extraer la API Express en una aplicación reutilizable por la función de Vercel sin cambiar las rutas existentes.
- [x] Añadir `vercel.json` y la función catch-all para conservar rutas API, imágenes y navegación SPA.
- [x] Añadir una capa de compatibilidad para servir `/manus-storage/*` desde Vercel Blob conservando las URLs de la interfaz.
- [ ] Configurar en Vercel las variables de entorno, almacenamiento, base de datos y pagos equivalentes.
- [ ] Desplegar una versión de prueba y comprobar catálogo, imágenes, carrito, checkout, pagos, analítica y vistas móvil/escritorio.
- [ ] Conectar el dominio de producción tras la validación completa de la copia en Vercel.
- [ ] Corregir la expectativa duplicada de cookies en `server/auth.logout.test.ts` antes de validar la migración final.
- [ ] Configurar Vercel como plataforma de producción principal tras validar una copia idéntica de la web.
- [ ] Crear y conectar Neon PostgreSQL a Vercel, migrando la persistencia sin modificar la interfaz.
- [x] Crear la base de datos Neon `elora-smart-production` en la región IAD1.
- [x] Enlazar Neon al proyecto Vercel `elora-smart` y crear `DATABASE_URL` para Production y Preview.
- [ ] Auditar el esquema y la capa de acceso actuales para una migración de MySQL a PostgreSQL compatible con Neon.
- [ ] Generar y aplicar el esquema PostgreSQL de Elora Smart en Neon.
- [ ] Migrar los datos persistentes existentes y verificar integridad sin exponer información sensible.
- [ ] Transferir los activos recuperados a Vercel Blob y comprobar las rutas existentes `/manus-storage/*`.
- [ ] Configurar las variables de entorno restantes en Vercel y realizar pruebas de integración.
- [ ] Validar el despliegue de Vercel en móvil y escritorio antes de trasladar el dominio.
