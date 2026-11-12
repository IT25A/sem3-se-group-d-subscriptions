const { run, get, all } = require("../../database");

async function createNotification({ userId, message })  {
    const date = new Date().toISOString().split('T')[0];
    const { lastID } = await run(
        "INSERT INTO Notifications (userid, date, message) VALUES (?, ?, ?)", [userId, date, message]
    );
    return { id: lastID, message, date };
}

async function getNotifications({ userId }) {
    return await all("SELECT id, date, message FROM Notifications WHERE userid = ?",[userId]
    );
}

async function deleteNotification({ userId, id }) {
    const { changes } = await run("DELETE FROM Notifications WHERE userid = ? AND id = ?", [userId, id]
    );
    return { id, changes };
}

module.exports = { createNotification, getNotifications, deleteNotification };
