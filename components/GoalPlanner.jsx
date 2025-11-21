import React, { useState } from "react";

const GoalPlanner = () => {
  const [showModal, setShowModal] = useState(false);
  const [goals, setGoals] = useState([]);
  const [activeInsightGoal, setActiveInsightGoal] = useState(null);

  const addGoal = (newGoalName) => {
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        goalName: newGoalName,
        timeline: "Flexible",
        goalType: "Custom",
        isEditing: false,
      },
    ]);
  };

  
  const deleteGoal = (id) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  const toggleEdit = (id) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, isEditing: !goal.isEditing } : goal
      )
    );
  };

  const updateGoal = (id, updatedData) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id ? { ...goal, ...updatedData, isEditing: false } : goal
      )
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
              <i className="ri-todo-line"></i>
            </span>
            <span>My Financial Goals</span>
          </h1>
          <p className="text-gray-500 mt-2 ml-1">
            Track, plan and achieve your financial milestones
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
        >
          <i className="ri-add-line transition-transform group-hover:rotate-90"></i>
          <span>Add New Goal</span>
        </button>
      </div>

      {/* Empty state */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 shadow-sm">
          <div className="bg-indigo-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-todo-line text-3xl text-indigo-600"></i>
          </div>
          <h3 className="text-xl font-medium text-gray-600">
            No goals added yet
          </h3>
          <p className="text-gray-500 mt-2 mb-4">
            Start by adding your first financial goal
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg inline-flex items-center gap-2 shadow-md"
          >
            <i className="ri-add-line"></i>
            Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group"
            >
              <div
                className={`absolute top-0 left-0 w-2 h-full ${
                  goal.goalType === "Short-Term"
                    ? "bg-blue-500"
                    : goal.goalType === "Medium-Term"
                    ? "bg-purple-500"
                    : goal.goalType === "Long-Term"
                    ? "bg-green-500"
                    : "bg-gray-500"
                }`}
              ></div>

              <div className="ml-4 space-y-4">
                {goal.isEditing ? (
                  <div className="space-y-3">
                    <input
                      className="w-full border border-gray-300 px-4 py-2 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                      value={goal.goalName}
                      onChange={(e) =>
                        updateGoal(goal.id, { goalName: e.target.value })
                      }
                      aria-label="Edit goal name"
                    />
                  </div>
                ) : (
                  <h2 className="text-xl font-bold text-gray-800">
                    {goal.goalName}
                  </h2>
                )}
              </div>

              <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
                <button
                  className="text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1 text-sm font-medium"
                  onClick={() => toggleEdit(goal.id)}
                >
                  <i
                    className={`ri-${goal.isEditing ? "save" : "edit"}-line`}
                  ></i>
                  {goal.isEditing ? "Save" : "Edit"}
                </button>
                <button
                  className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 text-sm font-medium"
                  onClick={() => deleteGoal(goal.id)}
                >
                  <i className="ri-delete-bin-line"></i>
                  Delete
                </button>
                <button
                  className="text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
                  onClick={() => setActiveInsightGoal(goal.id)}
                >
                  <i className="ri-lightbulb-line"></i>
                  Insights
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for adding goal */}
      {showModal && (
        <GoalPlannerModal
          onClose={() => setShowModal(false)}
          onSubmit={addGoal}
        />
      )}

      {/* AI popup */}
      {activeInsightGoal && (
        <AIInsightPopup onClose={() => setActiveInsightGoal(null)} />
      )}
    </div>
  );
};

// Modal to add new goal
const GoalPlannerModal = ({ onClose, onSubmit }) => {
  const [goalName, setGoalName] = useState("");

  const handleSubmit = () => {
    if (!goalName.trim()) return;
    onSubmit(goalName.trim());
    setGoalName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-50 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl space-y-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-indigo-600">🎯</span>
            Plan Your Goal
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="space-y-5">
          <label className="text-sm font-medium text-gray-600">
            Enter Your Goal
          </label>
          <input
            type="text"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            placeholder="e.g., Save for a new laptop"
            className="w-full border border-gray-200 px-4 py-3 rounded-xl text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!goalName.trim()}
            onClick={handleSubmit}
          >
            Add Goal
          </button>
        </div>
      </div>
    </div>
  );
};

// AI insights popup
const AIInsightPopup = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center font-sans">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-gray-100">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-indigo-700 flex items-center gap-2">
            <i className="ri-lightbulb-flash-line text-yellow-500"></i>
            AI Goal Insights
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <div className="space-y-3">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-1">Current State</h3>
            <p className="text-gray-700">
              You're saving steadily and are on track to reach your goal in 5
              months.
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-1">
              Projected Time
            </h3>
            <p className="text-gray-700">
              Estimated goal completion in 6 months.
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-1">Tips</h3>
            <p className="text-gray-700">
              Automate savings and reduce discretionary expenses.
            </p>
          </div>
        </div>

        <div className="text-right pt-2">
          <button
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={onClose}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalPlanner;
