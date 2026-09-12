# Validación de recuperación — 11 de septiembre de 2026

## Ficha ESENZA en producción

- URL validada: `https://www.elorasmart.store/producto/esenza`.
- La galería expone una portada y siete recursos de galería con URL distintas; no se observan duplicados de la portada.
- El botón **Descargar ficha técnica** abre el formulario correctamente. La descarga se ha modificado para iniciarse mediante un clic explícito posterior al formulario, que es compatible con bloqueadores de ventanas emergentes de navegadores móviles.

## Distribuidores y contacto

La ruta pública `https://www.elorasmart.store/#contacto` se valida después de la carga inicial: la portada sitúa correctamente el contenedor interno de scroll en el formulario de contacto.

La sección de distribuidores muestra el mapa SVG interactivo de España junto al buscador por código postal y los distribuidores publicados. El contacto desde distribuidores apunta a `/#contacto` y ya alcanza el formulario.

## Enlaces sociales

- Instagram confirmado: `https://www.instagram.com/elora_smart/`.
- TikTok confirmado públicamente: `https://www.tiktok.com/@elora.smart`.
- Facebook confirmado públicamente: `https://www.facebook.com/61576584694086/`.
No se encontró una página oficial verificable de LinkedIn, por lo que el enlace anterior no se mantiene para evitar enviar visitantes a una página inexistente. La validación pública muestra únicamente Instagram, TikTok y Facebook en el footer.

## Vista móvil

La ficha ESENZA y la ruta de contacto se han comprobado a 375 × 812 píxeles. La cabecera móvil, la imagen de producto, el formulario de contacto y los controles de navegación permanecen dentro del viewport sin solapamientos de la interfaz de la aplicación.

## Corrección final de visibilidad de distribuidores

- El despliegue de producción de Vercel asociado a `a4a931c` está en estado **Ready**.
- El componente de distribuidores ya no depende de `IntersectionObserver` ni de un estado asíncrono de animación: su visibilidad queda fijada en el primer renderizado.
- Las pruebas de regresión y el tipado se completaron correctamente con 34 pruebas superadas.

## Ampliación móvil del mapa SVG

- El contenedor del mapa emplea menos relleno en móvil para aprovechar la anchura disponible.
- El SVG se muestra al 114% de anchura, centrado mediante un desplazamiento horizontal compensado; desde el breakpoint `sm` conserva su tamaño normal.
- Las pruebas, el tipado y la compilación de producción se completaron correctamente antes de publicar el ajuste.

## Restauración del mapa Cómo llegar

- La sección de contacto vuelve a incluir un mapa visible de la tienda de Elora Smart en Avenida da Mahía 17, Bertamiráns (Ames).
- Se conserva el enlace exterior de navegación y el diseño de tarjeta de ubicación del bloque de contacto.
- El mapa usa una inserción de Google Maps que evita que la sección quede vacía si falla la carga de la API dinámica utilizada anteriormente.
