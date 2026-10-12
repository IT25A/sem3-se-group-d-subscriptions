const { Router } = require("express");
const db = require("../../database");

const router = Router();

router.post("/", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email and password are required" });
  }

  db.run(
    "INSERT INTO Users (username, email, password) VALUES (?, ?, ?)",
    [username, email, password],
    function (err) {
      if (err) {
        console.error("Insert user error:", err.message);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ error: "Username or email already taken" });
        }
        return res.status(500).json({ error: "Failed to create user" });
      }
      res.status(201).json({ id: this.lastID, username, email });
    }
  );
});

module.exports = router;
