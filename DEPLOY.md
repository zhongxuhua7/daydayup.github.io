# 家庭成长奖励网页 - 部署文档

## 📋 目录
- [项目简介](#项目简介)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [本地运行](#本地运行)
- [生产环境部署](#生产环境部署)
- [数据管理](#数据管理)
- [常见问题](#常见问题)
- [技术支持](#技术支持)

---

## 项目简介

家庭成长奖励网页是一个轻量级的家庭成长激励工具，通过星星奖励机制帮助家长培养孩子良好习惯。

### 核心特性
- ✅ **纯前端应用**：无需后端服务器，完全基于浏览器运行
- ✅ **本地存储**：所有数据存储在用户设备的 localStorage 中
- ✅ **离线可用**：无需网络连接即可使用全部功能
- ✅ **响应式设计**：完美适配手机、平板、电脑等各种设备
- ✅ **数据安全**：支持数据导出备份，不向外部服务器传输

### 技术栈
- **HTML5**：页面结构
- **CSS3**：样式设计（响应式布局）
- **JavaScript (ES6+)**：原生JavaScript，无框架依赖
- **localStorage**：本地数据持久化

---

## 环境要求

### 最低要求
- **浏览器**：Chrome 80+、Edge 80+、Safari 13+、Firefox 75+
- **JavaScript支持**：必须启用
- **localStorage支持**：必须启用
- **存储空间**：至少 5-10MB 可用空间

### 推荐配置
- **现代浏览器**：Chrome、Edge、Safari 最新版本
- **屏幕分辨率**：320px - 1920px（支持移动端和PC端）
- **设备类型**：手机、平板、电脑均可

---

## 快速开始

### 方式一：直接打开（推荐用于个人使用）

1. **下载项目文件**
   ```bash
   # 下载项目压缩包或克隆代码
   git clone <项目地址>
   cd 家庭成长奖励网页
   ```

2. **直接打开**
   - 双击 `index.html` 文件
   - 或在浏览器中打开 `index.html`

3. **开始使用**
   - 应用会在首次打开时初始化默认数据
   - 所有数据自动保存在浏览器中

### 方式二：本地服务器（推荐用于开发测试）

#### 使用 Python（推荐）
```bash
# Python 3
python -m http.server 5000

# 或指定端口
python -m http.server 8080

# 访问 http://localhost:5000
```

#### 使用 Node.js
```bash
# 安装 http-server
npm install -g http-server

# 启动服务
http-server -p 5000

# 访问 http://localhost:5000
```

#### 使用 PHP
```bash
php -S localhost:5000
```

---

## 本地运行

### 开发环境

#### 1. 克隆项目
```bash
git clone <项目地址>
cd 家庭成长奖励网页
```

#### 2. 启动本地服务器

**选择一种方式：**

**Python 3（推荐）**
```bash
python -m http.server 5000
```

**Node.js**
```bash
npm install -g http-server
http-server -p 5000
```

**Vite（如果项目使用 Vite）**
```bash
npm install
npm run dev
```

#### 3. 访问应用
```
http://localhost:5000
```

#### 4. 开发调试
- 打开浏览器开发者工具（F12）
- 查看 Console 输出
- 使用 Network 监控网络请求
- 使用 Application 查看 localStorage 数据

### 热更新（如果支持）
- 使用 Vite 或其他支持 HMR 的工具时，修改代码会自动刷新
- 使用简单服务器时，需要手动刷新页面

---

## 生产环境部署

### 部署方案对比

| 方案 | 难度 | 成本 | 适用场景 | 推荐指数 |
|------|------|------|----------|----------|
| 直接文件访问 | ⭐ | 免费 | 个人使用、本地存储 | ⭐⭐⭐⭐⭐ |
| Nginx 静态服务器 | ⭐⭐ | 免费/低成本 | 企业内网、私有部署 | ⭐⭐⭐⭐ |
| GitHub Pages | ⭐⭐ | 免费 | 开源项目、个人博客 | ⭐⭐⭐⭐ |
| Vercel/Netlify | ⭐ | 免费 | 快速部署、自动HTTPS | ⭐⭐⭐⭐⭐ |
| 云服务器+CDN | ⭐⭐⭐ | 按量付费 | 高并发、全球访问 | ⭐⭐⭐ |

---

### 方案一：GitHub Pages 部署（推荐）

#### 优势
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 自动部署（Git Push）
- ✅ 自定义域名支持

#### 步骤

1. **准备 GitHub 仓库**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

2. **启用 GitHub Pages**
   - 进入仓库 Settings
   - 左侧菜单选择 "Pages"
   - Source 选择 "Deploy from a branch"
   - Branch 选择 "main" 或 "master"
   - 点击 Save

3. **等待部署完成**
   - 部署完成后会显示访问地址
   - 格式：`https://你的用户名.github.io/仓库名`

4. **访问应用**
   ```
   https://你的用户名.github.io/仓库名
   ```

5. **（可选）自定义域名**
   - 在仓库 Settings → Pages → Custom domain
   - 输入你的域名
   - 配置 DNS CNAME 记录

---

### 方案二：Vercel 部署（最简单）

#### 优势
- ✅ 零配置自动部署
- ✅ 自动 HTTPS
- ✅ 全球边缘网络
- ✅ 无限带宽
- ✅ 免费额度充足

#### 步骤

1. **准备代码**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **推送到 GitHub**
   ```bash
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

3. **部署到 Vercel**
   - 访问 https://vercel.com
   - 点击 "New Project"
   - 导入你的 GitHub 仓库
   - 点击 "Deploy"

4. **访问应用**
   - Vercel 会自动生成访问地址
   - 格式：`https://你的仓库名.vercel.app`

5. **（可选）自定义域名**
   - 在 Vercel 控制台添加自定义域名
   - 自动配置 SSL 证书

---

### 方案三：Netlify 部署

#### 优势
- ✅ 拖拽部署
- ✅ 自动 HTTPS
- ✅ 表单处理（如需）
- ✅ 免费额度充足

#### 步骤

1. **准备代码**
   ```bash
   # 打包项目
   tar -czf project.tar.gz index.html styles/ js/
   ```

2. **拖拽部署**
   - 访问 https://netlify.com
   - 注册/登录
   - 将项目文件夹拖拽到上传区域
   - 等待部署完成

3. **或 Git 部署**
   - 连接 GitHub 仓库
   - 选择仓库和分支
   - 自动部署

---

### 方案四：Nginx 静态服务器部署

#### 适用场景
- 企业内网部署
- 已有服务器
- 需要完全控制

#### 步骤

1. **上传文件到服务器**
   ```bash
   scp -r index.html styles/ js/ user@server:/var/www/family-reward/
   ```

2. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       root /var/www/family-reward;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # 启用 gzip 压缩
       gzip on;
       gzip_types text/css application/javascript;
   }
   ```

3. **重启 Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **（可选）配置 HTTPS**
   ```bash
   # 使用 Let's Encrypt
   sudo certbot --nginx -d your-domain.com
   ```

---

### 方案五：云服务器部署

#### 选项
- **阿里云 ECS**
- **腾讯云 CVM**
- **华为云 ECS**
- **AWS EC2**
- **Google Cloud Compute Engine**

#### 步骤

1. **购买服务器**
   - 选择最低配置即可（1核2G足够）
   - 选择操作系统（Ubuntu 20.04 推荐）

2. **安装环境**
   ```bash
   # 更新系统
   sudo apt update

   # 安装 Nginx
   sudo apt install nginx -y

   # 上传文件
   sudo mkdir -p /var/www/family-reward
   # 使用 scp 或 ftp 上传文件到 /var/www/family-reward
   ```

3. **配置防火墙**
   ```bash
   # 开放 80 和 443 端口
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

4. **配置 Nginx**
   - 参考"方案四"的配置

5. **访问应用**
   ```
   http://你的服务器IP
   ```

---

## 数据管理

### 数据存储位置

所有数据存储在浏览器的 `localStorage` 中：
- **键名**：`familyRewardData`
- **容量**：约 5-10MB
- **位置**：浏览器 Application → Local Storage

### 数据导出

#### 方式一：应用内导出
1. 进入「设置」→「数据管理」
2. 点击「导出数据」
3. 自动下载 JSON 格式备份文件

#### 方式二：开发者工具导出
```javascript
// 在浏览器 Console 中执行
const data = localStorage.getItem('familyRewardData');
const blob = new Blob([data], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `backup-${new Date().toISOString().split('T')[0]}.json`;
a.click();
```

### 数据导入

#### 方式一：应用内导入
1. 进入「设置」→「数据管理」
2. 点击「导入数据」
3. 选择之前导出的 JSON 文件
4. 确认导入

#### 方式二：开发者工具导入
```javascript
// 在浏览器 Console 中执行
const input = document.createElement('input');
input.type = 'file';
input.accept = '.json';
input.onchange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = (event) => {
    localStorage.setItem('familyRewardData', event.target.result);
    alert('导入成功，请刷新页面');
  };
  reader.readAsText(file);
};
input.click();
```

### 数据备份策略

#### 推荐做法
1. **定期备份**：每周导出一次数据
2. **多份备份**：保存多个时间点的备份
3. **云存储**：将备份文件保存到云盘（百度网盘、Google Drive等）
4. **命名规范**：使用日期命名，如 `backup-2026-04-07.json`

#### 备份频率建议
- **日常使用**：每周一次
- **重要数据**：每天一次
- **重大变更前**：立即备份

### 数据迁移

#### 在不同设备间迁移
1. 在原设备上导出数据
2. 将备份文件传输到新设备
3. 在新设备上导入数据

#### 清除数据
```
设置 → 数据管理 → 重置数据
```

⚠️ **警告**：重置数据会删除所有记录，操作前请先备份！

---

## 常见问题

### Q1: 为什么打开应用后数据是空的？
**A**: 首次打开应用时会初始化默认数据，包括：
- 3个分类（生活习惯、学习、脾气）
- 5个任务模板
- 3个心愿

### Q2: 数据会丢失吗？
**A**: 数据存储在浏览器 localStorage 中，可能丢失的情况：
- 清除浏览器数据
- 隐私模式浏览（关闭后清除）
- 更换设备或浏览器
- 存储空间不足

**建议**：定期导出数据备份

### Q3: 可以在多台设备上同步数据吗？
**A**: 目前不支持自动同步，但可以通过导出/导入实现数据迁移：
- 设备A导出数据
- 将备份文件传输到设备B
- 设备B导入数据

### Q4: 支持哪些浏览器？
**A**: 支持所有现代浏览器：
- ✅ Chrome 80+
- ✅ Edge 80+
- ✅ Safari 13+
- ✅ Firefox 75+
- ✅ 微信内置浏览器
- ✅ 手机浏览器

### Q5: 应用需要联网吗？
**A**: 不需要联网！所有功能在本地运行：
- ✅ 离线可用
- ✅ 无需服务器
- ✅ 无需API调用

### Q6: 数据存储容量有限制吗？
**A**: localStorage 限制约 5-10MB，足以存储：
- 数千条记录
- 数百个任务
- 数百个心愿

### Q7: 如何提高应用性能？
**A**: 几个优化建议：
- 定期清理旧数据
- 避免同时打开过多任务
- 使用现代浏览器
- 清理浏览器缓存

### Q8: 部署后访问很慢怎么办？
**A**: 解决方案：
- 使用 CDN 加速（推荐）
- 压缩静态文件（gzip）
- 使用 HTTP/2
- 优化图片资源

### Q9: 如何自定义应用标题和图标？
**A**: 修改 `index.html`：
```html
<title>你的应用标题</title>
<link rel="icon" href="your-icon.png">
```

### Q10: 支持多孩子管理吗？
**A**: 当前版本不支持，但可以通过以下方式实现：
- 创建多个浏览器配置文件
- 使用隐身模式
- 等待后续版本更新

---

## 性能优化

### 前端优化

#### 1. 启用 Gzip 压缩
```nginx
# Nginx 配置
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

#### 2. 启用缓存
```nginx
# Nginx 配置
location ~* \.(js|css)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

#### 3. 优化图片
- 使用 WebP 格式
- 压缩图片大小
- 使用 lazy loading

### 网络优化

#### 1. 使用 CDN
- 推荐服务商：阿里云 CDN、腾讯云 CDN、Cloudflare
- 全球节点加速访问

#### 2. 启用 HTTP/2
```nginx
listen 443 ssl http2;
```

#### 3. 使用预连接
```html
<link rel="preconnect" href="https://cdn.example.com">
```

---

## 安全建议

### 数据安全
- ✅ 所有数据存储在本地，不向外部传输
- ✅ 不需要登录，不会泄露账号信息
- ✅ 支持数据导出，可完全控制数据

### 部署安全
- 启用 HTTPS（Let's Encrypt 免费）
- 配置安全头（CSP、X-Frame-Options）
- 定期更新服务器和依赖

### 用户隐私
- 不收集任何用户信息
- 不使用任何第三方追踪
- 完全匿名使用

---

## 更新日志

### v1.0.0 (2026-04-07)
- ✅ 初始版本发布
- ✅ 核心功能实现
- ✅ 响应式设计
- ✅ 数据导出导入

---

## 技术支持

### 文档资源
- 项目文档：查看 `AGENTS.md`
- 开发指南：查看代码注释

### 问题反馈
- 遇到问题请检查：
  1. 浏览器控制台错误信息
  2. localStorage 是否正常
  3. 数据格式是否正确

### 获取帮助
- 查阅本文档的"常见问题"部分
- 检查浏览器兼容性
- 尝试清除浏览器缓存后重试

---

## 附录

### 文件结构
```
family-reward/
├── index.html          # 主HTML文件
├── styles/
│   └── main.css       # 样式文件
├── js/
│   └── app.js         # 应用逻辑
├── AGENTS.md          # 项目文档
└── DEPLOY.md          # 部署文档（本文件）
```

### 数据结构
```javascript
{
  userInfo: { name, avatar },
  categories: [{ id, name, icon }],
  tasks: [{ id, name, category, stars, repeat }],
  wishes: [{ id, name, stars }],
  records: [{ id, type, stars, timestamp, ... }],
  taskCompletions: {},
  settings: { theme, fontSize }
}
```

### 浏览器兼容性
| 浏览器 | 最低版本 | 测试状态 |
|--------|----------|----------|
| Chrome | 80+ | ✅ 测试通过 |
| Edge | 80+ | ✅ 测试通过 |
| Safari | 13+ | ✅ 测试通过 |
| Firefox | 75+ | ✅ 测试通过 |
| 微信浏览器 | 最新版 | ✅ 测试通过 |

---

## 联系方式

如有问题或建议，请通过以下方式联系：
- 📧 提交 Issue
- 💬 项目讨论区

---

**祝您使用愉快！** 🎉
