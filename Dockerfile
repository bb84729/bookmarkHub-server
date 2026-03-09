# ---- Stage 1: Build ----
# 用完整的 Node.js image 來編譯 TypeScript
FROM node:20-alpine AS builder

# 設定工作目錄（容器內的路徑）
WORKDIR /app

# 先複製 package.json，利用 Docker layer cache
# 只要 package.json 沒變，這層就不會重新執行 npm install
COPY package*.json ./

# 安裝所有 dependencies（包含 devDependencies，因為需要 tsc）
RUN npm ci

# 複製所有原始碼
COPY . .

# 編譯 TypeScript → JavaScript
RUN npm run build


# ---- Stage 2: Production ----
# 用乾淨的 image，只放編譯後的檔案，讓最終 image 更小
FROM node:20-alpine AS production

WORKDIR /app

# 只複製 package.json（不含 devDependencies）
COPY package*.json ./

# 只安裝 production dependencies
RUN npm ci --only=production

# 從 builder stage 複製編譯好的 JS 檔案
COPY --from=builder /app/dist ./dist

# 對外開放的 port（文件用途，實際 mapping 在 compose 設定）
EXPOSE 3000

# 啟動指令
CMD ["node", "dist/server.js"]