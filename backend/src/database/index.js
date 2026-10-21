const database = require("better-sqlite3");
const { storage } = require("../configs/db");
const createUsersTable = require("./tables/users");
const createSubscriptionTable = require("./tables/subscriptionModel");

const db = new database(storage)
createUsersTable(db)
createSubscriptionTable(db)
console.log("Connected to database")

module.exports = db;