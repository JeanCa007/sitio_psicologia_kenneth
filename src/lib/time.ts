export function tzOffsetMs(date: Date, timeZone: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const parts: Record<string, string> = {};
  for (const p of dtf.formatToParts(date)) parts[p.type] = p.value;
  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asUTC - date.getTime();
}

export function zonedToUtc(dateStr: string, timeStr: string, timeZone: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  const [hh, mm] = timeStr.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm, 0);
  const offset = tzOffsetMs(new Date(guess), timeZone);
  return new Date(guess - offset);
}

export function formatTimeInZone(date: Date, timeZone: string, locale: string): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      timeZone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return date.toISOString().slice(11, 16);
  }
}

export function weekdayInZone(dateStr: string, timeZone: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  const noonUtc = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  try {
    const s = new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(noonUtc);
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    if (s in map) return map[s];
  } catch {
    /* ignore */
  }
  return noonUtc.getUTCDay();
}

export function guessTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Costa_Rica";
  } catch {
    return "America/Costa_Rica";
  }
}

export function generateSlotTimes(start: string, end: string, slotMinutes: number): string[] {
  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const toStr = (mins: number) =>
    `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
  const out: string[] = [];
  const step = slotMinutes > 0 ? slotMinutes : 60;
  for (let t = toMin(start); t + step <= toMin(end); t += step) out.push(toStr(t));
  return out;
}