import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(request) {
  try {
    const { message, transactions, forecast } = await request.json();

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const totalCredit = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);
    const totalDebit = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const result = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a friendly financial advisor for Indian small business owners.
          
You have access to the user's financial data:
- Total Income: ₹${totalCredit.toLocaleString("en-IN")}
- Total Expenses: ₹${totalDebit.toLocaleString("en-IN")}
- Net Balance: ₹${(totalCredit - totalDebit).toLocaleString("en-IN")}
- Transactions: ${JSON.stringify(transactions.slice(0, 30))}
- 3-Month Forecast: ${JSON.stringify(forecast)}

Answer questions about their finances in simple, friendly language.
Use Indian context — mention rupees, Indian banks, UPI.
Keep answers short — max 3-4 sentences.
If they ask something unrelated to finance, politely redirect.`,
        },
        { role: "user", content: message },
      ],
      temperature: 0.4,
      max_tokens: 300,
    });

    return NextResponse.json({
      success: true,
      reply: result.choices[0]?.message?.content || "Sorry, I couldn't understand that.",
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}