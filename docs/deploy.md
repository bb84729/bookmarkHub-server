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

## 防火牆（UFW）

```bash
ufw allow 22        # SSH
ufw allow 3000      # API
ufw enable
```

MongoDB 27017 不要對外開放，用 SSH tunnel 連。

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

## 更新環境變數

直接在 VPS 上改，不需要 `--build`：

```bash
nano /root/bookmarkHub-server/.env.docker
docker compose up -d
```

## 備註

- `restart: unless-stopped` — 容器 crash 會自動重啟
- `-d` 代表 detach，背景執行
- Node.js 20.6+ 內建 `--env-file`，不需要 dotenv 套件
- API 位址：`http://139.162.101.11:3000`
- Linode 按小時計費，$5/月是上限，不用到一個月按比例算
- 單純關機（Power Off）還是會收費，要完全停止計費需 Delete 機器
