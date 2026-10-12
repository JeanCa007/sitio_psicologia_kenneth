export function formatCrc(n: number): string {
  try {
    return `₡${new Intl.NumberFormat("es-CR").format(n)}`;
  } catch {
    return `₡${n}`;
  }
}

export function formatUsd(n: number): string {
  try {
    return `$${new Intl.NumberFormat("en-US").format(n)}`;
  } catch {
    return `$${n}`;
  }
}

export function formatDuration(min: number): string {
  if (min >= 60 && min % 60 === 0) return `${min / 60} h`;
  return `${min} min`;
}

export function formatDateLong(dateStr: string | null, locale: string): string {
  if (!dateStr) return "";
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(y, m - 1, d));
  } catch {
    return dateStr;
  }
}