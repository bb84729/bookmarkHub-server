import { Router } from 'express'
import * as bookmarkController from '../controllers/bookmark.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { bookmarkValidator } from '../validators/bookmark.validator'

const router = Router()

// 所有 bookmark 路由都需要登入
router.use(authenticate)

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: 書籤管理
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Bookmark:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         title:
 *           type: string
 *           example: Google
 *         url:
 *           type: string
 *           example: https://google.com
 *         description:
 *           type: string
 *           example: 搜尋引擎
 *         favicon:
 *           type: string
 *           example: https://google.com/favicon.ico
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ["搜尋", "工具"]
 *         folder:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d2
 *         user:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d3
 *         order:
 *           type: number
 *           example: 0
 *         createdAt:
 *           type: string
 *           example: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: 取得所有書籤
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 搜尋關鍵字
 *         example: Google
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: 未登入
 */
router.get('/', bookmarkController.getAll)

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   get:
 *     summary: 取得單一書籤
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 書籤 ID
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: 未登入
 *       404:
 *         description: 找不到書籤
 */
router.get('/:id', bookmarkController.getOne)

/**
 * @swagger
 * /api/bookmarks:
 *   post:
 *     summary: 新增書籤
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *             properties:
 *               title:
 *                 type: string
 *                 example: Google
 *               url:
 *                 type: string
 *                 example: https://google.com
 *               description:
 *                 type: string
 *                 example: 搜尋引擎
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["搜尋", "工具"]
 *               folder:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       201:
 *         description: 新增成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: 欄位驗證失敗
 *       401:
 *         description: 未登入
 */
router.post('/', bookmarkValidator, validate, bookmarkController.create)

/**
 * @swagger
 * /api/bookmarks/reorder:
 *   put:
 *     summary: 批次更新書籤排序
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 64f1a2b3c4d5e6f7a8b9c0d1
 *                     order:
 *                       type: number
 *                       example: 0
 *     responses:
 *       200:
 *         description: 更新成功
 *       401:
 *         description: 未登入
 */
router.put('/reorder', bookmarkController.updateOrder)

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   put:
 *     summary: 更新書籤
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 書籤 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Google
 *               url:
 *                 type: string
 *                 example: https://google.com
 *               description:
 *                 type: string
 *                 example: 搜尋引擎
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["搜尋", "工具"]
 *               folder:
 *                 type: string
 *                 example: 64f1a2b3c4d5e6f7a8b9c0d2
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: 未登入
 *       404:
 *         description: 找不到書籤
 */
router.put('/:id', bookmarkValidator, validate, bookmarkController.update)

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   delete:
 *     summary: 刪除書籤
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 書籤 ID
 *     responses:
 *       200:
 *         description: 刪除成功
 *       401:
 *         description: 未登入
 *       404:
 *         description: 找不到書籤
 */
router.delete('/:id', bookmarkController.remove)

export default router
