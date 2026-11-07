const { run, get, all } = require("../../database");

class ConflictError extends Error {}

async function createSubscription({ userId, subscription, price, category }) {
    try {
        const {lastID} = await run("INSERT INTO SubscriptionModel (userid, subscription, price, category) VALUES (?, ?, ?, ?)",
            [userId, subscription, price, category]);
        return { id: lastID, subscription, price, category };
    } catch (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
            throw new ConflictError("Subscription already exists");
        }
        throw err;
    }
}

async function getSubscription({ userId }) {
    try {
        return await all("SELECT id, subscription, price, category FROM SubscriptionModel WHERE userid = ?",
            [userId]);
    } catch (err) {
        throw new Error("Get Subscription failed");
    }
}

async function deleteSubscription({ userId, id }) {
    try {
        const {changes} = await run("DELETE FROM SubscriptionModel WHERE userid = ? AND id = ?",
            [userId, id]);
        return {id, changes};
    } catch (err) {
        throw new Error("Delete Subscription failed");
    }
}

async function updateSubscription({ userId, id, subscription, price, category }) {
    try {
        const {changes} = await run("UPDATE SubscriptionModel SET subscription = ?, price = ?, category = ? WHERE userid = ? AND id = ?",
            [subscription, price, category, userId, id]);
        return {id, changes};
    } catch (err) {
        if (err.message.includes("UNIQUE constraint failed")) {
            throw new ConflictError("Subscription already exists");
        }
        throw new Error("Update Subscription failed");
    }
}

module.exports = {ConflictError, createSubscription, getSubscription, deleteSubscription, updateSubscription};
