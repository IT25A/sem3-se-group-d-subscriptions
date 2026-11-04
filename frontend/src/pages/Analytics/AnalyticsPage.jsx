import { useEffect, useState } from "react";
import monthIcon from "../../assets/calendar-1.svg";
import yearIcon from "../../assets/calendar-2.svg";
import walletIcon from "../../assets/wallet.svg";
import subscriptionIcon from "../../assets/currency.svg";

const CATEGORIES = ["Video-Streaming", "Music-Streaming", "Software", "Gaming", "News", "Fitness", "Sonstiges"];

const CATEGORY_COLORS = {
    "Video-Streaming":  "#228B22",
    "Music-Streaming":  "#6495ED",
    "Software":         "#9F2B68",
    "Gaming":           "#D70040",
    "News":             "#CC7722",
    "Fitness":          "#275BF5",
    "Sonstiges":        "#757575",
};

function formatPrice(value) {
    const [euros, cents] = value.toFixed(2).split(".");
    return `${euros}.${cents}`;
}

function StatCard({ icon, label, value }) {
    return (
        <div className="card p-6 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "var(--gradient-emerald)" }}
            >
                <img src={icon} alt={label} className="icon icon-white" />
            </div>
            <div>
                <p className="text-xs t-muted mb-1">{label}</p>
                <p className="text-2xl font-bold t-primary">{value}</p>
            </div>
        </div>
    );
}

function CategoryBar({ label, amount, pct, color }) {
    return (
        <div className="flex items-center gap-3 mb-3">
            <span className="text-xs t-secondary w-32 shrink-0 truncate">{label}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: color }}
                />
            </div>
            <span className="text-xs t-accent font-semibold w-16 text-right shrink-0">
                {formatPrice(amount)} €
            </span>
        </div>
    );
}

