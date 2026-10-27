import { useEffect, useState } from "react";
import filterPriceAscendingIcon from "../../assets/filter-price-asc.svg";
import filterPriceDescendingIcon from "../../assets/filter-price-desc.svg";
import deleteIcon from "../../assets/trash.svg";
import editIcon from "../../assets/edit.svg";
import filterIcon from "../../assets/filter.svg";

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
  const [showFilters, setShowFilters] = useState(false);

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

  const usedCategories = ["Alle", ...CATEGORIES.filter((c) => subscriptions.some((s) => s.category === c))];
  const filtered = subscriptions
      .filter((s) => activeFilter === "Alle" || s.category === activeFilter)
      .sort((a, b) => {
        if (sortOrder === "asc") return Number(a.price) - Number(b.price);
        if (sortOrder === "desc") return Number(b.price) - Number(a.price);
        return 0;
      });

  return (
      <div className="container-md mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold t-primary">
            Meine Abos
          </h2>
          <button
              onClick={() => setShowFilters(v => !v)}
              className={showFilters ? "btn-primary" : "btn-secondary"}
          >
            <img src={filterIcon} alt="Logout" className="icon icon-white" />
          </button>
        </div>

        {showFilters && (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {usedCategories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveFilter(cat)}
                        className={activeFilter === cat ? "chip-active" : "chip"}
                    >
                      {cat}
                    </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs t-muted">Preis:</span>
                <button
                    onClick={() => setSortOrder(sortOrder === "desc" ? null : "desc")}
                    className={sortOrder === "desc" ? "chip-active" : "chip"}
                >
                  <img src={filterPriceAscendingIcon} alt="Teuerste zuerst" className="icon icon-white" />
                </button>
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? null : "asc")}
                    className={sortOrder === "asc" ? "chip-active" : "chip"}
                >
                  <img src={filterPriceDescendingIcon} alt="Günstigste zuerst" className="icon icon-white" />
                </button>
              </div>
            </>
        )}

        <ul className="flex flex-col gap-2">
          {filtered.map((sub) => (
              <li
                  key={sub.id}
                  className="items-center justify-between p-5 card rounded-xl text-sm"
              >
                <div className="flex flex-row">
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
                            className="border border-blue-400 rounded px-2 py-0.5 text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <span className="font-medium t-primary">{sub.subscription}</span>
                    )}
                    <span className="ml-2 text-xs t-faint">{sub.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                <span className="t-accent font-semibold">
                  {Number(sub.price).toFixed(2)} €
                </span>
                    <button
                        onClick={() => startEdit(sub)}
                        className="transition-opacity disabled:opacity-40"
                        title="Bearbeiten"
                    >
                      <img src={editIcon} alt="Edit" className="icon icon-edit" />
                    </button>
                    <button
                        onClick={() => handleDelete(sub.id)}
                        disabled={deletingId === sub.id}
                        className="transition-opacity disabled:opacity-40"
                        title="Löschen"
                    >
                      {deletingId === sub.id ? "…" : <img src={deleteIcon} alt="Delete" className="icon icon-delete" />}
                    </button>
                  </div>
                </div>
              </li>
          ))}
        </ul>

        {filtered.length === 0 && (
          <p className="t-faint mt-2 text-sm">
            {subscriptions.length === 0
              ? "Noch keine Abos vorhanden."
              : "Keine Abos für diesen Filter."}
          </p>
        )}

        <p className="text-right text-sm t-muted mt-2">
          {activeFilter !== "Alle" && (
              <span className="mr-1 text-xs">({activeFilter})</span>
          )}
          Gesamt:{" "}
          <span className="font-semibold t-primary">
          {filtered.reduce((sum, s) => sum + Number(s.price), 0).toFixed(2)} €
        </span>
        </p>
      </div>
  );
}

export default SubscriptionList;
