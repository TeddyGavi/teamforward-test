import { authenticate } from './jwt.middleware'

export const authenticateMiddleware = (req, res, next) => {
  authenticate(req, res, (err) => {
    if (err) {
      return res.status(401).json({ err: 'Authentication failed' })
    }
    next()
  })
}