function Analytics({ budget, refresh }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch("/api/subscriptions", { credentials: "include" })
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load subscriptions");
                return res.json();
            })
            .then((data) => { setSubscriptions(data); setError(null); })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [refresh]);

    const monthly = subscriptions.reduce((sum, s) => sum + Number(s.price), 0);
    const yearly = monthly * 12;
    const count = subscriptions.length;
    const avgCost = count > 0 ? monthly / count : 0;

    const budgetUsedPct = budget && monthly > 0
        ? Math.min(Math.round((monthly / Number(budget)) * 100), 100)
        : null;

    const byCategory = CATEGORIES.reduce((acc, cat) => {
        const total = subscriptions
            .filter((s) => s.category === cat)
            .reduce((sum, s) => sum + Number(s.price), 0);
        if (total > 0) acc.push({ label: cat, amount: total });
        return acc;
    }, []).sort((a, b) => b.amount - a.amount);

    const mostExpensive = subscriptions.length
        ? [...subscriptions].sort((a, b) => Number(b.price) - Number(a.price))[0]
        : null;

    return (
        <div className="container-md mt-6 pb-10">
            <h2 className="text-xl font-semibold t-primary mb-4">Analytics</h2>

            {error && <p className="t-error text-sm mb-4">{error}</p>}

            {/* Overview widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard
                    icon={monthIcon}
                    label="Monthly costs"
                    value={loading ? "…" : `${formatPrice(monthly)} €`}
                />
                <StatCard
                    icon={yearIcon}
                    label="Yearly costs"
                    value={loading ? "…" : `${formatPrice(yearly)} €`}
                />
                <StatCard
                    icon={subscriptionIcon}
                    label="Total subscriptions"
                    value={loading ? "…" : count}
                />
                <StatCard
                    icon={walletIcon}
                    label="Avg. cost / subscription"
                    value={loading ? "…" : `${formatPrice(avgCost)} €`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Spending by category bar chart */}
                <div className="card p-6">
                    <h3 className="text-lg font-semibold t-primary mb-4">Monthly spending by category</h3>
                    {loading ? (
                        <p className="t-muted text-sm">Loading…</p>
                    ) : byCategory.length === 0 ? (
                        <p className="t-muted text-sm">No subscriptions yet.</p>
                    ) : (
                        byCategory.map(({ label, amount }) => (
                            <CategoryBar
                                key={label}
                                label={label}
                                amount={amount}
                                pct={monthly > 0 ? (amount / monthly) * 100 : 0}
                                color={CATEGORY_COLORS[label] ?? "#047857"}
                            />
                        ))
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    {/* Budget usage gauge */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold t-primary mb-3">Budget usage</h3>
                        {budget == null ? (
                            <p className="t-muted text-sm">No budget set.</p>
                        ) : (
                            <>
                                <div className="flex justify-between text-xs t-muted mb-1">
                                    <span>{formatPrice(monthly)} € spent</span>
                                    <span>{formatPrice(Number(budget))} € budget</span>
                                </div>
                                <div className="bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                                    <div
                                        className="h-4 rounded-full transition-all duration-700"
                                        style={{
                                            width: `${budgetUsedPct}%`,
                                            background: budgetUsedPct >= 100
                                                ? "linear-gradient(to right,#b91c1c,#ef4444)"
                                                : budgetUsedPct >= 75
                                                    ? "linear-gradient(to right,#b45309,#f59e0b)"
                                                    : "var(--gradient-emerald)",
                                        }}
                                    />
                                </div>
                                <p className={`text-xs font-semibold ${budgetUsedPct >= 100 ? "t-error" : budgetUsedPct >= 75 ? "text-yellow-400" : "t-success"}`}>
                                    {budgetUsedPct}% of budget used
                                </p>
                            </>
                        )}
                    </div>

                    {/* Most expensive subscription */}
                    <div className="card p-6">
                        <h3 className="text-lg font-semibold t-primary mb-3">Most expensive</h3>
                        {loading ? (
                            <p className="t-muted text-sm">Loading…</p>
                        ) : mostExpensive ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xl font-semibold t-primary">{mostExpensive.subscription}</p>
                                    <p className="text-xs t-muted mt-0.5">{mostExpensive.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold t-accent">{formatPrice(Number(mostExpensive.price))} €</p>
                                    <p className="text-xs t-muted">/ month</p>
                                </div>
                            </div>
                        ) : (
                            <p className="t-muted text-sm">No subscriptions yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Category summary table */}
            {!loading && byCategory.length > 0 && (
                <div className="card p-6">
                    <h3 className="text-xl font-semibold t-primary mb-4">Category summary</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left border-b border-gray-700">
                                    <th className="pb-2 t-muted font-medium">Category</th>
                                    <th className="pb-2 t-muted font-medium text-center">Subscriptions</th>
                                    <th className="pb-2 t-muted font-medium text-center">Monthly</th>
                                    <th className="pb-2 t-muted font-medium text-center">Yearly</th>
                                    <th className="pb-2 t-muted font-medium text-center">% of total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {byCategory.map(({ label, amount }) => {
                                    const catCount = subscriptions.filter((s) => s.category === label).length;
                                    const pct = monthly > 0 ? Math.round((amount / monthly) * 100) : 0;
                                    return (
                                        <tr key={label} className="border-b border-gray-700/50 last:border-0">
                                            <td className="py-2.5">
                                        <span
                                            className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle"
                                            style={{ background: CATEGORY_COLORS[label] ?? "#047857" }}
                                        />
                                                <span className="t-primary">{label}</span>
                                            </td>
                                            <td className="py-2.5 text-center t-secondary">{catCount}</td>
                                            <td className="py-2.5 text-center t-accent font-semibold">{formatPrice(amount)} €</td>
                                            <td className="py-2.5 text-center t-secondary">{formatPrice(amount * 12)} €</td>
                                            <td className="py-2.5 text-center t-muted">{pct}%</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Analytics;