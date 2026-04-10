import { NextResponse } from "next/server";
import twilio from "twilio";

export async function POST(request) {
  try {
    const { phone, transactions, forecast } = await request.json();

    if (!phone || !transactions || transactions.length === 0) {
      return NextResponse.json(
        { error: "Phone number and transactions required" },
        { status: 400 }
      );
    }

    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const totalCredit = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalDebit = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalCredit - totalDebit;
    const savingsRate = totalCredit > 0
      ? ((totalCredit - totalDebit) / totalCredit * 100).toFixed(1)
      : 0;

    const topCategory = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    const topSpend = Object.entries(topCategory)
      .sort((a, b) => b[1] - a[1])[0];

    const forecastTip = forecast && forecast.length > 0
      ? forecast[0].tip
      : "Keep tracking your transactions for better insights";

    const message = `💼 *SME Finance Intelligence Report*
━━━━━━━━━━━━━━━━
📊 *Financial Summary*
✅ Total Income: ₹${totalCredit.toLocaleString()}
❌ Total Expenses: ₹${totalDebit.toLocaleString()}
💰 Net Balance: ₹${netBalance.toLocaleString()}
📈 Savings Rate: ${savingsRate}%

🏷️ *Top Spending Category*
${topSpend ? `${topSpend[0]}: ₹${topSpend[1].toLocaleString()}` : "N/A"}

🔮 *AI Forecast Tip*
${forecastTip}

🏦 *Transactions Analyzed*
Total: ${transactions.length} transactions

━━━━━━━━━━━━━━━━
_Powered by SME Finance Intelligence_ 🚀`;

    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: `whatsapp:+91${phone}`,
      body: message,
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("WhatsApp error:", error);
    return NextResponse.json(
      { error: "Failed to send WhatsApp message" },
      { status: 500 }
    );
  }
}