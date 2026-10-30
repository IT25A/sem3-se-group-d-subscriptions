const { Router } = require("express");
const service = require("./subscription.service");

const router = Router();

router.post("/", (req, res) => {
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

router.get("/", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "not logged in" });
    }
    try {
        const subscriptionItem = service.getSubscription({ userId: req.session.userId });
        res.status(200).json(subscriptionItem);
    }
    catch (err) {
        if (err instanceof service.ConflictError) {
            return res.status(409).json({ error: err.message });
        }
        console.error("get subscription error:", err);
        res.status(500).json({ error: "Failed to get subscription" });
    }
})

router.delete("/:id", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "not logged in" });
    }
    const id = Number(req.params.id);
    const userId = req.session.userId;
    try {
        const result = service.deleteSubscription({ userId, id });
        if (result.changes === 0) {
            return res.status(404).json({ error: "Subscription not found" });
        }
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error("delete subscription error:", err);
        res.status(500).json({ error: "Failed to delete subscription" });
    }
})

router.put("/:id", (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "not logged in" });
    }
    const id = Number(req.params.id);
    const userId = req.session.userId;
    const  change  = req.body;
    if (change.subscription === undefined && change.price === undefined && change.category === undefined) {
        return res.status(400).json({error: "at least one field is required"});
    }
    try {
        const result = service.updateSubscription({ userId, id, subscription: change.subscription, price: change.price, category: change.category });
        if (result.changes === 0) {
            return res.status(404).json({ error: "Subscription not found" });
        }
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.error("update subscription error:", err);
        res.status(500).json({ error: "Failed to update subscription" });
    }
})

module.exports = router;
