import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import routes from './routes'

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
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

export default app
