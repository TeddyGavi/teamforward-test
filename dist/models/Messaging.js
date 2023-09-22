import { Schema, model } from 'mongoose'
const IndividualMessageSchema = new Schema(
  {
    chatRoomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatRoom',
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
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
  },
  { timestamps: true }
)
const IndividualMessageModel = model(
  'IndividualMessage',
  IndividualMessageSchema
)
export default IndividualMessageModel
//# sourceMappingURL=Messaging.js.map
