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
  <strong>Your Resume In. Portfolio Out.</strong><br/>
  <sub>Terminal-themed portfolio for developers, researchers, and creatives. Edit text files or let AI do it via MCP.</sub>
</p>

<p align="center">
  <a href="https://term-hub.vercel.app/"><img src="https://img.shields.io/badge/Live_Demo-88c0d0?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" /></a>
  <a href="https://h-freax.github.io/"><img src="https://img.shields.io/badge/Author's_Site-b48ead?style=for-the-badge&logo=firefoxbrowser&logoColor=white" alt="Author's Site" /></a>
  <a href="https://term-hub.vercel.app/guide"><img src="https://img.shields.io/badge/Documentation-5e81ac?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Docs" /></a>
  <a href="https://discord.gg/QV2kyXzaTa"><img src="https://img.shields.io/badge/Discord-7289da?style=for-the-badge&logo=discord&logoColor=white" alt="Discord" /></a>
</p>

<p align="center">
  <a href="https://www.gnu.org/licenses/gpl-3.0"><img src="https://img.shields.io/badge/License-GPL_v3-a3be8c?style=flat-square" alt="License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Chakra_UI-319795?style=flat-square&logo=chakraui&logoColor=white" alt="Chakra UI" />
  <a href="#ai-integration--supports-mcp"><img src="https://img.shields.io/badge/NEW-Supports_MCP-bf616a?style=flat-square&logo=openai&logoColor=white" alt="Supports MCP" /></a>
</p>

---

