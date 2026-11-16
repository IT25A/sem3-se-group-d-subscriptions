process.env.DB_PATH = ":memory:";
process.env.SESSION_SECRET = "test-secret";

const assert = require('node:assert/strict');
const { describe,test, beforeEach, after } = require("node:test");
const request = require("supertest");
const app = require("../../../src/app");
const { run } = require("../../../src/database");

const user = { username: "user1", email: "mail@test.de", password: "password123" };

describe("usersRouter", () => {
	beforeEach(async () => {
		await run("DELETE FROM SubscriptionModel");
		await run("DELETE FROM Users");
	});

	test("POST /api/users creates user (201)", async () => {
		const res = await request(app).post("/api/users").send(user);
		assert.equal(res.status, 201);
		assert.equal(res.body.username, "user1");
		assert.equal(res.body.password, undefined);
	});

	test("POST /api/users throws 409 when user exists", async () => {
		await request(app).post("/api/users").send(user);
		const res = await request(app).post("/api/users").send(user);
		assert.equal(res.status, 409);
	})

	test("POST /api/users throws 400 when field is missing", async () => {
		assert.equal((await request(app).post("/api/users").send({ username: "", email: "mail@test.de", password: "password123" })).status, 400);
		assert.equal((await request(app).post("/api/users").send({ username: "user1", email: "", password: "password123" })).status, 400);
		assert.equal((await request(app).post("/api/users").send({ username: "user1", email: "mail@test.de", password: "" })).status, 400);
	})

	test("POST /api/users throws 400 when input is of wrong type", async () => {
		const res = await request(app).post("/api/users").send({ username: 12, email: "mail@test.de", password: "password123" });
		assert.equal(res.status, 400)
	})

	test("PUT /api/users/budget sets budget(200)", async () => {
		const agent = request.agent(app);
		await agent.post("/api/users").send(user);
		await agent.post("/api/auth/login").send({ username: user.username, password: user.password });

		const res = await agent.put("/api/users/budget").send({ budget: 50 });

		assert.equal(res.status, 200);
		assert.equal(res.body.budget, 50);

		const session = await agent.get("/api/auth/session");
		assert.equal(session.body.budget, 50);
	});

	test("PUT /api/users/budget without login returns 401", async () => {
		const res = await request(app).put("/api/users/budget").send({ budget: 50 });
		assert.equal(res.status, 401);
	});

	test("PUT /api/users/budget with invalid value returns 400", async () => {
		const agent = request.agent(app);
		await agent.post("/api/users").send(user);
		await agent.post("/api/auth/login").send({ username: user.username, password: user.password });

		assert.equal((await agent.put("/api/users/budget").send({ budget: -5 })).status, 400);
		assert.equal((await agent.put("/api/users/budget").send({ budget: "50" })).status, 400);
		assert.equal((await agent.put("/api/users/budget").send({})).status, 400);
	});

	test("DELETE /api/users returns 200 when successful", async () => {
		const agent = request.agent(app);
		await agent.post("/api/users").send(user);
		await agent.post("/api/auth/login").send({ username: user.username, password: user.password });
		const deleted = await agent.delete("/api/users");
		assert.equal(deleted.status, 200);

		const relogin = await request(app).post("/api/auth/login").send({ username: user.username, password: user.password });
		assert.equal(relogin.status, 401);

		const after = await agent.get("/api/auth/session")
		assert.equal(after.status, 401);
	})

	test("DELETE /api/users returns 401 when not logged in", async () => {
		const deleted = await request(app).delete("/api/users");
		assert.equal(deleted.status, 401);
	})
});

