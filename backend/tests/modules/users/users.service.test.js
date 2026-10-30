process.env.DB_PATH = ":memory:";

const db = require("../../../src/database");
const service = require("../../../src/modules/users/users.service");
const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");

const user = { username: "user1", email: "mail@test.de", password: "password" };

describe("userService", () => {
	beforeEach(() => {
		db.exec("DELETE FROM Users;");
	});

	after(() => db.close());

	test("createUser", () => {
		const created = service.createUser(user);
		assert.deepEqual(created, {
			id: created.id,
			username: "user1",
			email: "mail@test.de",
			budget: 0
		});
		assert.equal(typeof created.id, "number");
	});

	test("createUser fails when user exists", () => {
		service.createUser(user)
		assert.throws(() => service.createUser(user), service.ConflictError);
	})

	test("verifyCredentials", () => {
		const created = service.createUser(user);
		const result = service.verifyCredentials(user.username, user.password);
		assert.deepEqual(result, created);
	})

	test("verifyCredentials fails when password false", () => {
		service.createUser(user);
		const wrongPassword = "1234";
		assert.throws(() => service.verifyCredentials(user.username, wrongPassword), service.InvalidCredentialsError);
	})

	test("findById", () => {
		const created = service.createUser(user);
		assert.deepEqual(service.findById(created.id), {id: created.id, username: user.username, email: user.email, budget: 0});
	})

	test("findById returns undefined when ID not known", () => {
		assert.equal(service.findById(9999), undefined);
	});
})