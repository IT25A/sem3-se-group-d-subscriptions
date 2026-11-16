import { useEffect, useState } from "react";
import alertIcon from "../../assets/alert.svg";
import { checkAndCreateNotifications, dismissNotification } from "./notifications.service.js";

function getType(message) {
    if (message.includes("Budget überschritten")) return "budget_exceeded";
    if (message.includes("Budget fast erreicht")) return "budget_warning";
    const overdue = message.match(/^"(.+)" ist überfällig/);
    if (overdue) return `overdue:${overdue[1]}`;
    const upcoming = message.match(/^"(.+)" ist fällig in/);
    if (upcoming) return `upcoming:${upcoming[1]}`;
    return null;
}

function NotificationsPage({ onCountChange }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        setLoading(true);
        checkAndCreateNotifications().then(() => loadNotifications());
    }, []);

    async function handleDelete(id, message) {
        const type = getType(message);
        if (type && !type.startsWith("budget_")) dismissNotification(type);
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
                                onClick={() => handleDelete(n.id, n.message)}
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
