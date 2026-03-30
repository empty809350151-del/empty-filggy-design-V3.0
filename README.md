# Fliggy Hotel Redesign

移动端酒店 OTA 改版原型，核心方向是从“搜索酒店”升级为“选择住法”。

## 技术栈

- React 19
- TypeScript
- Vite
- React Router
- GSAP

## 适合分享给别人的使用方式

这个项目已经补齐了两种可直接使用的交付方式：

1. `Node` 运行
2. `Docker` 运行
3. `GitHub Pages` 自动部署

无论对方是否有前端开发环境，都可以打开这个项目。

## 方式一：Node 环境运行

适合有 Node.js 的同事或客户本地试用。

### 要求

- Node.js 20+，推荐 Node.js 22
- npm 10+

### 启动步骤

```bash
npm install
npm run build
npm run start
```

默认访问地址：

- [http://localhost:65186](http://localhost:65186)

## 方式二：Docker 运行

适合希望在任何机器上直接跑起来，不依赖本地 Node 环境的场景。

### 构建镜像

```bash
docker build -t fliggy-hotel-redesign .
```

### 启动容器

```bash
docker run --rm -p 8080:80 fliggy-hotel-redesign
```

访问地址：

- [http://localhost:8080](http://localhost:8080)

## 方式三：直接部署静态产物

如果你要分享给更多人，最稳的方式是把 `dist/` 部署到任意静态托管平台：

- Vercel
- Netlify
- 阿里云 OSS + CDN
- 腾讯云 COS
- GitHub Pages
- 内网静态服务器

### 生成静态产物

```bash
npm install
npm run build
```

构建后产物在：

- [dist](/Users/tianzhongyi/Documents/fliggy hotel redesign_v3.0/app/dist)

这个目录可以直接上传到静态服务器。

## 方式四：GitHub Pages 长期分享链接

这个项目已经补齐 GitHub Pages 自动部署配置：

- [deploy-pages.yml](/Users/tianzhongyi/Documents/fliggy hotel redesign_v3.0/app/.github/workflows/deploy-pages.yml)

只要把整个 `app/` 目录作为一个独立 GitHub 仓库推上去，并在仓库里启用 `GitHub Pages`，以后每次推送到 `main` 分支都会自动更新线上页面。

### 推上 GitHub 后的分享方式

最终你可以把这个链接发给任何人：

```text
https://<你的 GitHub 用户名>.github.io/<仓库名>/#/
```

这是最适合“别人任何时候点链接都能打开”的方式。

### GitHub Pages 的建议设置

- 仓库使用独立仓库，不要放在你家目录的大仓库里
- 默认分支：`main`
- Pages 来源：`GitHub Actions`

### Pages 构建特性

- 已自动使用 `HashRouter`
- 已自动使用相对资源路径
- 不依赖后端
- 适合长期分享原型

## 常用命令

```bash
npm run dev
npm run build
npm run lint
npm run test:e2e
npm run start
```

## 目录说明

- [src](/Users/tianzhongyi/Documents/fliggy hotel redesign_v3.0/app/src)：业务代码
- [public](/Users/tianzhongyi/Documents/fliggy hotel redesign_v3.0/app/public)：静态资源
- [dist](/Users/tianzhongyi/Documents/fliggy hotel redesign_v3.0/app/dist)：生产构建产物
- [Dockerfile](/Users/tianzhongyi/Documents/fliggy hotel redesign_v3.0/app/Dockerfile)：Docker 交付配置
- [nginx.conf](/Users/tianzhongyi/Documents/fliggy hotel redesign_v3.0/app/nginx.conf)：生产静态服务配置

## 分享建议

如果是发给开发同学：

- 直接发整个 `app/` 目录
- 对方执行 `npm install && npm run build && npm run start`

如果是发给非开发同学或客户：

- 优先发 Docker 使用说明
- 或者直接把 `dist/` 部署成在线地址后再分享

## 说明

- 这是前端原型项目，不依赖后端服务
- 数据均为前端 mock
- 路由已按单页应用配置，直接部署静态产物即可使用
