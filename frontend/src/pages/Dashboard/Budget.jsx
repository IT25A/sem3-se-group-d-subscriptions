import { useState } from "react";
import editIcon from "../../assets/edit.svg";

function Budget({ budget, onBudgetChange }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) return;
    setLoading(true);
    try {
      const isUpdate = budget != null;
      const res = await fetch("/api/users/budget", {
        method: isUpdate ? "PUT" : "POST",
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
      <div className="container-md mt-6 p-5 card">
        <h2 className="text-base font-semibold t-primary mb-1">Budget</h2>
        <div className="flex items-center justify-between">
          <p className="text-sm t-secondary">
            Monatliches Budget:{" "}
            <span className="font-semibold t-primary">
              {Number(budget).toFixed(2)} €
            </span>
          </p>
          <button
            onClick={() => { setInput(""); setEditing(true); }}
            className="text-xs t-accent hover:underline ml-4"
          >
            <img src={editIcon} alt="Edit" className="icon icon-edit" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-md mt-6 p-4 card">
      <h2 className="text-base font-semibold t-primary mb-3">
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
          className="flex-1 input-field"
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "…" : budget != null ? "Speichern" : "Setzen"}
        </button>
        {budget != null && (
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="text-sm t-muted hover:underline px-2"
          >
            Abbrechen
          </button>
        )}
      </form>
    </div>
  );
}

export default Budget;