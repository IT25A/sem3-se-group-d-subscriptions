import { useState } from "react";

function Budget({ budget, onBudgetChange }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users/budget", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ budget: parseFloat(input) }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      const data = await res.json();
      onBudgetChange(data.budget);
      setInput("");
      setEditing(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (budget != null && !editing) {
    return (
      <div className="max-w-md mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Budget</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Monatliches Budget:{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              {Number(budget).toFixed(2)} €
            </span>
          </p>
          <button
            onClick={() => { setInput(""); setEditing(true); }}
            className="text-xs text-blue-600 hover:underline ml-4"
          >
            Ändern
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
        {budget != null ? "Budget ändern" : "Budget setzen"}
      </h2>
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="z.B. 50.00"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-1.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded px-3 py-1.5"
        >
          {loading ? "…" : budget != null ? "Speichern" : "Setzen"}
        </button>
        {budget != null && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 px-2"
          >
            Abbrechen
          </button>
        )}
      </form>
    </div>
  );
}

export default Budget;
