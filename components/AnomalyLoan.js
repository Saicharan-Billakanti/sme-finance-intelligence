"use client";

export default function AnomalyLoan({ transactions }) {
  if (!transactions || transactions.length === 0) return null;

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  const avgTransaction =
    transactions.length > 0
      ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length
      : 0;

  // Anomaly Detection
  const anomalies = transactions.filter((t) => t.amount > avgTransaction * 2);

  // Loan Eligibility
  const monthlyIncome = totalCredit;
  const savingsRate =
    totalCredit > 0 ? ((totalCredit - totalDebit) / totalCredit) * 100 : 0;

  let loanAmount = 0;
  let loanEligible = false;
  let loanReason = "";

  if (savingsRate >= 20 && monthlyIncome >= 10000) {
    loanEligible = true;
    loanAmount = Math.round(monthlyIncome * 3);
    loanReason = "Based on your income consistency and savings rate";
  } else if (monthlyIncome >= 5000) {
    loanEligible = true;
    loanAmount = Math.round(monthlyIncome * 1.5);
    loanReason = "Based on your transaction history";
  } else {
    loanReason = "Add more transactions to check loan eligibility";
  }

  return (
    <div className="space-y-4">
      {/* Anomaly Detection */}
      {anomalies.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ⚠️ Unusual Transactions Detected
          </h2>
          <div className="space-y-3">
            {anomalies.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-white rounded-xl p-3 border border-orange-100"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {t.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t.date} · {t.category}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      t.type === "credit" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.type === "credit" ? "+" : "-"}₹
                    {t.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-500 mt-0.5">
                    {Math.round(t.amount / avgTransaction)}x above average
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-orange-600 mt-3">
            💡 These transactions are significantly higher than your average of
            ₹{Math.round(avgTransaction).toLocaleString()}
          </p>
        </div>
      )}

      {/* Loan Eligibility */}
      <div
        className={`rounded-2xl p-6 border ${
          loanEligible
            ? "bg-green-50 border-green-100"
            : "bg-gray-50 border-gray-100"
        }`}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          🏦 Business Loan Eligibility
        </h2>
        {loanEligible ? (
          <>
            <p className="text-sm text-gray-500 mb-4">{loanReason}</p>
            <div className="flex items-center gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Estimated Eligibility
                </p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  ₹{loanAmount.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1.5 rounded-full">
                ✓ Eligible
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              * Indicative amount based on UPI transaction history. Actual
              eligibility subject to bank verification.
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500">{loanReason}</p>
        )}
      </div>
    </div>
  );
}