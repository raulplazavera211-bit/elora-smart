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
