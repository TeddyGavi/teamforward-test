import * as dotenv from 'dotenv'
import cloudinary from 'cloudinary'
dotenv.config({ path: '../.env' })
export default cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
})
// console.log("cloudinary config works!" , cloudinary.config())
//# sourceMappingURL=cloudinary.config.js.map
