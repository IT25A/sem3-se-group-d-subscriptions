import { useEffect, useState } from "react";
import { AlertIcon } from "../assets/icons.jsx";

let isRunning = false;

async function postNotification(message) {
    await fetch("/api/notifications", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });
}

export async function checkAndCreateNotifications() {
    if (isRunning) return;
    isRunning = true;
    try {
        {/* Gets all the subscriptions and all existing notifications */}
        const [subs, existingNotifs] = await Promise.all([
            fetch("/api/subscriptions", { credentials: "include" }).then(r => r.ok ? r.json() : []).catch(() => []),
            fetch("/api/notifications", { credentials: "include" }).then(r => r.ok ? r.json() : []).catch(() => []),
        ]);

        for (const s of subs) {
            if (!s.date) continue;

            const today = new Date();
            const currentDay = today.getDate();
            const billingDay = new Date(s.date).getUTCDate();

            let difference = billingDay - currentDay;

            if (difference < 0) {
                const daysInCurrentMonth = new Date(
                    today.getFullYear(),
                    today.getMonth() + 1,
                    0
                ).getDate();
                difference = daysInCurrentMonth - currentDay + billingDay;
            }

            const stalePaymentNotifs = existingNotifs.filter(n =>
                n.message.startsWith(`Payment for ${s.subscription} is due in`)
            );
            await Promise.all(stalePaymentNotifs.map(n =>
                fetch(`/api/notifications/${n.id}`, { method: "DELETE", credentials: "include" })
            ));

            if (difference > 0 && difference <= 5) {
                const dayLabel = difference === 1 ? "day" : "days";
                const message = `Payment for ${s.subscription} is due in ${difference} ${dayLabel}`;
                await postNotification(message);
            }
        }

        {/* Over Budget or close to reaching it */}
        const session = await fetch("/api/auth/session", { credentials: "include" }).then(r => r.json()).catch(() => null);
        const budget = session?.budget ? Number(session.budget) : 0;

        if (budget > 0) {
            const monthly = subs.reduce((sum, s) => sum + Number(s.price), 0);

            if (monthly > budget) {
                const oldBudgetNotifs = existingNotifs.filter(n =>
                    n.message.includes("Over budget") || n.message.includes("Almost reached budget")
                );
                await Promise.all(oldBudgetNotifs.map(n =>
                    fetch(`/api/notifications/${n.id}`, { method: "DELETE", credentials: "include" })
                ));
                await postNotification(
                    `Over budget - monthly costs (${monthly.toFixed(2)} €) run over budget (${budget.toFixed(2)} €)`
                );
            } else if (monthly >= budget * 0.8) {
                const oldBudgetNotifs = existingNotifs.filter(n =>
                    n.message.includes("Over budget") || n.message.includes("Almost reached budget")
                );
                await Promise.all(oldBudgetNotifs.map(n =>
                    fetch(`/api/notifications/${n.id}`, { method: "DELETE", credentials: "include" })
                ));
                await postNotification(
                    `Almost reached budget - monthly costs (${monthly.toFixed(2)} €) reach ${Math.round((monthly / budget) * 100)}% of your budget (${budget.toFixed(2)} €)`
                );
            }
        }
    } finally {
        isRunning = false;
    }
}

function NotificationsPage({ onCountChange }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    {/* Loads notification from the backend, shows the newest notification at the top */}
    function loadNotifications() {
        fetch("/api/notifications", { credentials: "include" })
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                const list = Array.isArray(data) ? data.slice().reverse() : [];
                setNotifications(list);
                onCountChange?.(list.length);
            })
            .catch(() => { setNotifications([]); onCountChange?.(0); })
            .finally(() => setLoading(false));
    }
    {/* Checks if a new notification needs to be created */}
    useEffect(() => {
        loadNotifications();
    }, []);
    async function handleDelete(id) {
        await fetch(`/api/notifications/${id}`, {
            method: "DELETE",
            credentials: "include",
        });
        setNotifications(prev => prev.filter(n => n.id !== id));
    }

    return (
        <div className="container-md mt-6 pb-10">
            <h2 className="text-xl font-semibold t-primary mb-4">Notifications</h2>
            {loading ? (
                <p className="t-muted text-sm">Loading…</p>
            ) : notifications.length === 0 ? (
                <p className="t-muted text-sm">No new notifications.</p>
            ) : (
                <div className="flex flex-col gap-2">
                    {notifications.map(n => (
                        <div key={n.id} className="card rounded-xl p-6 flex items-center justify-between py-3">
                            <div className="flex items-center gap-3">
                                <AlertIcon className="icon icon-alert shrink-0" />
                                <div>
                                    <p className="text-sm t-primary">{n.message}</p>
                                    <p className="text-xs t-muted mt-0.5">{n.date}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(n.id)}
                                className="btn-close"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default NotificationsPage;
