const database = require("better-sqlite3");
const { storage } = require("../configs/db");
const createUsersTable = require("./tables/users");
// Add future tables here: const createSubscriptionsTable = require("./tables/subscriptions");

const db = new database(storage)
createUsersTable(db)
console.log("Connected to database")

module.exports = db;