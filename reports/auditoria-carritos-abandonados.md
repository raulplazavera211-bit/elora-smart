# Auditoría de checkouts no completados

**Fecha de consulta:** 5 de septiembre de 2026  
**Ámbito:** registros históricos disponibles en la tabla de pedidos.  
**Protección de datos:** este informe no incluye nombres, correos, teléfonos ni direcciones.

## Resultado principal

El carrito de la web se guarda en el `localStorage` del navegador de cada visitante. Por ello, los productos añadidos al carrito sin iniciar checkout no se enviaron al servidor y no pueden recuperarse de forma histórica.

Sí existen registros recuperables de **checkouts iniciados**: se crean cuando la persona completa sus datos y continúa al pago. Estos registros no constan como pagados ni como confirmados y se presentan a continuación como **candidatos a abandono de checkout**, no como carritos abandonados confirmados.

| Estado de pago | Registros pendientes | Importe potencial | Interpretación |
|---|---:|---:|---|
| `pending_payment` | 32 | 58.803,00 € | Checkout iniciado y pago pendiente de confirmación. |
| `unpaid` | 6 | 9.821,00 € | Checkout creado sin pago confirmado. |
| **Total** | **38** | **68.624,00 €** | No constituye facturación ni pagos realizados. |

Los registros van desde el **16 de junio de 2026, 06:49:23** hasta el **3 de agosto de 2026, 19:26:33**. Los 38 conservan correo electrónico y teléfono en la base de datos, pero no se incluyen aquí para minimizar la exposición de datos personales.

## Qué puede afirmarse y qué no

Los 38 registros están en estado `pending` y no existe ningún pedido en esta consulta con estado de pago `paid`, `failed`, `confirmed`, `processing`, `shipped` o `delivered`.

No debe suponerse que los 38 sean ventas perdidas reales: algunos pueden corresponder a pruebas de checkout, pagos interrumpidos o procesos en los que la confirmación del proveedor no se registró. Antes de contactar a una persona, conviene revisar la referencia concreta en el panel de pedidos y comprobar el resultado definitivo con el proveedor de pago correspondiente.

## Limitación histórica

La web no guardaba los carritos en una base central antes del checkout. Por tanto, no es posible reconstruir desde el inicio los carritos que solo tuvieron productos añadidos y nunca llegaron a completar los datos de checkout.

Para medirlos desde ahora será necesario implementar un registro de carritos en servidor con consentimiento de cookies y una política de conservación de datos definida.
