import { useEffect, useState } from "react";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import AddSubscription from "./pages/Dashboard/AddSubscription.jsx";
import SubscriptionList from "./pages/Dashboard/SubscriptionList.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import Sidebar from "./components/layout/Sidebar.jsx";

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(0);
    const [budget, setBudget] = useState(null);

    useEffect(() => {
        fetch("/api/auth/user", { credentials: "include" })
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
            <Sidebar user={user} onLogout={handleLogout} />
            <main className="main-content">
                <div className="main-header container-md">
                    <h1 className="text-2xl font-bold t-primary">
                        Hello, {user.username}
                    </h1>
                </div>
                <Dashboard budget={budget} onBudgetChange={setBudget} refresh={refresh} />
                <SubscriptionList refresh={refresh} onDeleted={() => setRefresh((r) => r + 1)} />
                <AddSubscription onAdded={() => setRefresh((r) => r + 1)} />
            </main>
        </div>
    );
}

export default App;
