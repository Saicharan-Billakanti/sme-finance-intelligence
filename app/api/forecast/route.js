import { NextResponse } from "next/server";
import { generateForecast } from "@/lib/groq";

export async function POST(request) {
  try {
    const { transactions } = await request.json();

    if (!transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: "No transactions provided" },
        { status: 400 }
      );
    }

    const forecast = await generateForecast(transactions);

    return NextResponse.json({
      success: true,
      forecast
    });

  } catch (error) {
    console.error("Forecast error:", error);
    return NextResponse.json(
      { error: "Failed to generate forecast" },
      { status: 500 }
    );
  }
}