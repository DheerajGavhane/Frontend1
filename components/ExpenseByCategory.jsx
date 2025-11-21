import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserContext from "../context/UserContext";

const ExpenseByCategory = () => {
  const userInfo = useContext(UserContext);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!userInfo || !userInfo.uid) return;

      try {
        const txnCollection = collection(
          db,
          `fiMcpData/${userInfo.uid}/bankTransactions`
        );
        const snapshot = await getDocs(txnCollection);

        const totals = {};

        snapshot.forEach((doc) => {
          const data = doc.data();
          const category = data.category || "Uncategorized";
          const amount = Number(data.amount) || 0;

          if (!totals[category]) {
            totals[category] = 0;
          }
          totals[category] += amount;
        });

        setCategoryTotals(totals);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError("Failed to load expenses");
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [userInfo]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2 text-indigo-600">💸</span>
          Expense Categories
        </h2>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading expenses...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : Object.keys(categoryTotals).length === 0 ? (
        <div className="text-gray-500">No expense data available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(categoryTotals).map(([category, total]) => (
            <div
              key={category}
              className="bg-indigo-50 p-4 rounded-lg border border-indigo-100"
            >
              <h4 className="text-md font-semibold text-indigo-800">{category}</h4>
              <p className="text-xl font-bold text-gray-700 mt-1">₹ {total.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseByCategory;
