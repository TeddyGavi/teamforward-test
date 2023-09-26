"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOCATION = exports.USER = exports.CHAT = void 0;
const messages_controller_1 = require("./messages.controller");
const user_controller_1 = require("./user.controller");
const location_controller_1 = require("./location.controller");
const CHAT = new messages_controller_1.ChatController();
exports.CHAT = CHAT;
const USER = new user_controller_1.UserController();
exports.USER = USER;
const LOCATION = new location_controller_1.LocationController();
exports.LOCATION = LOCATION;
//# sourceMappingURL=index.js.map