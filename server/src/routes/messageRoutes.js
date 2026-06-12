const express = require("express");
const router = express.Router();

const protect = require(
    "../middleware/authMiddleware"
);

const {
    sendMessage,
} = require("../controllers/messageController");

router.post(
    "/send",
    protect,
    sendMessage
);

module.exports = router;