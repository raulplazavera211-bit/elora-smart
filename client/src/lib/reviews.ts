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
  // ── Reseñas originales ──────────────────────────────────────────────────────
  { name: "Ana G.", text: "Me encanta mover el chorro de agua, para tener una limpieza perfecta.", date: "Mayo 2026", stars: 5 },
  { name: "Lorena A.", text: "Un lujo tener este inodoro en casa, no sé cómo hemos podido vivir sin él! El baño ha pasado a ser de lujo! Un 10.", date: "Marzo 2026", stars: 5 },
  { name: "Carlos M.", text: "La atención un 10 sobre 10, profesionales y con el producto que compré muy satisfecho. Para mí ha sido una alegría, estoy muy conforme, lo recomiendo.", date: "Marzo 2026", stars: 5 },
  { name: "Roberto F.", text: "Después de varias semanas aún me sigue sorprendiendo 😃", date: "Febrero 2026", stars: 5 },
  // ── Reseñas reales de Google My Business ────────────────────────────────────
  { name: "Adán Martínez Alcántara", text: "Empezaré diciendo que teníamos un WC suspendido y nos horrorizaba la idea de tener que meternos otra vez en obra. Pero, echándole un poco de imaginación y paciencia, y gracias al buen asesoramiento, decidimos lanzarnos de cabeza. Tengo que admitir que mi mujer no estaba del todo convencida al principio… pero ahora en casa todos quieren usarlo. Solo la sensación de sentarte en una taza calentita ya es uno de esos pequeños lujos de la vida. Desde que lo usamos, la sensación de dejar de depender del papel es brutal. Es algo que no se puede explicar, hay que probarlo.", date: "Mayo 2026", stars: 5 },
  { name: "tryzfisioterapia", text: "Por reforma y apertura de un nuevo negocio me adentré en el futuro confiando en Elora Smart. La gente está muy contenta por lo higiénico que es al no tener que tocar nada para levantar y bajar tapa y asiento, ni siquiera tocar nada para tirar de la cisterna. Estoy súper contenta con la adquisición del inodoro. Además de ser muy profesionales y tener una atención muy cercana. Muy recomendable.", date: "Diciembre 2025", stars: 5 },
  { name: "P M", text: "Me dejé asesorar por Eloy y fue todo un acierto. Buena atención y asesoramiento y productos de 10, con una calidad superior a lo que había visto hasta ahora en el mercado.", date: "Enero 2026", stars: 5 },
  { name: "REFORMAS SEVILLEJA", text: "Hemos instalado el modelo compact y la verdad que es toda una novedad. La instalación es muy similar a un inodoro convencional solo que hay que dejar un punto de luz. Estoy sorprendido por todas las opciones que tiene, lo recomiendo.", date: "Febrero 2026", stars: 5 },
  { name: "DCI Reformas Madrid", text: "Excelente producto, atención inmejorable. Acostumbrados a instalar todo tipo de wc inteligentes, sin duda este es el más completo que hemos instalado hasta la fecha. El producto es de una altísima calidad tanto en funciones como en acabados y por ahora todos nuestros clientes están muy satisfechos y encantados con el producto.", date: "Marzo 2026", stars: 5 },
  { name: "Josecho Paisajista", text: "Muy buena atención de Marta y Eloi. Interesante producto. Es lo que poco a poco nos vayamos acostumbrando a las nuevas tendencias.", date: "Marzo 2026", stars: 5 },
  { name: "Jaime Valero", text: "El Vater en sí es la bomba, muy buena calidad, facilísimo de instalar siempre que sigas las instrucciones, facilísimo de usar y todo automático. La atención al cliente es lo que es brutal, el seguimiento que hacen y la paciencia que tienen.", date: "Mayo 2026", stars: 5 },
  { name: "Manuel Anllo Centeno", text: "Un inodoro super guay! La verdad nunca pensé que necesitaría uno, hasta que lo he probado. No volveré a utilizar un inodoro de los convencionales nunca más!!! De 10. Y el servicio técnico inmejorable! Tuvimos un pequeño problema con la instalación, pero nos contestaron rápidamente y el problema se solucionó al momento! Muy satisfecho!!", date: "Septiembre 2025", stars: 5 },
  { name: "eva juarez", text: "Lo instalaron en uno de los dos baños de mi casa y estoy encantada. Al principio no tenía certeza de que sería realmente útil, pero ahora solo uso este inodoro.", date: "Febrero 2026", stars: 5 },
  { name: "Cristina Rey Gomez", text: "Encontramos este lugar por acaso y decidimos entrar para aprender más sobre inodoros inteligentes, pues estábamos bastante perdidos en el asunto. Salimos absolutamente encantados. Adoramos tanto el producto como la atención recibida.", date: "Septiembre 2025", stars: 5 },
  { name: "Manolo Valiño", text: "Fiquei sorprendido coa ampla variedade de modelos que ofrecen e, sobre todo, cos seus recursos. Tamén destacaría o excelente servizo ao cliente.", date: "Enero 2026", stars: 5 },
  { name: "Valeria Lavorato", text: "Excelente calidad y servicio. Recomiendo sin duda. Los inodoros inteligentes son fantásticos.", date: "Enero 2026", stars: 5 },
];

