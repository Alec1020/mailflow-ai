const express = require("express");
const router = express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const {
    sendMessage,
    getInbox,
    getMessageById,
    markAsRead,
    deleteMessage
} = require("../controllers/messageController");

router.post(
    "/send",
    protect,
    sendMessage
);

router.get(
    "/inbox",
    protect,
    getInbox
);

router.get(
    "/:id",
    protect,
    getMessageById
);

router.put(
    "/:id/read",
    protect,
    markAsRead
);

router.delete(
    "/:id",
    protect,
    deleteMessage
);

router.post(
    "/:id/reply",
    protect,
    replyMessage
);

module.exports = router;