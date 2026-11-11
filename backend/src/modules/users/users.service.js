const bcrypt = require('bcrypt');
const { run, get, all } = require("../../database");

class ConflictError extends Error {}
class InvalidCredentialsError extends Error {}

async function createUser({ username, email, password }) {
	const hashedPassword = bcrypt.hashSync(password, 10);
	try {
		const {lastID} = await run("INSERT INTO Users (username, email, password, budget) VALUES (?, ?, ?, 0)",
				[username, email, hashedPassword]);
		return { id: lastID, username: username, email: email, budget: 0 };
	} catch (err) {
		if (err.message.includes("UNIQUE constraint failed")) {
			throw new ConflictError("Username or email already taken");
		}
		throw err;
	}
}

async function findById(id) {
	return get("SELECT ID, USERNAME, EMAIL, BUDGET FROM Users WHERE ID = ?",[id])
}

async function verifyCredentials(username, password) {
	const user = await get("SELECT id, username, email, password, budget FROM Users WHERE USERNAME = ?", [username])
	if (!user || !bcrypt.compareSync(password, user.password)) {
		throw new InvalidCredentialsError("Username or password invalid");
	}
	return {id: user.id, username: user.username, email: user.email, budget: user.budget};
}

async function setBudget(budget, id) {
	const {changes} = await run("UPDATE Users SET budget = ? WHERE id = ?", [budget, id]);
	return {budget, changes};
}

async function deleteUser( id ) {
		const {changes} = await run("DELETE FROM Users WHERE id = ?",
				[id]);
		return {id, changes};
}

module.exports = {createUser, ConflictError, findById, verifyCredentials, InvalidCredentialsError, setBudget, deleteUser};