// ─── Reseñas en inglés ────────────────────────────────────────────────────────
const REVIEWS_EN: Review[] = [
  // ── Original reviews ────────────────────────────────────────────────────────
  { name: "Ana G.", text: "I love being able to move the water jet to get a perfect clean.", date: "May 2026", stars: 5 },
  { name: "Lorena A.", text: "What a luxury to have this toilet at home — I don't know how we lived without it! The bathroom has become truly luxurious. A perfect 10.", date: "March 2026", stars: 5 },
  { name: "Carlos M.", text: "Service 10 out of 10, professional team and very happy with the product I bought. It's been a joy for me, I'm very satisfied, I recommend it.", date: "March 2026", stars: 5 },
  { name: "Roberto F.", text: "After several weeks it still keeps surprising me 😃", date: "February 2026", stars: 5 },
  // ── Real Google My Business reviews ─────────────────────────────────────────
  { name: "Adán Martínez Alcántara", text: "We had a wall-hung toilet and dreaded the idea of doing building work again. But thanks to great advice, we went for it. My wife wasn't fully convinced at first… but now everyone at home wants to use it. Just the feeling of sitting on a warm seat is one of life's small luxuries. Since we started using it, the feeling of not depending on paper is incredible. It's something you can't explain — you have to try it.", date: "May 2026", stars: 5 },
  { name: "tryzfisioterapia", text: "For a renovation and opening of a new business I stepped into the future by trusting Elora Smart. People are very happy with how hygienic it is — you don't have to touch anything to raise or lower the lid and seat, or even to flush. I'm thrilled with the purchase. Very professional with a very personal touch. Highly recommended.", date: "December 2025", stars: 5 },
  { name: "P M", text: "I let Eloy advise me and it was absolutely the right call. Great attention and advice, and products rated 10/10, with a quality superior to anything I had seen on the market.", date: "January 2026", stars: 5 },
  { name: "REFORMAS SEVILLEJA", text: "We installed the compact model and it's a real novelty. Installation is very similar to a conventional toilet — you just need to leave a power point. I'm amazed by all the options it has. I recommend it.", date: "February 2026", stars: 5 },
  { name: "DCI Reformas Madrid", text: "Excellent product, unbeatable service. Used to installing all kinds of smart toilets, this is without doubt the most complete one we've installed to date. Extremely high quality in both functions and finishes, and so far all our clients are very satisfied and delighted with the product.", date: "March 2026", stars: 5 },
  { name: "Josecho Paisajista", text: "Very good service from Marta and Eloi. Interesting product. It's what we'll gradually get used to as new trends arrive.", date: "March 2026", stars: 5 },
  { name: "Jaime Valero", text: "The toilet itself is amazing, very good quality, super easy to install if you follow the instructions, easy to use and fully automatic. Customer service is outstanding — the follow-up and patience they have is incredible.", date: "May 2026", stars: 5 },
  { name: "Manuel Anllo Centeno", text: "A super cool toilet! I honestly never thought I'd need one, until I tried it. I'll never go back to a conventional toilet again!!! A perfect 10. And the technical service is unbeatable! We had a small installation issue, but they responded quickly and it was solved immediately! Very satisfied!!", date: "September 2025", stars: 5 },
  { name: "eva juarez", text: "They installed it in one of my two bathrooms and I'm delighted. At first I wasn't sure it would really be useful, but now I only use this toilet.", date: "February 2026", stars: 5 },
  { name: "Cristina Rey Gomez", text: "We found this place by chance and decided to go in to learn more about smart toilets, as we were quite lost on the subject. We left absolutely enchanted. We loved both the product and the service we received.", date: "September 2025", stars: 5 },
  { name: "Manolo Valiño", text: "I was surprised by the wide variety of models on offer and, above all, by their features. I would also highlight the excellent customer service.", date: "January 2026", stars: 5 },
  { name: "Valeria Lavorato", text: "Excellent quality and service. I recommend without hesitation. Smart toilets are fantastic.", date: "January 2026", stars: 5 },
];

