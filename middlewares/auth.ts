import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const secretKey = process.env.SECRET_KEY as string

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization
  if (!token) {
    res.status(401).send('Access Denied')
    return
  }

  try {
    const verified = jwt.verify(token, secretKey)
    if (verified) {
      next()
    } else {
      res.status(401).send('Unauthorized')
    }
  } catch (error) {
    res.status(400).send('Invalid Token')
  }
}
