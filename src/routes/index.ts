import { Router } from 'express'
import bookmarkRoutes from './bookmark.routes'
import folderRoutes from './folder.routes'
import authRoutes from './auth.routes'

const router = Router()

router.use('/bookmarks', bookmarkRoutes)
router.use('/folders', folderRoutes)
router.use('/auth', authRoutes)

export default router
