import { Request, Response, NextFunction } from 'express'
import { Bookmark } from '../models'

// 取得所有書籤
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookmarks = await Bookmark.find()
    res.json(bookmarks)
  } catch (error) {
    next(error)
  }
}

// 取得單一書籤
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id)

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }

    res.json(bookmark)
  } catch (error) {
    next(error)
  }
}

// 新增書籤
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookmark = await Bookmark.create({
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      tags: req.body.tags || [],
      folder: req.body.folder,
      user: req.body.user // 之後會從 JWT 取得
    })

    res.status(201).json(bookmark)
  } catch (error) {
    next(error)
  }
}

// 更新書籤
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allowedFields = ['title', 'url', 'description', 'tags', 'folder']
    const receivedFields = Object.keys(req.body)

    // 檢查是否有不允許的欄位
    const invalidFields = receivedFields.filter((field) => !allowedFields.includes(field))
    if (invalidFields.length > 0) {
      return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` })
    }

    const bookmark = await Bookmark.findByIdAndUpdate(
      req.params.id,
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
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookmark = await Bookmark.findByIdAndDelete(req.params.id)

    if (!bookmark) {
      return res.status(404).json({ error: 'Bookmark not found' })
    }

    res.json({ message: 'Bookmark deleted successfully' })
  } catch (error) {
    next(error)
  }
}
