import type {
  User,
  JournalEntry,
  CheckIn,
  Tool,
  Scenario,
  ResourceLink,
  Message,
} from "@/lib/types";

// ── Current user ──
export const currentUser: User = {
  id: "u1",
  name: "Ana",
  email: "ana@ejemplo.com",
};

// ── Journal Entries ──
export const journalEntries: JournalEntry[] = [
  {
    id: "j1",
    userId: "u1",
    title: "Hoy fue un día difícil en el trabajo",
    content:
      "Mi jefe hizo un comentario delante de todo el equipo que me hizo sentir muy pequeña. No sé si fue intencionado, pero me quedé bloqueada. Intenté respirar y salir un momento. Al llegar a casa lloré un rato y me sentí algo mejor.",
    mood: "sad",
    tags: ["trabajo", "bullying", "emociones"],
    createdAt: "2026-02-14T18:30:00Z",
  },
  {
    id: "j2",
    userId: "u1",
    title: "Ansiedad antes de la reunión",
    content:
      "Llevo toda la mañana con el estómago encogido pensando en la reunión de esta tarde. Sé que no va a pasar nada malo, pero mi cuerpo no para de enviar señales de alerta. Voy a intentar la respiración 4-7-8 antes de entrar.",
    mood: "anxious",
    tags: ["ansiedad", "trabajo", "respiracion"],
    createdAt: "2026-02-13T09:15:00Z",
  },
  {
    id: "j3",
    userId: "u1",
    title: "Pequeña victoria: puse un límite",
    content:
      "Hoy le dije a mi compañero que no me parecía bien como me habló ayer. Me temblaba la voz, pero lo dije. Él se disculpó. Me siento orgullosa aunque agotada.",
    mood: "calm",
    tags: ["limites", "comunicacion", "logro"],
    createdAt: "2026-02-12T20:00:00Z",
  },
  {
    id: "j4",
    userId: "u1",
    title: "No puedo dormir por el estrés",
    content:
      "Son las 2 de la mañana y sigo dando vueltas. Tengo demasiadas cosas en la cabeza: el proyecto, la situación con mi equipo, la presentación del viernes. Voy a intentar escribir aqui todo lo que me agobia para sacarlo de mi mente.",
    mood: "stressed",
    tags: ["estres", "insomnio", "trabajo"],
    createdAt: "2026-02-11T02:00:00Z",
  },
  {
    id: "j5",
    userId: "u1",
    title: "Recordando lo del instituto",
    content:
      "Hoy vi una noticia sobre bullying escolar y me volvieron recuerdos de cuando tenía 14 años. Ya no duele igual, pero sigue ahí. Creo que es bueno reconocerlo y recordarme que ya no estoy en esa situación.",
    mood: "sad",
    tags: ["bullying", "pasado", "reflexion"],
    createdAt: "2026-02-10T17:45:00Z",
  },
  {
    id: "j6",
    userId: "u1",
    title: "Un buen día, por fin",
    content:
      "Hoy el día fue tranquilo. Trabajé sin interrupciones, comí con calma y por la tarde fui a pasear. A veces se me olvida que los días buenos también existen. Quiero recordar este momento.",
    mood: "calm",
    tags: ["bienestar", "gratitud", "calma"],
    createdAt: "2026-02-09T21:00:00Z",
  },
];

// ── Check-ins ──
export const checkIns: CheckIn[] = [
  {
    id: "c1",
    userId: "u1",
    mood: "anxious",
    stressLevel: 7,
    energyLevel: 4,
    createdAt: "2026-02-14T08:00:00Z",
  },
  {
    id: "c2",
    userId: "u1",
    mood: "stressed",
    stressLevel: 8,
    energyLevel: 3,
    createdAt: "2026-02-13T08:00:00Z",
  },
  {
    id: "c3",
    userId: "u1",
    mood: "ok",
    stressLevel: 5,
    energyLevel: 6,
    createdAt: "2026-02-12T08:00:00Z",
  },
  {
    id: "c4",
    userId: "u1",
    mood: "calm",
    stressLevel: 3,
    energyLevel: 7,
    createdAt: "2026-02-11T08:00:00Z",
  },
  {
    id: "c5",
    userId: "u1",
    mood: "sad",
    stressLevel: 6,
    energyLevel: 3,
    createdAt: "2026-02-10T08:00:00Z",
  },
  {
    id: "c6",
    userId: "u1",
    mood: "ok",
    stressLevel: 4,
    energyLevel: 5,
    createdAt: "2026-02-09T08:00:00Z",
  },
  {
    id: "c7",
    userId: "u1",
    mood: "calm",
    stressLevel: 2,
    energyLevel: 8,
    createdAt: "2026-02-08T08:00:00Z",
  },
];

