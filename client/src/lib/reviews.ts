// ─── Fuente única de verdad para reseñas de Elora Smart ──────────────────────
// Importar desde aquí en cualquier página o componente que las necesite.

export type Review = {
  name: string;
  text: string;
  date: string;
  stars: number;
};

// ─── Reseñas en español (originales, verificadas en Google) ──────────────────
const REVIEWS_ES: Review[] = [
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
];

// ─── Reseñas en inglés ────────────────────────────────────────────────────────
const REVIEWS_EN: Review[] = [
  { name: "Ana G.", text: "I love being able to move the water jet to get a perfect clean.", date: "May 2026", stars: 5 },
  { name: "Jaime V.", text: "The toilet itself is amazing, very good quality, super easy to install if you follow the instructions, easy to use and fully automatic. Customer service is outstanding — the follow-up and patience they have is incredible.", date: "May 2026", stars: 5 },
  { name: "Adán M.", text: "We had a wall-hung toilet and dreaded the idea of doing any building work. But thanks to great advice, we went for it. Completely satisfied with the result.", date: "May 2026", stars: 5 },
  { name: "Lorena A.", text: "What a luxury to have this toilet at home — I don't know how we lived without it! The bathroom has become truly luxurious. A perfect 10.", date: "March 2026", stars: 5 },
  { name: "Carlos M.", text: "Service 10 out of 10, professional team and very happy with the product I bought. It's been a joy for me, I'm very satisfied, I recommend it.", date: "March 2026", stars: 5 },
  { name: "Marta R.", text: "Excellent service from Marta and Eloi. Interesting product. Hopefully we'll all gradually get used to these new trends.", date: "March 2026", stars: 5 },
  { name: "Instalaciones Pro", text: "Excellent product, unbeatable service. Used to installing all kinds of smart toilets, this is without doubt the most complete one we've installed to date. Extremely high quality in both functions and finishes.", date: "February 2026", stars: 5 },
  { name: "Roberto F.", text: "After several weeks it still keeps surprising me 😃", date: "February 2026", stars: 5 },
  { name: "Pedro L.", text: "We installed the compact model and it's a real novelty. Installation is very similar to a conventional toilet. I'm amazed by all the options it has — I recommend it.", date: "January 2026", stars: 5 },
  { name: "Sofía T.", text: "They installed it in my home and I'm delighted. At first I wasn't sure it would really be useful, and now I only use this toilet.", date: "January 2026", stars: 5 },
];

// ─── Reseñas en portugués ─────────────────────────────────────────────────────
const REVIEWS_PT: Review[] = [
  { name: "Ana G.", text: "Adoro poder mover o jato de água para ter uma limpeza perfeita.", date: "Maio 2026", stars: 5 },
  { name: "Jaime V.", text: "O vaso em si é incrível, muito boa qualidade, facilíssimo de instalar se seguir as instruções, fácil de usar e totalmente automático. O atendimento ao cliente é brutal — o acompanhamento e a paciência que têm é impressionante.", date: "Maio 2026", stars: 5 },
  { name: "Adán M.", text: "Tínhamos um WC suspenso e a ideia de fazer obras horrorizava-nos. Mas graças ao bom aconselhamento, decidimos avançar. Totalmente satisfeitos com o resultado.", date: "Maio 2026", stars: 5 },
  { name: "Lorena A.", text: "Que luxo ter este vaso em casa — não sei como vivemos sem ele! A casa de banho tornou-se de luxo! Um 10.", date: "Março 2026", stars: 5 },
  { name: "Carlos M.", text: "Atendimento 10 em 10, profissionais e muito satisfeito com o produto que comprei. Para mim foi uma alegria, estou muito contente, recomendo.", date: "Março 2026", stars: 5 },
  { name: "Marta R.", text: "Muito bom atendimento da Marta e do Eloi. Produto interessante. Espero que aos poucos nos vamos habituando às novas tendências.", date: "Março 2026", stars: 5 },
  { name: "Instalaciones Pro", text: "Excelente produto, atendimento inigualável. Habituados a instalar todo o tipo de WC inteligentes, sem dúvida este é o mais completo que instalámos até à data. Altíssima qualidade tanto nas funções como nos acabamentos.", date: "Fevereiro 2026", stars: 5 },
  { name: "Roberto F.", text: "Depois de várias semanas ainda me continua a surpreender 😃", date: "Fevereiro 2026", stars: 5 },
  { name: "Pedro L.", text: "Instalámos o modelo compact e a verdade é que é uma novidade. A instalação é muito semelhante a um WC convencional. Estou surpreendido com todas as opções que tem, recomendo.", date: "Janeiro 2026", stars: 5 },
  { name: "Sofía T.", text: "Instalaram-no em minha casa e estou encantada. No início não tinha a certeza de que seria realmente útil e agora só uso este WC.", date: "Janeiro 2026", stars: 5 },
];

