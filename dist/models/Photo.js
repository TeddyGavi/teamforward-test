"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PhotoSchema = new mongoose_1.Schema({
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
});
const PhotoModel = (0, mongoose_1.model)('Photo', PhotoSchema);
exports.default = PhotoModel;
//# sourceMappingURL=Photo.js.map