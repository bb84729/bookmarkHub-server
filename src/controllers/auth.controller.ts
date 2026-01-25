import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { AuthRequest } from '../middleware/auth.middleware'

// 註冊
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = req.body

    // 檢查 email 是否已存在
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
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
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // 比對密碼
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
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
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}
