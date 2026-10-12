import type { AvailabilityRow, CourseRow, ServiceRow } from "@/lib/types";

export const fallbackServices: ServiceRow[] = [
  {
    id: "srv-terapia-individual",
    slug: "terapia-psicologica-individual",
    name_es: "Terapia psicológica individual",
    name_en: "Individual therapy",
    category: "terapia",
    short_es: "Un espacio personal para gestionar ansiedad, estrés, autoestima y momentos difíciles.",
    short_en: "A personal space to manage anxiety, stress, self-esteem and hard moments.",
    description_es:
      "La terapia individual es un espacio confidencial diseñado para ti. Trabajamos juntos en comprender tus emociones, desarrollar herramientas prácticas y construir una vida más equilibrada.",
    description_en:
      "Individual therapy is a confidential space designed for you. We work together to understand your emotions, develop practical tools and build a more balanced life.",
    duration_min: 50,
    price_crc: 28000,
    price_usd: 45,
    icon: "ri-user-heart-line",
    image_url:
      "https://readdy.ai/api/search-image?query=Calm%20minimalist%20therapy%20session%20scene%20with%20soft%20warm%20neutral%20tones%2C%20two%20comfortable%20armchairs%20and%20a%20small%20plant%2C%20natural%20window%20light%2C%20serene%20editorial%20photography%2C%20gentle%20shadows&width=1200&height=800&seq=service-terapia-individual-01&orientation=landscape",
    includes_es: ["Sesión de 50 minutos por videollamada", "Plan de trabajo personalizado", "Ejercicios y recursos entre sesiones", "Espacio 100% confidencial"],
    includes_en: ["50-minute video call session", "Personalized work plan", "Exercises and resources between sessions", "100% confidential space"],
    is_active: true,
    sort_order: 1,
    created_at: "",
  },
  {
    id: "srv-terapia-pareja",
    slug: "terapia-de-pareja",
    name_es: "Terapia de pareja",
    name_en: "Couples therapy",
    category: "terapia",
    short_es: "Mejoren la comunicación y reconecten con el acompañamiento de un profesional.",
    short_en: "Improve communication and reconnect with professional support.",
    description_es:
      "Un espacio neutral para conversar, escucharse y reconstruir la relación. Trabajamos comunicación, resolución de conflictos, límites y reconexión emocional.",
    description_en:
      "A neutral space to talk, listen and rebuild the relationship. We work on communication, conflict resolution, boundaries and emotional reconnection.",
    duration_min: 60,
    price_crc: 40000,
    price_usd: 65,
    icon: "ri-heart-2-line",
    image_url:
      "https://readdy.ai/api/search-image?query=Warm%20minimalist%20couple%20conversation%20scene%20with%20soft%20terracotta%20and%20sage%20tones%2C%20cozy%20neutral%20interior%2C%20soft%20natural%20light%2C%20serene%20editorial%20photography&width=1200&height=800&seq=service-terapia-pareja-01&orientation=landscape",
    includes_es: ["Sesión de 60 minutos para ambos", "Enfoque en comunicación y vínculo", "Herramientas para el día a día", "Confidencialidad garantizada"],
    includes_en: ["60-minute session for both", "Focus on communication and bond", "Tools for everyday life", "Guaranteed confidentiality"],
    is_active: true,
    sort_order: 2,
    created_at: "",
  },
  {
    id: "srv-crisis",
    slug: "atencion-en-crisis",
    name_es: "Atención en crisis",
    name_en: "Crisis support",
    category: "crisis",
    short_es: "Apoyo inmediato para momentos difíciles. Prioridad cuando más lo necesitas.",
    short_en: "Immediate support for hard moments. Priority when you need it most.",
    description_es:
      "Cuando sientes que no puedes esperar, estamos aquí. La atención en crisis ofrece un espacio inmediato para estabilizar emociones y encontrar los siguientes pasos.",
    description_en:
      "When you feel you cannot wait, we are here. Crisis support offers an immediate space to stabilize emotions and find the next steps.",
    duration_min: 45,
    price_crc: 35000,
    price_usd: 55,
    icon: "ri-flashlight-line",
    image_url:
      "https://readdy.ai/api/search-image?query=Calm%20comforting%20abstract%20scene%20with%20soft%20sage%20green%20and%20cream%20tones%2C%20gentle%20light%20and%20warm%20shadow%2C%20supportive%20serene%20atmosphere%2C%20editorial%20photography&width=1200&height=800&seq=service-crisis-01&orientation=landscape",
    includes_es: ["Sesión de contención inmediata", "Prioridad de agenda por WhatsApp", "Herramientas de autorregulación", "Seguimiento cercano"],
    includes_en: ["Immediate containment session", "Priority scheduling by WhatsApp", "Self-regulation tools", "Close follow-up"],
    is_active: true,
    sort_order: 3,
    created_at: "",
  },
  {
    id: "srv-psicopedagogia",
    slug: "psicopedagogia",
    name_es: "Acompañamiento psicopedagógico",
    name_en: "Educational therapy",
    category: "psicopedagogia",
    short_es: "Estrategias de aprendizaje y apoyo escolar para niños y adolescentes.",
    short_en: "Learning strategies and school support for children and teens.",
    description_es:
      "Acompañamos a estudiantes y familias con dificultades de aprendizaje, atención, hábitos de estudio y motivación.",
    description_en:
      "We support students and families with learning difficulties, attention, study habits and motivation.",
    duration_min: 50,
    price_crc: 30000,
    price_usd: 48,
    icon: "ri-book-open-line",
    image_url:
      "https://readdy.ai/api/search-image?query=Bright%20minimalist%20study%20desk%20scene%20with%20notebooks%20and%20pencils%2C%20warm%20cream%20and%20sage%20tones%2C%20soft%20natural%20light%2C%20serene%20editorial%20photography&width=1200&height=800&seq=service-psicopedagogia-01&orientation=landscape",
    includes_es: ["Evaluación de necesidades de aprendizaje", "Plan de estrategias personalizado", "Orientación para la familia", "Seguimiento del progreso"],
    includes_en: ["Learning needs assessment", "Personalized strategy plan", "Family guidance", "Progress follow-up"],
    is_active: true,
    sort_order: 4,
    created_at: "",
  },
  {
    id: "srv-diagnostico",
    slug: "diagnostico-psicopedagogico",
    name_es: "Diagnóstico psicopedagógico",
    name_en: "Educational assessment",
    category: "diagnostico",
    short_es: "Evaluación completa con informe profesional para tomar mejores decisiones.",
    short_en: "Complete assessment with a professional report for better decisions.",
    description_es:
      "Realizamos una evaluación integral del proceso de aprendizaje y del desarrollo, con instrumentos validados.",
    description_en:
      "We carry out a comprehensive assessment of the learning and development process using validated instruments.",
    duration_min: 90,
    price_crc: 75000,
    price_usd: 115,
    icon: "ri-clipboard-line",
    image_url:
      "https://readdy.ai/api/search-image?query=Tidy%20minimalist%20assessment%20scene%20with%20clipboard%20and%20notes%20on%20a%20warm%20desk%2C%20cream%20and%20terracotta%20tones%2C%20soft%20natural%20light%2C%20serene%20editorial%20photography&width=1200&height=800&seq=service-diagnostico-01&orientation=landscape",
    includes_es: ["Entrevista inicial con la familia", "Aplicación de pruebas y observación", "Informe profesional escrito", "Devolución de resultados y recomendaciones"],
    includes_en: ["Initial family interview", "Testing and observation", "Written professional report", "Results and recommendations"],
    is_active: true,
    sort_order: 5,
    created_at: "",
  },
  {
    id: "srv-infantil",
    slug: "terapia-infantil-adolescente",
    name_es: "Terapia infantil y adolescente",
    name_en: "Child and teen therapy",
    category: "terapia",
    short_es: "Acompañamiento emocional adaptado a cada etapa del crecimiento.",
    short_en: "Emotional support adapted to each stage of growth.",
    description_es:
      "Un espacio seguro y adaptado a la edad para que niños y adolescentes expresen lo que sienten.",
    description_en:
      "A safe, age-adapted space for children and teens to express how they feel.",
    duration_min: 50,
    price_crc: 30000,
    price_usd: 48,
    icon: "ri-emotion-happy-line",
    image_url:
      "https://readdy.ai/api/search-image?query=Playful%20yet%20calm%20children%20therapy%20scene%20with%20soft%20toys%20and%20warm%20neutral%20tones%2C%20gentle%20natural%20light%2C%20serene%20editorial%20photography&width=1200&height=800&seq=service-infantil-01&orientation=landscape",
    includes_es: ["Sesiones adaptadas a la edad", "Involucramiento de la familia", "Actividades y juego terapéutico", "Orientación para casa"],
    includes_en: ["Age-adapted sessions", "Family involvement", "Activities and therapeutic play", "Guidance for home"],
    is_active: true,
    sort_order: 6,
    created_at: "",
  },
];

