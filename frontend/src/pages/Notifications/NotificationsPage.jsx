import { useEffect, useState } from "react";
import alertIcon from "../../assets/alert.svg";

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
        //holt einmal alle abos des users und alle bereits vorhandenen notificationen
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

            if (difference >= 0 && difference < 5) {
                const message = `Payment for ${s.subscription} is due in ${difference} days`;
                const exists = existingNotifs.some(n =>
                    n.message === message
                );
                if (!exists) {
                    await postNotification(message);
                }
            }
        }

        // Budget überschritten oder fast erreicht
        const session = await fetch("/api/auth/session", { credentials: "include" }).then(r => r.json()).catch(() => null);
        const budget = session?.budget ? Number(session.budget) : 0;

        if (budget > 0) {
            const monthly = subs.reduce((sum, s) => sum + Number(s.price), 0);
            // Budget Notification löschen -> um sie neu zu schikcen (mit akt. Werten)
            const oldBudgetNotifs = existingNotifs.filter(n =>
                n.message.includes("Over budget") || n.message.includes("Almost reached budget")
            );
            await Promise.all(oldBudgetNotifs.map(n =>
                fetch(`/api/notifications/${n.id}`, { method: "DELETE", credentials: "include" })
            ));

            if (monthly > budget) {
                const alreadyExists = existingNotifs.some(n => n.message.includes("Over budget"));
                if (!alreadyExists) {
                    await postNotification(
                        `Over budget - monthly costs (${monthly.toFixed(2)} €) run over budget (${budget.toFixed(2)} €)`
                    );
                }
            } else if (monthly >= budget * 0.8) {
                const alreadyExists = existingNotifs.some(n => n.message.includes("Almost reached budget"));
                if (!alreadyExists) {
                    await postNotification(
                        `Almost reached budget - monthly costs (${monthly.toFixed(2)} €) reach ${Math.round((monthly / budget) * 100)}% of your budget (${budget.toFixed(2)} €)`
                    );
                }
            }
        }
    } finally {
        isRunning = false;
    }
}

function NotificationsPage({ onCountChange }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    //Lädt Noti. vom Backend, dreht die Liste um (damit neuste oben steht)
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
    //Schaut ob eine neue Notification erstellt werden muss
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
                <p className="t-muted text-sm">Keine Notifications.</p>
            ) : (
                <div className="card p-6">
                    {notifications.map(n => (
                        <div key={n.id} className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0">
                            <div className="flex items-center gap-3">
                                <img src={alertIcon} alt="alert" className="icon icon-alert w-5 h-5 shrink-0" />
                                <div>
                                    <p className="text-sm t-primary">{n.message}</p>
                                    <p className="text-xs t-muted mt-0.5">{n.date}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(n.id)}
                                className="text-xs t-muted hover:t-error ml-4 shrink-0"
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
