import { jsPDF } from "jspdf";
import { CICLO_LECTIVO, DISCIPLINAS, TURNOS } from "./constants";

export type Comprobante = {
  legajo: string;
  apellidoNombre: string;
  dni: string;
  fechaNacimiento: string;
  edad: number | null;
  observaciones: string;
  disciplinas: string[];
  turno: string;
  email: string;
  telefono: string;
};

export function descargarComprobantePdf(data: Comprobante) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const disciplinas = data.disciplinas
    .map((id) => DISCIPLINAS.find((d) => d.id === id)?.label ?? id)
    .join(", ");
  const turno = TURNOS.find((t) => t.id === data.turno)?.label ?? data.turno;

  doc.setFillColor(13, 90, 92);
  doc.rect(0, 0, 210, 28, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Centro de Educacion Fisica", 14, 12);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Comprobante de inscripcion — Ciclo ${CICLO_LECTIVO}`, 14, 20);

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(12);
  let y = 42;
  const line = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(label, 14, y);
    doc.setFont("helvetica", "normal");
    doc.text(value || "—", 70, y);
    y += 9;
  };

  line("Legajo", data.legajo);
  line("Estudiante", data.apellidoNombre);
  line("DNI", data.dni || "Sin DNI");
  line("Nacimiento", data.fechaNacimiento);
  line("Edad al 30/06", data.edad != null ? String(data.edad) : "—");
  line("Turno", turno);
  line("Telefono", data.telefono);
  line("Email", data.email);

  doc.setFont("helvetica", "bold");
  doc.text("Disciplinas", 14, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  const wrapped = doc.splitTextToSize(disciplinas, 180);
  doc.text(wrapped, 14, y);
  y += wrapped.length * 6 + 6;

  if (data.observaciones) {
    doc.setFont("helvetica", "bold");
    doc.text("Observaciones", 14, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    const obs = doc.splitTextToSize(data.observaciones, 180);
    doc.text(obs, 14, y);
    y += obs.length * 6 + 10;
  }

  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(
    "Conserva este comprobante. La inscripcion queda registrada en la planilla administrativa del CEF.",
    14,
    Math.min(y + 8, 280),
  );

  doc.save(`inscripcion-${data.legajo}.pdf`);
}
