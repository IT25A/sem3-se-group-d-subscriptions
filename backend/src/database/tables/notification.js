module.exports = (db) => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS Notifications (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            userid          INTEGER REFERENCES Users(id) ON DELETE CASCADE,
            date            DATE NOT NULL,
            message         TEXT NOT NULL
        )
    `);
};