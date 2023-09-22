/**
 * @abstract custom request object extending global Express interface as defined in 'express-serve-static-core'
 */

import { IUser } from '../models/index'

declare module 'express' {
  interface Request {
    userId?: string
    user?: IUser
  }
}
