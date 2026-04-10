import { NextResponse } from "next/server";
import { parseSMSWithAI } from "@/lib/groq";

export async function POST(request) {
  try {
    const { smsText } = await request.json();

    if (!smsText || smsText.trim() === "") {
      return NextResponse.json(
        { error: "No SMS text provided" },
        { status: 400 }
      );
    }

    const transactions = await parseSMSWithAI(smsText);

    return NextResponse.json({ 
      success: true, 
      transactions,
      count: transactions.length 
    });

  } catch (error) {
    console.error("Parse SMS error:", error);
    return NextResponse.json(
      { error: "Failed to parse SMS" },
      { status: 500 }
    );
  }
}