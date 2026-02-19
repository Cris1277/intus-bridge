import { prisma } from "../lib/prisma";
import { Mood, ScenarioType, ToolType } from "@prisma/client";
import bcrypt from "bcrypt";

/**
 * Seed idempotente:
 * - Crea/actualiza el usuario demo
 * - Inserta tools/scenarios/resources
 * - Inserta journalEntries/checkIns con fechas del mock
 * - Inserta una conversación y mensajes del mock
 */
async function main() {
  // 1) Usuario demo (mapeamos u1 -> user real)
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const user = await prisma.user.upsert({
    where: { email: "ana@ejemplo.com" },
    update: { name: "Ana", passwordHash },
    create: {
      id: "u1", // mantenemos el id del mock para que cuadre con userId
      email: "ana@ejemplo.com",
      name: "Ana",
      passwordHash,
    },
  });

  // 2) Tools
  const tools = [
    {
      id: "t1",
      title: "Respiración 4-7-8",
      type: ToolType.breathing,
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
      type: ToolType.breathing,
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
      type: ToolType.grounding,
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
      type: ToolType.grounding,
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
      type: ToolType.reframe,
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
      type: ToolType.selftalk,
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
      type: ToolType.selftalk,
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
      type: ToolType.reframe,
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

  for (const t of tools) {
    await prisma.tool.upsert({
      where: { id: t.id },
      update: {
        title: t.title,
        type: t.type,
        description: t.description,
        durationMin: t.durationMin,
        steps: [...t.steps],
      },
      create: { ...t, steps: [...t.steps] },
    });
  }

  // 3) Scenarios
  const scenarios = [
    {
      id: "s1",
      type: ScenarioType.bullying_school,
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
      createdAt: new Date("2026-01-15T10:00:00Z"),
    },
    {
      id: "s2",
      type: ScenarioType.bullying_school,
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
      createdAt: new Date("2026-01-15T10:00:00Z"),
    },
    {
      id: "s3",
      type: ScenarioType.bullying_work,
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
      createdAt: new Date("2026-01-20T10:00:00Z"),
    },
    {
      id: "s4",
      type: ScenarioType.bullying_work,
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
      createdAt: new Date("2026-01-20T10:00:00Z"),
    },
    {
      id: "s5",
      type: ScenarioType.anxiety,
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
      createdAt: new Date("2026-01-25T10:00:00Z"),
    },
    {
      id: "s6",
      type: ScenarioType.stress,
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
      createdAt: new Date("2026-01-28T10:00:00Z"),
    },
  ];

  for (const s of scenarios) {
    await prisma.scenario.upsert({
      where: { id: s.id },
      update: {
        type: s.type,
        title: s.title,
        description: s.description,
        steps: [...s.steps],
        createdAt: s.createdAt,
      },
      create: {
        id: s.id,
        type: s.type,
        title: s.title,
        description: s.description,
        steps: [...s.steps],
        createdAt: s.createdAt,
      },
    });
  }

  // 4) Resources
  const resources = [
    {
      id: "r1",
      title: "Emergencias",
      description:
        "Número de emergencias en España. Llama si estás en peligro inmediato.",
      type: "emergency",
      phone: "112",
      url: null as string | null,
    },
    {
      id: "r2",
      title: "Linea 024",
      description:
        "Línea de atención a la conducta suicida, disponible 24 horas.",
      type: "emergency",
      phone: "024",
      url: null as string | null,
    },
    {
      id: "r3",
      title: "Teléfono de la Esperanza",
      description: "Línea de ayuda emocional y prevención del suicidio.",
      type: "professional",
      phone: "717 003 717",
      url: null as string | null,
    },
    {
      id: "r4",
      title: "Colegio Oficial de Psicólogos",
      description: "Busca un profesional de la psicología cerca de ti.",
      type: "professional",
      phone: null as string | null,
      url: "https://www.cop.es",
    },
    {
      id: "r5",
      title: "Guia sobre acoso escolar (AEPAE)",
      description: "Información y recursos sobre bullying escolar.",
      type: "education",
      phone: null as string | null,
      url: "https://aepae.es",
    },
    {
      id: "r6",
      title: "Guia sobre acoso laboral",
      description: "Información sobre mobbing y derechos laborales.",
      type: "education",
      phone: null as string | null,
      url: "https://www.mites.gob.es",
    },
  ];

  for (const r of resources) {
    await prisma.resourceLink.upsert({
      where: { id: r.id },
      update: {
        title: r.title,
        description: r.description,
        type: r.type,
        phone: r.phone ?? undefined,
        url: r.url ?? undefined,
      },
      create: {
        id: r.id,
        title: r.title,
        description: r.description,
        type: r.type,
        phone: r.phone ?? undefined,
        url: r.url ?? undefined,
      },
    });
  }

  // 5) Journal Entries
  const journalEntries = [
    {
      id: "j1",
      userId: user.id,
      title: "Hoy fue un día difícil en el trabajo",
      content:
        "Mi jefe hizo un comentario delante de todo el equipo que me hizo sentir muy pequeña. No sé si fue intencionado, pero me quedé bloqueada. Intenté respirar y salir un momento. Al llegar a casa lloré un rato y me sentí algo mejor.",
      mood: Mood.sad,
      tags: ["trabajo", "bullying", "emociones"],
      createdAt: new Date("2026-02-14T18:30:00Z"),
    },
    {
      id: "j2",
      userId: user.id,
      title: "Ansiedad antes de la reunión",
      content:
        "Llevo toda la mañana con el estómago encogido pensando en la reunión de esta tarde. Sé que no va a pasar nada malo, pero mi cuerpo no para de enviar señales de alerta. Voy a intentar la respiración 4-7-8 antes de entrar.",
      mood: Mood.anxious,
      tags: ["ansiedad", "trabajo", "respiracion"],
      createdAt: new Date("2026-02-13T09:15:00Z"),
    },
    {
      id: "j3",
      userId: user.id,
      title: "Pequeña victoria: puse un límite",
      content:
        "Hoy le dije a mi compañero que no me parecía bien como me habló ayer. Me temblaba la voz, pero lo dije. Él se disculpó. Me siento orgullosa aunque agotada.",
      mood: Mood.calm,
      tags: ["limites", "comunicacion", "logro"],
      createdAt: new Date("2026-02-12T20:00:00Z"),
    },
    {
      id: "j4",
      userId: user.id,
      title: "No puedo dormir por el estrés",
      content:
        "Son las 2 de la mañana y sigo dando vueltas. Tengo demasiadas cosas en la cabeza: el proyecto, la situación con mi equipo, la presentación del viernes. Voy a intentar escribir aqui todo lo que me agobia para sacarlo de mi mente.",
      mood: Mood.stressed,
      tags: ["estrés", "insomnio", "trabajo"],
      createdAt: new Date("2026-02-11T02:00:00Z"),
    },
    {
      id: "j5",
      userId: user.id,
      title: "Recordando lo del instituto",
      content:
        "Hoy vi una noticia sobre bullying escolar y me volvieron recuerdos de cuando tenía 14 años. Ya no duele igual, pero sigue ahí. Creo que es bueno reconocerlo y recordarme que ya no estoy en esa situación.",
      mood: Mood.sad,
      tags: ["bullying", "pasado", "reflexion"],
      createdAt: new Date("2026-02-10T17:45:00Z"),
    },
    {
      id: "j6",
      userId: user.id,
      title: "Un buen día, por fin",
      content:
        "Hoy el día fue tranquilo. Trabajé sin interrupciones, comí con calma y por la tarde fui a pasear. A veces se me olvida que los días buenos también existen. Quiero recordar este momento.",
      mood: Mood.calm,
      tags: ["bienestar", "gratitud", "calma"],
      createdAt: new Date("2026-02-09T21:00:00Z"),
    },
  ];

  for (const j of journalEntries) {
    await prisma.journalEntry.upsert({
      where: { id: j.id },
      update: {
        title: j.title,
        content: j.content,
        mood: j.mood,
        tags: [...j.tags],
        createdAt: j.createdAt,
      },
      create: {
        id: j.id,
        userId: j.userId,
        title: j.title,
        content: j.content,
        mood: j.mood,
        tags: [...j.tags],
        createdAt: j.createdAt,
      },
    });
  }

  // 6) Check-ins
  const checkIns = [
    {
      id: "c1",
      userId: user.id,
      mood: Mood.anxious,
      stressLevel: 7,
      energyLevel: 4,
      createdAt: new Date("2026-02-14T08:00:00Z"),
    },
    {
      id: "c2",
      userId: user.id,
      mood: Mood.stressed,
      stressLevel: 8,
      energyLevel: 3,
      createdAt: new Date("2026-02-13T08:00:00Z"),
    },
    {
      id: "c3",
      userId: user.id,
      mood: Mood.ok,
      stressLevel: 5,
      energyLevel: 6,
      createdAt: new Date("2026-02-12T08:00:00Z"),
    },
    {
      id: "c4",
      userId: user.id,
      mood: Mood.calm,
      stressLevel: 3,
      energyLevel: 7,
      createdAt: new Date("2026-02-11T08:00:00Z"),
    },
    {
      id: "c5",
      userId: user.id,
      mood: Mood.sad,
      stressLevel: 6,
      energyLevel: 3,
      createdAt: new Date("2026-02-10T08:00:00Z"),
    },
    {
      id: "c6",
      userId: user.id,
      mood: Mood.ok,
      stressLevel: 4,
      energyLevel: 5,
      createdAt: new Date("2026-02-09T08:00:00Z"),
    },
    {
      id: "c7",
      userId: user.id,
      mood: Mood.calm,
      stressLevel: 2,
      energyLevel: 8,
      createdAt: new Date("2026-02-08T08:00:00Z"),
    },
  ];

  for (const c of checkIns) {
    await prisma.checkIn.upsert({
      where: { id: c.id },
      update: {
        mood: c.mood,
        stressLevel: c.stressLevel,
        energyLevel: c.energyLevel,
        createdAt: c.createdAt,
      },
      create: {
        id: c.id,
        userId: c.userId,
        mood: c.mood,
        stressLevel: c.stressLevel,
        energyLevel: c.energyLevel,
        createdAt: c.createdAt,
      },
    });
  }

  // 7) Conversation + Messages (mock)
  await prisma.conversation.upsert({
    where: { id: "conv1" },
    update: { userId: user.id },
    create: {
      id: "conv1",
      userId: user.id,
      createdAt: new Date("2026-02-14T10:00:00Z"),
    },
  });

  const messages = [
    {
      id: "m1",
      conversationId: "conv1",
      role: "assistant",
      content:
        "Hola, me alegra que estés aqui. Este es un espacio seguro para ti. ¿Cómo te sientes hoy?",
      createdAt: new Date("2026-02-14T10:00:00Z"),
      safetyFlags: [] as string[],
    },
    {
      id: "m2",
      conversationId: "conv1",
      role: "user",
      content:
        "Estoy bastante estresada por el trabajo. Mi jefe no para de presionarme.",
      createdAt: new Date("2026-02-14T10:01:00Z"),
      safetyFlags: [] as string[],
    },
    {
      id: "m3",
      conversationId: "conv1",
      role: "assistant",
      content:
        "Entiendo que la presión constante es agotadora. Es normal sentirse asi cuando el entorno laboral es exigente. ¿Quieres que exploremos alguna herramienta de calma o prefieres contarme más sobre lo que estás viviendo?",
      createdAt: new Date("2026-02-14T10:02:00Z"),
      safetyFlags: [] as string[],
    },
  ];

  for (const m of messages) {
    await prisma.message.upsert({
      where: { id: m.id },
      update: {
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
        safetyFlags: [...m.safetyFlags],
        conversationId: m.conversationId,
      },
      create: {
        id: m.id,
        conversationId: m.conversationId,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
        safetyFlags: [...m.safetyFlags],
      },
    });
  }

  console.log(
    "✅ Seed completado: user/tools/scenarios/resources/journal/checkins/messages",
  );
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
