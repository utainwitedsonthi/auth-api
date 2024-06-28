import type { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

interface AuthProps {
  username: string
  password: string
}

const prisma = new PrismaClient()
const secretKey = process.env.SECRET_KEY as string

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: AuthProps = req.body
  try {
    if (!username || !password) {
      res.status(400).json({ error: 'Username or Password are required' })
      return
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    })

    if (existingUser) {
      res.status(400).json({ error: 'Username already exists.' })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        salt,
      },
    })

    res.status(201).json({ id: newUser.id, username: newUser.username })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to register' })
  }
}

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password }: AuthProps = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    })

    if (!user) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' })
      return
    }

    const token = generateAccessToken(user.id, user.username)

    res.status(200).json({ token })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to login' })
  }
}

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const refreshToken: string = req.body.token

  try {
    if (!refreshToken) {
      res.sendStatus(401)
      return
    }
    jwt.verify(refreshToken, secretKey, (err: any, user: any) => {
      if (err) return res.sendStatus(403)
      const token = generateAccessToken(user.id, user.username)
      res.json({ token })
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to refresh token' })
  }
}

const generateAccessToken = (id: number, username: string) => {
  return jwt.sign({ id: id, username: username }, secretKey, {
    expiresIn: '15m',
  })
}
