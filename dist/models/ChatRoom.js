import { Schema, model } from 'mongoose'
const ChatRoomSchema = new Schema(
  {
    userIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  { timestamps: true }
)
const ChatRoomModel = model('ChatRoom', ChatRoomSchema)
export default ChatRoomModel
//# sourceMappingURL=ChatRoom.js.map
