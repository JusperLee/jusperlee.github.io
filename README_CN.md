<!--
SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
SPDX-License-Identifier: GPL-3.0-only
-->

<p align="right">
  <a href="README.md">English</a> | <a href="README_CN.md">中文</a>
</p>

<p align="center">
  <img src="public/logo.svg" alt="TermHub" width="520" />
</p>

<p align="center">
  <strong>上传简历，生成主页。</strong><br/>
  <sub>面向开发者、研究者和创作者的终端风格个人作品集。编辑文本文件或通过 MCP 让 AI 自动完成。</sub>
</p>

<p align="center">
  <a href="https://term-hub.vercel.app/"><img src="https://img.shields.io/badge/在线演示-88c0d0?style=for-the-badge&logo=googlechrome&logoColor=white" alt="在线演示" /></a>
  <a href="https://h-freax.github.io/"><img src="https://img.shields.io/badge/作者主页-b48ead?style=for-the-badge&logo=firefoxbrowser&logoColor=white" alt="作者主页" /></a>
  <a href="https://term-hub.vercel.app/guide"><img src="https://img.shields.io/badge/使用文档-5e81ac?style=for-the-badge&logo=readthedocs&logoColor=white" alt="文档" /></a>
  <a href="https://discord.gg/QV2kyXzaTa"><img src="https://img.shields.io/badge/Discord-7289da?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a>
</p>

<p align="center">
  <a href="https://www.gnu.org/licenses/gpl-3.0"><img src="https://img.shields.io/badge/License-GPL_v3-a3be8c?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Chakra_UI-319795?style=flat-square&logo=chakraui&logoColor=white" alt="Chakra UI" />
  <a href="#ai-集成--支持-mcp"><img src="https://img.shields.io/badge/NEW-支持_MCP-bf616a?style=flat-square&logo=openai&logoColor=white" alt="支持 MCP" /></a>
</p>

---