// ── Tools ──
export const tools: Tool[] = [
  {
    id: "t1",
    title: "Respiración 4-7-8",
    type: "breathing",
    description:
      "Técnica de respiración que activa el sistema nervioso parasimpático para calmarte rapidamente.",
    durationMin: 3,
    steps: [
      "Siéntate cómodo y cierra los ojos.",
      "Inhala por la nariz contando hasta 4.",
      "Mantén el aire contando hasta 7.",
      "Exhala lentamente por la boca contando hasta 8.",
      "Repite el ciclo 4 veces.",
      "Nota como tu cuerpo se relaja con cada ciclo.",
    ],
  },
  {
    id: "t2",
    title: "Respiración cuadrada",
    type: "breathing",
    description:
      "Respiración en cuatro tiempos iguales, ideal para recuperar el control en momentos de ansiedad.",
    durationMin: 4,
    steps: [
      "Inhala contando hasta 4.",
      "Mantén el aire contando hasta 4.",
      "Exhala contando hasta 4.",
      "Espera contando hasta 4 antes de volver a inhalar.",
      "Repite durante 4 minutos.",
    ],
  },
  {
    id: "t3",
    title: "Grounding 5-4-3-2-1",
    type: "grounding",
    description:
      "Técnica de anclaje sensorial que te trae al presente cuando la ansiedad te desconecta.",
    durationMin: 5,
    steps: [
      "Nombra 5 cosas que puedas VER a tu alrededor.",
      "Nombra 4 cosas que puedas TOCAR.",
      "Nombra 3 cosas que puedas OIR.",
      "Nombra 2 cosas que puedas OLER.",
      "Nombra 1 cosa que puedas SABOREAR.",
      "Respira profundo. Ya estás aqui.",
    ],
  },
  {
    id: "t4",
    title: "Grounding con objetos",
    type: "grounding",
    description:
      "Usa un objeto físico para anclarte al presente y reducir la disociación.",
    durationMin: 3,
    steps: [
      "Busca un objeto cercano (una taza, un bolígrafo, una piedra).",
      "Sostenlo con ambas manos.",
      "Observa su color, forma y textura.",
      "Siente su temperatura y peso.",
      "Describe en voz alta o mentalmente lo que percibes.",
      "Repite: 'Estoy aqui, estoy seguro/a'.",
    ],
  },
  {
    id: "t5",
    title: "Reencuadre cognitivo",
    type: "reframe",
    description:
      "Aprende a ver la situación desde otro ángulo para reducir el impacto emocional.",
    durationMin: 5,
    steps: [
      "Escribe el pensamiento que te genera malestar.",
      "Preguntate: 'Es un hecho o una interpretación?'",
      "Busca evidencias a favor y en contra del pensamiento.",
      "Escribe una versión mas equilibrada del pensamiento.",
      "Lee la nueva versión en voz alta.",
      "Nota si tu nivel de malestar ha cambiado.",
    ],
  },
  {
    id: "t6",
    title: "Diálogo compasivo",
    type: "selftalk",
    description:
      "Reemplaza la autocrítica por un diálogo interno amable, como si hablaras con un buen amigo.",
    durationMin: 4,
    steps: [
      "Identifica el pensamiento autocrítico (ej: 'Soy un desastre').",
      "Imagina que un amigo querido te dice lo mismo sobre si mismo.",
      "Escribe lo que le dirías a ese amigo.",
      "Ahora dirige esas mismas palabras hacia ti.",
      "Repite: 'Merezco compasión, como cualquier persona'.",
    ],
  },
  {
    id: "t7",
    title: "Afirmaciones de seguridad",
    type: "selftalk",
    description:
      "Frases que refuerzan tu sentido de seguridad y control cuando todo parece incierto.",
    durationMin: 3,
    steps: [
      "Busca un lugar tranquilo.",
      "Repite en voz alta o mentalmente: 'Estoy a salvo en este momento'.",
      "'Puedo manejar las cosas paso a paso'.",
      "'No tengo que resolver todo ahora'.",
      "'Ya he superado momentos difíciles antes'.",
      "Respira profundo y continua con tu dia.",
    ],
  },
  {
    id: "t8",
    title: "Reencuadre del error",
    type: "reframe",
    description:
      "Transforma la experiencia de 'fallar' en una oportunidad de aprendizaje y crecimiento.",
    durationMin: 4,
    steps: [
      "Describe brevemente la situación que consideras un error.",
      "Preguntate: 'Que aprendí de esto?'",
      "Preguntate: 'Que haría diferente la próxima vez?'",
      "Escribe una frase que resuma el aprendizaje.",
      "Recuerda: equivocarse es parte de ser humano.",
    ],
  },
];

