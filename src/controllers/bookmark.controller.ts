import { Response, NextFunction } from 'express'
import { Bookmark } from '../models'
import { AuthRequest } from '../middleware/auth.middleware'
import { AppError } from '../utils/AppError'

// 取得所有書籤
// 支援搜尋
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { search, tag } = req.query

    // 取得分頁參數，預設 page=1, limit=10
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, parseInt(req.query.limit as string) || 10)
    const skip = (page - 1) * limit

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

    // 同時查資料和總筆數
    const [bookmarks, total] = await Promise.all([
      Bookmark.find(query).sort({ order: 1, _id: 1 }).skip(skip).limit(limit),
      Bookmark.countDocuments(query)
    ])

    const totalPages = Math.ceil(total / limit)

    res.json({
      data: bookmarks,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
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
    // 找出目前最大的 order，新書籤放在最後
    const lastBookmark = await Bookmark.findOne({ user: req.userId })
      .sort({ order: -1 })
      .select('order')

    const nextOrder = lastBookmark ? lastBookmark.order + 1 : 0
    const bookmark = await Bookmark.create({
      title: req.body.title,
      url: req.body.url,
      description: req.body.description,
      tags: req.body.tags || [],
      folder: req.body.folder,
      user: req.userId, // 從 token 取得，不是前端傳的
      order: nextOrder
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

// 批次更新書籤排序
// 這就是「一次 API 呼叫，同時更新所有書籤的順序」，只是因為 MongoDB 沒有「一次更新多筆不同文件的不同值」的語法，所以用 Promise.all 來達成同樣效果。
export const updateOrder = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items } = req.body // items: [{ id: '...', order: 0 }, { id: '...', order: 1 }, ...]

    const updates = items.map((item: { id: string; order: number }) =>
      Bookmark.findOneAndUpdate({ _id: item.id, user: req.userId }, { order: item.order })
    )

    await Promise.all(updates)

    res.json({ message: 'Order updated successfully' })
  } catch (error) {
    next(error)
  }
}
