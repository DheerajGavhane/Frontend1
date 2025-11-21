import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserContext from "../context/UserContext";

const NetWorth = () => {
  const [netData, setNetData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useContext(UserContext);

  useEffect(() => {
    const fetchNetWorth = async () => {
      if (userInfo === null) return;

      if (!userInfo?.uid) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      console.log("👤 userInfo in NetWorth.jsx:", userInfo);

      try {
        const creditRef = collection(
          db,
          `fiMcpData/${userInfo.uid}/creditReports`
        );
        const snapshot = await getDocs(creditRef);

        if (snapshot.empty) {
          console.warn("No documents found in user's creditReports");
          setError("No net worth data found.");
          return;
        }

        const data = snapshot.docs[0].data();
        console.log("📥 Fetched credit report data:", data);

        const creditScore = parseInt(data?.score?.bureauScore || 0);

        const accountDetails =
          data?.creditAccount?.creditAccountDetails?.[0] || {};

        const outstandingLoan = parseFloat(accountDetails?.currentBalance || 0);
        const creditLimit = parseFloat(accountDetails?.creditLimitAmount || 0);

        const utilization =
          creditLimit > 0 ? (outstandingLoan / creditLimit) * 100 : 0;

        setNetData({
          creditScore,
          outstandingLoan,
          creditLimit,
          utilization,
          subscriberName: accountDetails?.subscriberName || "Unknown Bank",
        });
      } catch (err) {
        console.error("Error fetching net worth:", err);
        setError("Failed to load net worth data.");
      } finally {
        setLoading(false);
      }
    };

    fetchNetWorth();
  }, [userInfo]);

  const getUtilizationCategory = (percent) => {
    if (percent < 10) return { label: "Excellent", color: "emerald" };
    if (percent < 30) return { label: "Good", color: "teal" };
    if (percent < 50) return { label: "Moderate", color: "yellow" };
    return { label: "High", color: "red" };
  };

  const formatCurrency = (val) => `₹${val?.toLocaleString()}`;
  const utilizationInfo = getUtilizationCategory(netData?.utilization || 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-indigo-600">💰</span>
          Net Worth Snapshot
        </h2>
        {netData && (
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold bg-${utilizationInfo.color}-100 text-${utilizationInfo.color}-800`}
          >
            {utilizationInfo.label}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600">Loading net worth data...</span>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-500">Credit Score</p>
              <p className="text-3xl font-bold text-blue-700">
                {netData.creditScore}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Outstanding Loan</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(netData.outstandingLoan)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Credit Limit</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(netData.creditLimit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Utilization</p>
              <p className="text-2xl font-bold text-yellow-600">
                {netData.utilization.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Credit Provider</p>
              <p className="text-lg font-medium text-gray-700">
                {netData.subscriberName}
              </p>
            </div>
          </div>

          <div
            className={`p-3 rounded-lg bg-${utilizationInfo.color}-50 border border-${utilizationInfo.color}-100`}
          >
            <p className={`text-${utilizationInfo.color}-800`}>
              {utilizationInfo.label === "Excellent"
                ? "You’re maintaining an ideal credit utilization. Great for your credit health!"
                : utilizationInfo.label === "Good"
                ? "Your credit usage is under control."
                : utilizationInfo.label === "Moderate"
                ? "You may want to reduce usage to boost your score."
                : "High credit usage. Consider paying down balances."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetWorth;
