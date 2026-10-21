# Inscripción CEF

Aplicación Jamstack (Next.js App Router) para inscribir estudiantes de un Centro de Educación Física. El formulario es un asistente por pasos con validación Zod y, al enviar, anexa una fila a Google Sheets (o a un JSON local en desarrollo).

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- React Hook Form + Zod
- Google Sheets API v4 (`googleapis`, Service Account)
- Comprobante imprimible y PDF (`jspdf`)

## Puesta en marcha

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Para probar sin Google, en `.env.local`:

```
SHEETS_PROVIDER=local
```

Las inscripciones se guardan en `data/inscripciones.json`.

## Google Sheets

1. Creá un proyecto en Google Cloud y habilitá **Google Sheets API**.
2. Creá una **Service Account** y descargá el JSON.
3. Compartí la hoja de cálculo con el `client_email` de la cuenta (permiso Editor).
4. Completá en `.env.local`:
   - `GOOGLE_SHEETS_SPREADSHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (conservá los `\n`)
   - `SHEETS_PROVIDER=google`

Si la pestaña está vacía, el backend escribe la fila de encabezados y el primer legajo (`CEF-AAAA-0001`).

## Columnas de la planilla

| Col | Campo |
| --- | --- |
| 1 | LEGAJO |
| 2 | APELLIDO Y NOMBRE (`APELLIDO, NOMBRE`) |
| 3 | DNI |
| 4 | FECHA DE NACIMIENTO (`DD/MM/AAAA`) |
| 5 | EDAD (al 30/06 del ciclo) |
| 6 | TELEFONO (solo dígitos) |
| 7 | OBSERVACIONES |
| 8+ | Disciplinas (`X` si está inscripto) |

Después de las disciplinas se anexan turno, contacto, escuela, responsable, salud y autorización de imagen.

## Endpoints y archivos clave

- `src/lib/schema.ts` — validación Zod (incluye adulto si edad &lt; 18)
- `src/components/inscription/wizard.tsx` — wizard
- `src/app/api/inscribir/route.ts` — persistencia
- `src/lib/sheets.ts` — append transaccional (legajo autoincremental)