// ─── Reseñas en portugués ─────────────────────────────────────────────────────
const REVIEWS_PT: Review[] = [
  // ── Avaliações originais ─────────────────────────────────────────────────────
  { name: "Ana G.", text: "Adoro poder mover o jato de água para ter uma limpeza perfeita.", date: "Maio 2026", stars: 5 },
  { name: "Lorena A.", text: "Que luxo ter este vaso em casa — não sei como vivemos sem ele! A casa de banho tornou-se de luxo! Um 10.", date: "Março 2026", stars: 5 },
  { name: "Carlos M.", text: "Atendimento 10 em 10, profissionais e muito satisfeito com o produto que comprei. Para mim foi uma alegria, estou muito contente, recomendo.", date: "Março 2026", stars: 5 },
  { name: "Roberto F.", text: "Depois de várias semanas ainda me continua a surpreender 😃", date: "Fevereiro 2026", stars: 5 },
  // ── Avaliações reais do Google My Business ───────────────────────────────────
  { name: "Adán Martínez Alcántara", text: "Tínhamos um WC suspenso e a ideia de fazer obras horrorizava-nos. Mas graças ao bom aconselhamento, decidimos avançar. A minha mulher não estava totalmente convencida no início… mas agora em casa todos querem usá-lo. Só a sensação de se sentar numa sanita quente já é um dos pequenos luxos da vida. Desde que o usamos, a sensação de deixar de depender do papel é brutal.", date: "Maio 2026", stars: 5 },
  { name: "tryzfisioterapia", text: "Para a renovação e abertura de um novo negócio, avancei para o futuro confiando na Elora Smart. As pessoas estão muito contentes com a higiene — não é preciso tocar em nada para levantar ou baixar a tampa e o assento, nem para dar descarga. Estou muito contente com a aquisição. Muito profissionais e com um atendimento muito próximo. Muito recomendável.", date: "Dezembro 2025", stars: 5 },
  { name: "P M", text: "Deixei-me aconselhar pelo Eloy e foi um acerto total. Bom atendimento e aconselhamento e produtos de 10, com uma qualidade superior ao que tinha visto até agora no mercado.", date: "Janeiro 2026", stars: 5 },
  { name: "REFORMAS SEVILLEJA", text: "Instalámos o modelo compact e a verdade é que é uma novidade. A instalação é muito semelhante a um WC convencional, só é preciso deixar um ponto de luz. Estou surpreendido com todas as opções que tem, recomendo.", date: "Fevereiro 2026", stars: 5 },
  { name: "DCI Reformas Madrid", text: "Excelente produto, atendimento inigualável. Habituados a instalar todo o tipo de WC inteligentes, sem dúvida este é o mais completo que instalámos até à data. Altíssima qualidade tanto nas funções como nos acabamentos e até agora todos os nossos clientes estão muito satisfeitos.", date: "Março 2026", stars: 5 },
  { name: "Josecho Paisajista", text: "Muito bom atendimento da Marta e do Eloi. Produto interessante. É o que aos poucos nos vamos habituando às novas tendências.", date: "Março 2026", stars: 5 },
  { name: "Jaime Valero", text: "O vaso em si é incrível, muito boa qualidade, facilíssimo de instalar se seguir as instruções, fácil de usar e totalmente automático. O atendimento ao cliente é brutal — o acompanhamento e a paciência que têm é impressionante.", date: "Maio 2026", stars: 5 },
  { name: "Manuel Anllo Centeno", text: "Um WC super fixe! A verdade é que nunca pensei que precisaria de um, até o experimentar. Nunca mais vou usar um WC convencional!!! Um 10. E o serviço técnico inigualável! Tivemos um pequeno problema com a instalação, mas responderam rapidamente e o problema ficou resolvido de imediato! Muito satisfeito!!", date: "Setembro 2025", stars: 5 },
  { name: "eva juarez", text: "Instalaram-no num dos dois banheiros da minha casa e estou encantada. No início não tinha a certeza de que seria realmente útil e agora só uso este WC.", date: "Fevereiro 2026", stars: 5 },
  { name: "Cristina Rey Gomez", text: "Encontrámos este lugar por acaso e decidimos entrar para aprender mais sobre WC inteligentes, pois estávamos bastante perdidos no assunto. Saímos absolutamente encantados. Adorámos tanto o produto como o atendimento recebido.", date: "Setembro 2025", stars: 5 },
  { name: "Manolo Valiño", text: "Fiquei surpreendido com a ampla variedade de modelos que oferecem e, sobretudo, com os seus recursos. Também destacaria o excelente atendimento ao cliente.", date: "Janeiro 2026", stars: 5 },
  { name: "Valeria Lavorato", text: "Excelente qualidade e serviço. Recomendo sem dúvida. Os vasos sanitários inteligentes são fantásticos.", date: "Janeiro 2026", stars: 5 },
];

