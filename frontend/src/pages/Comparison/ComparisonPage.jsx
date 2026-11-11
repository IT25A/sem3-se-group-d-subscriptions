import { useState } from "react";

const CATEGORIES = [
    { value: "video",     label: "Video" },
    { value: "music",     label: "Music" },
    { value: "language",  label: "Language Learning" },
    { value: "ebook",     label: "eBook" },
    { value: "dating",    label: "Dating Apps" },
    { value: "audiobook", label: "AudioBook" },
];

function SubscriptionSelector({ title, category, setCategory, service, setService, services, subscription, loading }) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="card p-6 flex flex-row gap-2">
                <select
                    className="w-full input-field"
                    value={category}
                    onChange={e => { setCategory(e.target.value); setService(""); }}
                >
                    <option value="">- Choose category -</option>
                    {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                </select>
                <select
                    className="w-full input-field"
                    value={service}
                    onChange={e => setService(e.target.value)}
                    disabled={!category}
                >
                    <option value="">- Choose service -</option>
                    {services.map(s => (
                        <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                </select>
            </div>
            <div className="card p-6 flex-1 flex flex-col overflow-y-auto">
                <h3 className="text-lg font-semibold t-primary mb-4">{title}</h3>
                {loading && <p className="t-muted text-sm">Loading...</p>}
                {!loading && !service && <p className="t-muted text-sm">No subscription selected.</p>}
                {!loading && subscription && (
                    <div className="flex flex-col gap-2">
                        <h4 className="font-semibold t-primary text-3xl mb-1">{subscription.name}</h4>
                        {subscription.items.length === 0 && (
                            <p className="t-muted text-sm">No plans available.</p>
                        )}
                        {subscription.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center border-b py-2 last:border-0">
                                <span className="text-sm t-primary">{item.name}</span>
                                <span className="text-sm font-medium t-primary text-right">{item.price}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function useSubscriptionSelector() {
    const [category, setCategory] = useState("");
    const [service, setService] = useState("");
    const [services, setServices] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSetCategory(cat) {
        setCategory(cat);
        setService("");
        setSubscription(null);
        setServices([]);
        if (!cat) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/webscraper/${cat}`);
            const data = await res.json();
            setServices(data);
        } catch {
            setServices([]);
        } finally {
            setLoading(false);
        }
    }

    function handleSetService(name) {
        setService(name);
        const found = services.find(s => s.name === name) || null;
        setSubscription(found);
    }

    return { category, setCategory: handleSetCategory, service, setService: handleSetService, services, subscription, loading };
}

function ComparisonPage() {
    const a = useSubscriptionSelector();
    const b = useSubscriptionSelector();

    return (
        <div className="container-md mt-6 pb-10">
            <h2 className="text-xl font-semibold t-primary mb-4">Compare Subscriptions</h2>

            <div className="comparison-card">
                <SubscriptionSelector
                    title="Subscription A"
                    category={a.category}
                    setCategory={a.setCategory}
                    service={a.service}
                    setService={a.setService}
                    services={a.services}
                    subscription={a.subscription}
                    loading={a.loading}
                />
                <SubscriptionSelector
                    title="Subscription B"
                    category={b.category}
                    setCategory={b.setCategory}
                    service={b.service}
                    setService={b.setService}
                    services={b.services}
                    subscription={b.subscription}
                    loading={b.loading}
                />
            </div>
            <p className="footer-note">Data sourced from abo24.de</p>
        </div>
    );
}

export default ComparisonPage;