> [!TIP]
> **不想碰代码？** 我们正在搭建托管平台 **[termhubai.com](https://termhubai.com)** —— 上传简历即可生成在线作品集，无需 Git 或终端。**加入 Waitlist** 抢先体验！

<br/>

## 演示

<p align="center">
  <a href="https://h-freax.github.io/">
    <img src="public/screenshots/home.png" alt="TermHub — 作者的真实主页" width="720" />
  </a>
  <br/>
  <sub><a href="https://h-freax.github.io/">h-freax.github.io</a> — 作者的真实主页，使用 TermHub 构建</sub>
</p>

<p align="center">
  <a href="https://term-hub.vercel.app/">Cookie 示例站</a> · <a href="https://h-freax.github.io/">作者真实主页</a>
</p>

<details>
<summary>查看所有页面</summary>

<br/>

**学术论文**

<img src="public/screenshots/publications.png" alt="学术论文" width="720" />

**项目展示**

<img src="public/screenshots/projects.png" alt="项目展示" width="720" />

**工作经历**

<img src="public/screenshots/experience.png" alt="工作经历" width="720" />

**博客文章**

<img src="public/screenshots/articles.png" alt="博客文章" width="720" />

**获奖荣誉** · **我的旅程**

<img src="public/screenshots/award.png" alt="获奖荣誉" width="360" /> <img src="public/screenshots/myjourney.png" alt="我的旅程" width="360" />

**精选论文** · **最新动态**

<img src="public/screenshots/selectedpublications.png" alt="精选论文" width="360" /> <img src="public/screenshots/recentupdates.png" alt="最新动态" width="360" />

</details>

<br/>

## 设计理念

TermHub 围绕一个简单的理念构建：**简历 → AI → Markdown → 个人主页**

无需编写 HTML 或学习框架，只需将简历交给任何 AI —— **ChatGPT、Claude、Gemini 或任何大语言模型** —— 它会生成 Markdown 文件，直接接入 TermHub。适用于开发者、研究人员、设计师、学生 —— 任何想要专业作品集的人。通过我们的**内置 MCP 服务器**，Claude 可以全自动完成：读取你的简历，调用 19 个专用工具，一分钟内填充整个网站。

<br/>

## 功能特性

- 终端美学 + **Nord** 配色方案，深色 / 浅色模式
- 完全**响应式**（手机 → 桌面），编辑即时热重载
- **无需编码** —— 只需编辑 `content/` 中的文本文件
- **MCP 驱动** —— 简历 → AI → 作品集，分钟级完成
- **中英文双语** —— 内置国际化支持

**内容类型：** 论文 · 项目 · 经历 · 文章 · 获奖 · 动态

<br/>

## 快速开始

```bash
# 1. Fork 并克隆
git clone https://github.com/H-Freax/TermHub.git
cd TermHub && npm install

# 2. 运行设置向导 — 生成你的配置
npm run setup

# 3. 启动开发服务器
npm run dev
```

> 打开 **http://localhost:5173** —— 你的网站已经运行。
> 编辑 `content/` 中的文件，保存后浏览器会自动刷新。

<br/>

## 编辑内容

所有内容都在**一个文件夹**中 —— 你无需触碰源代码。

```
content/
├── site.json              ← 姓名、邮箱、社交链接、功能开关
├── about.md               ← 个人简介 & 职业时间线
├── experience.json        ← 工作 & 教育经历
├── publications/          ← 每篇论文一个 .md 文件
├── projects/              ← 每个项目一个 .md 文件
├── articles/              ← 每篇博客一个 .md 文件
├── news.json              ← 公告动态
├── awards.json            ← 获奖荣誉
└── images/                ← 头像、Logo、截图
```

<details>
<summary>功能开关 — 显示或隐藏整个页面</summary>

<br/>

在 `content/site.json` 中开启或关闭功能：

```json
{
  "features": {
    "publications": true,
    "projects": true,
    "articles": true,
    "experience": true,
    "news": true,
    "pets": false,
    "guide": false
  }
}
```

当某个功能设为 `false` 时，对应的页面和导航链接会完全消失。

</details>

<br/>

## 部署

- **GitHub Pages** — 推送到 `main`，内置工作流自动部署
- **Vercel** — 导入仓库 → 点击部署（自动识别 Vite）
- **Netlify** — 导入仓库 → 点击部署

<br/>

## AI 集成 — 支持 MCP

**简历 → AI → Markdown → 个人主页** 的终极形态：TermHub 内置 **MCP 服务器**，让 Claude 直接读取你的简历、生成所有 Markdown/JSON 内容文件并构建网站 —— 零手动编辑。

- 将简历 PDF 或文本交给 AI，获得完整网站
- **19 个专用工具**，覆盖论文、项目、经历、获奖
- 内置 **PDF 文本提取**
- AI 可启动开发服务器并**实时预览**

```bash
# 快速配置
cd mcp-server && npm install    # 1. 安装
# 2. 配置 Claude Desktop / Code（参见 mcp-server/mcp-config.json）
# 3. 告诉 Claude："解析我的简历并生成我的作品集"
```

<details>
<summary>可用工具</summary>

<br/>

| 工具 | 说明 |
|------|------|
| `get_schema` | 获取所有数据类型 — AI 首先调用此工具 |
| `parse_pdf` | 从简历 PDF 中提取文本 |
| `generate_from_resume` | 从简历文本生成结构化蓝图 |
| `update_site_config` | 设置姓名、邮箱、社交链接 |
| `add_publication` | 添加论文及完整元数据 |
| `add_project` | 添加项目，包含标签和亮点 |
| `add_experience` | 添加工作/研究经历 |
| `add_education` | 添加教育经历 |
| `add_news` / `add_award` | 添加动态和获奖 |
| `write_markdown_content` | 写入任意 Markdown 内容文件 |
| `write_json_content` | 写入任意 JSON 内容文件 |
| `manage_assets` | 复制图片到 public 目录 |
| `preview_site` | 启动开发服务器或生产构建 |
| `get_site_status` | 查看当前作品集内容概览 |
| `reset_content` | 清除所有内容，重新开始 |

</details>

> **工作流：** 简历 → `parse_pdf` → `generate_from_resume` → AI 调用 `add_*` 工具 → `preview_site` —— 一分钟内完成。

详细配置说明请参阅 [AI 集成指南](https://term-hub.vercel.app/docs#mcp-server)。

<br/>

## 技术栈

React 18 · TypeScript 5 · Vite 5 · Chakra UI · Framer Motion · Nord Palette · i18next

<br/>

## 更新日志

- `2026-03-15` **v1.2.0** — 内置中英文双语支持，语言切换按钮，自动浏览器语言检测
- `2026-03-15` **v1.1.0** — 新增 MCP 服务器，提供 19 个工具，AI 读取简历自动生成作品集
- `2026-03-14` **v1.0.0** — 首次发布，支持论文、项目、经历、文章、获奖和动态

<br/>

## 参与贡献

欢迎贡献！你可以：

- **Star** 给仓库加星表示支持
- **Issue** 提交 Bug 报告或功能建议
- **PR** — 请先查看 [CONTRIBUTING.md](CONTRIBUTING.md)
- **Discord** — [加入我们的 Discord](https://discord.gg/QV2kyXzaTa) 交流讨论

<br/>

## 许可证

**GPL-3.0-only** · 版权所有 © 2026 [Yaoyao (Freax) Qian](https://h-freax.github.io/)
