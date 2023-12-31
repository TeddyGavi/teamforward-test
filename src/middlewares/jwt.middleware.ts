import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = jwt
    .verify(req.cookies['jwt-token'], (process.env.SecretKeyOne ??= ''))
    .toString()
  if (!token) {
    return res
      .status(401)
      .json({ verified: false, message: 'Token not provided' })
  }

  jwt.verify(
    token,
    process.env.SecretKeyOne,
    (err, payload: { id: string } | undefined) => {
      if (err) {
        console.error(err)
        res
          .status(401)
          .json({ verified: false, message: 'token verification failed' })
      } else {
        req.body.userId = payload.id
        next()
      }
    }
  )
}
