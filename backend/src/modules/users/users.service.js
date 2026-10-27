const db = require("../../database");

class ConflictError extends Error {}
class InvalidCredentialsError extends Error {}

function createUser({ username, email, password }) {
	try {
		const info = db
				.prepare("INSERT INTO Users (username, email, password) VALUES (?, ?, ?)")
				.run(username, email, password);
		return { id: info.lastInsertRowid, username, email };
	} catch (err) {
		if (err.code === "SQLITE_CONSTRAINT_UNIQUE") {
			throw new ConflictError("Username or email already taken");
		}
		throw err;
	}
}

function findById(id) {
	return db.prepare("SELECT ID, USERNAME, EMAIL FROM Users WHERE ID = ?").get(id)
}

function verifyCredentials(username, password) {
	const user = db.prepare("SELECT id, username, email, password FROM Users WHERE USERNAME = ?").get(username)
	if (!user || user.password !== password) {
		throw new InvalidCredentialsError("Username or password invalid");
	}
	return {id: user.id, username: user.username, email: user.email};
}

function setBudget(budget, id) {
	const info = db.prepare("UPDATE Users SET budget = ? WHERE id = ?").run(budget, id);
	return { budget };
}

module.exports = {createUser, ConflictError, findById, verifyCredentials, InvalidCredentialsError, setBudget};
