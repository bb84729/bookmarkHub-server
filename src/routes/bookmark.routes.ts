import { Router } from 'express'
import * as bookmarkController from '../controllers/bookmark.controller'
import { authenticate } from '../middleware/auth.middleware'
import { validate } from '../middleware/validate.middleware'
import { bookmarkValidator } from '../validators/bookmark.validator'

const router = Router()
// 所有 bookmark 路由都需要登入
router.use(authenticate)

// GET    /api/bookmarks     - 取得所有書籤
router.get('/', bookmarkController.getAll)

// GET    /api/bookmarks/:id - 取得單一書籤
router.get('/:id', bookmarkController.getOne)

// POST   /api/bookmarks     - 新增書籤
router.post('/', bookmarkValidator, validate, bookmarkController.create)

// PUT    /api/bookmarks/:id - 更新書籤
router.put('/:id', bookmarkValidator, validate, bookmarkController.update)

// DELETE /api/bookmarks/:id - 刪除書籤
router.delete('/:id', bookmarkController.remove)

export default router
