process.env.DB_PATH = ":memory:";

const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");
const request = require("supertest");
const app = require("../../../src/app");
const { run } = require("../../../src/database");
const userService = require("../../../src/modules/users/users.service");

const subscription = {subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"};


describe("subscriptionRouter", () => {
	beforeEach(async () => {
		await run("DELETE FROM SubscriptionModel");
		await run("DELETE FROM Users");
	});

	async function loggedInAgent(username) {
		await userService.createUser({username: username, email: `${username}@test.de`, password: "password" });
		const agent = request.agent(app);
		const res = await agent.post("/api/auth/login").send({ username: username, password: "password" });
		assert.equal(res.status, 200);
		return agent;
	}

	test("POST /api/subscriptions creates subscription (201)", async () => {
		const agent = await loggedInAgent("user");
		const sub = await agent.post("/api/subscriptions").send(subscription);
		assert.equal(sub.status, 201);
		assert.deepEqual(sub.body, {id: sub.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"});
	});

	test("POST /api/subscriptions returns 409 when subscription name exists", async () => {
		const agent = await loggedInAgent("user");
		await agent.post("/api/subscriptions").send(subscription);
		const sub = await agent.post("/api/subscriptions").send(subscription);
		assert.equal(sub.status, 409);
	})

	test("POST /api/subscriptions gets default date when input empty", async () => {
		const agent = await loggedInAgent("user");
		const sub = await agent.post("/api/subscriptions").send({subscription: "Netflix", price: 12, category: "Video-Streaming", date: ""});
		assert.deepEqual(sub.body, {id: sub.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-11-12"});
	})

	test("POST /api/subscriptions returns 400 when date not valid", async () => {
		const agent = await loggedInAgent("user");
		const sub = await agent.post("/api/subscriptions").send({subscription: "Netflix", price: 12, category: "Video-Streaming", date: "abcd"});
		assert.equal(sub.status, 400);
	})

	test("POST /api/subscriptions returns 401 when not logged in", async () => {
		const created = await request(app).post("/api/subscriptions").send(subscription);
		assert.equal(created.status, 401);
	})

	test("POST /api/subscriptions returns 400 when field is empty", async () => {
		const agent = await loggedInAgent("user");
		assert.equal((await agent.post("/api/subscriptions").send({subscription: "", price: 12, category: "Video-Streaming", date: "2026-12-11"})).status, 400);
		assert.equal((await agent.post("/api/subscriptions").send({subscription: "Netflix", price: 12, category: "", date: "2026-12-11"})).status, 400);
	})

	test("POST /api/subscriptions returns 400 when price invalid", async () => {
		const agent = await loggedInAgent("user");
		assert.equal((await agent.post("/api/subscriptions").send({subscription: "Hulu", price: "12", category: "Video-Streaming", date: "2026-12-11"})).status, 400);
		assert.equal((await agent.post("/api/subscriptions").send({subscription: "Hulu", price: -5, category: "Video-Streaming", date: "2026-12-11"})).status, 400);
	})

	test("GET /api/subscriptions returns subscriptions", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		const sub = await agent.get("/api/subscriptions")
		assert.equal(sub.status, 200);
		assert.deepEqual(sub.body, [{id: created.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}]);
	})

	test("GET /api/subscriptions returns 401 when no user logged in", async () => {
		const sub = await request(app).get("/api/subscriptions");
		assert.equal(sub.status, 401);
	})

	test("GET /api/subscriptions shows only subscriptions from user", async () => {
		const agentA = await loggedInAgent("user");
		const agentB = await loggedInAgent("user2");

		await agentA.post("/api/subscriptions").send(subscription);
		assert.deepEqual((await agentB.get("/api/subscriptions")).body, []);
	})

	test("delete /api/subscriptions returns 200 when successful", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		assert.deepEqual((await agent.get("/api/subscriptions")).body, [{id: created.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}]);

		const deleted = await agent.delete(`/api/subscriptions/${created.body.id}`);
		assert.equal(deleted.status, 200);
		assert.deepEqual((await agent.get("/api/subscriptions")).body, []);
	})

	test("delete /api/subscriptions returns 401 when no user logged in", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		assert.deepEqual((await agent.get("/api/subscriptions")).body, [{id: created.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}]);
		await agent.post("/api/auth/logout")

		const deleted = await agent.delete(`/api/subscriptions/${created.body.id}`);
		assert.equal(deleted.status, 401);
	})

	test("delete /api/subscriptions returns 404 when subscription not found", async () => {
		const agent = await loggedInAgent("user");
		const deleted = await agent.delete(`/api/subscriptions/1`);
		assert.equal(deleted.status, 404);
	})

	test("delete /api/subscriptions can't delete twice", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription)
		await agent.delete(`/api/subscriptions/${created.body.id}`);
		const deleted = await agent.delete(`/api/subscriptions/${created.body.id}`);
		assert.equal(deleted.status, 404);
	})

	test("delete /api/subscriptions can't delete other users subscription", async () => {
		const agentA = await loggedInAgent("user");
		const agentB = await loggedInAgent("user2");
		const created = await agentB.post("/api/subscriptions").send(subscription);
		const deleted = await agentA.delete(`/api/subscriptions/${created.body.id}`);
		assert.equal(deleted.status, 404);
	})

	test("PUT /api/subscriptions returns 200 when successful", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		const updated = await agent.put(`/api/subscriptions/${created.body.id}`).send({subscription: "Spotify", price: 20, category: "Music-Streaming", date: "2025-07-15"})
		assert.equal(updated.status, 200);
		assert.deepEqual((await agent.get("/api/subscriptions")).body, [{id: created.body.id, subscription: "Spotify", price: 20, category: "Music-Streaming", date: "2025-07-15"}]);
	})

	test("PUT /api/subscriptions returns 404 when subscription not found", async () => {
		const agent = await loggedInAgent("user");
		await agent.post("/api/subscriptions").send(subscription);
		const updated = await agent.put(`/api/subscriptions/1000`).send({subscription: "Spotify", price: 20, category: "Music-Streaming", date: "2026-12-11"})
		assert.equal(updated.status, 404);
	})

	test("PUT /api/subscriptions returns 400 when empty input", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		const updated = await agent.put(`/api/subscriptions/${created.body.id}`).send({subscription: "", price: 20, category: "", date: "2026-12-11"});
		assert.equal(updated.status, 400);
	})

	test("PUT /api/subscriptions returns 400 when invalid input", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		const updated = await agent.put(`/api/subscriptions/${created.body.id}`).send({subscription: ["Hulu"], price: 20, category: "Video-Streaming", date: "2026-12-11"});
		assert.equal(updated.status, 400);
		const updated2 = await agent.put(`/api/subscriptions/${created.body.id}`).send({subscription: "Hulu", price: -5, category: "Video-Streaming", date: "2026-12-11"});
		assert.equal(updated2.status, 400);
		assert.deepEqual((await agent.get("/api/subscriptions")).body, [{id: created.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}]);

	})

	test("PUT /api/subscriptions returns 409 when subscription name exists", async () => {
		const agent = await loggedInAgent("user");
		await agent.post("/api/subscriptions").send(subscription);
		const created = await agent.post("/api/subscriptions").send({subscription: "Hulu", price: 20, category: "Video-Streaming", date: "2026-12-11"});
		const updated = await agent.put(`/api/subscriptions/${created.body.id}`).send({subscription: "Netflix", price: 20, category: "Video-Streaming", date: "2026-12-11"});
		assert.equal(updated.status, 409);
	});

	test("PUT /api/subscriptions works when subscription not changed", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		const updated = await agent.put(`/api/subscriptions/${created.body.id}`).send({subscription: "Netflix", price: 20, category: "Video-Streaming", date: "2026-12-11"});
		assert.equal(updated.status, 200);
	});

	test("PUT /api/subscriptions returns 401 when not logged in", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		assert.deepEqual((await agent.get("/api/subscriptions")).body, [{id: created.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}]);
		await agent.post("/api/auth/logout")

		const update = await agent.put(`/api/subscriptions/${created.body.id}`).send({subscription: "Hulu", price: 20, category: "Video-Streaming", date: "2026-12-11"});
		assert.equal(update.status, 401);
	})

	test("PUT /api/subscriptions returns 400 when date illegal", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/subscriptions").send(subscription);
		const updated = await agent.put(`/api/subscriptions/${created.body.id}`).send({subscription: "Netflix", price: 20, category: "Video-Streaming", date: "11.11.2011"});
		assert.equal(updated.status, 400);
	})

	test("PUT /api/subscriptions can't change other users subscription", async () => {
		const agentA = await loggedInAgent("user");
		const created = await agentA.post("/api/subscriptions").send(subscription);
		const agentB = await loggedInAgent("user2");

		const change = await agentB.put(`/api/subscriptions${created.body.id}`).send({subscription: "Hulu", price: 20, category: "Video-Streaming", date: "2026-12-11"});
		assert.equal(change.status, 404);
		assert.deepEqual((await agentA.get("/api/subscriptions")).body, [{id: created.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}]);
	})

	test("two users can have same subscription", async () => {
		const agentA = await loggedInAgent("user");
		const agentB = await loggedInAgent("user2");
		const created1 = await agentA.post("/api/subscriptions").send(subscription);
		const created2 = await agentB.post("/api/subscriptions").send(subscription);

		assert.deepEqual((await agentA.get("/api/subscriptions")).body, [{id: created1.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}]);
		assert.deepEqual((await agentB.get("/api/subscriptions")).body, [{id: created2.body.id, subscription: "Netflix", price: 12, category: "Video-Streaming", date: "2026-12-11"}]);
	})
});