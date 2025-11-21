import React, { useEffect, useContext, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import UserContext from "../context/UserContext";

const CreditScore = () => {
  const [creditScore, setCreditScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userInfo = useContext(UserContext);

  useEffect(() => {
    const fetchCreditScore = async () => {
      // ⏳ Wait for userInfo to be set
      if (userInfo === null) return;

      if (!userInfo?.uid) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      console.log("👤 userInfo in CreditScore.jsx:", userInfo);

      try {
        const creditCollection = collection(
          db,
          `fiMcpData/${userInfo.uid}/creditReports`
        );
        const snapshot = await getDocs(creditCollection);

        if (snapshot.empty) {
          console.warn("No documents found in user's creditReports");
          setCreditScore("No data available");
          return;
        }

        const docData = snapshot.docs[0].data();
        console.log("📥 Fetched credit report:", docData);

        const score = docData?.creditReportData?.score?.bureauScore;

        if (score !== undefined && score !== null) {
          setCreditScore(Number(score));
        } else {
          setCreditScore("Score not available");
        }
      } catch (err) {
        console.error("Error fetching credit score:", err);
        setError("Failed to load credit data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCreditScore();
  }, [userInfo]);

  const getScoreCategory = (score) => {
    if (score === null || score === undefined || typeof score === "string") {
      return {
        category: "Unavailable",
        color: "gray",
        description: "Credit score information is currently unavailable",
        showMeter: false,
      };
    }

    if (score >= 800)
      return {
        category: "Excellent",
        color: "emerald",
        description: "Exceptional creditworthiness",
        showMeter: true,
      };
    if (score >= 740)
      return {
        category: "Very Good",
        color: "teal",
        description: "High creditworthiness",
        showMeter: true,
      };
    if (score >= 670)
      return {
        category: "Good",
        color: "green",
        description: "Average creditworthiness",
        showMeter: true,
      };
    if (score >= 580)
      return {
        category: "Fair",
        color: "yellow",
        description: "Below average creditworthiness",
        showMeter: true,
      };

    return {
      category: "Poor",
      color: "red",
      description: "Low creditworthiness",
      showMeter: true,
    };
  };

  const scoreInfo = getScoreCategory(creditScore);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 mb-6 w-full max-w-4xl transition-all hover:shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-3 text-indigo-600">📊</span>
          Credit Score Overview
        </h2>
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold bg-${scoreInfo.color}-100 text-${scoreInfo.color}-800`}
        >
          {scoreInfo.category}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-gray-600">Loading your credit data...</span>
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
          {/* Score Display */}
          <div className="space-y-6">
            <div className="flex items-end">
              {typeof creditScore === "number" ? (
                <>
                  <span className="text-5xl font-bold text-gray-800 mr-2">
                    {creditScore}
                  </span>
                  <span className="text-lg text-gray-500 mb-1">out of 850</span>
                </>
              ) : (
                <span className="text-xl text-gray-500">{creditScore}</span>
              )}
            </div>

            {scoreInfo.showMeter && (
              <div className="relative pt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>300</span>
                  <span>900</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-${scoreInfo.color}-500 h-3 rounded-full`}
                    style={{ width: `${(creditScore / 850) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Excellent</span>
                </div>
              </div>
            )}

            {/* <div
              className={`p-3 rounded-lg bg-${scoreInfo.color}-50 border border-${scoreInfo.color}-100`}
            >
              <p className={`text-${scoreInfo.color}-800`}>
                {scoreInfo.description}
              </p>
            </div> */}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-2">
                About Your Score
              </h3>
              <p className="text-gray-700 text-sm">
                {typeof creditScore === "number" ? (
                  `Your credit score of ${creditScore} is considered ${scoreInfo.category.toLowerCase()}. This score affects your ability to get credit and the interest rates you'll receive.`
                ) : (
                  "We couldn't retrieve your credit score at this time. Please check back later or contact support if the problem persists."
                )}
              </p>
            </div>

              {/* {typeof creditScore === "number" && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Score Range Guide</h4>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                      <span className="text-sm">800-850: Excellent</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-teal-500 mr-2"></div>
                      <span className="text-sm">740-799: Very Good</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">670-739: Good</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span className="text-sm">580-669: Fair</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span className="text-sm">300-579: Poor</span>
                    </div>
                  </div>
                </div>
              )} */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreditScore;
