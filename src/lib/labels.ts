export const serviceCategoryLabels: Record<string, { es: string; en: string }> = {
  terapia: { es: "Terapia", en: "Therapy" },
  crisis: { es: "Atención en crisis", en: "Crisis support" },
  psicopedagogia: { es: "Psicopedagogía", en: "Educational therapy" },
  diagnostico: { es: "Diagnóstico", en: "Assessment" },
};

export const courseTypeLabels: Record<string, { es: string; en: string }> = {
  charla: { es: "Charla", en: "Talk" },
  curso: { es: "Curso", en: "Course" },
  capacitacion: { es: "Capacitación", en: "Training" },
};

export const weekdayLabels: Record<number, { es: string; en: string }> = {
  0: { es: "Domingo", en: "Sunday" },
  1: { es: "Lunes", en: "Monday" },
  2: { es: "Martes", en: "Tuesday" },
  3: { es: "Miércoles", en: "Wednesday" },
  4: { es: "Jueves", en: "Thursday" },
  5: { es: "Viernes", en: "Friday" },
  6: { es: "Sábado", en: "Saturday" },
};

export const appointmentStatusLabels: Record<string, { es: string; en: string }> = {
  pendiente: { es: "Pendiente", en: "Pending" },
  confirmada: { es: "Confirmada", en: "Confirmed" },
  completada: { es: "Completada", en: "Completed" },
  cancelada: { es: "Cancelada", en: "Cancelled" },
};

export const paymentStatusLabels: Record<string, { es: string; en: string }> = {
  pendiente: { es: "Pendiente", en: "Pending" },
  pagado: { es: "Pagado", en: "Paid" },
};

export function labelOf(
  map: Record<string, { es: string; en: string }>,
  key: string,
  lang: "es" | "en",
): string {
  return map[key]?.[lang] ?? key;
}