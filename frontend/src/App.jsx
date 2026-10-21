import { useEffect, useState } from "react";
import AuthPage from "./AuthPage";
import AddSubscription from "./AddSubscription";
import SubscriptionList from "./SubscriptionList";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  // Beim Start prüfen, ob noch eine Session besteht
  useEffect(() => {
    fetch("/api/auth/user", { credentials: "include" })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => setUser(data))
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
        <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
          <p className="text-gray-500">Loading…</p>
        </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={setUser} />;
  }

  return (
      <div className="min-h-screen bg-white dark:bg-gray-900 p-8">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hello {user.username}
          </h1>
          <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white rounded px-4 py-2 text-sm"
          >
            Logout
          </button>
        </div>
        {/* hier später das Dashboard */}
        <AddSubscription onAdded={() => setRefresh((r) => r + 1)} />
        <SubscriptionList refresh={refresh} />
      </div>
  );
}

export default App;

