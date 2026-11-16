process.env.DB_PATH = ":memory:";
process.env.SESSION_SECRET = "test-secret";

const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");
const request = require("supertest");
const app = require("../../../src/app");
const { run } = require("../../../src/database");
const userService = require("../../../src/modules/users/users.service");

const message = {message:"Test message"};

describe("notificationRouter", () => {
	beforeEach(async () => {
		await run("DELETE FROM Notifications");
		await run("DELETE FROM Users");
	});

	async function loggedInAgent(username) {
		await userService.createUser({username: username, email: `${username}@test.de`, password: "password"});
		const agent = request.agent(app);
		const res = await agent.post("/api/auth/login").send({username: username, password: "password"});
		assert.equal(res.status, 200);
		return agent;
	}

	test("POST /api/notifications returns 201 on success", async () => {
		const agent = await loggedInAgent("user");
		const note = await agent.post("/api/notifications").send(message);
		assert.equal(note.status, 201);
		assert.deepEqual(note.body, {id: note.body.id, message: "Test message", date: new Date().toISOString().split('T')[0]});
	})

	test("POST /api/notifications returns 400 without message", async () => {
		const agent = await loggedInAgent("user");
		const note = await agent.post("/api/notifications").send("");
		assert.equal(note.status, 400);
	})

	test("POST /api/notifications returns 401 without user logged in", async () => {
		const created = await request(app).post("/api/notifications").send(message);
		assert.equal(created.status, 401);
	})

	test("GET /api/notifications returns messages and 200", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/notifications").send(message);
		const list = await agent.get("/api/notifications");
		assert.deepEqual(list.body, [{id: created.body.id, date: new Date().toISOString().split('T')[0], message: "Test message"}]);
		assert.equal(list.status, 200);
	})

	test("GET /api/notifications returns 401 without user", async () => {
		const notes = await request(app).get("/api/notifications")
		assert.equal(notes.status, 401);
	})

	test("GET /api/notifications shows only notifications from user", async () => {
		const agentA = await loggedInAgent("user");
		const agentB = await loggedInAgent("user2");

		await agentA.post("/api/subscriptions").send(message);
		assert.deepEqual((await agentB.get("/api/notifications")).body, []);
	})

	test("DELETE /api/notifications returns 200 when successful"), async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/notifications").send(message);
		const listBefore = await agent.get("/api/notifications");
		const deleted = await agent.delete(`/api/notifications/${created.id}`);
		const listAfter = await agent.get("/api/notifications");
		assert.deepEqual(listBefore.body, [{id: created.body.id, date: new Date().toISOString().split('T')[0], message: "Test message"}]);
		assert.deepEqual(listAfter.body, [])
		assert.equal(deleted.changes, 1)
	}

	test("DELETE /api/notifications returns 401 without user", async () => {
		const deleted = await request(app).delete("/api/notifications/1");
		assert.equal(deleted.status, 401);
	})

	test("DELETE /api/notifications returns 404 when ID doesn't exists", async () => {
		const agent = await loggedInAgent("user");
		const deleted = await agent.delete("/api/notifications/10000");
		assert.equal(deleted.status, 404);
	})

	test("DELETE /api/notifications can't delete twice", async () => {
		const agent = await loggedInAgent("user");
		const created = await agent.post("/api/notifications").send(message)
		await agent.delete(`/api/notifications/${created.body.id}`);
		const deleted = await agent.delete(`/api/notifications/${created.body.id}`);
		assert.equal(deleted.status, 404);
	})
})