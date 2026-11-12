const { Router } = require("express");
const service = require("./notification.service");

const router = Router();

router.post("/", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "User not logged in" });
    }

    const { message } = req.body;
    const userId = req.session.userId;

    if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
    }

    try {
        const notification = await service.createNotification({ userId, message: message.trim() });
        res.status(201).json(notification);
    } catch (err) {
        console.error("Create notification error:", err);
        res.status(500).json({ error: "Failed to create notification" });
    }
});

router.get("/", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "User not logged in" });
    }
    try {
        const notifications = await service.getNotifications({ userId: req.session.userId });
        res.status(200).json(notifications);
    } catch (err) {
        console.error("Get notifications error:", err);
        res.status(500).json({ error: "Failed to get notifications" });
    }
});

router.delete("/:id", async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: "User not logged in" });
    }
    const id = Number(req.params.id);
    const userId = req.session.userId;
    try {
        const result = await service.deleteNotification({ userId, id });
        if (result.changes === 0) {
            return res.status(404).json({ error: "Notification not found" });
        }
        res.status(200).json({ success: true });
    } catch (err) {
        console.error("Delete notification error:", err);
        res.status(500).json({ error: "Failed to delete notification" });
    }
})

module.exports = router;