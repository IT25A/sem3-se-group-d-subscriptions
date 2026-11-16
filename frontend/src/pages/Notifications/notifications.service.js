let isRunning = false;

const DISMISSED_KEY = "dismissed_notifications";

function getDismissed() {
    try {
        return JSON.parse(localStorage.getItem(DISMISSED_KEY) ?? "[]");
    } catch {
        return [];
    }
}

export function dismissNotification(type) {
    const dismissed = getDismissed();
    if (!dismissed.includes(type)) {
        localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed, type]));
    }
}

function isDismissed(type) {
    return getDismissed().includes(type);
}

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
        const [subsRaw, existingNotifsRaw] = await Promise.all([
            fetch("/api/subscriptions", { credentials: "include" }).then(r => r.ok ? r.json() : []).catch(() => []),
            fetch("/api/notifications", { credentials: "include" }).then(r => r.ok ? r.json() : []).catch(() => []),
        ]);
        const subs = Array.isArray(subsRaw) ? subsRaw : [];
        const existingNotifs = Array.isArray(existingNotifsRaw) ? existingNotifsRaw : [];
        const currentMonth = new Date().toISOString().slice(0, 7);
        const todayDate = new Date().getDate();

        // überfällige Zahlungen & Zahlung steht bevor
        for (const s of subs) {
            if (!s.date) continue;

            const [, , dayStr] = s.date.split("-");
            const payDay = parseInt(dayStr, 10);
            if (s.payment !== currentMonth && payDay < todayDate) {
                const type = `overdue:${s.subscription}`;
                if (isDismissed(type)) continue;
                const alreadyExists = existingNotifs.some(n => n.message.includes(`"${s.subscription}" ist überfällig`));
                if (!alreadyExists) {
                    await postNotification(
                        `"${s.subscription}" ist überfällig - fällig seit dem ${payDay}. ${new Date().toLocaleString("de-DE", { month: "long" })}`
                    );
                }
            } else if (s.payment !== currentMonth && payDay - todayDate <= 2 && payDay >= todayDate) {
                const type = `upcoming:${s.subscription}`;
                if (isDismissed(type)) continue;
                const alreadyExists = existingNotifs.some(n => n.message.includes(`"${s.subscription}" ist fällig in`));
                if (!alreadyExists) {
                    await postNotification(
                        `"${s.subscription}" ist fällig in ${payDay - todayDate === 0 ? "heute" : `${payDay - todayDate} Tag${payDay - todayDate === 1 ? "" : "en"}`} — am ${payDay}. ${new Date().toLocaleString("de-DE", { month: "long" })}`
                    );
                }
            }
        }

        // Budget überschritten oder fast erreicht
        const session = await fetch("/api/auth/session", { credentials: "include" }).then(r => r.json()).catch(() => null);
        const budget = session?.budget ? Number(session.budget) : 0;

        if (budget > 0) {
            const monthly = subs.reduce((sum, s) => sum + Number(s.price), 0);
            if (monthly > budget) {
                const alreadyExists = existingNotifs.some(n => n.message.includes("Budget überschritten"));
                if (!alreadyExists) {
                    await postNotification(
                        `Budget überschritten - monatliche Kosten (${monthly.toFixed(2)} €) übersteigen dein Budget (${budget.toFixed(2)} €)`
                    );
                }
            } else if (monthly >= budget * 0.8) {
                const alreadyExists = existingNotifs.some(n => n.message.includes("Budget fast erreicht"));
                if (!alreadyExists) {
                    await postNotification(
                        `Budget fast erreicht - monatliche Kosten (${monthly.toFixed(2)} €) erreichen ${Math.round((monthly / budget) * 100)}% deines Budgets (${budget.toFixed(2)} €)`
                    );
                }
            }
        }
    } finally {
        isRunning = false;
    }
}
