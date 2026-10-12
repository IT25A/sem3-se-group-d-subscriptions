const sqlite3 = require("sqlite3").verbose();

// Each test suite gets its own in-memory database
let db;

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

beforeAll(async () => {
  db = new sqlite3.Database(":memory:");
  await run(`
    CREATE TABLE Users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      username  TEXT    UNIQUE NOT NULL,
      email     TEXT    UNIQUE NOT NULL,
      password  TEXT           NOT NULL,
      createdAt TEXT           NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT           NOT NULL DEFAULT (datetime('now'))
    )
  `);
});

afterAll(() => {
  db.close();
});

afterEach(async () => {
  await run("DELETE FROM Users");
});

describe("Users table", () => {
  test("inserts a user and reads it back", async () => {
    const { lastID } = await run(
      "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
      ["alice", "alice@example.com", "hashed_password"]
    );

    const user = await get("SELECT * FROM Users WHERE id = ?", [lastID]);

    expect(user.id).toBe(lastID);
    expect(user.username).toBe("alice");
    expect(user.email).toBe("alice@example.com");
  });

  test("rejects duplicate username", async () => {
    await run(
      "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
      ["bob", "bob@example.com", "pw"]
    );

    await expect(
      run("INSERT INTO Users (username, email, password) VALUES (?, ?, ?)", [
        "bob",
        "other@example.com",
        "pw",
      ])
    ).rejects.toThrow();
  });

  test("rejects duplicate email", async () => {
    await run(
      "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
      ["carol", "carol@example.com", "pw"]
    );

    await expect(
      run("INSERT INTO Users (username, email, password) VALUES (?, ?, ?)", [
        "other",
        "carol@example.com",
        "pw",
      ])
    ).rejects.toThrow();
  });

  test("rejects missing required fields", async () => {
    await expect(
      run("INSERT INTO Users (username) VALUES (?)", ["dave"])
    ).rejects.toThrow();
  });
});
