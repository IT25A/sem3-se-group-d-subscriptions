module.exports = (db) => {
    db.exec(`
        CREATE TABLE IF NOT EXISTS SubscriptionModel (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            userid          INTEGER REFERENCES Users(id),
            price           Float   NOT NULL,
            
            subscription    TEXT    NOT NULL,
            category        TEXT    NOT NULL,
            UNIQUE(userid, subscription)
        )
    `);
};
