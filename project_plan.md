# PsicoNova — Psicología y Psicopedagogía Virtual

## 1. Project Description

Sitio web de servicios de **psicología y psicopedagogía 100% virtual**, con atención por
videollamada en **WhatsApp o Google Meet**. Ofrece terapia individual, atención en crisis,
charlas, capacitaciones y diagnósticos psicopedagógicos.

- **Público objetivo:** personas en Costa Rica (y fuera) que buscan acompañamiento
  psicológico/psicopedagógico accesible desde cualquier lugar.
- **Propuesta de valor:** atención virtual cercana y flexible, precios claros desde
  **₡28.000 + IVA** (también en dólares), con reserva de citas sencilla y pago por
  SINPE Móvil / transferencia (a futuro, pago en línea con Tilopay).
- **Escalabilidad:** enfoque **mobile-first**, con navegación simple y botones de contacto
  (WhatsApp) siempre a la mano.

## 2. Page Structure

### Sitio público
- `/` — Inicio (hero, servicios destacados, cómo funciona, precios, CTA)
- `/servicios` — Lista de servicios (terapia, atención en crisis, charlas, diagnósticos)
- `/servicios/:slug` — Detalle de servicio
- `/cursos` — Cursos, charlas y capacitaciones
- `/cursos/:id` — Detalle de curso/charla
- `/precios` — Tarifas (colones + dólares) y métodos de pago
- `/reservar` — Reserva de cita virtual
- `/sobre-mi` — Sobre el profesional / equipo
- `/contacto` — Contacto
- `/pago` — Instrucciones de pago (SINPE / transferencia) + subir comprobante

### Panel de administrador (protegido con login)
- `/admin/login` — Inicio de sesión
- `/admin` — Dashboard (resumen)
- `/admin/citas` — Gestionar citas (confirmar, reprogramar, estado de pago)
- `/admin/horarios` — Horarios y disponibilidad
- `/admin/servicios` — Servicios y precios
- `/admin/cursos` — Cursos, charlas y capacitaciones
- `/admin/contenido` — Contenido del sitio (textos, imágenes, contacto)

## 3. Core Features

- [ ] Sitio público responsive mobile-first
- [ ] Catálogo de servicios con descripciones y precios (₡ + USD)
- [ ] Cursos, charlas y capacitaciones
- [ ] Botones de contacto directo por WhatsApp / Google Meet
- [ ] Reserva de citas virtuales (formulario con servicio, fecha, hora, modalidad)
- [ ] Página de pago con datos de SINPE Móvil / transferencia y subida de comprobante
- [ ] Formulario de contacto
- [ ] Login de administrador
- [ ] Panel admin: CRUD de servicios y precios
- [ ] Panel admin: CRUD de cursos/charlas
- [ ] Panel admin: gestión de horarios y disponibilidad
- [ ] Panel admin: gestión de citas (estado, confirmación, pago)
- [ ] Panel admin: edición de contenido del sitio
- [ ] Pago en línea con Tilopay (fase futura)

## 4. Data Model Design

### Table: user_roles
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Referencia a auth.users |
| role | text | admin / therapist |
| created_at | timestamptz | Fecha de creación |

### Table: services
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| slug | text | Identificador URL |
| name | text | Nombre del servicio |
| category | text | terapia / crisis / diagnostico / charla |
| description | text | Descripción |
| duration_min | int | Duración en minutos |
| price_crc | numeric | Precio en colones |
| price_usd | numeric | Precio en dólares |
| image_url | text | Imagen |
| is_active | boolean | Visible en el sitio |
| sort_order | int | Orden |
| created_at | timestamptz | Fecha de creación |

### Table: courses
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| title | text | Título |
| type | text | curso / charla / capacitacion |
| description | text | Descripción |
| modality | text | whatsapp / meet |
| start_date | timestamptz | Fecha y hora |
| duration_min | int | Duración |
| price_crc | numeric | Precio en colones |
| price_usd | numeric | Precio en dólares |
| cover_url | text | Imagen de portada |
| is_active | boolean | Visible |
| created_at | timestamptz | Fecha de creación |

### Table: availability
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| weekday | int | Día de la semana (0-6) |
| start_time | time | Hora inicio |
| end_time | time | Hora fin |
| slot_minutes | int | Duración del bloque |
| is_active | boolean | Activo |

