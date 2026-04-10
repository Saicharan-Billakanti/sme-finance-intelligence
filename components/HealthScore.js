"use client";

export default function HealthScore({ transactions }) {
  if (!transactions || transactions.length === 0) return null;

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate = totalCredit > 0 ? ((totalCredit - totalDebit) / totalCredit) * 100 : 0;
  const diversityScore = new Set(transactions.map((t) => t.category)).size * 10;
  const volumeScore = Math.min(transactions.length * 5, 30);

  const rawScore = Math.min(
    Math.max(Math.round(savingsRate * 0.5 + diversityScore + volumeScore), 0),
    100
  );

  const getColor = (score) => {
    if (score >= 70) return { ring: "text-green-500", bg: "bg-green-50", label: "Excellent", emoji: "🟢" };
    if (score >= 50) return { ring: "text-yellow-500", bg: "bg-yellow-50", label: "Moderate", emoji: "🟡" };
    return { ring: "text-red-500", bg: "bg-red-50", label: "Needs Attention", emoji: "🔴" };
  };

  const { ring, bg, label, emoji } = getColor(rawScore);

  const insights = [];
  if (savingsRate < 20) insights.push("Your expenses are high relative to income. Try to cut non-essential costs.");
  if (savingsRate >= 20) insights.push("Good savings rate! Keep maintaining this balance.");
  if (totalDebit > totalCredit) insights.push("⚠️ You're spending more than you earn this period.");
  if (transactions.length < 5) insights.push("Add more transactions for a more accurate score.");

  return (
    <div className={`rounded-2xl shadow-sm border border-gray-100 p-6 ${bg}`}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Health Score</h2>
      <div className="flex items-center gap-6">
        <div className={`text-5xl font-bold ${ring}`}>{rawScore}</div>
        <div>
          <p className="text-sm font-medium text-gray-700">{emoji} {label}</p>
          <p className="text-xs text-gray-500 mt-1">out of 100</p>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        {insights.map((insight, i) => (
          <p key={i} className="text-sm text-gray-600">• {insight}</p>
        ))}
      </div>
    </div>
  );
}