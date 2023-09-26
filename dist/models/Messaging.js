"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const IndividualMessageSchema = new mongoose_1.Schema({
    chatRoomId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true,
    },
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
    },
    unread: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
const IndividualMessageModel = (0, mongoose_1.model)('IndividualMessage', IndividualMessageSchema);
exports.default = IndividualMessageModel;
//# sourceMappingURL=Messaging.js.map