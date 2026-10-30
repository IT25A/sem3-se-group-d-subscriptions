process.env.DB_PATH = ":memory:";

const db = require("../../../src/database");
const service = require("../../../src/modules/subscribtion/subscription.service");
const userService = require("../../../src/modules/users/users.service");
const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");

const user = {username: "user1", email: "mail@test.de", password: "password" };
const testUser = userService.createUser(user);
const subscription = {userId: testUser.id, subscription: "Netflix", price: 12, category: "Video-Streaming"}

describe("subscriptions", () => {
	beforeEach(() => {
		db.exec("DELETE FROM SubscriptionModel;");
	});

	after(() => db.close());

	test("create new subscription", () => {
		const created = service.createSubscription(subscription);
		assert.deepEqual(created, {id: created.id, subscription: "Netflix", price: 12, category: "Video-Streaming"});
		assert.equal(typeof created.id, "number");
	})

	test("create subscription fails when it already exists", () => {
		service.createSubscription(subscription);
		assert.throws(() => service.createSubscription(subscription), service.ConflictError);
	})

	test("getSubscriptions", () => {
		const created = service.createSubscription({userId: testUser.id, subscription: "Spotify", price: 12, category: "Musik-Streaming"});
		const created2 = service.createSubscription(subscription);
		const info = service.getSubscription({userId: testUser.id});
		assert.deepEqual([created2, created], info);
	})

	test("delete Subscription", () => {
		const video = service.createSubscription(subscription);
		const music =	service.createSubscription({userId: testUser.id, subscription: "Spotify", price: 12, category: "Musik-Streaming"});
		const twoSubs = service.getSubscription({userId: testUser.id});
		const deleted = service.deleteSubscription({userId: testUser.id, id: video.id});
		const oneSubs = service.getSubscription({userId: testUser.id});
		assert.deepEqual(twoSubs, [video, music]);
		assert.deepEqual(oneSubs, [music]);
		assert.equal(deleted.changes, 1)
	})

	test("updateSubscription", () => {
		const video = service.createSubscription(subscription);
		const info = service.updateSubscription({userId: testUser.id, id: video.id, subscription: "Hulu", price: 15, category: "Video-Streaming"});
		const list = service.getSubscription({userId: testUser.id});
		assert.deepEqual(list, [{id: video.id, subscription: "Hulu", price: 15, category: "Video-Streaming"}]);
		assert.equal(info.changes, 1);
	});
})