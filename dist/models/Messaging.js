import { Schema, model } from 'mongoose';
const IndividualMessageSchema = new Schema({
    chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: 'ChatRoom',
        required: true,
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: Schema.Types.ObjectId,
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
const IndividualMessageModel = model('IndividualMessage', IndividualMessageSchema);
export default IndividualMessageModel;
//# sourceMappingURL=Messaging.js.map