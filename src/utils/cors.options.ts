import cors, { CorsOptions } from 'cors'

/**
 * Class for configuring CORS (Cross-Origin Resource Sharing) options.
 * @class CorsConfig
 */
export class CorsConfig {
  private corsOptions: CorsOptions

  constructor(context: 'socket' | 'api') {
    this.corsOptions = this.configureCors(context)
  }

  private configureCors(context: 'socket' | 'api'): CorsOptions {
    let corsOptions: CorsOptions = {}

    if (context === 'socket') {
      corsOptions = {
        origin: process.env.REDIRECTKEYTWO,
        methods: ['GET', 'POST'],
        allowedHeaders: ['*'],
        credentials: true,
      }
    } else if (context === 'api') {
      corsOptions = {
        origin: process.env.REDIRECTKEYTWO,
        methods: ['GET,POST,PATCH,PUT,DELETE'],
        allowedHeaders: [],
        credentials: true,
      }
    } else {
      this.corsOptions = {
        origin: process.env.REDIRECTKEYTWO || '',
        methods: ['GET,POST,PATCH,PUT,DELETE'],
      }
    }
    return corsOptions
  }

  getCorsOptions(): CorsOptions {
    return this.corsOptions
  }

  getCorsMiddleware() {
    return cors(this.corsOptions)
  }
}
