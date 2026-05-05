# 🛍 好物集市 Shop App

一个完整的电商 React 应用，包含首页、商品列表、详情、搜索、购物车、收藏、订单、个人中心。

## 项目结构

```
shop-project/
├── index.html          # HTML 入口
├── vite.config.js      # Vite 配置
├── package.json        # 依赖配置
└── src/
    ├── main.jsx        # React 挂载入口
    └── App.jsx         # 主应用（所有页面）
```

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问 http://localhost:5173
```

## 打包构建

```bash
npm run build
# 生成 dist/ 文件夹，用于部署
```

## 部署到 Vercel（推荐）

### 方式一：拖拽部署
1. 运行 `npm run build` 生成 `dist` 文件夹
2. 打开 https://vercel.com/new
3. 把 `dist` 文件夹直接拖进去
4. 得到公开链接，分享给任何人

### 方式二：GitHub 自动部署
1. 把整个项目推送到 GitHub
2. 去 vercel.com → Import → 选择仓库
3. 点 Deploy，自动构建并分配域名
4. 之后每次 push 代码自动更新

## 部署到 Netlify

1. 运行 `npm run build`
2. 打开 https://app.netlify.com/drop
3. 拖拽 `dist` 文件夹上传
4. 立即获得公开链接

## 功能列表

- 🏠 首页：Banner 轮播、分类入口、热销榜、新品区
- 🛍 商品列表：分类筛选、多维排序
- 📄 商品详情：价格折扣、同类推荐、收藏
- 🔍 搜索：实时搜索商品名/品牌
- 🛒 购物车：增减数量、实时结算
- ❤️ 收藏夹：心愿单管理
- 📦 订单中心：订单记录与状态
- 👤 个人中心：登录注册、数据统计
