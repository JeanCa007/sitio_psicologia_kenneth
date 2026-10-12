import type { PaymentInfo, SiteIdentity } from "@/lib/types";

export const defaultIdentity: SiteIdentity = {
  brand: "PsicoNova",
  tagline_es: "Psicología y psicopedagogía virtual",
  tagline_en: "Virtual psychology and educational therapy",
  description_es:
    "Acompañamiento psicológico y psicopedagógico 100% en línea, por videollamada de WhatsApp o Google Meet. Terapia, atención en crisis, charlas y diagnósticos.",
  description_en:
    "100% online psychological and educational support by WhatsApp or Google Meet video call. Therapy, crisis support, talks and assessments.",
  whatsappNumber: "50688767344",
  whatsappDisplay: "+506 8876 7344",
  email: "hola@psiconova.cr",
  location_es: "Atención 100% virtual · Costa Rica",
  location_en: "100% online · Costa Rica",
  schedule_es: "Lunes a sábado · 7:00 a.m. a 8:00 p.m.",
  schedule_en: "Monday to Saturday · 7:00 a.m. to 8:00 p.m.",
  meetLink: "https://meet.google.com/",
  therapist: "Marcos Kenneth",
  currency: "CRC",
  timezone: "America/Costa_Rica",
  aboutImageUrl:
    "https://readdy.ai/api/search-image?query=Warm%20friendly%20professional%20Latin%20American%20male%20psychologist%20portrait%20in%20a%20calm%20bright%20room%2C%20soft%20terracotta%20and%20cream%20tones%2C%20natural%20window%20light%2C%20editorial%20photography%2C%20approachable%20and%20trustworthy&width=900&height=1100&seq=about-therapist-man-01&orientation=portrait&nocache=true",
  aboutTitle_es: "Acompaño personas a encontrar calma y claridad",
  aboutTitle_en: "I help people find calm and clarity",
  aboutText_es:
    "Soy psicólogo y psicopedagogo con más de 10 años de experiencia acompañando a niños, adolescentes, adultos y familias. Creo que la terapia es un espacio para respirar, entenderse y construir herramientas que se quedan contigo.\n\nOfrezco atención 100% virtual, para que puedas cuidar tu bienestar desde la comodidad de tu casa, con la misma cercanía de una consulta presencial.",
  aboutText_en:
    "I'm a psychologist and educational therapist with over 10 years of experience supporting children, teens, adults and families. I believe therapy is a space to breathe, understand yourself and build tools that stay with you.\n\nI offer 100% online care, so you can look after your wellbeing from the comfort of home, with the same closeness as an in-person session.",
};

export const defaultPayment: PaymentInfo = {
  intro_es:
    "Puedes pagar por SINPE Móvil o transferencia bancaria y enviarnos el comprobante. Así confirmamos tu cita de inmediato.",
  intro_en:
    "You can pay by SINPE Móvil or bank transfer and send us the receipt. That way we confirm your appointment right away.",
  sinpeName: "PsicoNova Psicología",
  sinpePhone: "8876 7344",
  bank: "Banco Nacional de Costa Rica",
  bankAccount: "CR05 0102 0000 1234 5678 90",
  bankAccountName: "PsicoNova Psicología S.A.",
  ivaNote_es:
    "Los precios se muestran desde ₡28.000 más IVA. También aceptamos pagos en dólares.",
  ivaNote_en:
    "Prices start at ₡28,000 plus VAT. We also accept payments in US dollars.",
};

export const siteInfo = {
  brand: defaultIdentity.brand,
  tagline: defaultIdentity.tagline_es,
  description: defaultIdentity.description_es,
  whatsappNumber: defaultIdentity.whatsappNumber,
  whatsappDisplay: defaultIdentity.whatsappDisplay,
  email: defaultIdentity.email,
  location: defaultIdentity.location_es,
  scheduleText: defaultIdentity.schedule_es,
  meetLink: defaultIdentity.meetLink,
};

// Backward-compatible aliases for legacy pages
export const paymentInfo = defaultPayment;

export const stats = [
  { value: "+1.200", label: "Sesiones virtuales" },
  { value: "10 años", label: "De experiencia" },
  { value: "100%", label: "En línea y confidencial" },
  { value: "4.9 / 5", label: "Valoración de pacientes" },
];