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
    <div className="max-w-md mx-auto mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Subscription anlegen
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Name</label>
          <input
            name="subscription"
            value={form.subscription}
            onChange={handleChange}
            required
            placeholder="z.B. Netflix"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Preis (€)</label>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
            placeholder="z.B. 12.99"
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">Kategorie</label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 dark:border-gray-600 rounded px-3 py-2 bg-white dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Bitte wählen…</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {status?.error && (
          <p className="text-sm text-red-500">{status.error}</p>
        )}
        {status?.success && (
          <p className="text-sm text-green-600 dark:text-green-400">{status.success}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded px-4 py-2 text-sm"
        >
          {loading ? "Wird angelegt…" : "Anlegen"}
        </button>
      </form>
    </div>
  );
}

export default AddSubscription;
