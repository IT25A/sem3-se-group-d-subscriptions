process.env.DB_PATH = ":memory:";

const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");
const request = require("supertest");
const app = require("../../../src/app");
const { run } = require("../../../src/database");

const user = { username: "user1", email: "mail@test.de", password: "password123" };

describe("authRouter", () => {
	beforeEach(async () => {
		await run("DELETE FROM SubscriptionModel");
		await run("DELETE FROM Users");
	});

	test("Login with wrong credentials returns 401", async () => {
		await request(app).post("/api/users").send(user);
		const res = await request(app).post("/api/auth/login").send({ username: "user1", password: "falsch" });
		assert.equal(res.status, 401);
	});

	test("login, session and logout works", async () => {
		const agent = request.agent(app);
		const created = await agent.post("/api/users").send(user);
		const login = await agent.post("/api/auth/login").send({username: "user1", password: "password123"});
		assert.equal(login.status, 200);

		const session = await agent.get("/api/auth/session")
		assert.equal(session.status, 200);
		assert.equal(session.id, created.id);

		const logout = await agent.post("/api/auth/logout");
		assert.equal(logout.status, 200);

		const after = await agent.get("/api/auth/session")
		assert.equal(after.status, 401);
	})
});