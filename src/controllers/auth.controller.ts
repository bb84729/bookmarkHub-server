import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { AuthRequest } from '../middleware/auth.middleware'
import { AppError } from '../utils/AppError'

// 註冊
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body

    // 檢查 email 是否已存在
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new AppError('Email already exists', 400)
    }

    // 建立使用者（密碼會在 Model 自動加密）
    const user = await User.create({
      email,
      password,
      name
    })

    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name
    })
  } catch (error) {
    next(error)
  }
}

// 登入
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // 檢查有沒有填 email 和 password
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // 查詢使用者
    const user = await User.findOne({ email })
    if (!user) {
      throw new AppError('Invalid email or password', 401)
    }

    // 比對密碼
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401)
    }

    // 產生 JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN } as jwt.SignOptions
    )
    res.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name
      }
    })
  } catch (error) {
    next(error)
  }
}

// 取得當前使用者
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}
