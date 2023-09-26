"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersWithinRadius = exports.getLocationHelper = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const index_1 = require("../models/index");
const logging_1 = require("./logging");
const getLocationHelper = async (address) => {
    try {
        const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${address}`;
        const response = await (0, node_fetch_1.default)(url);
        //TODO handle non 200 responses (200 means ok)
        const responseJson = await response.json();
        (0, logging_1.log)(responseJson);
        return responseJson.data;
    }
    catch (expection) {
        console.log('something went wrong with getLocationHelper function', expection);
    }
};
exports.getLocationHelper = getLocationHelper;
const getUsersWithinRadius = async (coordinates, radius, activities, userId) => {
    try {
        // let splitInterests = interests?.split(",") || [];
        // let interestQuery = [];
        // for(let interest of splitInterests){
        //     const queryInterestObject = {};
        //     queryInterestObject[`interests.${interest}`] = true;
        //     interestQuery.push(queryInterestObject);
        // }
        const splitActivities = activities?.split(',') || [];
        const activityQuery = [];
        for (const activity of splitActivities) {
            const queryActivityObject = {};
            queryActivityObject[`activities.${activity}`] = true;
            activityQuery.push(queryActivityObject);
        }
        const findQuery = {
            $and: [{ _id: { $ne: userId } }],
        };
        if (coordinates.length === 2 && radius) {
            findQuery.$and.push({
                location: {
                    $geoWithin: {
                        $centerSphere: [[coordinates[0], coordinates[1]], radius / 3963.2],
                    },
                },
            });
        }
        // if (interests){
        //     findQuery.$and.push({ $or: interestQuery });
        // }
        if (activities) {
            findQuery.$and.push({ $or: activityQuery });
        }
        const results = await index_1.UserModel.find(findQuery);
        return results;
    }
    catch (expection) {
        console.log('Something went wrong with getUserWithRadius function', expection);
    }
};
exports.getUsersWithinRadius = getUsersWithinRadius;
//# sourceMappingURL=locationHelpers.js.map