const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema({
    cloudinaryImgUrl:{
        type: String
    },
    cloudinaryId: {
        type: String
    },
      // Do we need this to establish relationship between user and photo?
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId, 
    //   ref: "User",
    //   require: true,
    // },
});

const Photo = mongoose.model('photo', PhotoSchema);
module.exports = Photo;


