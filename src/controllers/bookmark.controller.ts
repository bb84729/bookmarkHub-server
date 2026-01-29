import { Response, NextFunction } from 'express'
import { Bookmark } from '../models'
import { AuthRequest } from '../middleware/auth.middleware'
import { AppError } from '../utils/AppError'

// 取得所有書籤
// 支援搜尋
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { search, tag } = req.query

    //基本查詢條件：只查自己的
    const query: any = { user: req.userId }

    //如果有搜尋關鍵字，搜尋標題和描述 //$regex 是 MongoDB 的模糊搜尋,$or 是「或」的條件，符合其中一個就會被找到
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    // 如果有標籤篩選
    if (tag) {
      query.tags = tag
    }

    // 3. 最後 query 變成這樣
    // {
    //   user: "你的ID",
    //   $or: [
    //     { title: { $regex: "google", $options: "i" } },
    //     { description: { $regex: "google", $options: "i" } }
    //   ]
    // }

    const bookmarks = await Bookmark.find(query)
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
      throw new AppError('Bookmark not found', 404)
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
      throw new AppError(`Invalid fields: ${invalidFields.join(', ')}`, 400)
    }

    const bookmark = await Bookmark.findOneAndUpdate(
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
      throw new AppError('Bookmark not found', 404)
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
      throw new AppError('Bookmark not found', 404)
    }

    res.json({ message: 'Bookmark deleted successfully' })
  } catch (error) {
    next(error)
  }
}
