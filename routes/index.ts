import { Router } from 'express'
import { login, refreshToken, register } from '../controllers/auth'
import { protect } from '../controllers/data'
import { verifyToken } from '../middlewares/auth'

const router = Router()

//auth
router.post('/register', register)
router.post('/login', login)
router.post('/refreshToken', refreshToken)

//data
router.get('/protect', verifyToken, protect)

export default router
