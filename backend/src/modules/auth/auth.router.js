const { Router } = require("express");
const service = require("../users/users.service");

const router = Router();

router.post("/login",  (req, res) => {
	const { username, password } = req.body;
	if (!username || !password) {
		return res.status(400).json({ error: "username and password are required" });
	}
	try {
		const user = service.verifyCredentials(username, password);
		req.session.regenerate((err) => {
			if (err) return res.status(500).json({ error: "Login failed" });
			req.session.userId = user.id;
			res.json(user);
		});
	}
	catch (err) {
		if (err instanceof service.InvalidCredentialsError) {
			return res.status(401).json({ error: err.message });
		}
		console.error("Login error:", err);
		res.status(500).json({ error: "Login failed" });
	}
})

router.post("/logout", (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ error: "Unable to logout user" });
		res.clearCookie("connect.sid");
		res.json({ success: true });
	})
})

router.get("/session", (req, res) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: "no user logged in" });
	}
	let user = service.findById(req.session.userId)
	if (!user) {
		return res.status(401).json({ error: "no user logged in" });
	}
	res.json(user);
})

module.exports = router;