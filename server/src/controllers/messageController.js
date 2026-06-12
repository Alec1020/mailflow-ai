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
//Inbox API
exports.getInbox = async (req, res) => {
    try {
        const {
            search,
            sort = "newest",
            filter = "all",
        } = req.query;

        const query = {
            receiver: req.user._id,
        };

        // Search
        if (search) {
            query.subject = {
                $regex: search,
                $options: "i",
            };
        }

        // Filter
        if (filter === "read") {
            query.isRead = true;
        }

        if (filter === "unread") {
            query.isRead = false;
        }

        // Sort
        let sortOption = { createdAt: -1 };

        switch (sort) {
            case "oldest":
                sortOption = { createdAt: 1 };
                break;

            case "newest":
                sortOption = { createdAt: -1 };
                break;

            case "subject":
                sortOption = { subject: 1 };
                break;

            case "unread":
                sortOption = { isRead: 1, createdAt: -1 };
                break;

            default:
                sortOption = { createdAt: -1 };
        }

        //Get total count of messages matching the query 
        const total = await Message.countDocuments(query);

        //Pagenation
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const messages = await Message.find(query)
            .populate(
                "sender",
                "firstName lastName email"
            )
            .sort(sortOption)
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            messages,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit),
            },
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
//Message Details API
exports.getMessageById = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)
            .populate("sender", "firstName lastName email")
            .populate("receiver", "firstName lastName email");

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
//Mark as Read API
exports.markAsRead = async (req, res) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            { isRead: true },
            { new: true }
        );

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
//Delete Message API
exports.deleteMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        if (message.receiver.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Forbidden",
            });
        }

        await Message.deleteOne();

        res.status(200).json({
            message: "Message deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
//Reply Message API
exports.replyMessage = async (req, res) => {
    try {
        const original =
            await Message.findById(
                req.params.id
            );

        if (!original) {
            return res.status(404).json({
                message: "Message not found",
            });
        }

        const reply =
            await Message.create({
                sender: req.user._id,
                receiver: original.sender,
                subject:
                    "RE: " +
                    original.subject,
                content:
                    req.body.content,
                parentMessage:
                    original._id,
            });

        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};