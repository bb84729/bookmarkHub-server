import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models'
import { AuthRequest } from '../middleware/auth.middleware'
import { AppError } from '../utils/AppError'

const generateAccessToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions
  )
}

const generateRefreshToken = (userId: string) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions
  )
}
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
    const accessToken = generateAccessToken(user._id.toString())
    const refreshToken = generateRefreshToken(user._id.toString())

    // 把refreshToken存進資料庫
    user.refreshToken = refreshToken
    await user.save()

    res.json({
      accessToken,
      refreshToken,
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

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400)
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as {
      userId: string
    }

    const user = await User.findById(decoded.userId)
    if (!user || user.refreshToken !== refreshToken) {
      throw new AppError('Invalid refresh token', 401)
    }

    const accessToken = generateAccessToken(user._id.toString())

    res.json({ accessToken })
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError('Invalid refresh token', 401))
    }
    next(error)
  }
}

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await User.findByIdAndUpdate(req.userId, { refreshToken: null })
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

// 取得當前使用者
export const getMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.userId).select('-password -refreshToken')

    if (!user) {
      throw new AppError('User not found', 404)
    }

    res.json(user)
  } catch (error) {
    next(error)
  }
}
