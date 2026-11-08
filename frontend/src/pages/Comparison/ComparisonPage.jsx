function ComparisonPage() {
    return (
        <div className="container-md mt-6 pb-10">
            <h2 className="text-xl font-semibold t-primary mb-4">Compare Subscriptions</h2>

            <div className="flex gap-4" style={{ height: "calc(100vh - 10rem)" }}>
                <div className="card p-6 flex-1 flex flex-col overflow-y-auto">
                    <h3 className="text-lg font-semibold t-primary mb-4">Subscription A</h3>
                    <p className="t-muted text-sm">No subscription selected.</p>
                </div>

                <div className="card p-6 flex-1 flex flex-col overflow-y-auto">
                    <h3 className="text-lg font-semibold t-primary mb-4">Subscription B</h3>
                    <p className="t-muted text-sm">No subscription selected.</p>
                </div>
            </div>
        </div>
    );
}

export default ComparisonPage;