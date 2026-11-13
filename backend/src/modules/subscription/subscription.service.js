const { run, get, all } = require("../../database");

class ConflictError extends Error {}

async function createSubscription({ userId, subscription, price, category, date }) {
    try {
        const {lastID} = await run("INSERT INTO SubscriptionModel (userid, subscription, price, category, date) VALUES (?, ?, ?, ?, ?)",
            [userId, subscription, price, category, date]);
        return { id: lastID, subscription, price, category, date };
    } catch (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
            throw new ConflictError("Subscription already exists");
        }
        throw err;
    }
}

async function getSubscription({ userId }) {
    return await all("SELECT id, subscription, price, category, date FROM SubscriptionModel WHERE userid = ?",
        [userId])
}

async function deleteSubscription({ userId, id }) {
    const {changes} = await run("DELETE FROM SubscriptionModel WHERE userid = ? AND id = ?",
        [userId, id]);
        return {id, changes};
}

async function updateSubscription({ userId, id, subscription, price, category, date }) {
    try {
        const {changes} = await run("UPDATE SubscriptionModel SET subscription = ?, price = ?, category = ?, date = ? WHERE userid = ? AND id = ?",
            [subscription, price, category, date, userId, id]);
        return {id, changes};
    } catch (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
            throw new ConflictError("Subscription already exists");
        }
        throw err;
    }
}

module.exports = {ConflictError, createSubscription, getSubscription, deleteSubscription, updateSubscription};
