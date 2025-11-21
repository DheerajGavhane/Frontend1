import React, { useState } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const Anomalies = ({ activeTab, setActiveTab }) => {
  const [goalName, setGoalName] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!goalName || !targetTime) return alert('Please enter Goal Name and Target Time');
    setLoading(true);

    const goalPrompt = `User wants to '${goalName}' in ${targetTime}. ${description ? 'Details: ' + description : ''}`;

    try {
      const res = await axios.post(import.meta.env.VITE_API_BASE_URL + '/ask', {
        message: goalPrompt,
      });
      setAnalysis(res.data.reply);
    } catch (err) {
      console.error('Error getting goal analysis:', err);
      setAnalysis('Failed to analyze the goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col pt-1 px-4 gap-y-5">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="bg-white rounded-xl shadow-lg p-6 mx-auto flex flex-col border border-gray-100 w-full max-w-4xl transition-all hover:shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="mr-3 text-indigo-600">🎯</span>
            Set Financial Goal
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <input
            type="text"
            placeholder="Goal Name (e.g., Buy a Bike)"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />

          <input
            type="text"
            placeholder="Target Time (e.g., 6 months)"
            value={targetTime}
            onChange={(e) => setTargetTime(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 w-full"
            rows="3"
          ></textarea>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl"
          >
            {loading ? 'Analyzing...' : 'Submit Goal'}
          </button>
        </div>

        {analysis && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-blue-700 mb-2 flex items-center">
              <span className="mr-2">🧠</span>
              LLM Recommendation
            </h3>
            <p className="text-gray-800 whitespace-pre-wrap">{analysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Anomalies;
