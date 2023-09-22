import { Document, Schema, model, Types } from 'mongoose'

export interface IChatRoom extends Document {
  userIds: Types.ObjectId[]
}
const ChatRoomSchema = new Schema<IChatRoom>(
  {
    userIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
  },
  { timestamps: true }
)
const ChatRoomModel = model<IChatRoom>('ChatRoom', ChatRoomSchema)

export default ChatRoomModel
