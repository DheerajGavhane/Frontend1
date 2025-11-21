import React, { useEffect, useContext, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserContext from "../context/UserContext";
import { ResponsivePie } from "@nivo/pie"; // Corrected import statement

// A single color palette to be used for the chart and list
const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

const TotalAccountBalance = () => {
  const [totalBalance, setTotalBalance] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useContext(UserContext);

  useEffect(() => {
    const fetchAccountBalance = async () => {
      if (!userInfo?.uid) {
        setLoading(false);
        return;
      }

      try {
        const creditCollection = collection(
          db,
          `fiMcpData/${userInfo.uid}/creditReports`
        );
        const snapshot = await getDocs(creditCollection);

        if (snapshot.empty) {
          console.warn("No documents found in creditReports");
          setTotalBalance("No data available");
          setAccounts([]);
          setChartData([]);
          setLoading(false);
          return;
        }

        const docData = snapshot.docs[0].data();
        const total =
          docData?.creditReportData?.creditAccount?.creditAccountSummary?.totalOutstandingBalance?.outstandingBalanceAll;
        setTotalBalance(
          total ? `₹${parseInt(total).toLocaleString()}` : "Balance not available"
        );

        const details =
          docData?.creditReportData?.creditAccount?.creditAccountDetails || [];

        const mappedAccounts = details.map((acc) => {
          const balance = parseInt(acc.currentBalance);
          return {
            bank: acc.subscriberName,
            balanceDisplay: `₹${balance.toLocaleString()}`,
            value: balance,
          };
        });

        setAccounts(mappedAccounts);
        setChartData(
          mappedAccounts.map(({ bank, value }, index) => ({
            id: bank,
            label: bank,
            value: value,
            color: COLORS[index % COLORS.length],
          }))
        );
      } catch (err) {
        console.error("Error fetching account balance:", err);
        setError("Failed to load account data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAccountBalance();
  }, [userInfo]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-indigo-600">💰</span>
          Account Balances Overview
        </h2>
        {totalBalance && typeof totalBalance === "string" && !totalBalance.includes("₹") ? (
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
            Data Unavailable
          </div>
        ) : (
          <div className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800">
            {accounts.length} Accounts
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600">Loading your account data...</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Balances */}
          <div className="space-y-6">
            <div className="flex items-end">
              {totalBalance && totalBalance.includes("₹") ? (
                <>
                  <span className="text-5xl font-bold text-gray-800 mr-2">
                    {totalBalance}
                  </span>
                  <span className="text-lg text-gray-500 mb-1">Total Balance</span>
                </>
              ) : (
                <span className="text-xl text-gray-500">{totalBalance}</span>
              )}
            </div>

            {/* Account List */}
            <div className="space-y-3">
              <h3 className="font-medium text-gray-700">Account Breakdown</h3>
              <div className="space-y-2">
                {accounts.length > 0 ? (
                  accounts.map((acc, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center">
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="font-medium text-gray-700">{acc.bank}</span>
                      </div>
                      <span className="font-semibold text-gray-800">
                        {acc.balanceDisplay}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-500">
                    No account details available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Pie Chart */}
          <div className="space-y-6">
            <div className="h-64 sm:h-72 w-full">
              {chartData.length > 0 ? (
                <ResponsivePie
                  data={chartData}
                  margin={{ top: 10, right: 0, bottom: 40, left: 0 }}
                  innerRadius={0.5}
                  padAngle={0.6}
                  cornerRadius={2}
                  activeOuterRadiusOffset={8}
                  colors={{ datum: 'data.color' }}
                  arcLinkLabelsSkipAngle={10}
                  arcLinkLabelsTextColor="#333333"
                  arcLinkLabelsThickness={2}
                  arcLinkLabelsColor={{ from: "color" }}
                  arcLabelsSkipAngle={10}
                  arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                  tooltipFormat={(value) => `₹${value.toLocaleString()}`}
                  legends={[
                    {
                      anchor: "bottom",
                      direction: "row",
                      translateY: 56,
                      itemWidth: 100,
                      itemHeight: 18,
                      symbolShape: "circle",
                      itemsSpacing: 0,
                      itemDirection: "left-to-right",
                      itemTextColor: "#71717A",
                      effects: [
                        {
                          on: "hover",
                          style: {
                            itemTextColor: "#000",
                          },
                        },
                      ],
                    },
                  ]}
                />
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-gray-500">No chart data available</p>
                </div>
              )}
            </div>

            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-2">
                About Your Balances
              </h3>
              <p className="text-gray-700 text-sm">
                {accounts.length > 0
                  ? "This overview shows your current account balances across different financial institutions. The pie chart visualizes the distribution of these balances."
                  : "We couldn't retrieve your account balance details at this time."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TotalAccountBalance;