# Validación de recuperación — 11 de septiembre de 2026

## Ficha ESENZA en producción

- URL validada: `https://www.elorasmart.store/producto/esenza`.
- La galería expone una portada y siete recursos de galería con URL distintas; no se observan duplicados de la portada.
- El botón **Descargar ficha técnica** abre el formulario correctamente. La descarga se ha modificado para iniciarse mediante un clic explícito posterior al formulario, que es compatible con bloqueadores de ventanas emergentes de navegadores móviles.

## Distribuidores y contacto

- La ruta pública `https://www.elorasmart.store/#contacto` seguía mostrando la portada al validar el primer despliegue porque la Home usa un contenedor interno de scroll.
- Se ha aplicado una corrección con desplazamiento explícito sobre ese contenedor y reintento después de la carga inicial. La validación pública de este ajuste se realizará tras el siguiente despliegue.

## Enlaces sociales

- Instagram confirmado: `https://www.instagram.com/elora_smart/`.
- TikTok confirmado públicamente: `https://www.tiktok.com/@elora.smart`.
- Facebook confirmado públicamente: `https://www.facebook.com/61576584694086/`.
- No se encontró una página oficial verificable de LinkedIn, por lo que el enlace anterior no se mantiene para evitar enviar visitantes a una página inexistente.