export const fallbackCourses: CourseRow[] = [
  {
    id: "cur-ansiedad",
    title_es: "Taller: Manejo de la ansiedad en el día a día",
    title_en: "Workshop: Managing everyday anxiety",
    type: "charla",
    description_es:
      "Una charla práctica para entender qué es la ansiedad y aprender técnicas concretas de respiración, organización y regulación emocional.",
    description_en:
      "A practical talk to understand anxiety and learn concrete breathing, organization and emotional regulation techniques.",
    modality: "Google Meet",
    start_date: "2026-11-08",
    start_time: "10:00",
    duration_min: 90,
    price_crc: 15000,
    price_usd: 24,
    cover_url:
      "https://readdy.ai/api/search-image?query=Calm%20wellness%20workshop%20scene%20with%20soft%20sage%20green%20and%20cream%20tones%2C%20minimalist%20abstract%20breathing%20shapes%2C%20serene%20editorial%20photography%2C%20gentle%20light&width=1200&height=800&seq=course-ansiedad-01&orientation=landscape",
    is_active: true,
    created_at: "",
  },
  {
    id: "cur-crianza",
    title_es: "Curso: Crianza positiva y límites con amor",
    title_en: "Course: Positive parenting and loving boundaries",
    type: "curso",
    description_es:
      "Programa de 4 encuentros para padres y madres que quieren criar con conexión y poner límites sin gritos.",
    description_en:
      "A 4-session program for parents who want to raise with connection and set boundaries without yelling.",
    modality: "Google Meet",
    start_date: "2026-11-14",
    start_time: "18:00",
    duration_min: 90,
    price_crc: 45000,
    price_usd: 72,
    cover_url:
      "https://readdy.ai/api/search-image?query=Warm%20cozy%20family%20learning%20scene%20with%20soft%20terracotta%20and%20cream%20tones%2C%20minimalist%20abstract%20figures%2C%20serene%20editorial%20photography%2C%20gentle%20light&width=1200&height=800&seq=course-crianza-01&orientation=landscape",
    is_active: true,
    created_at: "",
  },
  {
    id: "cur-pap",
    title_es: "Capacitación: Primeros auxilios psicológicos",
    title_en: "Training: Psychological first aid",
    type: "capacitacion",
    description_es:
      "Formación para profesionales, docentes y equipos que desean aprender a contener y orientar a personas en crisis.",
    description_en:
      "Training for professionals, teachers and teams who want to learn to support people in crisis.",
    modality: "Google Meet",
    start_date: "2026-11-22",
    start_time: "09:00",
    duration_min: 180,
    price_crc: 30000,
    price_usd: 48,
    cover_url:
      "https://readdy.ai/api/search-image?query=Professional%20warm%20training%20scene%20with%20soft%20neutral%20and%20sage%20tones%2C%20minimalist%20abstract%20hands%20supporting%2C%20serene%20editorial%20photography%2C%20gentle%20light&width=1200&height=800&seq=course-pap-01&orientation=landscape",
    is_active: true,
    created_at: "",
  },
  {
    id: "cur-sueno",
    title_es: "Charla: Sueño, descanso y bienestar emocional",
    title_en: "Talk: Sleep, rest and emotional wellbeing",
    type: "charla",
    description_es:
      "Descubre cómo el descanso influye en tus emociones y aprende rutinas de sueño saludables.",
    description_en:
      "Discover how rest influences your emotions and learn healthy sleep routines.",
    modality: "WhatsApp",
    start_date: "2026-12-05",
    start_time: "19:00",
    duration_min: 60,
    price_crc: 12000,
    price_usd: 19,
    cover_url:
      "https://readdy.ai/api/search-image?query=Peaceful%20calm%20night%20wellness%20scene%20with%20soft%20warm%20neutral%20tones%2C%20minimalist%20moon%20and%20stars%20abstract%2C%20serene%20editorial%20photography%2C%20gentle%20light&width=1200&height=800&seq=course-sueno-01&orientation=landscape",
    is_active: true,
    created_at: "",
  },
];

export const fallbackAvailability: AvailabilityRow[] = [
  { id: "av-1", weekday: 1, start_time: "07:00", end_time: "20:00", slot_minutes: 60, is_active: true },
  { id: "av-2", weekday: 2, start_time: "07:00", end_time: "20:00", slot_minutes: 60, is_active: true },
  { id: "av-3", weekday: 3, start_time: "07:00", end_time: "20:00", slot_minutes: 60, is_active: true },
  { id: "av-4", weekday: 4, start_time: "07:00", end_time: "20:00", slot_minutes: 60, is_active: true },
  { id: "av-5", weekday: 5, start_time: "07:00", end_time: "20:00", slot_minutes: 60, is_active: true },
  { id: "av-6", weekday: 6, start_time: "08:00", end_time: "14:00", slot_minutes: 60, is_active: true },
];