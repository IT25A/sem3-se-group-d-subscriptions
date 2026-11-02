const db = require("../../database");
const bcrypt = require('bcrypt');

class ConflictError extends Error {}
class InvalidCredentialsError extends Error {}

function createUser({ username, email, password }) {
	const hashedPassword = bcrypt.hashSync(password, 10);
	try {
		const info = db
				.prepare("INSERT INTO Users (username, email, password, budget) VALUES (?, ?, ?, 0)")
				.run(username, email, hashedPassword);
		return { id: info.lastInsertRowid, username: username, email: email, budget: 0 };
	} catch (err) {
		if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
			throw new ConflictError("Username or email already taken");
		}
		throw err;
	}
}

function findById(id) {
	return db.prepare("SELECT ID, USERNAME, EMAIL, BUDGET FROM Users WHERE ID = ?").get(id)
}

function verifyCredentials(username, password) {
	const user = db.prepare("SELECT id, username, email, password, budget FROM Users WHERE USERNAME = ?").get(username)
	if (!user || !bcrypt.compareSync(password, user.password)) {
		throw new InvalidCredentialsError("Username or password invalid");
	}
	return {id: user.id, username: user.username, email: user.email, budget: user.budget};
}

function setBudget(budget, id) {
	db.prepare("UPDATE Users SET budget = ? WHERE id = ?").run(budget, id);
	return {budget};
}

module.exports = {createUser, ConflictError, findById, verifyCredentials, InvalidCredentialsError, setBudget};
