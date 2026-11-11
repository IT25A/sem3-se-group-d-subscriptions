const { Router } = require("express");
const service = require("./users.service");

const router = Router();

router.post("/", async (req, res) => {
  const { username, email, password } = req.body ?? {};

  const name = typeof username === "string" ? username.trim() : "";
  const mail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!name || !mail || typeof password !== "string" || !password) {
    return res.status(400).json({ error: "Username, email and password are required" });
  }

  try {
    const user = await service.createUser({ username: name, email: mail, password });
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof service.ConflictError) {
      return res.status(409).json({ error: err.message });
    }
    console.error("Insert user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.put("/budget", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "User not logged in" });
  }
  const { budget } = req.body;
  if (budget == null) {
    return res.status(400).json({ error: "Budget is required" });
  }
  if ( typeof budget != "number" || budget < 0) {
    return res.status(400).json({ error: "Budget is invalid" });
  }
  try {
    const result = await service.setBudget(budget, req.session.userId);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ budget });
  }
  catch (err) {
    console.error("update budget error:", err);
    res.status(500).json({ error: "Failed to update budget" });
  }
})

router.delete("/", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "User not logged in" });
  }

  try {
    const result = await service.deleteUser(req.session.userId);
    if (result.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Failed to end session" });
      res.clearCookie("connect.sid");
      res.status(200).json({ success: true });
    })
  }
  catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" });
  }
})

module.exports = router;
