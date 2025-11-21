import React, { useState, useContext } from "react";
import axios from "axios";
import { ArrowUp, Bot } from "lucide-react";
import UserContext from "../context/UserContext";
import ReactMarkdown from "react-markdown";

// ✅ Inline Error Boundary
class MarkdownErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p className="text-red-500">⚠️ Error rendering AI response.</p>;
    }
    return this.props.children;
  }
}

const FutureMirror = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [customQuery, setCustomQuery] = useState('');
  const [scenario, setScenario] = useState('job_loss');
  const [queryResponse, setQueryResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userInfo = useContext(UserContext);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    setIsLoading(true);

    try {
      // Call your backend API
      const response = await axios.post(import.meta.env.VITE_API_BASE_URL + '/api/future', {
        query: customQuery,
        uid: userInfo.uid, // Assuming userInfo contains uid
        scenario: scenario
      });

      setQueryResponse(response.data);
    } catch (error) {
      console.error('Error fetching simulation data:', error);
      // Fallback to mock data if API fails
      setQueryResponse({
        reply: "Based on your financial profile, you're on track to meet your long-term goals. Your diversified approach to saving and investing provides resilience against various financial scenarios.",
        simulation: getMockDataForScenario(scenario),
        parameters: {}
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data fallback for each scenario type
  const getMockDataForScenario = (scenarioType) => {
    switch (scenarioType) {
      case 'job_loss':
        return [
          {
            horizonMonths: 3,
            probabilityRunOut: 0.25,
            medianRemaining: 125736.05,
            percentile10: 119170.37,
            percentile90: 132285.96,
            initialLiquidAssets: 260743.5
          },
          {
            horizonMonths: 6,
            probabilityRunOut: 0.65,
            medianRemaining: 45678.32,
            percentile10: 12345.67,
            percentile90: 78901.23,
            initialLiquidAssets: 260743.5
          },
          {
            horizonMonths: 12,
            probabilityRunOut: 0.90,
            medianRemaining: 12345.67,
            percentile10: 5678.90,
            percentile90: 23456.78,
            initialLiquidAssets: 260743.5
          }
        ];
      case 'salary_deduction':
        return [
          {
            horizonMonths: 3,
            medianRemaining: 213388.48,
            percentile10: 206738.35,
            percentile90: 219793.66,
            initialSavings: 195297
          },
          {
            horizonMonths: 6,
            medianRemaining: 231287.45,
            percentile10: 222171.22,
            percentile90: 240316.63,
            initialSavings: 195297
          },
          {
            horizonMonths: 12,
            medianRemaining: 267305.83,
            percentile10: 254417.96,
            percentile90: 280564.45,
            initialSavings: 195297
          }
        ];
      case 'investment_stop':
        return [
          {
            horizonMonths: 3,
            medianPortfolio: 678075.06,
            percentile10: 635524.82,
            percentile90: 724177.23,
            initialPortfolio: 658305
          },
          {
            horizonMonths: 6,
            medianPortfolio: 698163.06,
            percentile10: 637289.64,
            percentile90: 764264.37,
            initialPortfolio: 658305
          },
          {
            horizonMonths: 12,
            medianPortfolio: 798741.68,
            percentile10: 709675.59,
            percentile90: 901680.96,
            initialPortfolio: 658305
          }
        ];
      case 'liability_stress':
        return [
          {
            horizonMonths: 3,
            medianRemaining: 154061.54,
            percentile10: 151401.54,
            percentile90: 156687.16,
            stressedDebt: 93750
          },
          {
            horizonMonths: 6,
            medianRemaining: 112820.32,
            percentile10: 109080.70,
            percentile90: 116495.90,
            stressedDebt: 93750
          },
          {
            horizonMonths: 12,
            medianRemaining: 30286.13,
            percentile10: 25171.24,
            percentile90: 35349.94,
            stressedDebt: 93750
          }
        ];
      case 'emergency_expense':
        return [
          {
            horizonMonths: 3,
            probabilityRunOut: 0.15,
            medianRemaining: 255034.86,
            percentile10: 251095.15,
            percentile90: 258971.78,
            emergencyCost: 200000,
            emergencyMonth: 6
          },
          {
            horizonMonths: 6,
            probabilityRunOut: 0.35,
            medianRemaining: 115126.73,
            percentile10: 109598.03,
            percentile90: 120493.40,
            emergencyCost: 200000,
            emergencyMonth: 6
          },
          {
            horizonMonths: 12,
            probabilityRunOut: 0.20,
            medianRemaining: 234985.41,
            percentile10: 227190.85,
            percentile90: 242810.76,
            emergencyCost: 200000,
            emergencyMonth: 6
          }
        ];
      default:
        return [];
    }
  };

  // Function to format currency in Indian Rupees
  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return "₹0";

    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Function to format percentage
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return "0%";
    return `${(value * 100).toFixed(2)}%`;
  };

  // Function to get risk level based on probability
  const getRiskLevel = (probability) => {
    if (probability < 0.3) return { level: "Low", color: "text-green-600" };
    if (probability < 0.6) return { level: "Medium", color: "text-yellow-600" };
    return { level: "High", color: "text-red-600" };
  };

  // Render simulation results based on scenario type
  const renderSimulationResults = () => {
    if (!queryResponse || !queryResponse.simulation) return null;

    const { simulation } = queryResponse;

    // Extract initial values from the first simulation result
    const initialLiquidAssets = simulation[0]?.initialLiquidAssets || 0;
    const initialPortfolio = simulation[0]?.initialPortfolio || 0;
    const initialSavings = simulation[0]?.initialSavings || 0;

    return (
      <div className="mt-8 mb-5">
        <h3 className="text-xl font-semibold mb-4">Simulation Results<span className="text-sm font-normal"> (possible future balances)</span></h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {simulation.map((result, index) => {
            const riskLevel = result.probabilityRunOut !== undefined ?
              getRiskLevel(result.probabilityRunOut) : null;

            return (
              <div key={index} className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-semibold text-gray-700">{result.horizonMonths} Months</h3>
                  <i className="ri-calendar-event-line text-blue-500 text-xl"></i>
                </div>

                {(scenario === 'job_loss' || scenario === 'emergency_expense') && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Probability of running out:</span>
                      <span className={`font-medium ${riskLevel?.color || 'text-red-600'}`}>
                        {formatPercentage(result.probabilityRunOut)}
                      </span>
                    </div>
                    {riskLevel && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Risk Level:</span>
                        <span className={`font-medium ${riskLevel.color}`}>
                          {riskLevel.level}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Amount:</span>
                      <span className="font-medium">{formatCurrency(result.medianRemaining)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Worst-Case:</span>
                      <span className="font-medium">{formatCurrency(result.percentile10)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best-Case:</span>
                      <span className="font-medium">{formatCurrency(result.percentile90)}</span>
                    </div>
                    {scenario === 'job_loss' && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Initial liquid assets:</span>
                        <span className="font-medium">{formatCurrency(initialLiquidAssets)}</span>
                      </div>
                    )}
                  </div>
                )}

                {scenario === 'salary_deduction' && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Amount:</span>
                      <span className="font-medium text-green-600">{formatCurrency(result.medianRemaining)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Worst-Case:</span>
                      <span className="font-medium">{formatCurrency(result.percentile10)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best-Case:</span>
                      <span className="font-medium">{formatCurrency(result.percentile90)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Initial savings:</span>
                      <span className="font-medium">{formatCurrency(initialSavings)}</span>
                    </div>
                  </div>
                )}

                {scenario === 'investment_stop' && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Amount:</span>
                      <span className="font-medium text-purple-600">{formatCurrency(result.medianPortfolio)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Worst-Case:</span>
                      <span className="font-medium">{formatCurrency(result.percentile10)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best-Case:</span>
                      <span className="font-medium">{formatCurrency(result.percentile90)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Initial portfolio:</span>
                      <span className="font-medium">{formatCurrency(initialPortfolio)}</span>
                    </div>
                  </div>
                )}

                {scenario === 'liability_stress' && (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Amount:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(result.medianRemaining)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Worst-Case:</span>
                      <span className="font-medium">{formatCurrency(result.percentile10)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Best-Case:</span>
                      <span className="font-medium">{formatCurrency(result.percentile90)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Stressed debt:</span>
                      <span className="font-medium">{formatCurrency(result.stressedDebt)}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handleSend = async () => {
    const userQuery = input.trim();
    if (!userQuery || !userInfo?.uid) return;

    console.log("📨 Sending query:", userQuery);
    console.log("👤 UID from context:", userInfo.uid);

    try {
      const res = await axios.post("/api/future", {
        query: userQuery,
        uid: userInfo.uid,
      });

      setResponse(res.data.reply);
    } catch (error) {
      console.error("Error getting response:", error.message);
      setResponse("Something went wrong. Please try again later.");
    }

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="future-mirror-dashboard">
      {/* Custom Query Section */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="font-semibold text-gray-700 mb-4">Ask About Your Financial Future</h3>

        {/* Scenario Selection - Horizontal Buttons */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Scenario:</label>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'job_loss', label: 'Job Loss', icon: 'ri-user-voice-line', color: 'bg-red-400 hover:bg-red-600' },
              { value: 'salary_deduction', label: 'Salary Deduction', icon: 'ri-money-dollar-box-line', color: 'bg-blue-400 hover:bg-blue-600' },
              { value: 'investment_stop', label: 'Investment Stop', icon: 'ri-line-chart-line', color: 'bg-green-400 hover:bg-green-600' },
              { value: 'liability_stress', label: 'Liability Stress', icon: 'ri-bank-card-line', color: 'bg-purple-400 hover:bg-purple-600' },
              { value: 'emergency_expense', label: 'Emergency Expense', icon: 'ri-first-aid-kit-line', color: 'bg-orange-400 hover:bg-orange-600' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setScenario(option.value)}
                className={`flex items-center px-4 py-2 rounded-lg text-white font-medium transition-all ${scenario === option.value ? 'ring-2 ring-offset-2 ring-white ' + option.color.replace('hover:', '') : option.color}`}
              >
                <i className={`${option.icon} mr-2`}></i>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleQuerySubmit} className="flex gap-2">
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="E.g., How would a job loss affect my finances?"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Analyzing...' : 'Ask'}
            <i className={isLoading ? "ri-loader-4-line animate-spin" : "ri-search-line"}></i>
          </button>
        </form>

        {/* Sample questions */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "What happens if I lose my job?",
              "How would a 20% salary cut affect me?",
              "Can I pay off my debt faster?",
              "What if I have a medical emergency?"
            ].map((question, index) => (
              <button
                key={index}
                onClick={() => setCustomQuery(question)}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* here tiles */}
      {!queryResponse && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Net Worth Projection Tile */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-700">Net Worth Projection</h3>
                <i className="ri-line-chart-line text-blue-500 text-xl"></i>
              </div>
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(347890)}
                  </div>
                  <div className="text-sm text-gray-500">in 5 years</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Based on current savings and investment patterns</p>
            </div>

            {/* Retirement Readiness Tile */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-700">Retirement Readiness</h3>
                <i className="ri-calendar-event-line text-orange-500 text-xl"></i>
              </div>
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">78%</div>
                  <div className="text-sm text-gray-500">of target</div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Projected retirement age: 62</p>
            </div>

            {/* Investment Growth Tile */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-gray-700">Investment Growth</h3>
                <i className="ri-stock-line text-green-500 text-xl"></i>
              </div>
              <div className="h-40 bg-gray-50 rounded-lg flex items-center justify-center mb-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">+9.2%</div>
                  <div className="text-sm text-gray-500">annual growth</div>
                </div>
              </div>
              <p className="text-sm text-gray-600">Current portfolio: {formatCurrency(124560)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Financial Goals Progress */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-4">Financial Goals Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Home Down Payment</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: ₹50,00,000 by 2025</div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Education Fund</span>
                    <span className="text-sm font-medium">42%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: ₹30,00,000 by 2026</div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Emergency Fund</span>
                    <span className="text-sm font-medium">100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Target: ₹1,50,000 (Completed)</div>
                </div>
              </div>
            </div>

            {/* Future Expense Forecast */}
            <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
              <h3 className="font-semibold text-gray-700 mb-4">Future Expense Forecast</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">Healthcare</div>
                    <div className="text-xs text-gray-500">Projected annual cost at retirement</div>
                  </div>
                  <div className="font-bold">{formatCurrency(12400)}</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">Housing</div>
                    <div className="text-xs text-gray-500">Projected mortgage-free by 2040</div>
                  </div>
                  <div className="font-bold">{formatCurrency(8200)}</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <div>
                    <div className="font-medium">Leisure</div>
                    <div className="text-xs text-gray-500">Travel & entertainment budget</div>
                  </div>
                  <div className="font-bold">{formatCurrency(9500)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Recommendations */}
          <div className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
            <h3 className="font-semibold text-gray-700 mb-4">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <i className="ri-lightbulb-flash-line text-blue-600 text-xl mr-2"></i>
                  <h4 className="font-medium">Increase EPF Contributions</h4>
                </div>
                <p className="text-sm text-gray-600">Consider increasing contributions by 2% to maximize tax benefits.</p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <i className="ri-exchange-dollar-line text-green-600 text-xl mr-2"></i>
                  <h4 className="font-medium">Diversify Investments</h4>
                </div>
                <p className="text-sm text-gray-600">Your portfolio is heavily weighted in equities. Consider diversifying.</p>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <div className="flex items-center mb-2">
                  <i className="ri-shield-check-line text-amber-600 text-xl mr-2"></i>
                  <h4 className="font-medium">Insurance Review</h4>
                </div>
                <p className="text-sm text-gray-600">Your life insurance coverage may be insufficient for your family's needs.</p>
              </div>
            </div>
            </div>
        </>
      )}

      {/* Simulation Results */}
      {queryResponse && queryResponse.simulation && renderSimulationResults()}

      {/* Summary Response Section */}
      {queryResponse && (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
          <h3 className="font-semibold text-gray-700 mb-4">Analysis Summary</h3>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <MarkdownErrorBoundary>
              <div className="text-gray-700">
                <ReactMarkdown>
                  {queryResponse.reply}
                </ReactMarkdown>
              </div>
            </MarkdownErrorBoundary>
          </div>
        </div>
      )}

      {/* Chat Interface */}

    </div>
  );
};

export default FutureMirror;