const sqlite3 = require("sqlite3")
const { storage } = require("../configs/db");
const createUsersTable = require("./tables/users");
const createSubscriptionTable = require("./tables/subscriptionModel");

const db = new sqlite3.Database(storage, (err) => {
	if (err) {
		console.error("Failed to connect to database:", err.message);
		process.exit(1);
	}
});

db.serialize();
createUsersTable(db)
createSubscriptionTable(db)
console.log("Connected to database")

const run = (sql, params = []) =>
		new Promise((resolve, reject) => {
			db.run(sql, params, function (err) {
				if (err) return reject(err);
				resolve({ lastID: this.lastID, changes: this.changes });
			});
		});

const get = (sql, params = []) =>
		new Promise((resolve, reject) =>
				db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row))));

const all = (sql, params = []) =>
		new Promise((resolve, reject) =>
				db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows))));

module.exports = {db, run, get, all};