import { Response, NextFunction } from 'express'
import { Folder } from '../models'
import { AuthRequest } from '../middleware/auth.middleware'
import { AppError } from '../utils/AppError'

// 取得所有資料夾（只取得自己的）
export const getAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folders = await Folder.find({ user: req.userId })
    res.json(folders)
  } catch (error) {
    next(error)
  }
}

// 取得單一資料夾（只取得自己的）
export const getOne = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      user: req.userId
    })

    if (!folder) {
      throw new AppError('Folder not found', 404)
    }

    res.json(folder)
  } catch (error) {
    next(error)
  }
}

// 新增資料夾
export const create = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.create({
      name: req.body.name,
      user: req.userId
    })

    res.status(201).json(folder)
  } catch (error) {
    next(error)
  }
}

// 更新資料夾
export const update = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.userId
      },
      {
        name: req.body.name
      },
      { new: true, runValidators: true }
    )

    if (!folder) {
      throw new AppError('Folder not found', 404)
    }

    res.json(folder)
  } catch (error) {
    next(error)
  }
}

// 刪除資料夾
export const remove = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const folder = await Folder.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    })

    if (!folder) {
      throw new AppError('Folder not found', 404)
    }

    res.json({ message: 'Folder deleted successfully' })
  } catch (error) {
    next(error)
  }
}