// ─── Reseñas en francés ───────────────────────────────────────────────────────
const REVIEWS_FR: Review[] = [
  // ── Avis originaux ───────────────────────────────────────────────────────────
  { name: "Ana G.", text: "J'adore pouvoir déplacer le jet d'eau pour un nettoyage parfait.", date: "Mai 2026", stars: 5 },
  { name: "Lorena A.", text: "Quel luxe d'avoir ces toilettes à la maison — je ne sais pas comment on a pu vivre sans ! La salle de bain est devenue luxueuse ! Un 10.", date: "Mars 2026", stars: 5 },
  { name: "Carlos M.", text: "Service 10 sur 10, professionnels et très satisfait du produit acheté. C'est une vraie joie pour moi, je suis très content, je le recommande.", date: "Mars 2026", stars: 5 },
  { name: "Roberto F.", text: "Après plusieurs semaines, il continue encore à me surprendre 😃", date: "Février 2026", stars: 5 },
  // ── Vrais avis Google My Business ───────────────────────────────────────────
  { name: "Adán Martínez Alcántara", text: "Nous avions des toilettes suspendues et l'idée de faire des travaux nous horrifiait. Mais grâce à de bons conseils, nous nous sommes lancés. Ma femme n'était pas entièrement convaincue au début… mais maintenant tout le monde à la maison veut les utiliser. Rien que la sensation de s'asseoir sur un siège chaud est l'un des petits luxes de la vie.", date: "Mai 2026", stars: 5 },
  { name: "tryzfisioterapia", text: "Pour une rénovation et l'ouverture d'un nouveau commerce, j'ai fait confiance à Elora Smart. Les gens sont très contents de l'hygiène — pas besoin de toucher quoi que ce soit pour lever ou baisser le couvercle et le siège, ni pour tirer la chasse. Très professionnels avec une attention très personnelle. Très recommandé.", date: "Décembre 2025", stars: 5 },
  { name: "P M", text: "Je me suis laissé conseiller par Eloy et c'était le bon choix. Bonne attention et bons conseils, et des produits notés 10/10, avec une qualité supérieure à tout ce que j'avais vu sur le marché.", date: "Janvier 2026", stars: 5 },
  { name: "REFORMAS SEVILLEJA", text: "Nous avons installé le modèle compact et c'est vraiment une nouveauté. L'installation est très similaire à des toilettes conventionnelles. Je suis surpris par toutes les options qu'il offre, je le recommande.", date: "Février 2026", stars: 5 },
  { name: "DCI Reformas Madrid", text: "Excellent produit, service imbattable. Habitués à installer toutes sortes de WC intelligents, c'est sans aucun doute le plus complet que nous ayons installé à ce jour. Qualité très élevée tant dans les fonctions que dans les finitions.", date: "Mars 2026", stars: 5 },
  { name: "Josecho Paisajista", text: "Très bon service de Marta et Eloi. Produit intéressant. C'est ce à quoi nous nous habituerons peu à peu avec les nouvelles tendances.", date: "Mars 2026", stars: 5 },
  { name: "Jaime Valero", text: "Les toilettes en elles-mêmes sont incroyables, très bonne qualité, très faciles à installer si vous suivez les instructions, faciles à utiliser et entièrement automatiques. Le service client est formidable — leur suivi et leur patience sont remarquables.", date: "Mai 2026", stars: 5 },
  { name: "Manuel Anllo Centeno", text: "Des toilettes super cool ! Honnêtement, je n'aurais jamais pensé en avoir besoin, jusqu'à ce que je les essaie. Je ne reviendrai plus jamais à des toilettes conventionnelles !!! Un 10 parfait. Et le service technique est imbattable !", date: "Septembre 2025", stars: 5 },
  { name: "eva juarez", text: "Ils l'ont installé dans l'une de mes deux salles de bain et je suis ravie. Au début je n'étais pas sûre que ce serait vraiment utile et maintenant je n'utilise plus que ces toilettes.", date: "Février 2026", stars: 5 },
  { name: "Cristina Rey Gomez", text: "Nous avons trouvé cet endroit par hasard et avons décidé d'entrer pour en savoir plus sur les toilettes intelligentes. Nous sommes repartis absolument enchantés. Nous avons adoré le produit et le service reçu.", date: "Septembre 2025", stars: 5 },
  { name: "Manolo Valiño", text: "J'ai été surpris par la grande variété de modèles proposés et, surtout, par leurs fonctionnalités. Je soulignerais également l'excellent service client.", date: "Janvier 2026", stars: 5 },
  { name: "Valeria Lavorato", text: "Excellente qualité et service. Je recommande sans hésitation. Les toilettes intelligentes sont fantastiques.", date: "Janvier 2026", stars: 5 },
];

