import { useEffect, useState } from "react";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import SubscriptionList from "./pages/Dashboard/SubscriptionList.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Analytics from "./pages/Analytics/AnalyticsPage.jsx";
import ComparisonPage from "./pages/Comparison/ComparisonPage.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [budget, setBudget] = useState(null);
    const [activePage, setActivePage] = useState("Dashboard");

    useEffect(() => {
        fetch("/api/auth/session", { credentials: "include" })
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                setUser(data);
                setBudget(data?.budget ?? null);
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
    };

    if (!user) {
        return <AuthPage onLogin={handleLogin} />;
    }

    return (
        <div className="app-layout">
            <Sidebar user={user} onLogout={handleLogout} activePage={activePage} onNavigate={setActivePage} />
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
                            onBudgetChange={setBudget}
                            refresh={refresh}
                        />
                        <SubscriptionList
                            refresh={refresh}
                            onDeleted={() => setRefresh((r) => r + 1)}
                            onAdded={() => setRefresh((r) => r + 1)}
                        />
                    </>
                )}
                {activePage === "Subscriptions" && (
                    <SubscriptionList
                        refresh={refresh}
                        onDeleted={() => setRefresh((r) => r + 1)}
                        onAdded={() => setRefresh((r) => r + 1)}
                    />
                )}
                {activePage === "Analytics" && (
                    <Analytics budget={budget} refresh={refresh} />
                )}
                {activePage === "Compare" && (
                    <ComparisonPage />
                )}
            </main>
        </div>
    );
}

export default App;
