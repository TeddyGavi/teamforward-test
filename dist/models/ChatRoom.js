"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChatRoomSchema = new mongoose_1.Schema({
    userIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    ],
}, { timestamps: true });
const ChatRoomModel = (0, mongoose_1.model)('ChatRoom', ChatRoomSchema);
exports.default = ChatRoomModel;
//# sourceMappingURL=ChatRoom.js.map