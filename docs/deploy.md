# 部署筆記 — Linode VPS + Docker

## 架構

```
瀏覽器 → http://139.162.101.11
              ↓
        Nginx 容器 (:80)
          ├── /*      → 前端靜態檔（volume 掛載）
          └── /api/*  → Server 容器 (:3000) → MongoDB / Redis
```

| 環境 | MongoDB | Server | 前端 | 連線方式 |
|---|---|---|---|---|
| 開發 | Docker 容器 | 本地 `npm run dev` | 本地 `npm run dev` | `localhost:27017` |
| 部署 | Docker 容器 | Docker 容器 | Nginx 容器（靜態檔） | `mongodb:27017`（容器內部網路） |

## VPS 資訊

- 平台：Linode（Akamai）
- 方案：Nanode 1GB（$5/月，按小時計費，$5 是上限）
- 地區：JP, Tokyo 2
- IP：`139.162.101.11`
- OS：Ubuntu 24.04 LTS

## 首次部署步驟

### 1. SSH 連線

```bash
ssh root@139.162.101.11
```

### 2. 安裝 Docker

```bash
# 加 Docker 官方 repo
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker.gpg

echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu noble stable" > /etc/apt/sources.list.d/docker.list

apt update && apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 3. Clone 後端專案

```bash
cd /root
git clone https://github.com/bb84729/bookmarkHub-server.git
cd bookmarkHub-server
```

### 4. 建立環境變數

```bash
nano .env.docker
```

內容：

```
PORT=3000
MONGODB_URI=mongodb://root:password123@mongodb:27017/bookmarkhub?authSource=admin
JWT_SECRET=換成正式的密鑰
JWT_REFRESH_SECRET=換成正式的密鑰
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
REDIS_HOST=redis
REDIS_PORT=6379
```

### 5. 建立前端資料夾

```bash
mkdir -p /root/bookmarkHub-client/dist
```

### 6. 啟動所有容器

```bash
docker compose up -d --build
```

### 7. 本地 build 前端並上傳（在 Mac 上執行）

```bash
cd /Users/frontend/Desktop/bookmark-hub/client
npm run build
scp -r dist/ root@139.162.101.11:/root/bookmarkHub-client/
```

### 8. 設定防火牆

```bash
ufw allow 22        # SSH
ufw allow 80        # 前端（Nginx）
ufw allow 3000      # API（讓本地開發也能連）
ufw enable
```

MongoDB 27017、Redis 6379 不要對外開放。

## 更新前端

在本地 Mac 上執行，不需要 restart nginx（volume 掛載會自動生效）：

```bash
cd /Users/frontend/Desktop/bookmark-hub/client
npm run build
scp -r dist/ root@139.162.101.11:/root/bookmarkHub-client/
```

## 更新後端

在 VPS 上執行：

```bash
cd /root/bookmarkHub-server
git pull
docker compose up -d --build
```

## 更新環境變數

直接在 VPS 上改，不需要 `--build`：

```bash
nano /root/bookmarkHub-server/.env.docker
cd /root/bookmarkHub-server
docker compose up -d
```

## 常用指令

```bash
docker compose logs -f          # 看即時 log
docker compose logs -f server   # 只看 server 的 log
docker compose down             # 停止所有容器
docker compose up -d            # 背景啟動
docker compose up -d --build    # 重新 build 後啟動（程式碼更新時）
docker compose restart nginx    # 只重啟 nginx
```

## 環境變數管理

| 檔案 | 用途 | host |
|---|---|---|
| `.env` | 本地開發 | `localhost` |
| `.env.docker` | VPS 部署 | `mongodb`（容器名稱） |
| `.env.production` | 前端 build | `VITE_API_URL=/api` |

- `docker-compose.yml` 用 `env_file: .env.docker` 讀取
- `.env` 和 `.env.*` 都已加入 `.gitignore` 和 `.dockerignore`

## 用 Compass 查看 VPS 資料庫（SSH Tunnel）

在本機執行（不是 VPS）：

```bash
ssh -L 27018:localhost:27017 root@139.162.101.11
```

原理：本機 `localhost:27018` → 透過 SSH 加密通道 → VPS 的 `localhost:27017`（MongoDB）

然後 Compass 連線用：

```
mongodb://root:password123@localhost:27018/bookmarkhub?authSource=admin
```

注意：執行 tunnel 的終端機視窗不能關，關了 tunnel 就斷了。

## 備註

- `restart: unless-stopped` — 容器 crash 會自動重啟
- `-d` 代表 detach，背景執行
- Node.js 20.6+ 內建 `--env-file`，不需要 dotenv 套件
- 前端網址：`http://139.162.101.11`
- API 網址：`http://139.162.101.11:3000`
- Nginx 的靜態檔用 volume 掛載，更新 dist 後不需要 restart
- 單純關機（Power Off）還是會收費，要完全停止計費需 Delete 機器