// ── Scenarios ──
export const scenarios: Scenario[] = [
  {
    id: "s1",
    type: "bullying_school",
    title: "Bullying escolar: que hacer hoy",
    description:
      "Pasos concretos para protegerte y buscar ayuda si sufres acoso en el instituto.",
    steps: [
      "Reconoce que no es tu culpa. Nadie merece ser tratado asi.",
      "Busca a una persona de confianza: un profesor, orientador o familiar.",
      "Cuenta lo que esta pasando con el máximo detalle que puedas.",
      "Registra los incidentes: fecha, hora, que paso, quien estaba presente.",
      "Evita estar solo/a en los lugares donde ocurre el acoso.",
      "Recuerda: pedir ayuda es un acto de valentía, no de debilidad.",
      "Si la situación es grave o hay violencia, llama al 112.",
    ],
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "s2",
    type: "bullying_school",
    title: "Como apoyar a alguien que sufre bullying",
    description:
      "Guia para ser un buen apoyo cuando alguien cercano sufre acoso escolar.",
    steps: [
      "Escucha sin juzgar. Simplemente di: 'Te creo y estoy contigo'.",
      "No le digas 'ignoralo' o 'no es para tanto'.",
      "Preguntale que necesita, no asumas.",
      "Acompanale a hablar con un adulto de confianza si quiere.",
      "Mantente presente: a veces solo necesita saber que no esta solo/a.",
      "Si ves una situación de acoso, no te quedes callado/a.",
    ],
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "s3",
    type: "bullying_work",
    title: "Bullying laboral: límites y documentación",
    description:
      "Estrategias para protegerte del acoso laboral y documentar lo que ocurre.",
    steps: [
      "Identifica los comportamientos: humillaciones, aislamiento, sobrecarga, sabotaje.",
      "Registra cada incidente por escrito: fecha, hora, testigos, hechos.",
      "Guarda correos, mensajes y cualquier evidencia escrita.",
      "Busca apoyo: un compañero de confianza, el comité de empresa o RRHH.",
      "Practica respuestas asertivas: 'No me parece adecuado que me hables asi'.",
      "Consulta con un profesional (sindicato, abogado laboral) si la situación persiste.",
      "Cuida tu salud: el acoso laboral tiene impacto real en tu bienestar.",
    ],
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "s4",
    type: "bullying_work",
    title: "Preparar una conversación difícil en el trabajo",
    description:
      "Como plantear un problema de acoso o conflicto laboral de forma asertiva.",
    steps: [
      "Elige el momento y lugar adecuados (privado, sin prisas).",
      "Prepara lo que quieres decir: hechos concretos, no generalizaciones.",
      "Usa frases en primera persona: 'Me siento... cuando... porque...'",
      "Escucha la respuesta sin interrumpir.",
      "Propone soluciones concretas: 'Me gustaría que...'",
      "Si no te sientes seguro/a, lleva a alguien de confianza contigo.",
    ],
    createdAt: "2026-01-20T10:00:00Z",
  },
  {
    id: "s5",
    type: "anxiety",
    title: "Ansiedad: cuando empieza el bucle",
    description:
      "Pasos para interrumpir el ciclo de pensamientos ansiosos y volver al presente.",
    steps: [
      "Para. Reconoce que estás en un bucle de ansiedad.",
      "Pon los pies en el suelo. Siente el contacto.",
      "Usa la técnica 5-4-3-2-1 para anclarte al presente.",
      "Preguntate: 'Esto que pienso, es real ahora mismo?'",
      "Respira: inhala 4 segundos, manten 4, exhala 4.",
      "Haz una sola cosa pequeña: un vaso de agua, un paso fuera.",
      "Si la ansiedad es frecuente o intensa, busca apoyo profesional.",
    ],
    createdAt: "2026-01-25T10:00:00Z",
  },
  {
    id: "s6",
    type: "stress",
    title: "Estrés: descarga y planificación",
    description:
      "Estrategia para descargar el estrés acumulado y recuperar la sensación de control.",
    steps: [
      "Escribe TODO lo que te agobia en una lista, sin filtro.",
      "Separa lo que puedes controlar de lo que no.",
      "De lo que puedes controlar, elige solo 1-2 cosas para hoy.",
      "Pon un temporizador de 25 minutos y trabaja en una sola tarea.",
      "Cuando suene, para y respira 2 minutos.",
      "Al final del dia, reconoce lo que hiciste, por pequeño que sea.",
      "Recuerda: no tienes que resolverlo todo hoy.",
    ],
    createdAt: "2026-01-28T10:00:00Z",
  },
];

