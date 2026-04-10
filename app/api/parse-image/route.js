import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request) {
  try {
    const { base64, mimeType } = await request.json();

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const result = await client.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
              },
            },
            {
              type: "text",
              text: `Extract all bank/UPI transaction SMS messages from this screenshot.
              Return a JSON array with this exact format:
              {
                "date": "YYYY-MM-DD",
                "amount": number,
                "type": "credit" or "debit",
                "category": one of ["Sales", "Purchase", "Salary", "Rent", "Utilities", "Tax", "Loan", "Other"],
                "description": "brief description",
                "bank": "bank name if found"
              }
              Return ONLY the JSON array, no explanation, no markdown.`,
            },
          ],
        },
      ],
      temperature: 0.2,
    });

    const text = result.choices[0]?.message?.content || "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const transactions = JSON.parse(cleaned);

    return NextResponse.json({ success: true, transactions });
  } catch (error) {
    console.error("Image parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse image" },
      { status: 500 }
    );
  }
}