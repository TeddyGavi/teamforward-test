"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(
// `mongodb+srv://new-user-22:${KEY}@cluster0.4qha5k5.mongodb.net/?retryWrites=true&w=majority`, <- V43 MongoDB Cluster
`mongodb+srv://teamforward:${encodeURIComponent(process.env.MONGODB_PW)}@teamforward.i663tys.mongodb.net/?retryWrites=true&w=majority`, {
// useNewUrlParser: true,
// useUnifiedTopology: true,
// useFindAndModify:false
})
    .then(() => console.log('Successfully connected to MongoDB'))
    .catch((err) => console.log(err));
//# sourceMappingURL=mongoose.config.js.map