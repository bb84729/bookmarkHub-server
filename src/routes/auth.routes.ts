import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { registerValidator, loginValidator } from '../validators/auth.validator'

const router = Router()

// POST /api/auth/register - 註冊
router.post('/register', registerValidator, validate, authController.register)

// POST /api/auth/login - 登入
router.post('/login', loginValidator, validate, authController.login)

// GET /api/auth/me - 取得當前使用者（需要登入）
router.get('/me', authenticate, authController.getMe)

export default router
