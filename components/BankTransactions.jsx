import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserContext from "../context/UserContext";

const BankTransactions = () => {
  const [data, setData] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [topCategories, setTopCategories] = useState({});
  const [recurringPayments, setRecurringPayments] = useState([]);
  const [savings, setSavings] = useState(0);
  const [upiSpike, setUpiSpike] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userInfo = useContext(UserContext);

  useEffect(() => {
    const fetchBankTxns = async () => {
      if (userInfo === null) return;

      if (!userInfo?.uid) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const txnCollection = collection(db, `fiMcpData/${userInfo.uid}/bankTransactions`);
        const snapshot = await getDocs(txnCollection);

        if (snapshot.empty) {
          setError("No bank transaction data found.");
          return;
        }

        const transactions = [];
        snapshot.docs.forEach((doc) => {
          const docData = doc.data();
          if (Array.isArray(docData.txns)) {
            transactions.push(...docData.txns);
          }
        });

        setData(transactions);

        let income = 0;
        let upiSpend = 0;
        const categoryMap = {};
        const recurring = new Set();

        let firstBalance = parseFloat(transactions[transactions.length - 1]?.currentBalance || 0);
        let lastBalance = parseFloat(transactions[0]?.currentBalance || 0);

        transactions.forEach((txn) => {
          const { transactionAmount, transactionNarration, transactionType, transactionMode, currentBalance } = txn;
          const amount = parseFloat(transactionAmount);
          const narration = transactionNarration || "";

          if (transactionType === "CREDIT") {
            income += amount;
          }

          if (["DEBIT", "INSTALLMENT"].includes(transactionType)) {
            const lowerNarration = narration.toLowerCase();

            if (lowerNarration.includes("zomato") || lowerNarration.includes("swiggy") || lowerNarration.includes("coffee")) {
              categoryMap["Food"] = (categoryMap["Food"] || 0) + amount;
            } else if (lowerNarration.includes("recharge") || lowerNarration.includes("airtel")) {
              categoryMap["Utilities"] = (categoryMap["Utilities"] || 0) + amount;
            } else if (lowerNarration.includes("sip") || lowerNarration.includes("mf")) {
              categoryMap["SIPs"] = (categoryMap["SIPs"] || 0) + amount;
              recurring.add("Mutual Fund SIPs");
            } else if (lowerNarration.includes("credit card")) {
              categoryMap["Credit Card"] = (categoryMap["Credit Card"] || 0) + amount;
              recurring.add("HDFC Credit Card Payment");
            } else {
              categoryMap["Others"] = (categoryMap["Others"] || 0) + amount;
            }

            if (transactionMode === "OTHERS" && narration.includes("upi")) {
              upiSpend += amount;
            }
          }
        });

        setTotalIncome(income);
        setTopCategories(categoryMap);
        setRecurringPayments(Array.from(recurring));
        setSavings(lastBalance - firstBalance);
        setUpiSpike(upiSpend > 2000);
      } catch (err) {
        console.error("Error fetching bank transactions:", err);
        setError("Failed to load bank transaction data.");
      } finally {
        setLoading(false);
      }
    };

    fetchBankTxns();
  }, [userInfo]);

  const formatCurrency = (val) => `₹${val.toLocaleString()}`;
  const getSortedCategories = () =>
    Object.entries(topCategories)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-blue-600">🏦</span>
          Bank Transactions Overview
        </h2>
        {totalIncome > 0 && (
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            Income: {formatCurrency(totalIncome)}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-2">Top Expense Categories</h3>
            {getSortedCategories().map(([category, amount], index) => (
              <p key={index} className="text-sm text-gray-800">
                • {category}: {formatCurrency(amount)}
              </p>
            ))}
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <h3 className="font-semibold text-indigo-700 mb-2">Recurring Payments</h3>
            {recurringPayments.length > 0 ? (
              recurringPayments.map((item, idx) => (
                <p key={idx} className="text-sm text-gray-700">• {item}</p>
              ))
            ) : (
              <p className="text-sm text-gray-600">No recurring payments identified.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500">Net Savings (2 months)</p>
              <p className={`text-2xl font-bold ${savings >= 0 ? "text-green-600" : "text-red-600"}`}>
                {formatCurrency(savings)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Spending Alert</p>
              <p className={`text-lg font-semibold ${upiSpike ? "text-red-600" : "text-green-600"}`}>
                {upiSpike ? "High UPI Spend" : "Normal"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BankTransactions;
