import cors from 'cors';
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
        return cors(this.corsOptions);
    }
}
export default CorsConfig;
//# sourceMappingURL=cors.options.js.map