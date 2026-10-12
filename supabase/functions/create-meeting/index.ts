import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function buildEndTime(time: string, durationMin: number): string {
  const [h, m] = time.split(":").map((n) => parseInt(n, 10));
  const total = h * 60 + m + (Number.isFinite(durationMin) && durationMin > 0 ? durationMin : 50);
  const eh = Math.floor((total % (24 * 60)) / 60);
  const em = total % 60;
  return `${String(eh).padStart(2, "0")}:${String(em).padStart(2, "0")}`;
}

async function getGoogleAccessToken(): Promise<string | null> {
  const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
  const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GOOGLE_REFRESH_TOKEN");
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.access_token as string) || null;
}

interface GoogleEventResponse {
  hangoutLink?: string;
  htmlLink?: string;
  id?: string;
}

async function createCalendarEvent(
  accessToken: string,
  params: {
    title: string;
    description: string;
    date: string;
    time: string;
    endTime: string;
    timezone: string;
    attendeeEmail: string;
    requestId: string;
  },
): Promise<GoogleEventResponse | null> {
  const body: Record<string, unknown> = {
    summary: params.title,
    description: params.description,
    start: { dateTime: `${params.date}T${params.time}:00`, timeZone: params.timezone },
    end: { dateTime: `${params.date}T${params.endTime}:00`, timeZone: params.timezone },
    conferenceData: {
      createRequest: {
        requestId: params.requestId,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
  };
  if (params.attendeeEmail) {
    body.attendees = [{ email: params.attendeeEmail }];
  }

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=none",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) return null;
  return (await res.json()) as GoogleEventResponse;
}

async function sendEmail(params: {
  to: string;
  meetLink: string;
  patientName: string;
  brand: string;
  therapist: string;
  date: string;
  time: string;
  serviceName: string;
}): Promise<boolean> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  const fromDomain = Deno.env.get("RESEND_FROM_DOMAIN");
  if (!apiKey || !fromDomain || !params.to) return false;

  const from = `noreply@${fromDomain}`;
  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; color:#2b2b2b; line-height:1.6; max-width:560px; margin:0 auto;">
      <h2 style="color:#8a5a44;">Tu sesión está confirmada</h2>
      <p>Hola ${params.patientName || ""},</p>
      <p>Tu reserva con <strong>${params.brand}</strong> quedó agendada.</p>
      <ul style="padding-left:18px;">
        <li><strong>Servicio:</strong> ${params.serviceName}</li>
        <li><strong>Fecha:</strong> ${params.date}</li>
        <li><strong>Hora:</strong> ${params.time}</li>
        <li><strong>Profesional:</strong> ${params.therapist}</li>
      </ul>
      <p style="margin:24px 0;">
        <a href="${params.meetLink}" style="background:#8a5a44;color:#fff;padding:12px 22px;border-radius:8px;text-decoration:none;font-weight:bold;">
          Abrir mi videollamada
        </a>
      </p>
      <p style="font-size:13px;color:#777;">Si el botón no funciona, copia este enlace en tu navegador:<br>${params.meetLink}</p>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: `Tu sesión con ${params.brand} - ${params.date} ${params.time}`,
      html,
    }),
  });
  return res.ok;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  let payload: Record<string, unknown> = {};
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid body" }, 400);
  }

  const appointmentId = String(payload.appointmentId || "");
  const patientName = String(payload.patientName || "");
  const patientEmail = String(payload.patientEmail || "");
  const serviceName = String(payload.serviceName || "");
  const date = String(payload.date || "");
  const time = String(payload.time || "");
  const timezone = String(payload.timezone || "America/Costa_Rica");
  const durationMin = Number(payload.durationMin || 50);
  const brand = String(payload.brand || "Sesión");
  const therapist = String(payload.therapist || "");

  if (!date || !time) {
    return json({ error: "Faltan la fecha y la hora." }, 400);
  }

  const accessToken = await getGoogleAccessToken();
  if (!accessToken) {
    return json({ error: "google_not_configured", meetLink: "", emailSent: false }, 200);
  }

  const endTime = buildEndTime(time, durationMin);
  const requestId = `${appointmentId || "cita"}-${Date.now()}`;
  const title = `${serviceName || "Sesión"} · ${patientName}`;
  const description = `Sesión virtual con ${brand}.${therapist ? ` Profesional: ${therapist}.` : ""}`;

  const event = await createCalendarEvent(accessToken, {
    title,
    description,
    date,
    time,
    endTime,
    timezone,
    attendeeEmail: patientEmail,
    requestId,
  });

  const meetLink = event?.hangoutLink || "";
  if (!meetLink) {
    return json({ error: "meet_failed", meetLink: "", emailSent: false }, 200);
  }

  let emailSent = false;
  if (patientEmail) {
    emailSent = await sendEmail({
      to: patientEmail,
      meetLink,
      patientName,
      brand,
      therapist,
      date,
      time: `${time} (${timezone})`,
      serviceName,
    });
  }

  if (appointmentId) {
    try {
      const supabaseAdmin = createClient(
        Deno.env.get("SUPABASE_URL") ?? "",
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      );
      await supabaseAdmin
        .from("appointments")
        .update({ meet_link: meetLink })
        .eq("id", appointmentId);
    } catch {
      /* keep returning the link even if saving fails */
    }
  }

  return json({ meetLink, emailSent, eventLink: event?.htmlLink || "" }, 200);
});
