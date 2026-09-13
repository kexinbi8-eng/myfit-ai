# MyFit AI

手机优先的个人 AI 健康管理系统。当前已完成 MVP 主流程：首页、饮食/库存、训练、数据、目标和 AI 教练。

## 当前包含

- 390px 手机优先布局，同时兼容桌面宽度
- 首页状态总览、今日目标、饮食、训练和 AI 教练入口
- 固定底部五栏导航：首页 / 饮食 / 训练 / 数据 / 我的
- 安全区域友好的快速记录浮动按钮
- 快速记录弹层：饮食、体重、运动、步数、睡眠、食材
- 训练和饮食内容为 UI 演示数据，尚未接入数据库
- Supabase schema 已提供在 `supabase/schema.sql`，包含库存扣减防负数函数
- AI 服务端路由为 `/api/ai/chat`，OpenAI Key 只从服务端环境变量读取
- PWA manifest、Service Worker、SVG 图标和 localStorage 离线缓存

## 本地运行

```bash
pnpm install --store-dir .pnpm-store
pnpm dev
```

如果 PowerShell 找不到 pnpm，可直接运行项目目录中的 `启动 MyFit AI.cmd`；它会使用项目内已经安装的 Next.js，并监听局域网供手机访问。

手机访问：电脑和手机连接同一个 Wi-Fi 后，在手机打开 `http://电脑局域网IP:3000`。例如电脑地址是 `172.20.10.8`，则打开 `http://172.20.10.8:3000`。

## Netlify 部署

项目已包含 `netlify.toml`。在 Netlify 中连接代码仓库后，构建命令使用 `pnpm build`，发布目录使用 `.next`。Netlify 支持本项目使用的 Next.js App Router 和动态 `/api/ai/chat` 路由。

配置 AI：复制 `.env.example` 为 `.env.local`，填写 `OPENAI_API_KEY`。没有 Key 时，AI 页面会安全提示配置状态，不会把 Key 暴露给浏览器。

验证命令：

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## 下一步

生产化下一步是把 `lib/demo-data.ts` 替换为 Supabase repository，并接入 Supabase Auth/RLS；页面和 AI tool 接口已经按这个边界拆分。