// ─── Reseñas en italiano ──────────────────────────────────────────────────────
const REVIEWS_IT: Review[] = [
  // ── Recensioni originali ─────────────────────────────────────────────────────
  { name: "Ana G.", text: "Adoro poter spostare il getto d'acqua per una pulizia perfetta.", date: "Maggio 2026", stars: 5 },
  { name: "Lorena A.", text: "Che lusso avere questo WC in casa — non so come abbiamo fatto senza! Il bagno è diventato di lusso! Un 10.", date: "Marzo 2026", stars: 5 },
  { name: "Carlos M.", text: "Servizio 10 su 10, professionali e molto soddisfatto del prodotto acquistato. Per me è stata una gioia, sono molto contento, lo raccomando.", date: "Marzo 2026", stars: 5 },
  { name: "Roberto F.", text: "Dopo diverse settimane mi sorprende ancora 😃", date: "Febbraio 2026", stars: 5 },
  // ── Recensioni reali Google My Business ─────────────────────────────────────
  { name: "Adán Martínez Alcántara", text: "Avevamo un WC sospeso e l'idea di fare lavori ci spaventava. Ma grazie a buoni consigli, abbiamo deciso di buttarci. Mia moglie non era del tutto convinta all'inizio… ma ora in casa tutti vogliono usarlo. Solo la sensazione di sedersi su un sedile caldo è uno dei piccoli lussi della vita.", date: "Maggio 2026", stars: 5 },
  { name: "tryzfisioterapia", text: "Per una ristrutturazione e l'apertura di una nuova attività mi sono affidata al futuro con Elora Smart. Le persone sono molto contente dell'igiene — non bisogna toccare nulla per alzare o abbassare il coperchio e il sedile, né per tirare lo sciacquone. Molto professionali con un'attenzione molto personale. Molto consigliato.", date: "Dicembre 2025", stars: 5 },
  { name: "P M", text: "Mi sono fatto consigliare da Eloy ed è stata la scelta giusta. Buona attenzione e consulenza, e prodotti da 10, con una qualità superiore a tutto ciò che avevo visto sul mercato.", date: "Gennaio 2026", stars: 5 },
  { name: "REFORMAS SEVILLEJA", text: "Abbiamo installato il modello compact ed è davvero una novità. L'installazione è molto simile a un WC convenzionale. Sono sorpreso da tutte le opzioni che ha, lo raccomando.", date: "Febbraio 2026", stars: 5 },
  { name: "DCI Reformas Madrid", text: "Prodotto eccellente, servizio imbattibile. Abituati a installare ogni tipo di WC intelligente, senza dubbio questo è il più completo che abbiamo installato finora. Altissima qualità sia nelle funzioni che nelle finiture.", date: "Marzo 2026", stars: 5 },
  { name: "Josecho Paisajista", text: "Ottimo servizio da Marta ed Eloi. Prodotto interessante. È quello a cui ci abitueremo gradualmente con le nuove tendenze.", date: "Marzo 2026", stars: 5 },
  { name: "Jaime Valero", text: "Il WC in sé è fantastico, ottima qualità, facilissimo da installare se si seguono le istruzioni, facile da usare e completamente automatico. Il servizio clienti è eccezionale — il follow-up e la pazienza che hanno è incredibile.", date: "Maggio 2026", stars: 5 },
  { name: "Manuel Anllo Centeno", text: "Un WC super figo! Onestamente non avrei mai pensato di averne bisogno, finché non l'ho provato. Non tornerò mai più a un WC convenzionale!!! Un 10 perfetto. E il servizio tecnico è imbattibile!", date: "Settembre 2025", stars: 5 },
  { name: "eva juarez", text: "L'hanno installato in uno dei due bagni di casa mia e sono entusiasta. All'inizio non ero sicura che fosse davvero utile e ora uso solo questo WC.", date: "Febbraio 2026", stars: 5 },
  { name: "Cristina Rey Gomez", text: "Abbiamo trovato questo posto per caso e abbiamo deciso di entrare per saperne di più sui WC intelligenti. Siamo usciti assolutamente incantati. Abbiamo adorato sia il prodotto che il servizio ricevuto.", date: "Settembre 2025", stars: 5 },
  { name: "Manolo Valiño", text: "Sono rimasto sorpreso dall'ampia varietà di modelli offerti e, soprattutto, dalle loro caratteristiche. Evidenzierei anche l'eccellente servizio clienti.", date: "Gennaio 2026", stars: 5 },
  { name: "Valeria Lavorato", text: "Eccellente qualità e servizio. Consiglio senza esitazione. I WC intelligenti sono fantastici.", date: "Gennaio 2026", stars: 5 },
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
