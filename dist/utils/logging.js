"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const LOGGING_ENABLED = false;
const log = (...messages) => {
    if (LOGGING_ENABLED) {
        console.log(messages);
    }
};
exports.log = log;
//# sourceMappingURL=logging.js.map