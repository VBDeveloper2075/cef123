import { jsPDF } from "jspdf";
import { formatCuil } from "./age";
import {
  CICLO_LECTIVO,
  COOPERADORA_MONTO,
  CONDICIONES_SALUD,
  DISCIPLINAS,
  TURNOS,
} from "./constants";
import type { InscripcionForm } from "./schema";

export type Comprobante = {
  legajo: string;
  apellidoNombre: string;
  dni: string;
  cuil: string;
  fechaNacimiento: string;
  edad: number | null;
  observaciones: string;
  disciplinas: string[];
  turno: string;
  email: string;
  telefono: string;
  ficha?: InscripcionForm;
  montoCooperadora?: number;
};

const BLUE: [number, number, number] = [26, 61, 143];
const RED: [number, number, number] = [200, 16, 46];

async function loadLogo() {
  const res = await fetch("/cef123.jpg");
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function box(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
) {
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.3);
  doc.rect(x, y, w, h);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...BLUE);
  doc.text(label.toUpperCase(), x + 2, y + 4);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(20, 20, 20);
  const lines = doc.splitTextToSize(value || " ", w - 4);
  doc.text(lines, x + 2, y + 9);
}

function header(doc: jsPDF, logo: string | null, subtitle: string) {
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, 210, 8, "F");
  doc.setFillColor(...RED);
  doc.rect(0, 8, 210, 2, "F");
  if (logo) {
    doc.addImage(logo, "JPEG", 12, 14, 22, 22);
  }
  doc.setTextColor(...BLUE);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("CENTRO DE EDUCACION FISICA N. 123", 38, 22);
  doc.setTextColor(...RED);
  doc.setFontSize(11);
  doc.text("CASEROS", 38, 28);
  doc.setTextColor(...BLUE);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(subtitle, 38, 34);
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.6);
  doc.line(12, 40, 198, 40);
}

