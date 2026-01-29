import { Router } from 'express'
import * as folderController from '../controllers/folder.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { folderValidator } from '../validators/folder.validator'

const router = Router()

// 所有 folder 路由都需要登入
router.use(authenticate)

// GET    /api/folders     - 取得所有資料夾
router.get('/', folderController.getAll)

// GET    /api/folders/:id - 取得單一資料夾
router.get('/:id', folderController.getOne)

// POST   /api/folders     - 新增資料夾
router.post('/', folderValidator, validate, folderController.create)

// PUT    /api/folders/:id - 更新資料夾
router.put('/:id', folderValidator, validate, folderController.update)

// DELETE /api/folders/:id - 刪除資料夾
router.delete('/:id', folderController.remove)

export default router
