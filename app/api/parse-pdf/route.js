import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import PDFParser from "pdf2json";

export async function POST(request) {
  try {
    const { base64 } = await request.json();
    const buffer = Buffer.from(base64, "base64");

    // Parse PDF using pdf2json
    const extractedText = await new Promise((resolve, reject) => {
      const pdfParser = new PDFParser();
      
      pdfParser.on("pdfParser_dataReady", (pdfData) => {
        const text = pdfData.Pages.map((page) =>
          page.Texts.map((t) => { try { return decodeURIComponent(t.R[0].T); } catch { return t.R[0].T; } }).join(" ")
        ).join("\n");
        resolve(text);
      });

      pdfParser.on("pdfParser_dataError", (err) => {
        reject(err);
      });

      pdfParser.parseBuffer(buffer);
    });

    if (!extractedText || extractedText.trim().length < 10) {
      return NextResponse.json(
        { error: "Could not extract text from PDF." },
        { status: 400 }
      );
    }

    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const result = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `You are a financial statement parser for Indian banks.
          
          Analyze this bank statement and extract ALL transactions.
          
          Indian bank rules:
          - "Withdrawal" or "Dr" = debit
          - "Deposit" or "Cr" = credit
          - UPIAR/UPI = UPI transaction
          - Dates in DD-MM-YYYY → convert to YYYY-MM-DD
          
          Category rules for UPI transactions:
            - UPIAR/UPI credit = "Sales"  
            - UPIAR/UPI debit to merchant = "Purchase"
            - Electricity/BESCOM/MSEB = "Utilities"
            - Rent/lease = "Rent"
            - Amazon/Flipkart/AMZN = "Shopping"
            - Swiggy/Zomato = "Food"
            - Uber/Ola/fuel = "Transport"
            - Hospital/pharmacy = "Healthcare"
            - EMI/loan = "Loan"
            - NEFT/IMPS/transfer = "Transfer"

          Return a JSON array:
          {
            "date": "YYYY-MM-DD",
            "amount": number,
            "type": "credit" or "debit",
            "category": one of ["Sales", "Purchase", "Salary", "Rent", "Utilities", "Tax", "Loan", "Transfer", "Food", "Transport", "Shopping", "Healthcare", "Education", "Entertainment", "Other"],
            "description": "brief description",
            "bank": "bank name"
          }
          
          Bank Statement:
          ${extractedText.slice(0, 5000)}
          
          Return ONLY the JSON array, no explanation, no markdown.`,
        },
      ],
      temperature: 0.2,
    });

    const responseText = result.choices[0]?.message?.content || "";
    const cleaned = responseText.replace(/```json|```/g, "").trim();
    const transactions = JSON.parse(cleaned);

    return NextResponse.json({
      success: true,
      transactions,
      count: transactions.length,
    });

  } catch (error) {
    console.error("PDF parse error:", error);
    return NextResponse.json(
      { error: "Failed to parse PDF statement." },
      { status: 500 }
    );
  }
}