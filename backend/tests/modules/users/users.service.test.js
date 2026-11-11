process.env.DB_PATH = ":memory:";

const { db, run, get, all} = require("../../../src/database");
const service = require("../../../src/modules/users/users.service");
const subscriptions = require("../../../src/modules/subscription/subscription.service");

const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");
const bcrypt = require("bcrypt");
const subscriber = require("../../../src/modules/users/users.service");

const user = { username: "user1", email: "mail@test.de", password: "password" };

describe("userService", () => {
	beforeEach(async() => {
		await run("DELETE FROM Users;");
	});

	after(() => new Promise((resolve) => db.close(resolve)));

	test("createUser", async() => {
		const created = await service.createUser(user);
		assert.deepEqual(created, {
			id: created.id,
			username: "user1",
			email: "mail@test.de",
			budget: 0
		});
		assert.equal(typeof created.id, "number");
	});

	test("createUser fails when user exists", async() => {
		await service.createUser(user)
		await assert.rejects(() => service.createUser(user), service.ConflictError);
	})

	test("password is hashed", async () => {
		const created = await service.createUser(user);

		const row = await get("SELECT password FROM Users WHERE id = ?", [created.id]);

		assert.notEqual(row.password, user.password);
		assert.ok(bcrypt.compareSync(user.password, row.password));
	});

	test("verifyCredentials", async() => {
		const created = await service.createUser(user);
		const result = await service.verifyCredentials(user.username, user.password);
		assert.deepEqual(result, created);
	})

	test("verifyCredentials fails when password false", async() => {
		await service.createUser(user);
		const wrongPassword = "1234";
		await assert.rejects(() => service.verifyCredentials(user.username, wrongPassword), service.InvalidCredentialsError);
	})

	test("findById", async() => {
		const created = await service.createUser(user);
		assert.deepEqual(await service.findById(created.id), {id: created.id, username: user.username, email: user.email, budget: 0});
	})

	test("findById returns undefined when ID not known", async() => {
		assert.equal(await service.findById(9999), undefined);
	});

	test("setBudget", async() => {
		const created = await service.createUser(user);
		const defaultBudget = await service.findById(created.id);
		const change = await service.setBudget(100, created.id)
		const newBudget = await service.findById(created.id);
		assert.equal(defaultBudget.budget, 0)
		assert.equal(newBudget.budget, 100)
		assert.equal(change.changes, 1);
	})

	test("deleteUser", async() => {
		const created = await service.createUser(user);
		const createdSub = await subscriptions.createSubscription({userId: created.id, subscription: "Netflix", price: 12, category: "Video-Streaming"});
		const sub = await subscriptions.getSubscription({userId: created.id});
		const deleted = await service.deleteUser(created.id);
		const orphans = await all("SELECT * FROM SubscriptionModel WHERE id = ?", [createdSub.id]);
		assert.equal(deleted.changes, 1)
		assert.equal(await service.findById(created.id), undefined);
		assert.deepEqual(sub, [{id: createdSub.id, subscription: "Netflix", price: 12, category: "Video-Streaming"}]);
		assert.deepEqual(orphans, []);
	})
})