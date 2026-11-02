const { Router } = require("express");
const service = require("./users.service");

const router = Router();

router.post("/", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "username, email and password are required" });
  }

  try {
    const user = service.createUser({username, email, password});
    res.status(201).json(user);
  }
  catch (err) {
    if (err instanceof service.ConflictError) {
      return res.status(409).json({ error: err.message });
    }
    console.error("Insert user error:", err);
    res.status(500).json({ error: "Failed to create user" });
  }
});

router.put("/budget", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "not logged in" });
  }
  const { budget } = req.body;
  if (budget == null) {
    return res.status(400).json({ error: "budget is required" });
  }
  if (budget < 0 || typeof budget != "number") {
    return res.status(400).json({ error: "budget is invalid" });
  }
  try {
    service.setBudget(budget, req.session.userId);
    res.status(200).json({budget});
  }
  catch (err) {
    console.error("update budget error:", err);
    res.status(500).json({ error: "Failed to update budget" });
  }
})

module.exports = router;
