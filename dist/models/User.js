"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const GeoJSON = require('mongoose-geojson-schema')
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const mongoose_1 = require("mongoose");
const activityList = [
    'networking',
    'mentorship',
    'coffeeMeet',
    'virtualCoffee',
    'chingu',
    'onlineGames',
    'nightlife',
    'virtualMeet',
    'cycling',
    'hiking',
    'iceHockey',
    'running',
    'snowSport',
    'tennis',
    'walking',
    'waterSport',
    'yoga',
];
const activitiesObject = {};
for (const activity of activityList) {
    activitiesObject[activity] = { type: Boolean, default: false };
}
const UserSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: [true, 'A first name is required.'],
    },
    lastName: {
        type: String,
        required: [true, 'A last name is required.'],
    },
    email: {
        type: String,
        unique: true,
        validate: {
            validator: (val) => /^([\w-.]+@([\w-]+\.)+[\w-]+)?$/.test(val),
            message: 'Please enter a valid email.',
        },
    },
    password: {
        type: String,
        // minlength: [8, "Password must be 8 characters or longer."],
    },
    // DOB: {
    //   type: Date,
    //   check that dob is greater than 18 years ago
    //   required: [false, "Must be 18 or older to sign up"],
    // },
    bio: {
        type: String,
    },
    // add photo model to save profile photo info
    photos: {
        type: [{ imageUrl: String, caption: String }],
        validate: {
            validator: function (photos) {
                return photos.length < 4;
            },
            message: 'A user can have a maximum of 4 photos.',
        },
    },
    cloudinaryProfileImgUrl: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    },
    profession: {
        type: String,
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    // zipCode: {
    //   type: Number,
    // },
    location: {
        type: {
            type: String,
            enum: ['Point'], // 'location.type' must be 'Point'
        },
        coordinates: {
            type: [Number],
        },
    },
    // how to convert miles to km
    radius: {
        type: Number,
        // min max radius distance
    },
    // will be stored as an object holding all possible activities and booleans
    // interests: {
    //   chingu: { type: Boolean, default: false },
    //   networking: { type: Boolean, default: false },
    //   mentorship: { type: Boolean, default: false },
    // },
    activities: activitiesObject,
    dmPrivacy: Boolean,
    // userID in each message for ref
    notifications: {
        type: Number,
    },
    googleAuthId: {
        type: String,
    },
    dismissedUpdateProfileMessage: {
        type: Boolean,
        default: false,
    },
});
UserSchema.plugin(mongoose_unique_validator_1.default);
UserSchema.pre('save', async function (next) {
    bcrypt_1.default.hash(this.password, 10).then((hash) => {
        this.password = hash;
        next();
    });
});
const UserModel = (0, mongoose_1.model)('User', UserSchema);
exports.default = UserModel;
//# sourceMappingURL=User.js.map