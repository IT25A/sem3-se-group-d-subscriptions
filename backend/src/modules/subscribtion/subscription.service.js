const db = require("../../database");

class ConflictError extends Error {}

function createSubscription({ userId, subscription, price, category }) {
    try {
        const info = db
            .prepare("INSERT INTO SubscriptionModel (userid, subscription, price, category) VALUES (?, ?, ?, ?)")
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
        const rows = db
            .prepare("SELECT id, subscription, price, category FROM SubscriptionModel WHERE userid = ?")
            .all(userId);
        return rows;
    } catch (err) {
        throw new Error("get Subscription failed");
    }
}ma

function updateSubscriptionName({ subscription }) {
}

module.exports = {createSubscription, ConflictError};
