import { useEffect, useState } from "react";
import filterPriceAscendingIcon from "../../assets/filter-price-asc.svg";
import filterPriceDescendingIcon from "../../assets/filter-price-desc.svg";
import deleteIcon from "../../assets/trash.svg";
import editIcon from "../../assets/edit.svg";
import filterIcon from "../../assets/filter.svg";
import Modal from "../../components/ui/Modal.jsx";
import AddSubscription from "./AddSubscription.jsx";

const CATEGORIES = ["Video-Streaming", "Music-Streaming", "Software", "Gaming", "News", "Fitness", "Other"];

function SubscriptionList({ refresh, onDeleted, onAdded, notify }) {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmDeleteSub, setConfirmDeleteSub] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSub, setEditingSub] = useState(null);

  const handleDelete = async () => {
    const { id, subscription: name } = confirmDeleteSub;
    setConfirmDeleteSub(null);
    setDeletingId(id);
    try {
      const res = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error deleting subscription");
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      onDeleted?.();
      notify?.(`"${name}" deleted`);
    } catch (err) {
      notify?.(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdated = (updated) => {
    setSubscriptions((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setEditingSub(null);
    onAdded?.();
  };

  useEffect(() => {
    setLoading(true);
    fetch("/api/subscriptions", { credentials: "include" })
        .then((res) => {
          if (!res.ok) throw new Error("Error loading subscriptions");
          return res.json();
        })
        .then((data) => {
          setSubscriptions(data);
        })
        .catch((err) => notify?.(err.message))
        .finally(() => setLoading(false));
  }, [refresh]);

  const usedCategories = ["All", ...CATEGORIES.filter((c) => subscriptions.some((s) => s.category === c))];
  const filtered = subscriptions
      .filter((s) => activeFilter === "All" || s.category === activeFilter)
      .sort((a, b) => {
        if (sortOrder === "asc") return Number(a.price) - Number(b.price);
        if (sortOrder === "desc") return Number(b.price) - Number(a.price);
        return 0;
      });

  return (
      <div className="container-md mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold t-primary">
            My Subscriptions
          </h2>
          <div className="flex gap-2">
            <button
                onClick={() => setShowFilters(v => !v)}
                className={showFilters ? "btn-primary" : "btn-secondary"}
            >
              <img src={filterIcon} alt="Logout" className="icon icon-white" />
            </button>
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              + Add
            </button>
          </div>
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
                <span className="text-xs t-muted">Price:</span>
                <button
                    onClick={() => setSortOrder(sortOrder === "desc" ? null : "desc")}
                    className={sortOrder === "desc" ? "chip-active" : "chip"}
                >
                  <img src={filterPriceAscendingIcon} alt="Most to least" className="icon icon-white" />
                </button>
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? null : "asc")}
                    className={sortOrder === "asc" ? "chip-active" : "chip"}
                >
                  <img src={filterPriceDescendingIcon} alt="Least to most" className="icon icon-white" />
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
                    <span className="font-medium t-primary">{sub.subscription}</span>
                    <span className="ml-2 text-xs t-faint">{sub.category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                <span className="t-accent font-semibold">
                  {Number(sub.price).toFixed(2)} €
                </span>
                    <button
                        onClick={() => setEditingSub(sub)}
                        className="transition-opacity disabled:opacity-40"
                        title="Edit"
                    >
                      <img src={editIcon} alt="Edit" className="icon icon-edit" />
                    </button>
                    <button
                        onClick={() => setConfirmDeleteSub(sub)}
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
              ? "No subscriptions yet."
              : "No subscriptions for this filter."}
          </p>
        )}

        <Modal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            title="Add subscription"
        >
          <AddSubscription
              onAdded={(_data) => {
                onAdded?.(_data);
                setShowAddModal(false);
              }}
              notify={notify}
          />
        </Modal>

        <Modal
            isOpen={!!editingSub}
            onClose={() => setEditingSub(null)}
            title="Edit subscription"
        >
          {editingSub && (
            <AddSubscription
                initialValues={editingSub}
                onUpdated={handleUpdated}
                notify={notify}
            />
          )}
        </Modal>
        <Modal
            isOpen={!!confirmDeleteSub}
            onClose={() => setConfirmDeleteSub(null)}
            title="Delete subscription"
        >
          {confirmDeleteSub && (
            <div className="flex flex-col gap-4">
              <p className="t-secondary text-sm">
                Are you sure you want to delete <span className="font-semibold t-primary">{confirmDeleteSub.subscription}</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setConfirmDeleteSub(null)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleDelete} className="btn-primary">
                  Delete
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
  );
}

export default SubscriptionList;