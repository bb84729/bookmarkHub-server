import app from './app'
import dotenv from 'dotenv'
import connectDB from './config/db'

dotenv.config()

const PORT = process.env.PORT || 3000

// 先連接資料庫，再啟動 server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
})
