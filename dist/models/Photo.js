import { Schema, model } from 'mongoose'
const PhotoSchema = new Schema({
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
const PhotoModel = model('Photo', PhotoSchema)
export default PhotoModel
//# sourceMappingURL=Photo.js.map
