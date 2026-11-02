import { useState } from "react";

const CATEGORIES = ["Video-Streaming", "Music-Streaming", "Software", "Gaming", "News", "Fitness", "Sonstiges"];

function AddSubscription({ onAdded }) {
  const [form, setForm] = useState({ subscription: "", price: "", category: "" });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/subscriptions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...form, price: parseFloat(form.price) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ error: data.error || "Fehler beim Anlegen" });
      } else {
        setStatus({ success: `"${data.subscription}" wurde angelegt (ID: ${data.id})` });
        setForm({ subscription: "", price: "", category: "" });
        onAdded?.(data);
      }
    } catch {
      setStatus({ error: "Netzwerkfehler" });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="container-md mt-8 p-6 card">
        <h2 className="text-xl font-semibold t-primary mb-4">
          Subscription anlegen
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm t-secondary mb-1">Name</label>
            <input
                name="subscription"
                value={form.subscription}
                onChange={handleChange}
                required
                placeholder="z.B. Netflix"
                className="w-full input-field"
            />
          </div>

          <div>
            <label className="block text-sm t-secondary mb-1">Preis (€)</label>
            <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                placeholder="z.B. 12.99"
                className="w-full input-field"
            />
          </div>

          <div>
            <label className="block text-sm t-secondary mb-1">Kategorie</label>
            <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full input-field"
            >
              <option value="">Bitte wählen…</option>
              {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {status?.error && (
              <p className="text-sm t-error">{status.error}</p>
          )}
          {status?.success && (
              <p className="text-sm t-success">{status.success}</p>
          )}

          <button
              type="submit"
              disabled={loading}
              className="btn-primary"
          >
            {loading ? "Wird angelegt…" : "Anlegen"}
          </button>
        </form>
      </div>
  );
}

export default AddSubscription;
