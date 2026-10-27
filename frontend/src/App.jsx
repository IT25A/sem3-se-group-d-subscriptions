import { useEffect, useState } from "react";
import AuthPage from "./pages/Auth/AuthPage.jsx";
import AddSubscription from "./pages/Dashboard/AddSubscription.jsx";
import SubscriptionList from "./pages/Dashboard/SubscriptionList.jsx";
import Budget from "./pages/Dashboard/Budget.jsx";
import logoutIcon from "./assets/logout.svg";
import settingsIcon from "./assets/cog.svg";

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
                if (data?.budget != null) setBudget(data.budget);
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

    if (!user) {
        return <AuthPage onLogin={setUser} />;
    }

    return (
        <div className="page-wrapper p-8">
            <div className="flex items-center justify-between container-lg">
                <h1 className="text-2xl font-bold t-primary">
                    Hello {user.username}
                </h1>
                <div className="flex gap-2">
                    <button
                        // onClick={}
                        className="btn-secondary"
                    >
                        <img src={settingsIcon} alt="Logout" className="icon icon-white" />
                    </button>
                    <button
                        onClick={handleLogout}
                        className="btn-secondary"
                    >
                        <img src={logoutIcon} alt="Logout" className="icon icon-white" />
                    </button>
                </div>
            </div>
            <Budget budget={budget} onBudgetChange={setBudget} />
            <SubscriptionList refresh={refresh} />
            <AddSubscription onAdded={() => setRefresh((r) => r + 1)} />
        </div>
    );
}

export default App;