// ─── Reseñas en francés ───────────────────────────────────────────────────────
const REVIEWS_FR: Review[] = [
  { name: "Ana G.", text: "J'adore pouvoir déplacer le jet d'eau pour un nettoyage parfait.", date: "Mai 2026", stars: 5 },
  { name: "Jaime V.", text: "Les toilettes en elles-mêmes sont incroyables, très bonne qualité, très faciles à installer si vous suivez les instructions, faciles à utiliser et entièrement automatiques. Le service client est formidable — leur suivi et leur patience sont remarquables.", date: "Mai 2026", stars: 5 },
  { name: "Adán M.", text: "Nous avions des toilettes suspendues et l'idée de faire des travaux nous horrifiait. Mais grâce à de bons conseils, nous nous sommes lancés. Entièrement satisfaits du résultat.", date: "Mai 2026", stars: 5 },
  { name: "Lorena A.", text: "Quel luxe d'avoir ces toilettes à la maison — je ne sais pas comment on a pu vivre sans ! La salle de bain est devenue luxueuse ! Un 10.", date: "Mars 2026", stars: 5 },
  { name: "Carlos M.", text: "Service 10 sur 10, professionnels et très satisfait du produit acheté. C'est une vraie joie pour moi, je suis très content, je le recommande.", date: "Mars 2026", stars: 5 },
  { name: "Marta R.", text: "Très bon service de Marta et Eloi. Produit intéressant. J'espère que nous nous habituerons peu à peu aux nouvelles tendances.", date: "Mars 2026", stars: 5 },
  { name: "Instalaciones Pro", text: "Excellent produit, service imbattable. Habitués à installer toutes sortes de WC intelligents, c'est sans aucun doute le plus complet que nous ayons installé à ce jour. Qualité très élevée tant dans les fonctions que dans les finitions.", date: "Février 2026", stars: 5 },
  { name: "Roberto F.", text: "Après plusieurs semaines, il continue encore à me surprendre 😃", date: "Février 2026", stars: 5 },
  { name: "Pedro L.", text: "Nous avons installé le modèle compact et c'est vraiment une nouveauté. L'installation est très similaire à des toilettes conventionnelles. Je suis surpris par toutes les options qu'il offre, je le recommande.", date: "Janvier 2026", stars: 5 },
  { name: "Sofía T.", text: "On me l'a installé chez moi et je suis ravie. Au début je n'étais pas sûre que ce serait vraiment utile et maintenant je n'utilise plus que ces toilettes.", date: "Janvier 2026", stars: 5 },
];

// ─── Reseñas en italiano ──────────────────────────────────────────────────────
const REVIEWS_IT: Review[] = [
  { name: "Ana G.", text: "Adoro poter spostare il getto d'acqua per una pulizia perfetta.", date: "Maggio 2026", stars: 5 },
  { name: "Jaime V.", text: "Il WC in sé è fantastico, ottima qualità, facilissimo da installare se si seguono le istruzioni, facile da usare e completamente automatico. Il servizio clienti è eccezionale — il follow-up e la pazienza che hanno è incredibile.", date: "Maggio 2026", stars: 5 },
  { name: "Adán M.", text: "Avevamo un WC sospeso e l'idea di fare lavori ci spaventava. Ma grazie a buoni consigli, abbiamo deciso di buttarci. Completamente soddisfatti del risultato.", date: "Maggio 2026", stars: 5 },
  { name: "Lorena A.", text: "Che lusso avere questo WC in casa — non so come abbiamo fatto senza! Il bagno è diventato di lusso! Un 10.", date: "Marzo 2026", stars: 5 },
  { name: "Carlos M.", text: "Servizio 10 su 10, professionali e molto soddisfatto del prodotto acquistato. Per me è stata una gioia, sono molto contento, lo raccomando.", date: "Marzo 2026", stars: 5 },
  { name: "Marta R.", text: "Ottimo servizio da Marta ed Eloi. Prodotto interessante. Spero che poco a poco ci abitueremo alle nuove tendenze.", date: "Marzo 2026", stars: 5 },
  { name: "Instalaciones Pro", text: "Prodotto eccellente, servizio imbattibile. Abituati a installare ogni tipo di WC intelligente, senza dubbio questo è il più completo che abbiamo installato finora. Altissima qualità sia nelle funzioni che nelle finiture.", date: "Febbraio 2026", stars: 5 },
  { name: "Roberto F.", text: "Dopo diverse settimane mi sorprende ancora 😃", date: "Febbraio 2026", stars: 5 },
  { name: "Pedro L.", text: "Abbiamo installato il modello compact ed è davvero una novità. L'installazione è molto simile a un WC convenzionale. Sono sorpreso da tutte le opzioni che ha, lo raccomando.", date: "Gennaio 2026", stars: 5 },
  { name: "Sofía T.", text: "Me lo hanno installato a casa e sono entusiasta. All'inizio non ero sicura che fosse davvero utile e ora uso solo questo WC.", date: "Gennaio 2026", stars: 5 },
];

// ─── Mapa de idiomas ──────────────────────────────────────────────────────────
const REVIEWS_MAP: Record<string, Review[]> = {
  es: REVIEWS_ES,
  en: REVIEWS_EN,
  pt: REVIEWS_PT,
  fr: REVIEWS_FR,
  it: REVIEWS_IT,
};

/**
 * Devuelve las reseñas en el idioma indicado.
 * Si no existe traducción, cae en español.
 */
export function getReviews(lang: string): Review[] {
  return REVIEWS_MAP[lang] ?? REVIEWS_MAP['es'];
}

// Compatibilidad hacia atrás: exportar las reseñas en español como REVIEWS
export const REVIEWS = REVIEWS_ES;

export const AVATAR_COLORS = [
  "#4285F4", "#EA4335", "#34A853", "#FBBC04", "#9C27B0",
  "#00BCD4", "#FF5722", "#607D8B", "#E91E63", "#3F51B5",
] as const;
