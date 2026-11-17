import { useEffect, useState } from "react";
import { FilterPriceAscIcon, FilterPriceDescIcon, TrashIcon, EditIcon, FilterIcon } from "../assets/icons.jsx";
import Modal from "./Modal.jsx";
import ConfirmationModal from "./ConfirmationModal.jsx";

const CATEGORIES = ["Video-Streaming", "Music-Streaming", "Software", "Gaming", "News", "Fitness", "Other"];

const PREDEFINED = new Set(CATEGORIES.filter((c) => c !== "Other"));

function isCustomCategory(cat) {
  return cat && !PREDEFINED.has(cat);
}

function AddSubscription({ onAdded, initialValues, onUpdated, notify }) {
  const isEdit = !!initialValues;

  const initialCategory = initialValues?.category ?? "";
  const initialIsCustom = isCustomCategory(initialCategory);
  const date = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState(
    initialValues
      ? { subscription: initialValues.subscription, price: String(initialValues.price), category: initialIsCustom ? "Other" : initialCategory, date: initialValues.date ?? date }
      : { subscription: "", price: "", category: "", date: date }
  );
  const [customCategory, setCustomCategory] = useState(initialIsCustom ? initialCategory : "");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resolvedCategory = form.category === "Other" ? (customCategory.trim() || "Other") : form.category;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = { ...form, category: resolvedCategory, price: parseFloat(form.price) };

    try {
      if (isEdit) {
        const res = await fetch(`/api/subscriptions/${initialValues.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const data = await res.json();
          notify?.(data.error || "Error saving subscription");
        } else {
          notify?.(`"${form.subscription}" updated`);
          onUpdated?.({ ...initialValues, ...payload });
        }
      } else {
        const res = await fetch("/api/subscriptions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          notify?.(data.error || "Error adding subscription");
        } else {
          notify?.(`"${data.subscription}" added`);
          setForm({ subscription: "", price: "", category: "" });
          setCustomCategory("");
          onAdded?.(data);
        }
      }
    } catch {
      notify?.("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm t-secondary mb-1">Name</label>
            <input
                name="subscription"
                value={form.subscription}
                onChange={handleChange}
                required
                placeholder="e.g. Netflix"
                className="w-full input-field"
            />
          </div>

          <div>
            <label className="block text-sm t-secondary mb-1">Price (€)</label>
            <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="e.g. 12.99"
                className="w-full input-field"
            />
          </div>

          <div>
            <label className="block text-sm t-secondary mb-1">Category</label>
            <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full input-field"
            >
              <option value="">Please choose…</option>
              {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {form.category === "Other" && (
              <input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Custom category (optional)"
                className="w-full input-field mt-2"
              />
            )}
          </div>

          <div>
            <label className="block text-sm t-secondary mb-1">Billing day</label>
            <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                className="w-full input-field"
            />
          </div>

          <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
          >
            {loading ? (isEdit ? "Saving…" : "Adding…") : (isEdit ? "Save" : "Add")}
          </button>
      </form>
  );
}

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
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        notify?.(data.error || "Error deleting subscription");
        return;
      }
      setSubscriptions((prev) => prev.filter((s) => s.id !== id));
      onDeleted?.();
      notify?.(`"${name}" deleted`);
    } catch {
      notify?.("Network error");
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
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error || "Error loading subscriptions");
          }
          return res.json();
        })
        .then((data) => {
          setSubscriptions(data);
        })
        .catch((err) => notify?.(err.message))
        .finally(() => setLoading(false));
  }, [refresh]);

  const usedCategories = ["All", ...Array.from(new Set(subscriptions.map((s) => s.category).filter(Boolean)))];
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
                className={showFilters ? "btn btn-primary" : "btn btn-secondary"}
            >
              <FilterIcon className="icon icon-white" />
            </button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
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
                  <FilterPriceAscIcon className="icon icon-white" />
                </button>
                <button
                    onClick={() => setSortOrder(sortOrder === "asc" ? null : "asc")}
                    className={sortOrder === "asc" ? "chip-active" : "chip"}
                >
                  <FilterPriceDescIcon className="icon icon-white" />
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
                      <EditIcon className="icon icon-edit" />
                    </button>
                    <button
                        onClick={() => setConfirmDeleteSub(sub)}
                        disabled={deletingId === sub.id}
                        className="transition-opacity disabled:opacity-40"
                        title="Löschen"
                    >
                      {deletingId === sub.id ? "…" : <TrashIcon className="icon icon-delete" />}
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
        <ConfirmationModal
            isOpen={!!confirmDeleteSub}
            onClose={() => setConfirmDeleteSub(null)}
            onConfirm={handleDelete}
            title="Delete subscription"
            message={confirmDeleteSub ? <>Are you sure you want to delete <span className="font-semibold t-primary">{confirmDeleteSub.subscription}</span>?</> : ""}
        />
      </div>
  );
}

export default SubscriptionList;