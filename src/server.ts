import app from './app'
import connectDB from './config/db'

const PORT = process.env.PORT || 3000

// 先連接資料庫，再啟動 server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
  })
})
