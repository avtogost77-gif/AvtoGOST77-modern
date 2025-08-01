import { SmartCalculator } from "@/lib/pricing";
import type { CalculateInput } from "@/lib/pricing";
import type { CargoType } from "@/lib/types";
import { NextResponse } from "next/server";

const calc = new SmartCalculator();

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CalculateInput>;
    const { fromCity, toCity, weight } = body;
    if (!fromCity || !toCity || !weight) {
      return NextResponse.json(
        { error: true, message: "fromCity, toCity, weight are required" },
        { status: 400 }
      );
    }
    const result = calc.calculate({
      fromCity,
      toCity,
      weight,
      volume: body.volume ?? 0,
      cargoType: (body.cargoType as CargoType | undefined) ?? "general",
    });
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: true, message }, { status: 500 });
  }
}