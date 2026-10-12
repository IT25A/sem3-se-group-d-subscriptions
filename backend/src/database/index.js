const sqlite3 = require("sqlite3").verbose();
const { storage } = require("../configs/db");
const createUsersTable = require("./tables/users");
// Add future tables here: const createSubscriptionsTable = require("./tables/subscriptions");

const db = new sqlite3.Database(storage, (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  }
  console.log("Connected to SQLite database");
});

db.serialize(() => {
  createUsersTable(db);
});

module.exports = db;