import React, { useEffect, useState, useContext } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserContext from "../context/UserContext";

const EpfDetails = () => {
  const userInfo = useContext(UserContext);
  const [epfData, setEpfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userInfo?.uid) return;

    const fetchEpfDetails = async () => {
      try {
        const epfCollection = collection(db, `fiMcpData/${userInfo.uid}/epfDetails`);
        const snapshot = await getDocs(epfCollection);

        if (snapshot.empty) {
          setError("No EPF data found.");
          return;
        }

        const data = snapshot.docs[0].data();
        const raw = data.rawDetails;
        const est = raw?.est_details?.[0];
        const overall = raw?.overall_pf_balance;

        const totalBalance = parseFloat(overall?.current_pf_balance || 0);
        const employeeShare = parseFloat(overall?.employee_share_total?.balance || 0);
        const employerShare = parseFloat(overall?.employer_share_total?.balance || 0);
        const pension = parseFloat(overall?.pension_balance || 0);
        const withdrawable = totalBalance - pension;

        setEpfData({
          totalBalance,
          employeeShare,
          employerShare,
          pension,
          withdrawable,
          employerName: est?.est_name,
          doj: est?.doj_epf,
          doe: est?.doe_epf,
        });
      } catch (err) {
        console.error("Error fetching EPF details:", err);
        setError("Failed to load EPF data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpfDetails();
  }, [userInfo]);

  const formatCurrency = (amount) => `₹${amount?.toLocaleString()}`;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-indigo-600">🏦</span>
          EPF Details
        </h2>
        {epfData && (
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
            Updated
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600">Loading EPF data...</span>
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
              <p className="text-sm text-gray-500">Total EPF Balance</p>
              <p className="text-2xl font-bold text-indigo-700">
                {formatCurrency(epfData.totalBalance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee Share</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(epfData.employeeShare)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employer Share</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(epfData.employerShare)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pension Contribution</p>
              <p className="text-2xl font-bold text-amber-600">
                {formatCurrency(epfData.pension)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Withdrawable Amount</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(epfData.withdrawable)}
              </p>
            </div>
          </div>

          {/* Employment History */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">Employment History</h3>
            {epfData.employerName ? (
              <p className="text-sm text-gray-700">
                Last employer – <strong>{epfData.employerName}</strong> (
                {epfData.doj?.split("-")[2]} to {epfData.doe?.split("-")[2]})
              </p>
            ) : (
              <p className="text-sm text-gray-600">Employer history not available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EpfDetails;