// ── Resources ──
export const resources: ResourceLink[] = [
  {
    id: "r1",
    title: "Emergencias",
    description:
      "Número de emergencias en España. Llama si estás en peligro inmediato.",
    type: "emergency",
    phone: "112",
  },
  {
    id: "r2",
    title: "Linea 024",
    description:
      "Línea de atención a la conducta suicida, disponible 24 horas.",
    type: "emergency",
    phone: "024",
  },
  {
    id: "r3",
    title: "Teléfono de la Esperanza",
    description: "Línea de ayuda emocional y prevención del suicidio.",
    type: "professional",
    phone: "717 003 717",
  },
  {
    id: "r4",
    title: "Colegio Oficial de Psicólogos",
    description: "Busca un profesional de la psicología cerca de ti.",
    type: "professional",
    url: "https://www.cop.es",
  },
  {
    id: "r5",
    title: "Guia sobre acoso escolar (AEPAE)",
    description: "Información y recursos sobre bullying escolar.",
    type: "education",
    url: "https://aepae.es",
  },
  {
    id: "r6",
    title: "Guia sobre acoso laboral",
    description: "Información sobre mobbing y derechos laborales.",
    type: "education",
    url: "https://www.mites.gob.es",
  },
];

// ── Mock chat messages ──
export const mockMessages: Message[] = [
  {
    id: "m1",
    conversationId: "conv1",
    role: "assistant",
    content:
      "Hola, me alegra que estés aqui. Este es un espacio seguro para ti. ¿Cómo te sientes hoy?",
    createdAt: "2026-02-14T10:00:00Z",
  },
  {
    id: "m2",
    conversationId: "conv1",
    role: "user",
    content:
      "Estoy bastante estresada por el trabajo. Mi jefe no para de presionarme.",
    createdAt: "2026-02-14T10:01:00Z",
  },
  {
    id: "m3",
    conversationId: "conv1",
    role: "assistant",
    content:
      "Entiendo que la presión constante es agotadora. Es normal sentirse asi cuando el entorno laboral es exigente. ¿Quieres que exploremos alguna herramienta de calma o prefieres contarme más sobre lo que estás viviendo?",
    createdAt: "2026-02-14T10:02:00Z",
  },
];

// ── Mock empathic responses for chat ──
export const mockResponses: string[] = [
  "Gracias por compartir eso conmigo. Lo que sientes tiene sentido dada la situación. ¿Quieres que exploremos alguna herramienta que pueda ayudarte ahora mismo?",
  "Escucho lo que me dices y quiero que sepas que no estás solo/a en esto. Vamos paso a paso. ¿Qué es lo que más te preocupa en este momento?",
  "Es valiente hablar de esto. A veces solo ponerlo en palabras ya ayuda un poco. ¿Cómo te sientes ahora mismo, del 1 al 10?",
  "Entiendo. Eso suena realmente difícil. Recuerda que no tienes que resolverlo todo ahora. ¿Te gustaría probar un ejercicio de respiración rapido?",
  "Lo que describes es una reacción normal ante una situación que no es normal. Tu malestar es válido. ¿Quieres que busquemos un siguiente paso juntos?",
];
