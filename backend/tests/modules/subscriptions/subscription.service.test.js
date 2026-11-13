process.env.DB_PATH = ":memory:";

const { db, run } = require("../../../src/database");
const service = require("../../../src/modules/subscription/subscription.service");
const userService = require("../../../src/modules/users/users.service");
const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");

let testUser;
let subscription;

describe("subscriptions", () => {
	beforeEach(async() => {
		await run("DELETE FROM SubscriptionModel;");
		await run("DELETE FROM Users");
		testUser = await userService.createUser({username: "user1", email: "mail@test.de", password: "password" });
		subscription = {userId: testUser.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}
	});

	after(() => new Promise((resolve) => db.close(resolve)));

	test("create new subscription", async() => {
		const created = await service.createSubscription(subscription);
		assert.deepEqual(created, {id: created.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"});
		assert.equal(typeof created.id, "number");
	})

	test("create subscription fails when it already exists", async() => {
		await service.createSubscription(subscription);
		await assert.rejects(() => service.createSubscription(subscription), service.ConflictError);
	})

	test("getSubscriptions", async() => {
		const created = await service.createSubscription({userId: testUser.id, subscription: "Spotify", price: 12, category: "Musik-Streaming", date: "2026-12-11"});
		const created2 = await service.createSubscription(subscription);
		const info = await service.getSubscription({userId: testUser.id});
		assert.deepEqual([created2, created], info);
	})

	test("delete Subscription", async() => {
		const video = await service.createSubscription(subscription);
		const music =	await service.createSubscription({userId: testUser.id, subscription: "Spotify", price: 12, category: "Musik-Streaming", date: "2026-12-11"});
		const twoSubs = await service.getSubscription({userId: testUser.id});
		const deleted = await service.deleteSubscription({userId: testUser.id, id: video.id});
		const oneSubs = await service.getSubscription({userId: testUser.id});
		assert.deepEqual(twoSubs, [video, music]);
		assert.deepEqual(oneSubs, [music]);
		assert.equal(deleted.changes, 1)
	})

	test("updateSubscription", async() => {
		const video = await service.createSubscription(subscription);
		const info = await service.updateSubscription({userId: testUser.id, id: video.id, subscription: "Hulu", price: 15, category: "Video-Streaming", date: "2026-12-11"});
		const list = await service.getSubscription({userId: testUser.id});
		assert.deepEqual(list, [{id: video.id, subscription: "Hulu", price: 15, category: "Video-Streaming", date: "2026-12-11"}]);
		assert.equal(info.changes, 1);
	});

	test("updateSubscription fails when name already exists", async() => {
		await service.createSubscription(subscription);
		const music =	await service.createSubscription({userId: testUser.id, subscription: "Spotify", price: 12, category: "Musik-Streaming", date: "2026-12-11"});
		const update = {userId: testUser.id, id: music.id, subscription: "Netflix", price: 15, category: "Video-Streaming", date: "2026-12-11"};
		await assert.rejects(() => service.updateSubscription(update), service.ConflictError);
	})
})