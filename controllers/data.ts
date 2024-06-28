import type { Request, Response } from 'express'

export const protect = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: 'passed' })
}
