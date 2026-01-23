import { Router } from 'express'
import bookmarkRoutes from './bookmark.routes'
import folderRoutes from './folder.routes'

const router = Router()

router.use('/bookmarks', bookmarkRoutes)
router.use('/folders', folderRoutes)

// 之後會加上
// router.use('/auth', authRoutes)
// router.use('/folders', folderRoutes)

export default router
