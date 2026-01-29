import { Response, NextFunction } from 'express'
import { Bookmark } from '../models'
import { AuthRequest } from '../middleware/auth.middleware'

// 取得所有書籤
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.userId })
    res.json(bookmarks)
  } catch (error) {
    next(error)
  }
}

// 取得單一書籤
export const getOne = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.userId
    })

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }

    res.json(bookmark)
  } catch (error) {
    next(error)
  }
}

// 新增書籤
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bookmark = await Bookmark.create({
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      tags: req.body.tags || [],
      folder: req.body.folder,
      user: req.userId // 從 token 取得，不是前端傳的
    })

    res.status(201).json(bookmark)
  } catch (error) {
    next(error)
  }
}

// 更新書籤
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const allowedFields = ['title', 'url', 'description', 'tags', 'folder']
    const receivedFields = Object.keys(req.body)

    // 檢查是否有不允許的欄位
    const invalidFields = receivedFields.filter((field) => !allowedFields.includes(field))
    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` })
    }

    const bookmark = await Bookmark.findByIdAndUpdate(
      {
        _id: req.params.id,
        user: req.userId // 確保只能更新自己的
      },
      {
        title: req.body.title,
        url: req.body.url,
        description: req.body.description,
        tags: req.body.tags,
        folder: req.body.folder
      },
      { new: true, runValidators: true }
    )

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }

    res.json(bookmark)
  } catch (error) {
    next(error)
  }
}
// 刪除書籤
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.userId // 確保只能刪除自己的
    })

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }

    res.json({ message: 'Bookmark deleted successfully' })
  } catch (error) {
    next(error)
  }
}
