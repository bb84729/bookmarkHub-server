import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import routes from './routes'
import { AppError } from './utils/AppError'

const app: Application = express()

//middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//根路由
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'BookmarkHub API is running!' })
})

// API 路由
app.use('/api', routes)

// 404 處理 找不到該路由
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' })
})

// 錯誤處理
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // 如果是我們自訂的 AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message
    })
  }

  // Mongoose 驗證錯誤
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.message
    })
  }

  // Mongoose 重複鍵錯誤（例如 email 已存在）
  if (err.name === 'MongoServerError' && (err as any).code === 11000) {
    return res.status(400).json({
      error: 'Duplicate field value'
    })
  }

  // JWT 錯誤
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    })
  }

  // JWT 過期
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    })
  }

  // 其他未知錯誤
  console.error(err.stack)
  res.status(500).json({
    error: 'Something went wrong!'
  })
})

export default app