> [!TIP]
> **Don't want to touch code?** We're building a hosted solution at **[termhubai.com](https://termhubai.com)** — upload your resume and get a live portfolio, no Git or terminal needed. **Join the waitlist** to get early access!

<br/>

## Demo

<p align="center">
  <a href="https://h-freax.github.io/">
    <img src="public/screenshots/home.png" alt="TermHub — Author's Portfolio" width="720" />
  </a>
  <br/>
  <sub><a href="https://h-freax.github.io/">h-freax.github.io</a> — the author's real portfolio, built with TermHub</sub>
</p>

<p align="center">
  <a href="https://term-hub.vercel.app/">Cookie's Demo</a> · <a href="https://h-freax.github.io/">Author's Portfolio</a>
</p>

<details>
<summary>View all pages</summary>

<br/>

**Publications**

<img src="public/screenshots/publications.png" alt="Publications" width="720" />

**Projects**

<img src="public/screenshots/projects.png" alt="Projects" width="720" />

**Experience**

<img src="public/screenshots/experience.png" alt="Experience" width="720" />

**Articles**

<img src="public/screenshots/articles.png" alt="Articles" width="720" />

**Awards** · **My Journey**

<img src="public/screenshots/award.png" alt="Awards" width="360" /> <img src="public/screenshots/myjourney.png" alt="My Journey" width="360" />

**Selected Publications** · **Recent Updates**

<img src="public/screenshots/selectedpublications.png" alt="Selected Publications" width="360" /> <img src="public/screenshots/recentupdates.png" alt="Recent Updates" width="360" />

</details>

<br/>

## Design Philosophy

TermHub is built around one simple idea: **CV → AI → Markdown → Homepage**

Instead of writing HTML or learning a framework, you give your CV to any AI — **ChatGPT, Claude, Gemini, or any LLM** — and it generates Markdown files that plug directly into TermHub. Works for developers, researchers, designers, students — anyone who wants a professional portfolio. With our **built-in MCP server**, Claude can do this fully automatically: read your resume, call 19 specialized tools, and populate your entire site in under a minute.

<br/>

## Features

- Terminal aesthetic with **Nord** color palette, dark / light mode
- Fully **responsive** (mobile → desktop), hot reload on edit
- **No code needed** — just edit text files in `content/`
- **MCP-powered** — resume → AI → portfolio in minutes
- **i18n** — built-in English / Chinese bilingual support

**Content types:** Publications · Projects · Experience · Articles · Awards · News

<br/>

## Quick Start

```bash
# 1. Fork & clone
git clone https://github.com/H-Freax/TermHub.git
cd TermHub && npm install

# 2. Run the setup wizard — generates your config
npm run setup

# 3. Start dev server
npm run dev
```

> Open **http://localhost:5173** — your site is running.
> Edit files in `content/`, save, and the browser refreshes automatically.

<br/>

## What You Edit

All your content lives in **one folder** — you never touch source code.

```
content/
├── site.json              ← name, email, social links, features
├── about.md               ← bio & career timeline
├── experience.json        ← work & education history
├── publications/          ← one .md per paper
├── projects/              ← one .md per project
├── articles/              ← one .md per blog post
├── news.json              ← announcements
├── awards.json            ← awards & honors
└── images/                ← avatar, logos, screenshots
```

<details>
<summary>Feature toggles — show or hide entire pages</summary>

<br/>

In `content/site.json`, flip features on or off:

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

When a feature is `false`, its page and nav link disappear completely.

</details>

<br/>

## Deploy

- **GitHub Pages** — Push to `main`, the included workflow deploys automatically
- **Vercel** — Import repo → click Deploy (auto-detects Vite)
- **Netlify** — Import repo → click Deploy

<br/>

## AI Integration — Supports MCP

The **CV → AI → Markdown → Homepage** pipeline taken to its logical conclusion: TermHub includes a built-in **MCP server** that lets Claude directly read your resume, generate all Markdown/JSON content files, and build your site — zero manual editing.

- Give AI your resume PDF or text, get a complete site
- **19 specialized tools** for publications, projects, experience, awards
- Built-in **PDF text extraction**
- AI can start dev server and **live preview** your site

```bash
# Quick setup
cd mcp-server && npm install    # 1. Install
# 2. Configure Claude Desktop / Code (see mcp-server/mcp-config.json)
# 3. Tell Claude: "Parse my resume and generate my portfolio"
```

<details>
<summary>Available tools</summary>

<br/>

| Tool | Description |
|------|-------------|
| `get_schema` | Get all data types — AI calls this first |
| `parse_pdf` | Extract text from resume PDF |
| `generate_from_resume` | Create structured blueprint from resume text |
| `update_site_config` | Set name, email, social links |
| `add_publication` | Add a paper with full metadata |
| `add_project` | Add a project with tags and highlights |
| `add_experience` | Add work/research timeline entry |
| `add_education` | Add education entry |
| `add_news` / `add_award` | Add news items and awards |
| `write_markdown_content` | Write any Markdown content file |
| `write_json_content` | Write any JSON content file |
| `manage_assets` | Copy images to public directory |
| `preview_site` | Start dev server or production build |
| `get_site_status` | Overview of current portfolio content |
| `reset_content` | Clear all content for fresh start |

</details>

> **Workflow:** Resume → `parse_pdf` → `generate_from_resume` → AI calls `add_*` tools → `preview_site` — done in under a minute.

For detailed setup instructions, see the [AI Integration guide](https://term-hub.vercel.app/docs#mcp-server).

<br/>

## Tech Stack

React 18 · TypeScript 5 · Vite 5 · Chakra UI · Framer Motion · Nord Palette · i18next

<br/>

## Changelog

- `2026-03-15` **v1.2.0** — Built-in English / Chinese bilingual support with language switcher and auto detection
- `2026-03-15` **v1.1.0** — Added MCP server with 19 tools for AI-powered portfolio generation
- `2026-03-14` **v1.0.0** — Initial release with publications, projects, experience, articles, awards, and news

<br/>

## Contributing

Contributions are welcome! Feel free to:

- **Star** this repo to show support
- **Issue** for bugs or feature requests
- **PR** — check [CONTRIBUTING.md](CONTRIBUTING.md) first
- **Discord** — [Join our server](https://discord.gg/QV2kyXzaTa) to chat

<br/>

## License

**GPL-3.0-only** · Copyright © 2026 [Yaoyao (Freax) Qian](https://h-freax.github.io/)
