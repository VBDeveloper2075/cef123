import { NextResponse } from "next/server";
import { edadAl30DeJunio, formatFechaAR, nombrePlanilla } from "@/lib/age";
import { COOPERADORA_MONTO } from "@/lib/constants";
import { observationsFrom } from "@/lib/map-row";
import { inscripcionSchema } from "@/lib/schema";
import { persistInscripcion } from "@/lib/sheets";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = inscripcionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          message: "Revisá los datos del formulario.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const result = await persistInscripcion(data);

    return NextResponse.json({
      ok: true,
      legajo: result.legajo,
      fila: result.fila,
      provider: result.provider,
      apellidoNombre: nombrePlanilla(data.apellido, data.nombre),
      dni: data.dni,
      cuil: data.cuil,
      fechaNacimiento: formatFechaAR(data.fechaNacimiento),
      edad: edadAl30DeJunio(data.fechaNacimiento),
      observaciones: observationsFrom(data),
      disciplinas: data.disciplinas,
      turno: data.turno,
      email: data.email,
      telefono: data.telefonoCelular,
      ficha: data,
      montoCooperadora: COOPERADORA_MONTO,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo guardar la inscripción.";
    console.error("[inscribir]", error);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
