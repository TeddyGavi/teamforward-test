import { Schema, Document, model } from 'mongoose'

export interface IPhoto extends Document {
  cloudinaryImgUrl: string
  cloudinaryId: string
}

const PhotoSchema = new Schema<IPhoto>({
  cloudinaryImgUrl: {
    type: String,
  },
  cloudinaryId: {
    type: String,
  },
  // Do we need this to establish relationship between user and photo?
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  //   require: true,
  // },
})

const PhotoModel = model<IPhoto>('Photo', PhotoSchema)

export default PhotoModel
