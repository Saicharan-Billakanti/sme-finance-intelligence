"use client";

const categoryColors = {
  Sales: "bg-green-100 text-green-700",
  Purchase: "bg-red-100 text-red-700",
  Salary: "bg-blue-100 text-blue-700",
  Rent: "bg-orange-100 text-orange-700",
  Utilities: "bg-yellow-100 text-yellow-700",
  Tax: "bg-purple-100 text-purple-700",
  Loan: "bg-pink-100 text-pink-700",
  Other: "bg-gray-100 text-gray-700",
};

export default function TransactionList({ transactions }) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Transactions
        </h2>
        <div className="text-center py-12">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-gray-500 text-sm">
            No transactions yet. Paste your SMS above to get started.
          </p>
        </div>
      </div>
    );
  }

  const totalCredit = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Transactions ({transactions.length})
        </h2>
        <div className="flex gap-4 text-sm">
          <span className="text-green-600 font-medium">
            ↑ ₹{totalCredit.toLocaleString()}
          </span>
          <span className="text-red-600 font-medium">
            ↓ ₹{totalDebit.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {transactions.map((t, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  t.type === "credit" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {t.type === "credit" ? "↑" : "↓"}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {t.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      categoryColors[t.category] || categoryColors.Other
                    }`}
                  >
                    {t.category}
                  </span>
                  <span className="text-xs text-gray-400">{t.date}</span>
                  {t.bank && (
                    <span className="text-xs text-gray-400">{t.bank}</span>
                  )}
                </div>
              </div>
            </div>
            <span
              className={`text-sm font-semibold ${
                t.type === "credit" ? "text-green-600" : "text-red-600"
              }`}
            >
              {t.type === "credit" ? "+" : "-"}₹{t.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}