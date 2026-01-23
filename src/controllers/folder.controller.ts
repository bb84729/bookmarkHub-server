import { Request, Response, NextFunction } from 'express'
import { Folder } from '../models'

// 取得所有資料夾
export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folders = await Folder.find()
    res.json(folders)
  } catch (error) {
    next(error)
  }
}

// 取得單一資料夾
export const getOne = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findById(req.params.id)

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' })
    }

    res.json(folder)
  } catch (error) {
    next(error)
  }
}

// 新增資料夾
export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.create({
      name: req.body.name,
      user: req.body.user
    })

    res.status(201).json(folder)
  } catch (error) {
    next(error)
  }
}

// 更新資料夾
export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name
      },
      { new: true, runValidators: true }
    )

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' })
    }

    res.json(folder)
  } catch (error) {
    next(error)
  }
}

// 刪除資料夾
export const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findByIdAndDelete(req.params.id)

    if (!folder) {
      return res.status(404).json({ error: 'Folder not found' })
    }

    res.json({ message: 'Folder deleted successfully' })
  } catch (error) {
    next(error)
  }
}
