import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { registerValidator, loginValidator } from '../validators/auth.validator'
import { loginLimiter } from '../middleware/rateLimit.middleware'

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: 使用者驗證
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 註冊新帳號
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: Blue
 *     responses:
 *       201:
 *         description: 註冊成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 name:
 *                   type: string
 *                   example: Blue
 *       400:
 *         description: Email 已存在或欄位驗證失敗
 */
router.post('/register', registerValidator, validate, authController.register)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 使用者登入
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: 帳號或密碼錯誤
 *       429:
 *         description: 嘗試次數過多，請稍後再試
 */
router.post('/login', loginLimiter, loginValidator, validate, authController.login)

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: 使用 Refresh Token 換新的 Access Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiJ9...
 *     responses:
 *       200:
 *         description: 換新 Token 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiJ9...
 *       401:
 *         description: Refresh Token 無效或已過期
 */
router.post('/refresh', authController.refresh)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 登出
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 登出成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 *       401:
 *         description: 未登入
 */
router.post('/logout', authenticate, authController.logout)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 取得當前登入使用者資訊
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 name:
 *                   type: string
 *                   example: Blue
 *       401:
 *         description: 未登入
 *       404:
 *         description: 找不到使用者
 */
router.get('/me', authenticate, authController.getMe)

export default router
