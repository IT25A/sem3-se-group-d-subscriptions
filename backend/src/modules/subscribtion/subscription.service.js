const db = require("../../database");

class ConflictError extends Error {}

function createSubscription({ userId, subscription, price, category }) {
    try {
        const info = db.prepare("INSERT INTO SubscriptionModel (userid, subscription, price, category) VALUES (?, ?, ?, ?)")
            .run(userId, subscription, price, category);
        return { id: info.lastInsertRowid, subscription, price, category };
    } catch (err) {
        if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
            throw new ConflictError("Subscription already exists");
        }
        throw err;
    }
}

function getSubscription({ userId }) {
    try {
        return db.prepare("SELECT id, subscription, price, category FROM SubscriptionModel WHERE userid = ?")
            .all(userId);
    } catch (err) {
        throw new Error("Get Subscription failed");
    }
}

function deleteSubscription({ userId, id }) {
    try {
        const info = db.prepare("DELETE FROM SubscriptionModel WHERE userid = ? AND id = ?")
            .run(userId, id);
        return info;
    } catch (err) {
        throw new Error("Delete Subscription failed");
    }
}

function updateSubscription({ userId, id, subscription, price, category }) {
    try {
        const info = db.prepare("UPDATE SubscriptionModel SET subscription = ?, price = ?, category = ? WHERE userid = ? AND id = ?")
            .run(subscription, price, category, userId, id);
        return info;
    } catch (err) {
        throw new Error("Update Subscription failed");
    }
}

module.exports = {ConflictError, createSubscription, getSubscription, deleteSubscription, updateSubscription};
