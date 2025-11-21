import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserContext from "../context/UserContext";

const MutualFund = () => {
  const userInfo = useContext(UserContext);
  const [mfData, setMfData] = useState([]);
  const [totalInvested, setTotalInvested] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMfTransactions = async () => {
      if (!userInfo?.uid) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      try {
        const mfCollection = collection(db, `fiMcpData/${userInfo.uid}/mfTransactions`);
        const snapshot = await getDocs(mfCollection);

        if (snapshot.empty) {
          setError("No mutual fund data available.");
          setLoading(false);
          return;
        }

        let investedTotal = 0;
        const processed = snapshot.docs.map((doc) => {
          const { schemeName, txns } = doc.data();

          if (!Array.isArray(txns) || txns.length === 0) return null;

          let totalAmount = 0;
          let totalUnits = 0;
          let navStart = txns[0]?.purchasePrice ?? null;
          let navEnd = txns[txns.length - 1]?.purchasePrice ?? null;

          txns.forEach((txn) => {
            if (txn.orderType === 1) {
              totalAmount += txn.transactionAmount;
              totalUnits += txn.purchaseUnits;
            }
          });

          investedTotal += totalAmount;

          const monthlySIP = txns[0]?.transactionAmount || 0;
          const navGrowth = navStart && navEnd
            ? ((navEnd - navStart) / navStart) * 100
            : 0;

          return {
            schemeName,
            totalAmount,
            totalUnits,
            sip: monthlySIP,
            navStart,
            navEnd,
            navGrowth,
          };
        }).filter(Boolean);

        setMfData(processed);
        setTotalInvested(investedTotal);
        setError(null); // ✅ Clear any previous error
      } catch (err) {
        console.error("❌ Error fetching MF data:", err);
        setError("Failed to load mutual fund data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMfTransactions();
  }, [userInfo]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  const formatNumber = (num) => Number(num).toFixed(2);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-purple-600">🟣</span>
          Mutual Fund Overview
        </h2>
        {mfData.length > 0 && (
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            {formatCurrency(totalInvested)} Invested
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-600">Loading mutual fund data...</span>
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
          {mfData.map((fund, idx) => (
            <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">{fund.schemeName}</h3>
                <span className="text-sm text-indigo-600 font-medium">
                  SIP: {formatCurrency(fund.sip)}/month
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>Total Invested: <strong>{formatCurrency(fund.totalAmount)}</strong></div>
                <div>Units Held: <strong>{formatNumber(fund.totalUnits)}</strong></div>
                <div>NAV Growth: <strong>{formatNumber(fund.navStart)} → {formatNumber(fund.navEnd)}</strong></div>
                <div>Growth %:
                  <strong className={`ml-1 ${fund.navGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatNumber(fund.navGrowth)}%
                  </strong>
                </div>
              </div>
            </div>
          ))}

          <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg mt-4">
            <h4 className="font-medium text-purple-800 mb-2">Portfolio Summary</h4>
            <p className="text-gray-700 text-sm">
              You’ve invested over <strong>{formatCurrency(totalInvested)}</strong> in mutual funds through SIPs. This card summarizes current SIPs, NAV trends, and portfolio performance. A well-diversified SIP strategy is a great step toward long-term financial growth.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MutualFund;
