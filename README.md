# BookmarkHub — Server

BookmarkHub 的後端 API 服務，提供書籤與資料夾管理功能，包含使用者驗證、分頁查詢、拖曳排序等核心功能。

前端 Repo：[bookmarkhub-client](https://github.com/bb84729/bookmarkHub-client)

---

## 技術架構

| 類別        | 技術                                |
| ----------- | ----------------------------------- |
| 執行環境    | Node.js                             |
| 框架        | Express                             |
| 語言        | TypeScript                          |
| 資料庫      | MongoDB + Mongoose                  |
| 快取 / 狀態 | Redis                               |
| 驗證        | JWT（Access Token + Refresh Token） |
| 容器化      | Docker + Docker Compose             |
| 反向代理    | Nginx                               |
| API 文件    | Swagger（OpenAPI）                  |

---

## 功能列表

- **使用者驗證** — 註冊、登入、登出，JWT 雙 Token 機制（Access Token 15 分鐘、Refresh Token 7 天），Refresh Token 儲存於 Redis 並支援 TTL 過期控制
- **Rate Limiting** — 以 Redis 實作 API 請求限流，防止請求濫用
- **書籤管理** — 新增、編輯、刪除、查詢書籤，支援分頁與拖曳排序
- **資料夾管理** — 建立資料夾、將書籤歸類至資料夾，支援巢狀結構
- **API 文件** — Swagger UI 提供完整的 API 規格查閱介面

---

## 專案結構

```
src/
├── controllers/    # 路由處理邏輯
├── middlewares/    # 驗證、錯誤處理、rate limit
├── models/         # Mongoose Schema
├── routes/         # API 路由定義
├── services/       # 業務邏輯層
├── utils/          # 工具函數
└── app.ts          # 入口點
```

---

## 本地開發

### 環境需求

- Node.js 18+
- Docker + Docker Compose

### 步驟

**1. Clone 專案**

```bash
git clone https://github.com/your-username/bookmarkhub-server.git
cd bookmarkhub-server
```

**2. 設定環境變數**

```bash
cp .env.example .env
```

編輯 `.env`，填入你的設定值（詳見下方環境變數說明）。

**3. 啟動 MongoDB 與 Redis**

```bash
docker compose up -d
```

**4. 安裝依賴並啟動開發伺服器**

```bash
npm install
npm run dev
```

API 預設運行於 `http://localhost:3000`

---

## 環境變數

```dotenv
# MongoDB
MONGODB_URI=mongodb://root:password123@localhost:27017/bookmarkhub?authSource=admin

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-different-from-access
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
```

| 變數                     | 說明                                             |
| ------------------------ | ------------------------------------------------ |
| `MONGODB_URI`            | MongoDB 連線字串                                 |
| `JWT_SECRET`             | Access Token 簽署密鑰                            |
| `JWT_REFRESH_SECRET`     | Refresh Token 簽署密鑰（需與 Access Token 不同） |
| `JWT_ACCESS_EXPIRES_IN`  | Access Token 有效期（建議 15m）                  |
| `JWT_REFRESH_EXPIRES_IN` | Refresh Token 有效期（建議 7d）                  |
| `REDIS_HOST`             | Redis 主機位址                                   |
| `REDIS_PORT`             | Redis 連接埠                                     |

---

## API 文件

啟動服務後開啟瀏覽器前往：

```
http://localhost:3000/swagger
```

---

## 部署架構

```
Client
  │
  ▼
Nginx（反向代理 + HTTPS）
  │
  ▼
Node.js / Express（Docker）
  │
  ├── MongoDB（Docker）
  └── Redis（Docker）
```

正式環境以 Docker Compose 部署於 Linode VPS，Nginx 負責反向代理與 SSL 終止。
