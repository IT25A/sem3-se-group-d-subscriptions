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

module.exports = router;
