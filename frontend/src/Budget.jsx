import { useState } from "react";

function Budget({ budget, onBudgetChange }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSet = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    try {
      const res = await fetch("/api/users/budget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ budget: parseFloat(input) }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      const data = await res.json();
      onBudgetChange(data.budget);
      setInput("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (budget != null) {
    return (
      <div className="max-w-md mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-1">Budget</h2>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Monatliches Budget:{" "}
          <span className="font-semibold text-gray-900 dark:text-white">
            {Number(budget).toFixed(2)} €
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Budget setzen</h2>
      <form onSubmit={handleSet} className="flex items-center gap-2">
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
          {loading ? "…" : "Setzen"}
        </button>
      </form>
    </div>
  );
}

export default Budget;
