const User = require("../models/User");
const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
    try {
        const { receiverEmail, subject, content } =
            req.body;

        const receiver = await User.findOne({
            email: receiverEmail,
        });

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver not found",
            });
        }

        const message = await Message.create({
            sender: req.user._id,
            receiver: receiver._id,
            subject,
            content,
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};