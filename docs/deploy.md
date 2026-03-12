# 部署筆記 — Linode VPS + Docker

## 架構

| 環境 | MongoDB | Server | 連線方式 |
|---|---|---|---|
| 開發 | Docker 容器 | 本地 `npm run dev` | `localhost:27017` |
| 部署 | Docker 容器 | Docker 容器 | `mongodb:27017`（容器內部網路） |

## VPS 資訊

- 平台：Linode（Akamai）
- 方案：Nanode 1GB（$5/月）
- 地區：JP, Tokyo 2
- IP：`139.162.101.11`
- OS：Ubuntu 24.04 LTS

## 部署步驟

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

### 3. Clone 專案

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
```

### 5. 啟動

```bash
docker compose up -d
```

## 常用指令

```bash
docker compose logs -f          # 看即時 log
docker compose down             # 停止所有容器
docker compose up -d            # 背景啟動
docker compose up -d --build    # 重新 build 後啟動（程式碼更新時）
```

## 更新部署

```bash
cd /root/bookmarkHub-server
git pull
docker compose up -d --build
```

## 環境變數管理

- 開發用 `.env`（本地，host 是 `localhost`）
- 部署用 `.env.docker`（VPS 上，host 是 `mongodb` 容器名稱）
- `docker-compose.yml` 用 `env_file: .env.docker` 讀取
- `.env` 和 `.env.*` 都已加入 `.gitignore` 和 `.dockerignore`

## 備註

- `restart: unless-stopped` — 容器 crash 會自動重啟
- `-d` 代表 detach，背景執行
- Node.js 20.6+ 內建 `--env-file`，不需要 dotenv 套件
- API 位址：`http://139.162.101.11:3000`
