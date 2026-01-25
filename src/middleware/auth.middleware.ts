import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

// 擴充 Request 型別，加上 userId
export interface AuthRequest extends Request {
  userId?: string
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // 從 Header 取得 token
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // 取出 token（去掉 "Bearer " 前綴）
    const token = authHeader.split(' ')[1]

    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string }

    // 把 userId 存到 req，讓後續的 controller 可以用
    req.userId = decoded.userId

    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
