import { Document, Schema, model, Types } from 'mongoose'

export interface ISingleMessage extends Document {
  chatRoomId: Types.ObjectId
  from: Types.ObjectId
  to: Types.ObjectId
  message?: string
  unread: boolean
}

const IndividualMessageSchema = new Schema<ISingleMessage>(
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

const IndividualMessageModel = model<ISingleMessage>(
  'IndividualMessage',
  IndividualMessageSchema
)

export default IndividualMessageModel
