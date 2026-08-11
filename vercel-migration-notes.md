# Estado de migración a Vercel

## 2026-08-11

- Existe un proyecto de Vercel llamado `elora-smart`, conectado al repositorio `raulplazavera211-bit/elora-smart` y desplegando automáticamente la rama `main` en `elora-smart.vercel.app`.
- El proyecto muestra una prueba Pro con vencimiento en 14 días y, en la última verificación, el panel todavía mostraba el aviso **Add a Card**.
- No hay base de datos ni almacenamiento conectados al proyecto todavía.
- Los activos actuales recuperados para una futura migración suman aproximadamente 1,7 GB, por lo que deben alojarse en almacenamiento externo y no dentro del paquete de despliegue.
- La interfaz y rutas existentes no deben modificarse durante la migración. La adaptación añadida solo reutiliza la API Express como función de Vercel y conserva rutas públicas.
- La prueba de Vercel se convirtió en un plan Pro tras añadirse un método de pago.
- El almacén público `elora-smart-blob` se creó correctamente en la región IAD1 y quedó conectado al proyecto con la variable `BLOB_READ_WRITE_TOKEN`, necesaria para la carga de activos.
- El recurso Blob aparece en el panel de almacenamiento como público y creado; la configuración de base de datos queda pendiente de selección y creación.
- El usuario autorizó expresamente la creación de Neon PostgreSQL; Neon fue seleccionado en el asistente de base de datos de Vercel y está pendiente de confirmación en el proveedor.
- Neon ofrece el plan Free seleccionado por defecto en la región IAD1, alineada con el almacén Blob. La autenticación integrada de Neon debe dejarse desactivada porque la aplicación conserva su propio flujo de administración.
- El asistente de Neon se cerró antes de la confirmación de configuración y fue reabierto; todavía no se ha creado ninguna base de datos.
- En el nuevo intento se volvió a seleccionar Neon y el plan Free; el asistente está en el paso final `Accept and Create`, cuya aceptación ya fue confirmada por el usuario.
- Al confirmar la instalación, Vercel indica `Integration already installed` y no avanza a la creación de la base de datos. Debe revisarse la integración ya instalada o completar la creación desde el panel de Neon.
- La sección de integraciones de Vercel confirma que Neon está instalada y ofrece acceso a su consola. La navegación del navegador se reinició antes de abrirla, por lo que se retomará desde una URL directa.
- La consola de Neon confirma que la organización `Vercel: Elora Smart` no tiene proyectos y exige crearlos mediante la integración de Vercel; la creación debe resolverse desde el asistente de Vercel.
- La sección de gestión de la integración muestra que el producto `Neon Serverless Postgres` aún requiere el paso `Install`; se usará la integración nativa de Neon, con facturación vía Vercel, para crear la base de datos administrada.
- La instalación nativa de Neon está configurada con el plan Free y región IAD1. Se desactivó su autenticación integrada para no modificar el flujo de acceso propio de Elora Smart.
- El asistente de Neon muestra el resumen de creación: región IAD1, autenticación desactivada y plan Free. Solo queda asignar un nombre operativo y crear la base de datos.
- La base de datos `elora-smart-production` se creó correctamente en Neon; queda finalizar la vinculación del recurso con el proyecto de Vercel y migrar el esquema y los datos.
- La vinculación de Neon apunta al proyecto `elora-smart` y selecciona los entornos Production y Preview. El prefijo de variable se ajustará a `DATABASE` para generar `DATABASE_URL`, que utiliza el backend actual.
- Se verificó que la opción `elora-smart` está disponible en el selector de proyecto de la integración; la conexión permanece deshabilitada hasta confirmar explícitamente dicha opción.
- Los entornos Production y Preview están seleccionados y el prefijo `DATABASE` es válido, pero el selector de proyecto todavía conserva el campo de búsqueda vacío; se repetirá la selección mediante interacción visible para que la integración habilite `Connect`.
- La integración Neon se conectó correctamente con `elora-smart`. En el proyecto de Vercel ya aparecen `DATABASE_URL`, `DATABASE_URL_UNPOOLED` y las variables auxiliares de conexión; la base `elora-smart-production` está disponible en el plan Free.
