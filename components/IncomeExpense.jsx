import React, { useEffect, useContext, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserContext from "../context/UserContext"; // Make sure the path and export are correct

const IncomeExpense = () => {
  const userInfo = useContext(UserContext);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (userInfo === null) return;

      if (!userInfo?.uid) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      console.log("👤 userInfo in IncomeExpense.jsx:", userInfo);

      try {
        const bankRef = collection(
          db,
          `fiMcpData/${userInfo.uid}/bankTransactions`
        );
        const snapshot = await getDocs(bankRef);

        if (snapshot.empty) {
          setError("No transaction data found for user.");
          return;
        }

        let totalIncome = 0;
        let totalExpense = 0;

        snapshot.docs.forEach((doc) => {
          const data = doc.data();

          if (Array.isArray(data.txns)) {
            data.txns.forEach((txn) => {
              const amount = parseFloat(txn.transactionAmount || "0");
              const type = txn.transactionType;

              if (type === "CREDIT") totalIncome += amount;
              else if (["DEBIT", "INSTALLMENT"].includes(type))
                totalExpense += amount;
            });
          }
        });

        setIncome(totalIncome);
        setExpense(totalExpense);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userInfo]);

  const getCategory = (income, expense) => {
    const balance = income - expense;
    if (income === 0 && expense === 0)
      return { label: "No Data", color: "gray" };
    if (balance > 5000) return { label: "Healthy", color: "green" };
    if (balance > 0) return { label: "Balanced", color: "yellow" };
    return { label: "Overspending", color: "red" };
  };

  const categoryInfo = getCategory(income, expense);
  const total = income + expense;
  const incomePercent = total ? (income / total) * 100 : 0;
  const expensePercent = total ? (expense / total) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-indigo-600">💰</span>
          Income vs Expense
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold bg-${categoryInfo.color}-100 text-${categoryInfo.color}-800`}
        >
          {categoryInfo.label}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600">Loading transactions...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-700 underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500">Total Income</p>
              <p className="text-3xl font-bold text-green-600">
                ₹{income.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Expense</p>
              <p className="text-3xl font-bold text-red-500">
                ₹{expense.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Income</span>
              <span>Expense</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 flex overflow-hidden">
              <div
                className="bg-green-500 h-3"
                style={{ width: `${incomePercent}%` }}
              ></div>
              <div
                className="bg-red-500 h-3"
                style={{ width: `${expensePercent}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-600 text-center">
              Net Savings: ₹{(income - expense).toLocaleString()}
            </div>
          </div>

          <div
            className={`p-3 rounded-lg bg-${categoryInfo.color}-50 border border-${categoryInfo.color}-100`}
          >
            <p className={`text-${categoryInfo.color}-800`}>
              {categoryInfo.label === "Healthy"
                ? "Great job! You're saving well."
                : categoryInfo.label === "Balanced"
                ? "Your spending is balanced. Keep monitoring your budget."
                : categoryInfo.label === "Overspending"
                ? "You’re spending more than you earn. Consider reviewing your expenses."
                : "No data available to analyze your spending habits."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeExpense;
