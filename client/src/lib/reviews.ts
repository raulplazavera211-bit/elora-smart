// ─── Fuente única de verdad para reseñas de Elora Smart ──────────────────────
// Importar desde aquí en cualquier página o componente que las necesite.

export const REVIEWS = [
  { name: "Ana G.", text: "Me encanta mover el chorro de agua, para tener una limpieza perfecta.", date: "Mayo 2026", stars: 5 },
  { name: "Jaime V.", text: "El Vater en sí es la bomba, muy buena calidad, facilísimo de instalar siempre que sigas las instrucciones, facilísimo de usar y todo automático. La atención al cliente es brutal, el seguimiento que hacen y la paciencia que tienen.", date: "Mayo 2026", stars: 5 },
  { name: "Adán M.", text: "Teníamos un WC suspendido y nos horrorizaba la idea de meternos en obra. Pero gracias al buen asesoramiento, decidimos lanzarnos de cabeza. Totalmente satisfechos con el resultado.", date: "Mayo 2026", stars: 5 },
  { name: "Lorena A.", text: "Un lujo tener este inodoro en casa, no sé cómo hemos podido vivir sin él! El baño ha pasado a ser de lujo! Un 10.", date: "Marzo 2026", stars: 5 },
  { name: "Carlos M.", text: "La atención un 10 sobre 10, profesionales y con el producto que compré muy satisfecho. Para mí ha sido una alegría, estoy muy conforme, lo recomiendo.", date: "Marzo 2026", stars: 5 },
  { name: "Marta R.", text: "Muy buena atención de Marta y Eloi. Interesante producto. Espero que poco a poco nos vayamos acostumbrando a las nuevas tendencias.", date: "Marzo 2026", stars: 5 },
  { name: "Instalaciones Pro", text: "Excelente producto, atención inmejorable. Acostumbrados a instalar todo tipo de wc inteligentes, sin duda este es el más completo que hemos instalado hasta la fecha. Altísima calidad tanto en funciones como en acabados.", date: "Febrero 2026", stars: 5 },
  { name: "Roberto F.", text: "Después de varias semanas aún me sigue sorprendiendo 😃", date: "Febrero 2026", stars: 5 },
  { name: "Pedro L.", text: "Hemos instalado el modelo compact y la verdad que es toda una novedad. La instalación es muy similar a un inodoro convencional. Estoy sorprendido por todas las opciones que tiene, lo recomiendo.", date: "Enero 2026", stars: 5 },
  { name: "Sofía T.", text: "Me lo han puesto en mi casa y estoy encantada. Al principio no estaba segura que fuera realmente útil y ahora solo utilizo este inodoro.", date: "Enero 2026", stars: 5 },
] as const;

export type Review = typeof REVIEWS[number];

export const AVATAR_COLORS = [
  "#4285F4", "#EA4335", "#34A853", "#FBBC04", "#9C27B0",
  "#00BCD4", "#FF5722", "#607D8B", "#E91E63", "#3F51B5",
] as const;
