"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsConfig = void 0;
const cors_1 = __importDefault(require("cors"));
/**
 * Class for configuring CORS (Cross-Origin Resource Sharing) options.
 * @class CorsConfig
 */
class CorsConfig {
    corsOptions;
    constructor(context) {
        this.corsOptions = this.configureCors(context);
    }
    configureCors(context) {
        let corsOptions = {};
        if (context === 'socket') {
            corsOptions = {
                origin: process.env.REDIRECTKEYTWO,
                methods: ['GET', 'POST'],
                allowedHeaders: ['*'],
                credentials: true,
            };
        }
        else if (context === 'api') {
            corsOptions = {
                origin: process.env.REDIRECTKEYTWO,
                methods: ['GET,POST,PATCH,PUT,DELETE'],
                allowedHeaders: [],
                credentials: true,
            };
        }
        else {
            this.corsOptions = {
                origin: process.env.REDIRECTKEYTWO || '',
                methods: ['GET,POST,PATCH,PUT,DELETE'],
            };
        }
        return corsOptions;
    }
    getCorsOptions() {
        return this.corsOptions;
    }
    getCorsMiddleware() {
        return (0, cors_1.default)(this.corsOptions);
    }
}
exports.CorsConfig = CorsConfig;
//# sourceMappingURL=cors.options.js.map