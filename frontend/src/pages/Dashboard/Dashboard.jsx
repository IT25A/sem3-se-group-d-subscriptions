import { useEffect, useState } from "react";
import walletIcon from "../../assets/wallet.svg";
import editIcon from "../../assets/edit.svg";
import monthIcon from "../../assets/calendar-1.svg";
import yearIcon from "../../assets/calendar-2.svg";

function Dashboard({ budget, onBudgetChange, refresh }) {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingBudget, setEditingBudget] = useState(false);
    const [budgetInput, setBudgetInput] = useState("");
    const [budgetLoading, setBudgetLoading] = useState(false);

    useEffect(() => {
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

    const monthly = subscriptions.reduce((sum, s) => sum + Number(s.price), 0);
    const yearly = monthly * 12;

    const handleBudgetSubmit = async (e) => {
        e.preventDefault();
        if (!budgetInput) return;
        setBudgetLoading(true);
        try {
            const res = await fetch("/api/users/budget", {
                method: budget != null ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ budget: parseFloat(budgetInput) }),
            });
            if (!res.ok) throw new Error("Fehler beim Speichern");
            const data = await res.json();
            onBudgetChange(data.budget);
            setBudgetInput("");
            setEditingBudget(false);
        } catch (err) {
            alert(err.message);
        } finally {
            setBudgetLoading(false);
        }
    };

    const formatPrice = (value) => {
        const [euros, cents] = value.toFixed(2).split(".");
        return (
            <>
                {euros}.<span className="text-base font-bold">{cents}</span>
            </>
        );
    };

    return (
        <div className="container-md mt-6">
            <h2 className="text-xl font-semibold t-primary mb-4">Übersicht</h2>

            {error && <p className="t-error text-sm mb-4">{error}</p>}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Monthly widget */}
                <div className="card p-6 flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: "var(--gradient-emerald)" }}
                    >
                        <img src={monthIcon} alt="Monthly" className="icon icon-white" />
                    </div>
                    <div>
                        <p className="text-xs t-muted mb-1">Monatliche Kosten</p>
                        {loading ? (
                            <p className="text-2xl font-bold t-primary">…</p>
                        ) : (
                            <p className="text-2xl font-bold t-primary">
                                {formatPrice(monthly)}{" "}
                                <span className="text-base font-medium t-secondary">€</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Yearly widget */}
                <div className="card p-6 flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: "var(--gradient-emerald)" }}
                    >
                        <img src={yearIcon} alt="Yearly" className="icon icon-white" />
                    </div>
                    <div>
                        <p className="text-xs t-muted mb-1">Jährliche Kosten</p>
                        {loading ? (
                            <p className="text-2xl font-bold t-primary">…</p>
                        ) : (
                            <p className="text-2xl font-bold t-primary">
                                {formatPrice(yearly)}{" "}
                                <span className="text-base font-medium t-secondary">€</span>
                            </p>
                        )}
                    </div>
                </div>

                {/* Budget widget */}
                <div className="card p-6 flex items-center gap-4">
                    <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
                        style={{ background: "var(--gradient-emerald)" }}
                    >
                        <img src={walletIcon} alt="budget" className="icon icon-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs t-muted mb-1">Monatliches Budget</p>
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
                                <button type="submit" disabled={budgetLoading} className="btn-primary">
                                    {budgetLoading ? "…" : "OK"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingBudget(false)}
                                    className="text-sm t-muted hover:underline"
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
                                    <img src={editIcon} alt="Edit" className="icon icon-edit" />
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => { setBudgetInput(""); setEditingBudget(true); }}
                                className="btn-primary mt-1"
                            >
                                Setzen
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;