export async function descargarComprobantePdf(data: Comprobante) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const logo = await loadLogo().catch(() => null);
  const ficha = data.ficha ?? ({} as InscripcionForm);
  const turno = TURNOS.find((t) => t.id === data.turno)?.label ?? data.turno;
  const disciplinas = data.disciplinas
    .map((id) => DISCIPLINAS.find((d) => d.id === id)?.label ?? id)
    .join(" / ");
  const monto = data.montoCooperadora ?? COOPERADORA_MONTO;
  const hoy = new Date().toLocaleDateString("es-AR");

  header(doc, logo, `FICHA DE INSCRIPCION — CICLO LECTIVO ${CICLO_LECTIVO}`);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BLUE);
  doc.text(`LEGAJO ${data.legajo}`, 140, 34);

  let y = 44;
  box(doc, 12, y, 186, 16, "Apellido y nombre", data.apellidoNombre);
  y += 18;
  box(doc, 12, y, 58, 14, "DNI", data.dni || "Sin DNI");
  box(doc, 72, y, 70, 14, "CUIL", formatCuil(data.cuil || ficha.cuil));
  box(doc, 144, y, 54, 14, "Fecha de nacimiento", data.fechaNacimiento);
  y += 16;
  box(doc, 12, y, 40, 14, "Edad al 30/06", data.edad != null ? String(data.edad) : "—");
  box(doc, 54, y, 50, 14, "Turno", turno.toUpperCase());
  box(doc, 106, y, 92, 14, "Identidad de genero", ficha.identidadGenero);
  y += 16;
  box(doc, 12, y, 93, 14, "Lugar de nacimiento", ficha.lugarNacimiento);
  box(doc, 107, y, 91, 14, "Nacionalidad", ficha.nacionalidad);
  y += 16;
  box(
    doc,
    12,
    y,
    186,
    14,
    "Domicilio",
    `${ficha.calle} ${ficha.numero} ${ficha.pisoDepto} — ${ficha.localidad}, ${ficha.distrito}`,
  );
  y += 16;
  box(doc, 12, y, 90, 14, "Telefono", data.telefono);
  box(doc, 104, y, 94, 14, "Correo electronico", data.email);
  y += 16;
  box(doc, 12, y, 186, 22, "Propuesta educativa", ficha.propuestaEducativa);
  y += 24;
  box(doc, 12, y, 186, 14, "Disciplinas marcadas", disciplinas || "Segun propuesta");
  y += 16;
  box(
    doc,
    12,
    y,
    186,
    14,
    "Establecimiento de origen (opcional)",
    [ficha.nombreEscuela, ficha.anoEstudio, ficha.nivelModalidad, ficha.gestion]
      .filter(Boolean)
      .join(" — ") || "No corresponde / no asiste",
  );
  y += 16;
  box(doc, 12, y, 120, 14, "Adulto responsable", ficha.responsableNombre || "—");
  box(doc, 134, y, 64, 14, "Vinculo / DNI", `${ficha.responsableVinculo} ${ficha.responsableDni}`.trim() || "—");
  y += 20;
  doc.setFontSize(8);
  doc.setTextColor(...RED);
  doc.text(
    "Las solicitudes se consideraran segun los cupos disponibles y pueden quedar en lista de espera.",
    12,
    y,
  );
  y += 10;
  doc.setTextColor(60, 60, 60);
  doc.text("Firma del adulto responsable / estudiante mayor: ______________________    Aclaracion: ____________", 12, y);
  y += 8;
  doc.text(`Lugar y fecha: Caseros, ${hoy}`, 12, y);
  doc.setFontSize(7);
  doc.text("Hoja 1/3 — Ficha de inscripcion CEF 123 Caseros", 12, 287);

  doc.addPage();
  header(doc, logo, `FICHA MEDICA Y AUTORIZACION — CICLO ${CICLO_LECTIVO}`);
  y = 44;
  box(
    doc,
    12,
    y,
    186,
    14,
    "Cobertura medica",
    ficha.poseeObraSocial === "si"
      ? `${ficha.obraSocialNombre}  N. afiliado ${ficha.nroAfiliado}`
      : "No posee obra social / prepaga",
  );
  y += 16;
  const salud = ficha.condicionesSalud
    .map((id) => CONDICIONES_SALUD.find((c) => c.id === id)?.label)
    .filter(Boolean)
    .join(", ");
  box(doc, 12, y, 186, 18, "Antecedentes de salud", salud || "Sin condiciones marcadas");
  y += 20;
  box(doc, 12, y, 186, 16, "Detalle / alergias / medicacion", ficha.detalleSalud || "—");
  y += 18;
  box(doc, 12, y, 186, 14, "Hospital ante emergencias", ficha.hospitalEmergencia);
  y += 16;
  box(
    doc,
    12,
    y,
    186,
    14,
    "Contacto de emergencia",
    `${ficha.contactoEmergenciaNombre}  ${ficha.contactoEmergenciaTelefono}`,
  );
  y += 20;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BLUE);
  doc.text("Declaracion jurada de salud", 12, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  const dj = doc.splitTextToSize(
    "Declaro bajo juramento que los datos de salud informados son verdaderos y me comprometo a comunicar cualquier cambio relevante para la practica deportiva.",
    186,
  );
  doc.text(dj, 12, y);
  y += dj.length * 5 + 8;
  box(
    doc,
    12,
    y,
    186,
    22,
    "Autorizacion de uso de imagen",
    ficha.completarAutorizacionImagen && ficha.imagenConsentimiento
      ? `SI — Autoriza ${ficha.imagenAdultoNombre} (DNI ${ficha.imagenAdultoDni}), vinculo: ${ficha.imagenVinculo}.`
      : "NO se completo el modulo de autorizacion de imagen.",
  );
  y += 30;
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text("Firma: ______________________________     Aclaracion: ____________________", 12, y);
  doc.setFontSize(7);
  doc.text("Hoja 2/3 — Ficha medica CEF 123 Caseros", 12, 287);

  doc.addPage();
  header(doc, logo, "COMPROBANTE DE COOPERADORA E INSCRIPCION DIGITAL");
  y = 50;
  doc.setFillColor(250, 246, 246);
  doc.setDrawColor(...RED);
  doc.setLineWidth(0.8);
  doc.roundedRect(18, y, 174, 120, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(...RED);
  doc.text("COOPERADORA CEF 123 CASEROS", 105, y + 14, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text("Comprobante de pago e inscripcion digital", 105, y + 22, { align: "center" });
  doc.setFontSize(11);
  doc.text(`Alumno/a: ${data.apellidoNombre}`, 28, y + 40);
  doc.text(`Legajo: ${data.legajo}`, 28, y + 50);
  doc.text(`DNI: ${data.dni || "—"}    CUIL: ${formatCuil(data.cuil || ficha.cuil)}`, 28, y + 60);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...BLUE);
  doc.text(
    `Monto abonado: $ ${monto.toLocaleString("es-AR")}`,
    28,
    y + 78,
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(50, 50, 50);
  doc.text(`Fecha: ${hoy}    Medio: Mercado Pago`, 28, y + 92);
  doc.text("Conserva este archivo como comprobante de pago e inscripcion.", 28, y + 102);
  doc.setFontSize(8);
  doc.setTextColor(...BLUE);
  doc.text(
    "Con esta app ahorramos fotocopias y papel. Gracias por colaborar con la cooperadora.",
    105,
    y + 140,
    { align: "center" },
  );
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.text("Hoja 3/3 — Comprobante de cooperadora CEF 123 Caseros", 12, 287);

  doc.save(`planilla-inscripcion-${data.legajo}.pdf`);
}
