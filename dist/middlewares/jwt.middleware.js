"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const token = jsonwebtoken_1.default
        .verify(req.cookies['jwt-token'], (process.env.SecretKeyOne ??= ''))
        .toString();
    if (!token) {
        return res
            .status(401)
            .json({ verified: false, message: 'Token not provided' });
    }
    jsonwebtoken_1.default.verify(token, process.env.SecretKeyOne, (err, payload) => {
        if (err) {
            console.error(err);
            res
                .status(401)
                .json({ verified: false, message: 'token verification failed' });
        }
        else {
            req.userId = payload.id;
            next();
        }
    });
};
exports.authenticate = authenticate;
//# sourceMappingURL=jwt.middleware.js.map