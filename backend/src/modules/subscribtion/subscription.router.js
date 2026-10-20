const { Router } = require("express");
const service = require("./subscription.service");

const router = Router();

router.post("/add", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "not logged in" });
    }

    const { subscription, price, category } = req.body;
    const userId = req.session.userId;

    if (!subscription || !price || !category) {
        return res.status(400).json({ error: "subscription, price and category are required" });
    }

    try {
        const subscriptionItem = service.createSubscription({ userId, subscription, price, category });
        res.status(201).json(subscriptionItem);
    }
    catch (err) {
        if (err instanceof service.ConflictError) {
            return res.status(409).json({ error: err.message });
        }
        console.error("Insert subscription error:", err);
        res.status(500).json({ error: "Failed to create subscription" });
    }
})

module.exports = router;
