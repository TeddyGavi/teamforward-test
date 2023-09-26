"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const logging_1 = require("../utils/logging");
class LocationController {
    constructor() { }
    //use for debugging or if we do full address searches
    async getLocation(req, res) {
        //req is a full address or zipcode
        //if using full address need mechanism to feed back address options and select the correct one.
        const address = '98034';
        //TODO: get address of of request ie user.address
        const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITIONSTACK_KEY}&query=${address}`;
        const response = await (0, node_fetch_1.default)(url);
        const responseJson = await response.json();
        (0, logging_1.log)(responseJson);
        res.json(responseJson);
    }
}
exports.LocationController = LocationController;
//# sourceMappingURL=location.controller.js.map