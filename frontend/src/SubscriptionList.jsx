import { useEffect, useState } from "react";

const CATEGORIES = ["Video-Streaming", "Music-Streaming", "Software", "Gaming", "News", "Fitness", "Sonstiges"];

function SubscriptionList({ refresh, onDeleted }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Alle");
  const [sortOrder, setSortOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Fehler beim Löschen");
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      onDeleted?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (sub) => {
    setEditingId(sub.id);
    setEditValue(sub.subscription);
  };

  const handleUpdate = async (id) => {
    if (!editValue.trim()) {
      setEditingId(null);
      setEditValue("");
      return;
    }
    setEditingId(null);
    const newName = editValue.trim();
    setEditValue("");
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subscription: newName }),
      });
      if (!res.ok) throw new Error("Fehler beim Speichern");
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, subscription: newName } : s))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/subscriptions/getAllSubscriptions", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden");
        return res.json();
      })
      .then((data) => {
        setSubscriptions(data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [refresh]);

  if (loading) return <p className="text-gray-500 mt-4">Lade Abos…</p>;
  if (error) return <p className="text-red-500 mt-4">{error}</p>;
  if (subscriptions.length === 0)
    return <p className="text-gray-400 mt-4">Noch keine Abos vorhanden.</p>;

  const usedCategories = ["Alle", ...CATEGORIES.filter((c) => subscriptions.some((s) => s.category === c))];
  const filtered = subscriptions
    .filter((s) => activeFilter === "Alle" || s.category === activeFilter)
    .sort((a, b) => {
      if (sortOrder === "asc") return Number(a.price) - Number(b.price);
      if (sortOrder === "desc") return Number(b.price) - Number(a.price);
      return 0;
    });

  return (
    <div className="max-w-md mx-auto mt-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        Meine Abos
      </h2>

      <div className="flex flex-wrap gap-2 mb-4">
        {usedCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              activeFilter === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500 dark:text-gray-400">Preis:</span>
        <button
          onClick={() => setSortOrder(sortOrder === "desc" ? null : "desc")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            sortOrder === "desc"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Teuerste zuerst
        </button>
        <button
          onClick={() => setSortOrder(sortOrder === "asc" ? null : "asc")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            sortOrder === "asc"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Günstigste zuerst
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {filtered.map((sub) => (
          <li
            key={sub.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg shadow text-sm"
          >
            <div className="flex-1 min-w-0">
              {editingId === sub.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); handleUpdate(sub.id); }
                    if (e.key === "Escape") { setEditingId(null); setEditValue(""); }
                  }}
                  onBlur={() => {
                    if (editingId === sub.id) handleUpdate(sub.id);
                  }}
                  className="border border-blue-400 rounded px-2 py-0.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
              ) : (
                <button
                  onClick={() => startEdit(sub)}
                  className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  title="Umbenennen"
                >
                  {sub.subscription}
                </button>
              )}
              <span className="ml-2 text-xs text-gray-400">{sub.category}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                {Number(sub.price).toFixed(2)} €
              </span>
              <button
                onClick={() => handleDelete(sub.id)}
                disabled={deletingId === sub.id}
                className="text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-40"
                title="Löschen"
              >
                {deletingId === sub.id ? "…" : "✕"}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-gray-400 mt-2 text-sm">Keine Abos für diesen Filter.</p>
      )}

      <p className="text-right text-sm text-gray-500 dark:text-gray-400 mt-2">
        {activeFilter !== "Alle" && (
          <span className="mr-1 text-xs">({activeFilter})</span>
        )}
        Gesamt:{" "}
        <span className="font-semibold text-gray-900 dark:text-white">
          {filtered.reduce((sum, s) => sum + Number(s.price), 0).toFixed(2)} €
        </span>
      </p>
    </div>
  );
}

export default SubscriptionList;
