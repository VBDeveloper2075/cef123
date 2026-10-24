import { NextResponse } from "next/server";
import { COOPERADORA_MONTO } from "@/lib/constants";
import { getServerEnv } from "@/lib/server-env";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      legajo?: string;
      apellidoNombre?: string;
      email?: string;
      monto?: number;
    };
    const monto = Number(body.monto ?? COOPERADORA_MONTO);
    const env = await getServerEnv();
    const token = env.MERCADOPAGO_ACCESS_TOKEN;
    const origin =
      env.NEXT_PUBLIC_SITE_URL ??
      request.headers.get("origin") ??
      "http://localhost:3000";

    if (!token) {
      return NextResponse.json({
        ok: true,
        mock: true,
        monto,
        checkoutUrl: null,
        message:
          "Mercado Pago aun no esta configurado. Confirma el aporte y descarga el comprobante.",
      });
    }

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: [
          {
            title: `Cooperadora CEF 123 - ${body.legajo ?? ""}`,
            quantity: 1,
            currency_id: "ARS",
            unit_price: monto,
          },
        ],
        payer: {
          email: body.email,
          name: body.apellidoNombre,
        },
        back_urls: {
          success: `${origin}/?pago=ok`,
          pending: `${origin}/?pago=pendiente`,
          failure: `${origin}/?pago=error`,
        },
        auto_return: "approved",
        external_reference: body.legajo,
      }),
    });
    const json = (await res.json()) as { init_point?: string; message?: string };
    if (!res.ok || !json.init_point) {
      return NextResponse.json(
        { ok: false, message: json.message ?? "No se pudo crear el pago." },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true, mock: false, monto, checkoutUrl: json.init_point });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error de cooperadora.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
