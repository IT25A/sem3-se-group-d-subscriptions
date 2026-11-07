const { Router } = require("express");
const service = require("./subscription.service");

const router = Router();

router.post("/", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "User not logged in" });
    }

    const { subscription, price, category } = req.body;
    const userId = req.session.userId;

    const name = typeof subscription === "string" ? subscription.trim() : "";
    const cat = typeof category === "string" ? category.trim() : "";

    if (!name || !price || !cat) {
        return res.status(400).json({ error: "Subscription, price and category are required" });
    }

    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({ error: "Invalid price" });
    }

    try {
        const subscriptionItem = await service.createSubscription({ userId, subscription, price, category });
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

router.get("/", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "User not logged in" });
    }
    try {
        const subscriptionItem = await service.getSubscription({ userId: req.session.userId });
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

router.delete("/:id", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "User not logged in" });
    }
    const id = Number(req.params.id);
    const userId = req.session.userId;
    try {
        const result = await service.deleteSubscription({ userId, id });
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

router.put("/:id", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "User not logged in" });
    }
    const id = Number(req.params.id);
    const userId = req.session.userId;
    const { subscription, price, category } = req.body ?? {};
    const name = typeof subscription === "string" ? subscription.trim() : "";
    const cat = typeof category === "string" ? category.trim() : "";

    if (!name || !cat) {
        return res.status(400).json({ error: "Subscription name and category can't be empty" });
    }
    if (typeof price !== "number" || price < 0) {
        return res.status(400).json({error: "Invalid subscription name or price"});
    }
    try {
        const result = await service.updateSubscription({ userId, id, subscription: name, price: price, category: cat });
        if (result.changes === 0) {
            return res.status(404).json({ error: "Subscription not found" });
        }
        res.status(200).json({ success: true });
    }
    catch (err) {
        if (err instanceof service.ConflictError) {
            return res.status(409).json({ error: "Subscription name already exists" });
        }
        console.error("Update subscription error:", err);
        res.status(500).json({ error: "Failed to update subscription" });
    }
})

module.exports = router;
