process.env.DB_PATH = ":memory:";
process.env.SESSION_SECRET = "test-secret";

const { db, run, get, all} = require("../../../src/database");
const service = require("../../../src/modules/notification/notification.service");

const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");
const userService = require("../../../src/modules/users/users.service");

let testUser;
let notification;

describe("notifications", () => {
	beforeEach(async () => {
		await run("DELETE FROM SubscriptionModel;");
		await run("DELETE FROM Users");
		testUser = await userService.createUser({username: "user1", email: "mail@test.de", password: "password"});
		notification = {
			userId: testUser.id,
			message: "Test message",
		}
	});

	after(() => new Promise((resolve) => db.close(resolve)));

	test("createNotification", async () => {
		const created = await service.createNotification(notification);
		assert.deepEqual(created, {id: created.id, message: "Test message", date: new Date().toISOString().split('T')[0]});
	})

	test("getNotification", async () => {
		const created = await service.createNotification(notification);
		const list = await service.getNotifications({userId: testUser.id});
		assert.deepEqual(list, [{id: created.id, date: new Date().toISOString().split('T')[0], message: "Test message"}])
	})

	test("deleteNotification", async () => {
		const created = await service.createNotification(notification);
		const listBefore = await service.getNotifications({userId: testUser.id});
		const deleted = await service.deleteNotification({userId: testUser.id, id: created.id});
		const listAfter = await service.getNotifications({userId: testUser.id});
		assert.deepEqual(listBefore, [{id: created.id, date: new Date().toISOString().split('T')[0], message: "Test message"}])
		assert.deepEqual(listAfter, [])
		assert.equal(deleted.changes, 1)
	})
})