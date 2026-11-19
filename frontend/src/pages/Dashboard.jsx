import { useEffect, useState } from "react";
import { WalletIcon, EditIcon, CalendarMonthIcon, CalendarYearIcon } from "../assets/icons.jsx";

function formatPrice(value) {
    const [euros, cents] = value.toFixed(2).split(".");
    return (
        <>
            {euros}<span className="text-base font-bold">.{cents}</span>
        </>
    );
}

function StatCard({ icon: Icon, label, children }) {
    return (
        <div className="card p-6 flex items-center gap-4">
            <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: "var(--gradient-emerald)" }}
            >
                <Icon className="icon icon-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs t-muted mb-1">{label}</p>
                {children}
            </div>
        </div>
    );
}

function Dashboard({ budget, onBudgetChange, refresh, notify }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingBudget, setEditingBudget] = useState(false);
    const [budgetInput, setBudgetInput] = useState("");
    const [budgetLoading, setBudgetLoading] = useState(false);

    useEffect(() => {
        fetch("/api/subscriptions", { credentials: "include" })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    throw new Error(data.error || "Error loading subscriptions.");
                }
                return res.json();
            })
            .then((data) => setSubscriptions(data))
            .catch((err) => notify?.(err.message))
            .finally(() => setLoading(false));
    }, [refresh]);

    const monthly = subscriptions.reduce((sum, s) => sum + Number(s.price), 0);
    const yearly = monthly * 12;

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        if (!budgetInput) return;
        setBudgetLoading(true);
        try {
            const res = await fetch("/api/users/budget", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ budget: parseFloat(budgetInput) }),
            });
            const data = await res.json();
            if (!res.ok) {
                notify?.(data.error || "Error saving budget");
                return;
            }
            onBudgetChange(data.budget);
            setBudgetInput("");
            setEditingBudget(false);
            notify?.("Budget updated successfully");
        } catch {
            notify?.("Network error");
        } finally {
            setBudgetLoading(false);
        }
    };

    return (
        <div className="container-md mt-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold t-primary">Overview</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard icon={CalendarMonthIcon} label="Monthly costs">
                    {loading ? (
                        <p className="text-2xl font-bold t-primary">…</p>
                    ) : (
                        <p className="text-2xl font-bold t-primary">
                            {formatPrice(monthly)}{" "}
                            <span className="text-base font-medium t-secondary">€</span>
                        </p>
                    )}
                </StatCard>

                <StatCard icon={CalendarYearIcon} label="Yearly costs">
                    {loading ? (
                        <p className="text-2xl font-bold t-primary">…</p>
                    ) : (
                        <p className="text-2xl font-bold t-primary">
                            {formatPrice(yearly)}{" "}
                            <span className="text-base font-medium t-secondary">€</span>
                        </p>
                    )}
                </StatCard>

                <StatCard icon={WalletIcon} label="Monthly budget">
                    {editingBudget ? (
                        <form onSubmit={handleBudgetSubmit} className="flex items-center gap-2 mt-1">
                            <input
                                autoFocus
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="0.00"
                                value={budgetInput}
                                onChange={(e) => setBudgetInput(e.target.value)}
                                required
                                className="w-24 input-field"
                            />
                            <button type="submit" disabled={budgetLoading} className="btn btn-primary">
                                {budgetLoading ? "…" : "Set"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditingBudget(false)}
                                className="btn-close"
                            >
                                ✕
                            </button>
                        </form>
                    ) : budget != null ? (
                        <div className="flex items-center gap-2">
                            <p className="text-2xl font-bold t-primary">
                                {formatPrice(Number(budget))}{" "}
                                <span className="text-base font-medium t-secondary">€</span>
                            </p>
                            <button
                                onClick={() => { setBudgetInput(""); setEditingBudget(true); }}
                                className="ml-1"
                            >
                                <EditIcon className="icon icon-edit" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setBudgetInput(""); setEditingBudget(true); }}
                            className="btn btn-primary mt-1"
                        >
                            Set
                        </button>
                    )}
                </StatCard>
            </div>
        </div>
    );
}

export default Dashboard;