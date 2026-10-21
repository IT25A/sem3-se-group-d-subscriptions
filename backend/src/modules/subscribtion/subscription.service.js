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

function getCategory({ userId, category }) {
    try {
        db.prepare("SELECT id, subscription, price, category FROM SubscriptionModel WHERE userid = ? AND category = ?")
            .all(userId, category);
        return true;
    } catch (err) {
        throw new Error("Filtered by subscription failed");
    }

}

function orderByPrice({ userId }) {
    try {
        db.prepare("SELECT id, subscription, price, category FROM SubscriptionModel WHERE userid = ? ORDER BY price DESC")
            .all(userId);
        return true;
    } catch (err) {
        throw new Error("Ordering by price failed");
    }
}

function deleteSubscription({ userId, id }) {
    db.prepare("DELETE FROM SubscriptionModel WHERE userid = ? AND id = ?")
        .run(userId, id);
    return true;
}

function updateSubscriptionName({ userId, id, subscription }) {
    const info = db.prepare("UPDATE SubscriptionModel SET subscription = ? WHERE userid = ? AND id = ?")
        .run(subscription, userId, id);
    return info;
}

module.exports = {ConflictError, createSubscription, getSubscription, getCategory, orderByPrice, deleteSubscription, updateSubscriptionName};
