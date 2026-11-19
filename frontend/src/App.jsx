import { useEffect, useState } from "react";
import AuthPage from "./pages/AuthPage.jsx";
import SubscriptionList from "./components/SubscriptionList.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/AnalyticsPage.jsx";
import ComparisonPage from "./pages/ComparisonPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { Notification } from "./components/Notification.jsx";
import NotificationsPage, { checkAndCreateNotifications } from "./pages/NotificationsPage.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [budget, setBudget] = useState(null);
    const [activePage, setActivePage] = useState("Dashboard");
    const [notification, setNotification] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);

    function refreshNotificationCount() {
        fetch("/api/notifications", { credentials: "include" })
            .then(r => r.ok ? r.json() : [])
            .then(data => setNotificationCount(Array.isArray(data) ? data.length : 0))
            .catch(() => setNotificationCount(0));
    }

    useEffect(() => {
        fetch("/api/auth/session", { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                setUser(data);
                setBudget(data?.budget ?? null);
                if (data) {
                    checkAndCreateNotifications().then(refreshNotificationCount);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    if (loading) {
        return (
            <div className="page-wrapper flex items-center justify-center">
                <p className="t-muted">Loading…</p>
            </div>
        );
    }

    const handleLogin = (data) => {
        setUser(data);
        setBudget(data?.budget ?? null);
        checkAndCreateNotifications().then(refreshNotificationCount);
    };

    if (!user) {
        return <AuthPage onLogin={handleLogin} />;
    }

    return (
        <div className="app-layout">
            <Notification message={notification} onDone={() => setNotification("")} />
            <Sidebar user={user} onLogout={handleLogout} activePage={activePage} onNavigate={(page) => {
                setActivePage(page);
                if (page === "Notifications") setNotificationCount(0);
            }} notificationCount={notificationCount} />
            <main className="main-content">
                <div className="main-header container-md">
                    <h1 className="text-2xl font-bold t-primary">
                        Hello, {user.username}
                    </h1>
                </div>
                {activePage === "Dashboard" && (
                    <>
                        <Dashboard
                            budget={budget}
                            onBudgetChange={(b) => { setBudget(b); checkAndCreateNotifications().then(refreshNotificationCount); }}
                            refresh={refresh}
                            notify={setNotification}
                        />
                        <SubscriptionList
                            refresh={refresh}
                            onDeleted={() => { setRefresh((r) => r + 1); checkAndCreateNotifications().then(refreshNotificationCount); }}
                            onAdded={() => { setRefresh((r) => r + 1); checkAndCreateNotifications().then(refreshNotificationCount); }}
                            notify={setNotification}
                        />
                    </>
                )}
                {activePage === "Subscriptions" && (
                    <SubscriptionList
                        refresh={refresh}
                        onDeleted={() => { setRefresh((r) => r + 1); checkAndCreateNotifications().then(refreshNotificationCount); }}
                        onAdded={() => { setRefresh((r) => r + 1); checkAndCreateNotifications().then(refreshNotificationCount); }}
                        notify={setNotification}
                    />
                )}
                {activePage === "Analytics" && (
                    <Analytics budget={budget} refresh={refresh} />
                )}
                {activePage === "Notifications" && (
                    <NotificationsPage onCountChange={() => setNotificationCount(0)} />
                )}
                {activePage === "Compare" && (
                    <ComparisonPage />
                )}
            </main>
        </div>
    );
}

export default App;
