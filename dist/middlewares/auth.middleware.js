"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateMiddleware = void 0;
const jwt_middleware_1 = require("./jwt.middleware");
const authenticateMiddleware = (req, res, next) => {
    (0, jwt_middleware_1.authenticate)(req, res, (err) => {
        if (err) {
            return res.status(401).json({ err: 'Authentication failed' });
        }
        next();
    });
};
exports.authenticateMiddleware = authenticateMiddleware;
//# sourceMappingURL=auth.middleware.js.map