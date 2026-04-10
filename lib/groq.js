import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function parseSMSWithAI(smsText) {
  const prompt = `
    You are a financial SMS parser for Indian SME owners.
    
    Analyze these SMS messages and extract transaction details.
    Return a JSON array with this exact format for each transaction:
    {
      "date": "YYYY-MM-DD",
      "amount": number,
      "type": "credit" or "debit",
      "category": one of ["Sales", "Purchase", "Salary", "Rent", "Utilities", "Tax", "Loan", "Transfer", "Food", "Transport", "Shopping", "Healthcare", "Education", "Entertainment", "Other"],
      "description": "brief description",
      "bank": "bank name if found"
    }
    
    Category rules:
    - Sales/credit from UPI = "Sales"
    - Electricity/water/gas/internet bill = "Utilities"
    - Rent/lease payment = "Rent"
    - Salary/payroll = "Salary"
    - GST/income tax = "Tax"
    - EMI/loan payment = "Loan"
    - Amazon/Flipkart/shopping = "Shopping"
    - Swiggy/Zomato/restaurant = "Food"
    - Uber/Ola/petrol/fuel = "Transport"
    - Hospital/pharmacy/medical = "Healthcare"
    - School/college/course = "Education"
    - Netflix/Spotify/movies = "Entertainment"
    - Bank transfer/NEFT/IMPS = "Transfer"
    - Wholesale/inventory purchase = "Purchase"
    - Everything else = "Other"
    
    SMS Messages:
    ${smsText}
    
    Return ONLY the JSON array, no explanation, no markdown.
  `;

  const result = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const text = result.choices[0]?.message?.content || "";

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return [];
  }
}

export async function generateForecast(transactions) {
  const prompt = `
    You are a financial analyst for Indian SMEs.
    
    Based on these past transactions, predict the next 3 months cash flow.
    Transactions: ${JSON.stringify(transactions)}
    
    Return a JSON array with exactly 3 objects:
    {
      "month": "Month Year",
      "predictedIncome": number,
      "predictedExpense": number,
      "netCashFlow": number,
      "confidence": "High" or "Medium" or "Low",
      "tip": "one actionable financial tip"
    }
    
    Return ONLY the JSON array, no explanation, no markdown.
  `;

  const result = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  });

  const text = result.choices[0]?.message?.content || "";

  try {
    const cleaned = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    return [];
  }
}