### Table: appointments
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| patient_name | text | Nombre del paciente |
| patient_email | text | Correo |
| patient_phone | text | Teléfono |
| service_id | uuid | Servicio solicitado |
| preferred_date | date | Fecha deseada |
| preferred_time | time | Hora deseada |
| modality | text | whatsapp / meet |
| notes | text | Notas |
| meet_link | text | Enlace de Google Meet generado |
| status | text | pendiente / confirmada / completada / cancelada |
| payment_status | text | pendiente / pagado |
| created_at | timestamptz | Fecha de creación |

### Table: payments
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| appointment_id | uuid | Cita asociada |
| amount | numeric | Monto |
| currency | text | CRC / USD |
| method | text | sinpe / transferencia / tilopay |
| status | text | pendiente / verificado / rechazado |
| reference | text | Referencia |
| proof_url | text | Comprobante |
| created_at | timestamptz | Fecha de creación |

### Table: site_content
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| key | text | Clave del bloque |
| value | jsonb | Valor del contenido |
| updated_at | timestamptz | Última actualización |

### Table: contact_messages
| Field | Type | Description |
|-------|------|-------------|
| id | uuid | Primary key |
| name | text | Nombre |
| email | text | Correo |
| phone | text | Teléfono |
| message | text | Mensaje |
| created_at | timestamptz | Fecha de creación |

## 5. Backend / Third-party Integration Plan

- **Database:** SaaS Supabase (el proyecto propio del usuario) — se conecta ahora.
- **Auth:** Supabase Auth para el login del administrador (con roles en `user_roles`).
- **Storage:** Supabase Storage para comprobantes de pago e imágenes del sitio.
- **Pagos:** SINPE Móvil / transferencia bancaria + subida de comprobante (fase actual);
  **Tilopay** como pago en línea en una fase futura.
- **Mensajería:** enlaces de WhatsApp (`wa.me`) y enlaces de Google Meet.
- **Google Meet automático:** Edge Function `create-meeting` que crea un evento real en
  Google Calendar (API con OAuth) y devuelve el enlace de Meet por cita.
- **Correo:** Resend para enviar el enlace de la sesión al paciente automáticamente.

## 6. Development Phase Plan

### Phase 1: Sitio público (UI mobile-first, datos demo) ✅ Completada
- Goal: que el sitio público se vea completo y navegable con datos de ejemplo.
- Deliverable: Inicio, Servicios (+detalle), Cursos, Precios, Reservar, Pago, Contacto,
  Sobre mí, con navegación responsive y CTAs de WhatsApp/Meet.

### Phase 2: Conexión y estructura de datos ✅ Completada
- Goal: preparar la base de datos en Supabase.
- Deliverable: conexión a Supabase, tablas `services`, `courses`, `availability`,
  `appointments`, `contact_messages`, `site_settings` y `admins`, con políticas RLS
  (público lee / crea, solo admin edita) y datos iniciales cargados.

### Phase 3: Panel de administrador ✅ Completada
- Goal: que el administrador pueda entrar y gestionar todo el contenido.
- Deliverable: login con Supabase Auth (+ primer acceso/crear admin), guard de acceso,
  dashboard con métricas, CRUD de servicios/precios, cursos/charlas, horarios,
  gestión de citas (estado y pago) y bandeja de mensajes; edición de contenido del sitio.
- Rutas: `/admin/login`, `/admin`, `/admin/citas`, `/admin/mensajes`, `/admin/servicios`,
  `/admin/cursos`, `/admin/horarios`, `/admin/contenido`.

### Phase 4: Reservas y pagos reales ✅ Base lista
- Goal: conectar el flujo público con la base de datos.
- Deliverable: reserva de citas guardada en Supabase (con zona horaria del visitante),
  gestión de citas en el admin, subida de comprobante de pago (pendiente de Storage).
- **Google Meet automático + correo:** Edge Function `create-meeting` (Google Calendar API)
  que genera un enlace real por cita y lo envía por Resend. En el admin se puede ver,
  copiar, abrir y regenerar el enlace de cada cita.
  _Pendiente del usuario:_ configurar credenciales de Google (client id/secret + refresh token)
  y las claves de Resend.

### Phase 5: Extras y pago en línea
- Goal: completar la experiencia.
- Deliverable: pago en línea con Tilopay, correos de notificación (Resend),
  subida de comprobante de pago a Storage, blog/contenido.