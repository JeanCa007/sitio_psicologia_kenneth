export interface ServiceRow {
  id: string;
  slug: string;
  name_es: string;
  name_en: string;
  category: string;
  short_es: string;
  short_en: string;
  description_es: string;
  description_en: string;
  duration_min: number;
  price_crc: number;
  price_usd: number;
  icon: string;
  image_url: string;
  includes_es: string[];
  includes_en: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

export interface CourseRow {
  id: string;
  title_es: string;
  title_en: string;
  type: string;
  description_es: string;
  description_en: string;
  modality: string;
  start_date: string | null;
  start_time: string;
  duration_min: number;
  price_crc: number;
  price_usd: number;
  cover_url: string;
  is_active: boolean;
  created_at: string;
}

export interface AvailabilityRow {
  id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  is_active: boolean;
}

export interface AppointmentRow {
  id: string;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  service_slug: string;
  service_name: string;
  preferred_date: string | null;
  preferred_time: string;
  modality: string;
  timezone: string;
  notes: string;
  status: string;
  payment_status: string;
  meet_link: string;
  created_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  motivo: string;
  message: string;
  created_at: string;
}

export interface SiteIdentity {
  brand: string;
  tagline_es: string;
  tagline_en: string;
  description_es: string;
  description_en: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  email: string;
  location_es: string;
  location_en: string;
  schedule_es: string;
  schedule_en: string;
  meetLink: string;
  therapist: string;
  currency: string;
  timezone: string;
  aboutImageUrl: string;
  aboutTitle_es: string;
  aboutTitle_en: string;
  aboutText_es: string;
  aboutText_en: string;
}

export interface PaymentInfo {
  intro_es: string;
  intro_en: string;
  sinpeName: string;
  sinpePhone: string;
  bank: string;
  bankAccount: string;
  bankAccountName: string;
  ivaNote_es: string;
  ivaNote_en: string;
}