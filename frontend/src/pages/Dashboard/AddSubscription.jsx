import { useState } from "react";

const CATEGORIES = ["Video-Streaming", "Music-Streaming", "Software", "Gaming", "News", "Fitness", "Other"];

const PREDEFINED = new Set(CATEGORIES.filter((c) => c !== "Other"));

function isCustomCategory(cat) {
  return cat && !PREDEFINED.has(cat);
}

function AddSubscription({ onAdded, initialValues, onUpdated, notify }) {
  const isEdit = !!initialValues;

  const initialCategory = initialValues?.category ?? "";
  const initialIsCustom = isCustomCategory(initialCategory);

  const [form, setForm] = useState(
    initialValues
      ? { subscription: initialValues.subscription, price: String(initialValues.price), category: initialIsCustom ? "Other" : initialCategory }
      : { subscription: "", price: "", category: "" }
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

export default AddSubscription;