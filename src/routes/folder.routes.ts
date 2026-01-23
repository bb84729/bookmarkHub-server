import { Router } from 'express'
import * as folderController from '../controllers/folder.controller'

const router = Router()

// GET    /api/folders     - 取得所有資料夾
router.get('/', folderController.getAll)

// GET    /api/folders/:id - 取得單一資料夾
router.get('/:id', folderController.getOne)

// POST   /api/folders     - 新增資料夾
router.post('/', folderController.create)

// PUT    /api/folders/:id - 更新資料夾
router.put('/:id', folderController.update)

// DELETE /api/folders/:id - 刪除資料夾
router.delete('/:id', folderController.remove)

export default router
