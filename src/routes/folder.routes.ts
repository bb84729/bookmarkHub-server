import { Router } from 'express'
import * as folderController from '../controllers/folder.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { folderValidator } from '../validators/folder.validator'

const router = Router()

// 所有 folder 路由都需要登入
router.use(authenticate)

/**
 * @swagger
 * tags:
 *   name: Folders
 *   description: 資料夾管理
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Folder:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d1
 *         name:
 *           type: string
 *           example: 工作
 *         user:
 *           type: string
 *           example: 64f1a2b3c4d5e6f7a8b9c0d2
 *         createdAt:
 *           type: string
 *           example: 2024-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * /api/folders:
 *   get:
 *     summary: 取得所有資料夾
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Folder'
 *       401:
 *         description: 未登入
 */
router.get('/', folderController.getAll)

/**
 * @swagger
 * /api/folders/{id}:
 *   get:
 *     summary: 取得單一資料夾
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 資料夾 ID
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       401:
 *         description: 未登入
 *       404:
 *         description: 找不到資料夾
 */
router.get('/:id', folderController.getOne)

/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: 新增資料夾
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: 工作
 *     responses:
 *       201:
 *         description: 新增成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       400:
 *         description: 欄位驗證失敗
 *       401:
 *         description: 未登入
 */
router.post('/', folderValidator, validate, folderController.create)

/**
 * @swagger
 * /api/folders/{id}:
 *   put:
 *     summary: 更新資料夾
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 資料夾 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: 工作
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Folder'
 *       401:
 *         description: 未登入
 *       404:
 *         description: 找不到資料夾
 */
router.put('/:id', folderValidator, validate, folderController.update)

/**
 * @swagger
 * /api/folders/{id}:
 *   delete:
 *     summary: 刪除資料夾
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 資料夾 ID
 *     responses:
 *       200:
 *         description: 刪除成功
 *       401:
 *         description: 未登入
 *       404:
 *         description: 找不到資料夾
 */
router.delete('/:id', folderController.remove)

export default router
