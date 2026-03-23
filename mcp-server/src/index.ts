#!/usr/bin/env node

// TermHub MCP Server
// AI-powered academic portfolio management via Model Context Protocol

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { execSync, spawn, type ChildProcess } from "node:child_process";
import yaml from "js-yaml";

// ── Config ──────────────────────────────────────────────────────────

const PROJECT_ROOT = process.env.TERMHUB_ROOT || path.resolve(process.cwd(), "..");
const CONTENT_DIR = path.join(PROJECT_ROOT, "content");
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const TYPES_FILE = path.join(PROJECT_ROOT, "src", "types", "index.ts");

let devServerProcess: ChildProcess | null = null;

// ── Language support ────────────────────────────────────────────────

const LanguageEnum = z.enum(["en", "zh"]).default("en").describe(
  "Content language. 'en' writes to content/, 'zh' writes to content/zh/"
);

type Language = "en" | "zh";

function getContentDir(language: Language = "en"): string {
  return language === "zh" ? path.join(CONTENT_DIR, "zh") : CONTENT_DIR;
}

function getContentRelPath(language: Language, filename: string): string {
  return language === "zh" ? `content/zh/${filename}` : `content/${filename}`;
}

// ── Helpers ─────────────────────────────────────────────────────────

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readJson(filePath: string): unknown {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

function writeJson(filePath: string, data: unknown) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function readMarkdownFile(filePath: string): { frontmatter: Record<string, unknown>; body: string } {
  const content = fs.readFileSync(filePath, "utf-8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (fmMatch) {
    const frontmatter = yaml.load(fmMatch[1]) as Record<string, unknown>;
    return { frontmatter, body: fmMatch[2].trim() };
  }
  return { frontmatter: {}, body: content.trim() };
}

function writeMarkdownFile(filePath: string, frontmatter: Record<string, unknown>, body: string) {
  ensureDir(path.dirname(filePath));
  const fmYaml = yaml.dump(frontmatter, { lineWidth: -1, quotingType: '"', forceQuotes: false });
  const content = `---\n${fmYaml}---\n\n${body}\n`;
  fs.writeFileSync(filePath, content, "utf-8");
}

function listContentFiles(language: Language = "en"): { json: string[]; markdown: Record<string, string[]> } {
  const result: { json: string[]; markdown: Record<string, string[]> } = {
    json: [],
    markdown: {},
  };

  const dir = getContentDir(language);
  if (!fs.existsSync(dir)) return result;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith(".json")) {
      result.json.push(entry.name);
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      if (!result.markdown["."]) result.markdown["."] = [];
      result.markdown["."].push(entry.name);
    }
    if (entry.isDirectory() && entry.name !== "zh") {
      const subDir = path.join(dir, entry.name);
      const subEntries = fs.readdirSync(subDir);
      const mdFiles = subEntries.filter((f) => f.endsWith(".md"));
      if (mdFiles.length > 0) {
        result.markdown[entry.name] = mdFiles;
      }
    }
  }
  return result;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Schemas for tool inputs ─────────────────────────────────────────

const ContentTypeEnum = z.enum([
  "site", "experience", "news", "awards", "research", "logos", "talks", "teaching",
]);

const MarkdownCategoryEnum = z.enum([
  "projects", "publications", "articles", "about",
]);

const ProjectCategoryEnum = z.enum([
  "robotics", "nlp", "web-app", "data", "tooling", "healthcare",
]);

const VenueTypeEnum = z.enum(["conference", "workshop", "demo", "preprint"]);
const PublicationStatusEnum = z.enum(["accepted", "published", "preprint"]);

// ── MCP Server ──────────────────────────────────────────────────────

const server = new McpServer({
  name: "termhub",
  version: "1.1.0",
});

// ── Tool: get_schema ────────────────────────────────────────────────

server.tool(
  "get_schema",
  "Get TermHub TypeScript type definitions and content file schemas. " +
    "Call this first to understand the data structures before creating content. " +
    "TermHub supports bilingual content (en/zh). English goes to content/, Chinese goes to content/zh/.",
  {},
  async () => {
    let typesContent = "";
    if (fs.existsSync(TYPES_FILE)) {
      typesContent = fs.readFileSync(TYPES_FILE, "utf-8");
    }

    const siteJson = fs.existsSync(path.join(CONTENT_DIR, "site.json"))
      ? JSON.stringify(readJson(path.join(CONTENT_DIR, "site.json")), null, 2)
      : "{}";

    return {
      content: [
        {
          type: "text" as const,
          text: `# TermHub Data Schema

## Bilingual Support (i18n)
TermHub supports English and Chinese content side by side:
- **English (default):** \`content/\` — site.json, about.md, publications/, projects/, etc.
- **Chinese:** \`content/zh/\` — zh/site.json, zh/about.md, zh/publications/, zh/projects/, etc.

All content tools accept a \`language\` parameter ("en" or "zh"). Use \`language: "zh"\` to write Chinese versions.
The website automatically switches between languages based on user preference.

## TypeScript Interfaces (src/types/index.ts)
\`\`\`typescript
${typesContent}
\`\`\`

## Site Config Structure (content/site.json)
\`\`\`json
${siteJson}
\`\`\`

## Content File Layout
\`\`\`
content/
├── site.json              ← Profile, social links, features, template, sections order, terminal config
├── about.md               ← About page (YAML frontmatter + markdown body)
├── experience.json        ← Education, timeline entries, reviewing
├── news.json              ← News items array
├── awards.json            ← Awards array
├── talks.json             ← Talks/presentations array
├── teaching.json          ← Teaching entries array
├── research.json          ← Current research labs
├── logos.json             ← Institution logo filename map
├── projects/*.md          ← Project entries
├── publications/*.md      ← Publication entries
├── articles/*.md          ← Article entries
└── zh/                    ← Chinese translations (same structure)
    ├── site.json
    ├── about.md
    ├── experience.json
    ├── news.json
    ├── awards.json
    ├── talks.json
    ├── teaching.json
    ├── projects/*.md
    ├── publications/*.md
    └── articles/*.md
\`\`\`

## Template System
TermHub supports multiple visual templates. Set \`"template"\` in site.json to switch.
Available templates: "terminal" (default — Nord-inspired terminal aesthetic).
New templates can be added in \`src/templates/<name>/index.ts\`.

## Component Slots (Figma-like variants)
Individual sections can be swapped independently via \`"components"\` in site.json.
Available slots: navbar, hero, bio, skills, newsDisplay, selectedPublications, journey, mentorship, talks, teaching, accomplishments, contact, footer.
Each slot can have multiple variants. Set \`"components": { "hero": "variantId" }\` to override.

## Section Ordering
The home page section order is configurable via \`"sections"\` in site.json.
Example: \`"sections": ["hero", "bio", "skills", "newsDisplay", "selectedPublications", "journey", "accomplishments", "footer"]\`
Remove a section from the array to hide it. Reorder to change display order.

## Markdown Frontmatter Examples

### Publication (\`content/publications/example.md\`)
\`\`\`yaml
---
id: unique-id-2025
title: "Paper Title"
authors: [Author One, Author Two]
venue: ConferenceName
venueType: conference  # conference | workshop | demo | preprint
year: 2025
status: published      # accepted | published | preprint
isFirstAuthor: true
links:
  paper: https://...
  arxiv: https://...
  code: https://...
emoji: "📄"
---
Abstract text here.
\`\`\`

### Project (\`content/projects/example.md\`)
\`\`\`yaml
---
title: Project Name
category: nlp           # robotics | nlp | web-app | data | tooling | healthcare
date: 2025-01-15
tags: [Python, PyTorch]
link: https://...
isOpenSource: true
badge: "🏆 Award"
---
Project description paragraph.

## Highlights
- First highlight
- Second highlight
\`\`\`
`,
        },
      ],
    };
  }
);

// ── Tool: list_content ──────────────────────────────────────────────

server.tool(
  "list_content",
  "List all content files in the TermHub content directory. " +
    "Use language parameter to list English or Chinese content files.",
  {
    language: LanguageEnum,
  },
  async ({ language }) => {
    const lang = language as Language;
    const files = listContentFiles(lang);
    return {
      content: [
        {
          type: "text" as const,
          text: `# Content files (${lang})\n\n${JSON.stringify(files, null, 2)}`,
        },
      ],
    };
  }
);

// ── Tool: read_content ──────────────────────────────────────────────

server.tool(
  "read_content",
  "Read a content file from TermHub. For JSON files, returns parsed JSON. " +
    "For Markdown files, returns frontmatter + body separately. " +
    "Use language parameter to read English or Chinese content.",
  {
    file_path: z
      .string()
      .describe(
        "Relative path within content/ directory, e.g. 'site.json', 'projects/my-project.md', 'about.md'"
      ),
    language: LanguageEnum,
  },
  async ({ file_path, language }) => {
    const lang = language as Language;
    const contentDir = getContentDir(lang);
    const fullPath = path.join(contentDir, file_path);
    if (!fs.existsSync(fullPath)) {
      return {
        content: [{ type: "text" as const, text: `Error: File not found: ${getContentRelPath(lang, file_path)}` }],
        isError: true,
      };
    }

    if (file_path.endsWith(".json")) {
      const data = readJson(fullPath);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
      };
    }

    if (file_path.endsWith(".md")) {
      const { frontmatter, body } = readMarkdownFile(fullPath);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify({ frontmatter, body }, null, 2),
          },
        ],
      };
    }

    const raw = fs.readFileSync(fullPath, "utf-8");
    return { content: [{ type: "text" as const, text: raw }] };
  }
);

// ── Tool: write_json_content ────────────────────────────────────────

server.tool(
  "write_json_content",
  "Write or update a JSON content file (site.json, experience.json, news.json, awards.json, research.json, logos.json). " +
    "Use language='zh' to write Chinese version to content/zh/.",
  {
    file_name: ContentTypeEnum.describe("Which JSON content file to write"),
    data: z.string().describe("JSON string of the data to write"),
    language: LanguageEnum,
  },
  async ({ file_name, data, language }) => {
    try {
      const lang = language as Language;
      const parsed = JSON.parse(data);
      const contentDir = getContentDir(lang);
      const filePath = path.join(contentDir, `${file_name}.json`);
      writeJson(filePath, parsed);
      return {
        content: [
          {
            type: "text" as const,
            text: `Successfully wrote ${getContentRelPath(lang, `${file_name}.json`)}`,
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error writing ${file_name}.json: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: write_markdown_content ────────────────────────────────────

server.tool(
  "write_markdown_content",
  "Write or update a Markdown content file with YAML frontmatter. " +
    "For projects/publications/articles, specify the category and a slug for the filename. " +
    "For about.md, use category='about'. Use language='zh' to write Chinese version.",
  {
    category: MarkdownCategoryEnum.describe("Content category folder"),
    slug: z
      .string()
      .optional()
      .describe("Filename slug (without .md). Auto-generated from title if omitted. Ignored for 'about'."),
    frontmatter: z.string().describe("JSON string of YAML frontmatter fields"),
    body: z.string().describe("Markdown body content"),
    language: LanguageEnum,
  },
  async ({ category, slug, frontmatter, body, language }) => {
    try {
      const lang = language as Language;
      const contentDir = getContentDir(lang);
      const fm = JSON.parse(frontmatter) as Record<string, unknown>;

      let filePath: string;
      if (category === "about") {
        filePath = path.join(contentDir, "about.md");
      } else {
        const fileName = slug || slugify(String(fm.title || "untitled"));
        filePath = path.join(contentDir, category, `${fileName}.md`);
      }

      writeMarkdownFile(filePath, fm, body);

      const relPath = lang === "zh"
        ? `content/zh/${path.relative(contentDir, filePath)}`
        : `content/${path.relative(contentDir, filePath)}`;
      return {
        content: [
          { type: "text" as const, text: `Successfully wrote ${relPath}` },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: delete_content ────────────────────────────────────────────

server.tool(
  "delete_content",
  "Delete a content file from TermHub. Use language='zh' for Chinese content.",
  {
    file_path: z
      .string()
      .describe("Relative path within content/ directory, e.g. 'projects/old-project.md'"),
    language: LanguageEnum,
  },
  async ({ file_path, language }) => {
    const lang = language as Language;
    const contentDir = getContentDir(lang);
    const fullPath = path.join(contentDir, file_path);
    if (!fs.existsSync(fullPath)) {
      return {
        content: [{ type: "text" as const, text: `File not found: ${getContentRelPath(lang, file_path)}` }],
        isError: true,
      };
    }
    fs.unlinkSync(fullPath);
    return {
      content: [{ type: "text" as const, text: `Deleted ${getContentRelPath(lang, file_path)}` }],
    };
  }
);

// ── Tool: update_site_config ────────────────────────────────────────

server.tool(
  "update_site_config",
  "Update specific fields in site.json without overwriting the entire file. " +
    "Accepts a partial JSON object that will be deep-merged with existing config. " +
    "Use language='zh' to update the Chinese site config.",
  {
    updates: z.string().describe("JSON string of fields to merge into site.json"),
    language: LanguageEnum,
  },
  async ({ updates, language }) => {
    try {
      const lang = language as Language;
      const contentDir = getContentDir(lang);
      const siteJsonPath = path.join(contentDir, "site.json");
      const existing = fs.existsSync(siteJsonPath)
        ? (readJson(siteJsonPath) as Record<string, unknown>)
        : {};
      const patch = JSON.parse(updates) as Record<string, unknown>;

      // Deep merge
      function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
        const result = { ...target };
        for (const key of Object.keys(source)) {
          if (
            source[key] &&
            typeof source[key] === "object" &&
            !Array.isArray(source[key]) &&
            target[key] &&
            typeof target[key] === "object" &&
            !Array.isArray(target[key])
          ) {
            result[key] = deepMerge(
              target[key] as Record<string, unknown>,
              source[key] as Record<string, unknown>
            );
          } else {
            result[key] = source[key];
          }
        }
        return result;
      }

      const merged = deepMerge(existing, patch);
      writeJson(siteJsonPath, merged);

      return {
        content: [
          {
            type: "text" as const,
            text: `Successfully updated ${getContentRelPath(lang, "site.json")}. Updated fields: ${Object.keys(patch).join(", ")}`,
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: add_publication ───────────────────────────────────────────

server.tool(
  "add_publication",
  "Add a single publication entry as a Markdown file. " +
    "Use language='zh' to add Chinese version to content/zh/publications/.",
  {
    id: z.string().describe("Unique publication ID, e.g. 'acl2025-my-paper'"),
    title: z.string().describe("Paper title"),
    authors: z.array(z.string()).describe("List of author names"),
    venue: z.string().describe("Publication venue name"),
    venue_type: VenueTypeEnum.describe("Type of venue"),
    year: z.number().describe("Publication year"),
    status: PublicationStatusEnum.describe("Publication status"),
    abstract: z.string().optional().describe("Paper abstract"),
    is_first_author: z.boolean().optional().describe("Whether you are first author"),
    links: z
      .object({
        paper: z.string().optional(),
        arxiv: z.string().optional(),
        code: z.string().optional(),
        demo: z.string().optional(),
        dataset: z.string().optional(),
        projectPage: z.string().optional(),
      })
      .optional()
      .describe("Related links"),
    emoji: z.string().optional().describe("Display emoji"),
    keywords: z.array(z.string()).optional().describe("Keywords"),
    language: LanguageEnum,
  },
  async (params) => {
    const lang = params.language as Language;
    const contentDir = getContentDir(lang);

    const frontmatter: Record<string, unknown> = {
      id: params.id,
      title: params.title,
      authors: params.authors,
      venue: params.venue,
      venueType: params.venue_type,
      year: params.year,
      status: params.status,
    };

    if (params.is_first_author) frontmatter.isFirstAuthor = true;
    if (params.emoji) frontmatter.emoji = params.emoji;
    if (params.keywords) frontmatter.keywords = params.keywords;
    if (params.links) {
      const links: Record<string, string> = {};
      for (const [k, v] of Object.entries(params.links)) {
        if (v) links[k] = v;
      }
      if (Object.keys(links).length > 0) frontmatter.links = links;
    }

    const body = params.abstract || "";
    const slug = slugify(params.id);
    const filePath = path.join(contentDir, "publications", `${slug}.md`);

    writeMarkdownFile(filePath, frontmatter, body);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added publication: ${getContentRelPath(lang, `publications/${slug}.md`)}`,
        },
      ],
    };
  }
);

// ── Tool: add_project ───────────────────────────────────────────────

server.tool(
  "add_project",
  "Add a single project entry as a Markdown file. " +
    "Use language='zh' to add Chinese version to content/zh/projects/.",
  {
    title: z.string().describe("Project title"),
    category: ProjectCategoryEnum.describe("Project category"),
    summary: z.string().describe("Short project description"),
    tags: z.array(z.string()).describe("Technology tags"),
    date: z.string().optional().describe("Project date (YYYY-MM-DD)"),
    link: z.string().optional().describe("Project URL"),
    is_open_source: z.boolean().optional().describe("Whether the project is open source"),
    badge: z.string().optional().describe("Display badge text"),
    highlights: z.array(z.string()).optional().describe("Key highlights as bullet points"),
    slug: z.string().optional().describe("Filename slug (auto-generated from title if omitted)"),
    language: LanguageEnum,
  },
  async (params) => {
    const lang = params.language as Language;
    const contentDir = getContentDir(lang);

    const frontmatter: Record<string, unknown> = {
      title: params.title,
      category: params.category,
      tags: params.tags,
    };

    if (params.date) frontmatter.date = params.date;
    if (params.link) frontmatter.link = params.link;
    if (params.is_open_source) frontmatter.isOpenSource = true;
    if (params.badge) frontmatter.badge = params.badge;

    let body = params.summary + "\n";
    if (params.highlights && params.highlights.length > 0) {
      body += "\n## Highlights\n\n";
      for (const h of params.highlights) {
        body += `- ${h}\n`;
      }
    }

    const fileName = params.slug || slugify(params.title);
    const filePath = path.join(contentDir, "projects", `${fileName}.md`);

    writeMarkdownFile(filePath, frontmatter, body);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added project: ${getContentRelPath(lang, `projects/${fileName}.md`)}`,
        },
      ],
    };
  }
);

// ── Tool: add_experience ────────────────────────────────────────────

server.tool(
  "add_experience",
  "Add a timeline entry to experience.json. " +
    "Use language='zh' to add to Chinese content.",
  {
    title: z.string().describe("Job/position title"),
    company: z.string().describe("Company or organization name"),
    company_url: z.string().optional().describe("Company website URL"),
    location: z.string().optional().describe("Location"),
    start: z.string().describe("Start date (YYYY-MM-DD)"),
    end: z.string().optional().describe("End date (YYYY-MM-DD), omit for current positions"),
    category: z.enum(["research", "industry", "academic", "leadership"]).describe("Experience category"),
    role_type: z.enum(["research", "mle", "sde", "teaching", "leadership"]).optional().describe("Role type"),
    summary: z.string().optional().describe("Brief summary"),
    highlights: z.array(z.string()).describe("Key achievements"),
    is_current: z.boolean().optional().describe("Whether this is a current position"),
    language: LanguageEnum,
  },
  async (params) => {
    const lang = params.language as Language;
    const contentDir = getContentDir(lang);
    const expPath = path.join(contentDir, "experience.json");
    const existing = fs.existsSync(expPath)
      ? (readJson(expPath) as Record<string, unknown>)
      : { education: { courses: [] }, reviewing: [], timeline: [] };

    const timeline = (existing.timeline as unknown[]) || [];

    const entry: Record<string, unknown> = {
      title: params.title,
      company: params.company,
      start: params.start,
      category: params.category,
      highlights: params.highlights,
    };

    if (params.company_url) entry.companyUrl = params.company_url;
    if (params.location) entry.location = params.location;
    if (params.end) entry.end = params.end;
    if (params.role_type) entry.roleType = params.role_type;
    if (params.summary) entry.summary = params.summary;
    if (params.is_current) entry.isCurrent = true;

    timeline.push(entry);
    existing.timeline = timeline;
    writeJson(expPath, existing);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added experience entry (${lang}): ${params.title} at ${params.company}`,
        },
      ],
    };
  }
);

// ── Tool: add_education ─────────────────────────────────────────────

server.tool(
  "add_education",
  "Add an education entry to experience.json. " +
    "Use language='zh' to add to Chinese content.",
  {
    course: z.string().describe("Degree or course name, e.g. 'M.S. Computer Science'"),
    institution: z.string().describe("Institution name"),
    year: z.string().describe("Year range, e.g. '2022-2024'"),
    language: LanguageEnum,
  },
  async (params) => {
    const lang = params.language as Language;
    const contentDir = getContentDir(lang);
    const expPath = path.join(contentDir, "experience.json");
    const existing = fs.existsSync(expPath)
      ? (readJson(expPath) as Record<string, unknown>)
      : { education: { courses: [] }, reviewing: [], timeline: [] };

    const education = (existing.education as Record<string, unknown>) || { courses: [] };
    const courses = (education.courses as unknown[]) || [];
    courses.push({
      course: params.course,
      institution: params.institution,
      year: params.year,
    });
    education.courses = courses;
    existing.education = education;
    writeJson(expPath, existing);

    return {
      content: [
        {
          type: "text" as const,
          text: `Added education (${lang}): ${params.course} at ${params.institution}`,
        },
      ],
    };
  }
);

// ── Tool: add_news ──────────────────────────────────────────────────

server.tool(
  "add_news",
  "Add a news item to news.json. Use language='zh' to add to Chinese content.",
  {
    type: z.string().describe("News type: publication, talk, release, award, etc."),
    badge: z.string().describe("Badge label displayed on the news item"),
    icon: z.string().describe("React icon component name, e.g. 'FaFileAlt', 'FaRocket'"),
    icon_color: z.string().describe("Chakra UI color, e.g. 'blue.400', 'green.400'"),
    title: z.string().describe("News headline"),
    description: z.string().describe("News description"),
    date: z.string().optional().describe("Display date, e.g. 'Mar 2025'"),
    sort_date: z.string().optional().describe("Sort date in YYYY-MM-DD format"),
    links: z
      .array(
        z.object({
          text: z.string(),
          url: z.string(),
          icon: z.string().optional(),
        })
      )
      .optional()
      .describe("Related links"),
    language: LanguageEnum,
  },
  async (params) => {
    const lang = params.language as Language;
    const contentDir = getContentDir(lang);
    const newsPath = path.join(contentDir, "news.json");
    const existing = fs.existsSync(newsPath) ? (readJson(newsPath) as unknown[]) : [];

    const item: Record<string, unknown> = {
      type: params.type,
      badge: params.badge,
      icon: params.icon,
      iconColor: params.icon_color,
      title: params.title,
      description: params.description,
    };

    if (params.date) item.date = params.date;
    if (params.sort_date) item.sortDate = params.sort_date;
    if (params.links) item.links = params.links;
    else item.links = [];

    existing.unshift(item); // Add to top (newest first)
    writeJson(newsPath, existing);

    return {
      content: [
        { type: "text" as const, text: `Added news item (${lang}): ${params.title}` },
      ],
    };
  }
);

// ── Tool: add_award ─────────────────────────────────────────────────

server.tool(
  "add_award",
  "Add an award/honor to awards.json. Use language='zh' to add to Chinese content.",
  {
    title: z.string().describe("Award title"),
    org: z.string().optional().describe("Awarding organization"),
    date: z.string().describe("Date, e.g. 'Dec 2025'"),
    kind: z
      .enum(["grant", "hackathon", "travel", "scholarship", "honor", "employment", "competition", "innovation", "other"])
      .optional()
      .describe("Award type"),
    link: z.string().optional().describe("Link URL"),
    language: LanguageEnum,
  },
  async (params) => {
    const lang = params.language as Language;
    const contentDir = getContentDir(lang);
    const awardsPath = path.join(contentDir, "awards.json");
    const existing = fs.existsSync(awardsPath) ? (readJson(awardsPath) as unknown[]) : [];

    const item: Record<string, unknown> = {
      title: params.title,
      date: params.date,
    };
    if (params.org) item.org = params.org;
    if (params.kind) item.kind = params.kind;
    if (params.link) item.link = params.link;

    existing.unshift(item);
    writeJson(awardsPath, existing);

    return {
      content: [
        { type: "text" as const, text: `Added award (${lang}): ${params.title}` },
      ],
    };
  }
);

// ── Tool: add_talk ──────────────────────────────────────────────────

server.tool(
  "add_talk",
  "Add a talk/presentation to talks.json. Use language='zh' to add to Chinese content.",
  {
    title: z.string().describe("Talk title"),
    event: z.string().describe("Event/conference name"),
    date: z.string().describe("Date, e.g. 'Mar 2025'"),
    location: z.string().optional().describe("Location"),
    type: z.enum(["keynote", "invited", "oral", "poster", "tutorial", "workshop", "panel", "other"]).optional().describe("Talk type"),
    description: z.string().optional().describe("Short description"),
    slides_url: z.string().optional().describe("URL to slides"),
    video_url: z.string().optional().describe("URL to video recording"),
    language: LanguageEnum,
  },
  async (params) => {
    const lang = params.language as Language;
    const contentDir = getContentDir(lang);
    const talksPath = path.join(contentDir, "talks.json");
    const existing = fs.existsSync(talksPath) ? (readJson(talksPath) as unknown[]) : [];

    const item: Record<string, unknown> = {
      title: params.title,
      event: params.event,
      date: params.date,
    };
    if (params.location) item.location = params.location;
    if (params.type) item.type = params.type;
    if (params.description) item.description = params.description;
    if (params.slides_url) item.slidesUrl = params.slides_url;
    if (params.video_url) item.videoUrl = params.video_url;

    existing.unshift(item);
    writeJson(talksPath, existing);

    return {
      content: [
        { type: "text" as const, text: `Added talk (${lang}): ${params.title}` },
      ],
    };
  }
);

// ── Tool: add_teaching ──────────────────────────────────────────────

server.tool(
  "add_teaching",
  "Add a teaching entry to teaching.json. Use language='zh' to add to Chinese content.",
  {
    course: z.string().describe("Course name"),
    institution: z.string().describe("Institution name"),
    semester: z.string().describe("Semester, e.g. 'Fall 2025'"),
    role: z.enum(["instructor", "ta", "guest-lecturer", "co-instructor", "other"]).describe("Role"),
    description: z.string().optional().describe("Short description"),
    link: z.string().optional().describe("Link to course page"),
    language: LanguageEnum,
  },
  async (params) => {
    const lang = params.language as Language;
    const contentDir = getContentDir(lang);
    const teachingPath = path.join(contentDir, "teaching.json");
    const existing = fs.existsSync(teachingPath) ? (readJson(teachingPath) as unknown[]) : [];

    const item: Record<string, unknown> = {
      course: params.course,
      institution: params.institution,
      semester: params.semester,
      role: params.role,
    };
    if (params.description) item.description = params.description;
    if (params.link) item.link = params.link;

    existing.unshift(item);
    writeJson(teachingPath, existing);

    return {
      content: [
        { type: "text" as const, text: `Added teaching entry (${lang}): ${params.course}` },
      ],
    };
  }
);

// ── Tool: parse_pdf ─────────────────────────────────────────────────

server.tool(
  "parse_pdf",
  "Parse a PDF file (e.g. resume/CV) and extract its text content. " +
    "Returns plain text that can then be used with other tools to populate the portfolio.",
  {
    file_path: z.string().describe("Absolute path to the PDF file"),
  },
  async ({ file_path }) => {
    try {
      if (!fs.existsSync(file_path)) {
        return {
          content: [{ type: "text" as const, text: `Error: File not found: ${file_path}` }],
          isError: true,
        };
      }

      const pdfParse = (await import("pdf-parse")).default;
      const buffer = fs.readFileSync(file_path);
      const data = await pdfParse(buffer);

      return {
        content: [
          {
            type: "text" as const,
            text: `# PDF Content (${data.numpages} pages)\n\n${data.text}`,
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error parsing PDF: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: generate_from_resume ──────────────────────────────────────

server.tool(
  "generate_from_resume",
  "All-in-one tool: Takes resume/CV text content and generates a structured extraction " +
    "with instructions for populating all TermHub content files. Returns a JSON blueprint " +
    "that maps resume sections to TermHub tools. The AI should then call individual tools " +
    "to actually write the files. Supports generating both English and Chinese content.",
  {
    resume_text: z.string().describe("Plain text content of the resume/CV"),
    owner_name: z.string().describe("Full name of the portfolio owner"),
    nickname: z.string().optional().describe("Preferred display name / nickname"),
    email: z.string().optional().describe("Contact email"),
    academic_email: z.string().optional().describe("Academic email (.edu)"),
    github: z.string().optional().describe("GitHub profile URL"),
    linkedin: z.string().optional().describe("LinkedIn profile URL"),
    google_scholar: z.string().optional().describe("Google Scholar URL"),
    avatar_path: z.string().optional().describe("Path to avatar image file"),
    languages: z
      .array(z.enum(["en", "zh"]))
      .default(["en"])
      .describe("Languages to generate content for. Use ['en', 'zh'] for bilingual."),
  },
  async (params) => {
    // Copy avatar if provided
    let avatarFileName = "";
    if (params.avatar_path && fs.existsSync(params.avatar_path)) {
      const ext = path.extname(params.avatar_path);
      avatarFileName = `avatar${ext}`;
      ensureDir(path.join(PUBLIC_DIR, "img"));
      fs.copyFileSync(params.avatar_path, path.join(PUBLIC_DIR, "img", avatarFileName));
    }

    // Build the extraction blueprint
    const blueprint = {
      instructions:
        "Below is a structured blueprint extracted from the resume. " +
        "Use the individual TermHub MCP tools (update_site_config, add_publication, " +
        "add_project, add_experience, add_education, write_markdown_content, etc.) " +
        "to populate each section. All tools accept a 'language' parameter. " +
        (params.languages.includes("zh")
          ? "IMPORTANT: Generate content for BOTH English (language='en') and Chinese (language='zh'). " +
            "For Chinese content, translate all user-facing text (titles, descriptions, highlights) to Chinese. " +
            "Keep technical terms, venue names, and proper nouns in English."
          : "The resume text is included for reference."),

      target_languages: params.languages,

      site_config: {
        tool: "update_site_config",
        note: params.languages.includes("zh")
          ? "Call update_site_config twice: once with language='en' and once with language='zh'. " +
            "Chinese site.json can have translated title, rotating subtitles, etc."
          : undefined,
        suggested_data: {
          template: "terminal",
          sections: [
            "hero", "bio", "newsDisplay", "selectedPublications",
            "journey", "skills", "mentorship", "talks", "teaching",
            "accomplishments", "contact", "footer",
          ],
          name: {
            full: params.owner_name,
            first: params.owner_name.split(" ")[0],
            nickname: params.nickname || params.owner_name.split(" ")[0],
            last: params.owner_name.split(" ").slice(1).join(" "),
            display: params.nickname || params.owner_name,
            authorVariants: [params.owner_name],
          },
          title: `Hi, I'm ${params.nickname || params.owner_name.split(" ")[0]}`,
          avatar: avatarFileName || "avatar.jpg",
          terminal: {
            username: slugify(params.nickname || params.owner_name.split(" ")[0]),
          },
          contact: {
            email: params.email || "",
            academicEmail: params.academic_email || "",
          },
          social: {
            github: params.github || "",
            linkedin: params.linkedin || "",
            googleScholar: params.google_scholar || "",
          },
        },
      },

      sections_to_extract: [
        {
          section: "Education",
          tool: "add_education",
          hint: "Extract degree, institution, year range for each education entry. " +
            (params.languages.includes("zh") ? "For zh: translate degree names (e.g. '计算机科学硕士')." : ""),
        },
        {
          section: "Experience / Work History",
          tool: "add_experience",
          hint: "Extract title, company, dates, highlights for each position. " +
            "Set category: research|industry|academic|leadership, roleType: research|mle|sde|teaching|leadership. " +
            (params.languages.includes("zh") ? "For zh: translate job titles, summaries, and highlights." : ""),
        },
        {
          section: "Publications",
          tool: "add_publication",
          hint: "Extract title, authors, venue, year, status, links for each paper. " +
            "Generate a unique ID like 'venue2025-short-title'. " +
            (params.languages.includes("zh") ? "For zh: translate abstract. Keep title/venue/authors in English." : ""),
        },
        {
          section: "Projects",
          tool: "add_project",
          hint: "Extract title, summary, tags, category, highlights for each project. " +
            "Map to categories: robotics|nlp|web-app|data|tooling|healthcare. " +
            (params.languages.includes("zh") ? "For zh: translate summary and highlights." : ""),
        },
        {
          section: "Awards & Honors",
          tool: "add_award",
          hint: "Extract title, org, date, kind for each award. " +
            (params.languages.includes("zh") ? "For zh: translate award titles." : ""),
        },
        {
          section: "Research Interests",
          tool: "write_json_content (file_name: 'research')",
          hint: "Extract current research labs/groups with advisor, focus, link. " +
            (params.languages.includes("zh") ? "For zh: translate research focus descriptions." : ""),
        },
        {
          section: "About / Bio",
          tool: "write_markdown_content (category: 'about')",
          hint: "Generate a narrative journey description and timeline phases from the resume. " +
            (params.languages.includes("zh") ? "For zh: write a Chinese version of the bio narrative." : ""),
        },
        {
          section: "Talks / Presentations",
          tool: "add_talk",
          hint: "Extract title, event, date, location, type for each talk or presentation. " +
            (params.languages.includes("zh") ? "For zh: translate description. Keep event names in English." : ""),
        },
        {
          section: "Teaching",
          tool: "add_teaching",
          hint: "Extract course, institution, semester, role for each teaching entry. " +
            (params.languages.includes("zh") ? "For zh: translate course names and descriptions." : ""),
        },
      ],

      resume_text: params.resume_text,
    };

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(blueprint, null, 2),
        },
      ],
    };
  }
);

// ── Tool: manage_assets ─────────────────────────────────────────────

server.tool(
  "manage_assets",
  "Copy images or other assets to the public directory for use in the portfolio",
  {
    action: z.enum(["copy", "list"]).describe("Action to perform"),
    source_path: z
      .string()
      .optional()
      .describe("Absolute path to source file (for 'copy' action)"),
    destination: z
      .enum(["img", "logos", "project-images", "publication-images", "files"])
      .optional()
      .describe("Destination subdirectory in public/"),
    filename: z
      .string()
      .optional()
      .describe("Target filename (defaults to source filename)"),
  },
  async ({ action, source_path, destination, filename }) => {
    if (action === "list") {
      const result: Record<string, string[]> = {};
      const dirs = ["img", "logos", "project-images", "publication-images", "files"];
      for (const dir of dirs) {
        const dirPath = path.join(PUBLIC_DIR, dir);
        if (fs.existsSync(dirPath)) {
          result[dir] = fs.readdirSync(dirPath);
        }
      }
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }

    if (!source_path || !destination) {
      return {
        content: [
          {
            type: "text" as const,
            text: "Error: source_path and destination required for 'copy' action",
          },
        ],
        isError: true,
      };
    }

    if (!fs.existsSync(source_path)) {
      return {
        content: [
          { type: "text" as const, text: `Error: Source file not found: ${source_path}` },
        ],
        isError: true,
      };
    }

    const destDir = path.join(PUBLIC_DIR, destination);
    ensureDir(destDir);
    const targetName = filename || path.basename(source_path);
    const destPath = path.join(destDir, targetName);
    fs.copyFileSync(source_path, destPath);

    return {
      content: [
        {
          type: "text" as const,
          text: `Copied to public/${destination}/${targetName}`,
        },
      ],
    };
  }
);

// ── Tool: preview_site ──────────────────────────────────────────────

server.tool(
  "preview_site",
  "Build or start the TermHub dev server for preview",
  {
    action: z
      .enum(["dev", "build", "stop"])
      .describe("'dev' starts dev server, 'build' creates production build, 'stop' stops dev server"),
  },
  async ({ action }) => {
    try {
      if (action === "stop") {
        if (devServerProcess) {
          devServerProcess.kill();
          devServerProcess = null;
          return {
            content: [{ type: "text" as const, text: "Dev server stopped." }],
          };
        }
        return {
          content: [{ type: "text" as const, text: "No dev server running." }],
        };
      }

      if (action === "build") {
        const output = execSync("npm run build", {
          cwd: PROJECT_ROOT,
          encoding: "utf-8",
          timeout: 120000,
        });
        return {
          content: [
            {
              type: "text" as const,
              text: `Build completed successfully.\n\n${output.slice(-500)}`,
            },
          ],
        };
      }

      // action === "dev"
      if (devServerProcess) {
        return {
          content: [
            { type: "text" as const, text: "Dev server is already running." },
          ],
        };
      }

      devServerProcess = spawn("npm", ["run", "dev"], {
        cwd: PROJECT_ROOT,
        stdio: ["ignore", "pipe", "pipe"],
      });

      // Wait for the server to output the URL
      const url = await new Promise<string>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Dev server start timeout")), 15000);
        devServerProcess!.stdout?.on("data", (data: Buffer) => {
          const text = data.toString();
          const urlMatch = text.match(/(https?:\/\/localhost:\d+)/);
          if (urlMatch) {
            clearTimeout(timeout);
            resolve(urlMatch[1]);
          }
        });
        devServerProcess!.on("error", (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

      return {
        content: [
          {
            type: "text" as const,
            text: `Dev server started at ${url}`,
          },
        ],
      };
    } catch (e) {
      return {
        content: [
          {
            type: "text" as const,
            text: `Error: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// ── Tool: list_templates ────────────────────────────────────────────

server.tool(
  "list_templates",
  "List all available TermHub visual templates and component slot variants. " +
    "Each template provides a different layout and theme. " +
    "Individual sections (navbar, hero, footer, etc.) can be overridden via the 'components' field in site.json.",
  {},
  async () => {
    // Read available templates from src/templates directory
    const templatesDir = path.join(PROJECT_ROOT, "src", "templates");
    const available: { id: string; description: string }[] = [];

    if (fs.existsSync(templatesDir)) {
      for (const entry of fs.readdirSync(templatesDir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          const indexPath = path.join(templatesDir, entry.name, "index.ts");
          if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, "utf-8");
            const descMatch = content.match(/description:\s*['"`]([^'"`]+)['"`]/);
            available.push({
              id: entry.name,
              description: descMatch ? descMatch[1] : "(no description)",
            });
          }
        }
      }
    }

    // Read component slots from each template's slots: { ... } block
    const slots: Record<string, string[]> = {};
    for (const tmpl of available) {
      const tmplIndexPath = path.join(templatesDir, tmpl.id, "index.ts");
      if (fs.existsSync(tmplIndexPath)) {
        const tmplContent = fs.readFileSync(tmplIndexPath, "utf-8");
        const slotsMatch = tmplContent.match(/slots:\s*\{([\s\S]*?)\n\s*\}/);
        if (slotsMatch) {
          const slotKeys = [...slotsMatch[1].matchAll(/(\w+)\s*:/g)].map(m => m[1]);
          for (const key of slotKeys) {
            if (!slots[key]) slots[key] = [];
            if (!slots[key].includes(tmpl.id)) slots[key].push(tmpl.id);
          }
        }
      }
    }

    // Get current config from site.json
    const siteJsonPath = path.join(CONTENT_DIR, "site.json");
    let currentTemplate = "terminal";
    let currentComponents: Record<string, string> = {};
    if (fs.existsSync(siteJsonPath)) {
      const site = readJson(siteJsonPath) as Record<string, unknown>;
      currentTemplate = (site.template as string) || "terminal";
      currentComponents = (site.components as Record<string, string>) || {};
    }

    return {
      content: [
        {
          type: "text" as const,
          text: JSON.stringify(
            {
              current_template: currentTemplate,
              current_component_overrides: currentComponents,
              available_templates: available,
              component_slots: slots,
              usage: {
                template: 'Set "template": "<id>" in content/site.json to switch templates.',
                components: 'Set "components": { "hero": "<variantId>" } to override individual sections.',
              },
            },
            null,
            2
          ),
        },
      ],
    };
  }
);

// ── Tool: get_site_status ───────────────────────────────────────────

server.tool(
  "get_site_status",
  "Get an overview of the current TermHub portfolio content — what's configured, " +
    "how many publications/projects/etc exist, and what's missing. " +
    "Shows counts for both English and Chinese content.",
  {},
  async () => {
    const status: Record<string, unknown> = {};

    // Site config
    const siteJsonPath = path.join(CONTENT_DIR, "site.json");
    if (fs.existsSync(siteJsonPath)) {
      const site = readJson(siteJsonPath) as Record<string, unknown>;
      const name = site.name as Record<string, string> | undefined;
      status.profile = {
        name: name?.display || "(not set)",
        avatar: site.avatar || "(not set)",
        template: (site.template as string) || "terminal",
        components: site.components || {},
        features: site.features || {},
      };
    } else {
      status.profile = "(site.json not found)";
    }

    // Count content for both languages
    function countContent(lang: Language) {
      const files = listContentFiles(lang);
      const contentDir = getContentDir(lang);
      const counts: Record<string, unknown> = {
        publications: files.markdown["publications"]?.length || 0,
        projects: files.markdown["projects"]?.length || 0,
        articles: files.markdown["articles"]?.length || 0,
        has_about: files.markdown["."]?.includes("about.md") || false,
      };

      const newsPath = path.join(contentDir, "news.json");
      const awardsPath = path.join(contentDir, "awards.json");
      const expPath = path.join(contentDir, "experience.json");

      const talksPath = path.join(contentDir, "talks.json");
      const teachingPath = path.join(contentDir, "teaching.json");

      if (fs.existsSync(newsPath)) {
        const news = readJson(newsPath) as unknown[];
        counts.news = news.length;
      }
      if (fs.existsSync(awardsPath)) {
        const awards = readJson(awardsPath) as unknown[];
        counts.awards = awards.length;
      }
      if (fs.existsSync(talksPath)) {
        const talks = readJson(talksPath) as unknown[];
        counts.talks = talks.length;
      }
      if (fs.existsSync(teachingPath)) {
        const teaching = readJson(teachingPath) as unknown[];
        counts.teaching = teaching.length;
      }
      if (fs.existsSync(expPath)) {
        const exp = readJson(expPath) as Record<string, unknown>;
        const timeline = (exp.timeline as unknown[]) || [];
        const edu = (exp.education as Record<string, unknown>) || {};
        const courses = (edu.courses as unknown[]) || [];
        counts.experience_entries = timeline.length;
        counts.education_entries = courses.length;
      }

      return counts;
    }

    status.content_en = countContent("en");
    status.content_zh = countContent("zh");

    // Check zh site.json
    const zhSiteJsonPath = path.join(CONTENT_DIR, "zh", "site.json");
    status.has_zh_site_config = fs.existsSync(zhSiteJsonPath);

    // Assets
    const imgDir = path.join(PUBLIC_DIR, "img");
    const logosDir = path.join(PUBLIC_DIR, "logos");
    status.assets = {
      images: fs.existsSync(imgDir) ? fs.readdirSync(imgDir).length : 0,
      logos: fs.existsSync(logosDir) ? fs.readdirSync(logosDir).length : 0,
    };

    // Dev server
    status.dev_server_running = devServerProcess !== null;

    return {
      content: [
        { type: "text" as const, text: JSON.stringify(status, null, 2) },
      ],
    };
  }
);

// ── Tool: reset_content ─────────────────────────────────────────────

server.tool(
  "reset_content",
  "Reset all content to empty/default state. WARNING: This deletes all existing content! " +
    "Resets both English and Chinese content. " +
    "Useful when starting fresh from a resume import.",
  {
    confirm: z
      .literal("yes-delete-all-content")
      .describe("Must be exactly 'yes-delete-all-content' to confirm"),
  },
  async ({ confirm }) => {
    if (confirm !== "yes-delete-all-content") {
      return {
        content: [
          { type: "text" as const, text: "Reset cancelled. Confirmation string did not match." },
        ],
      };
    }

    // Clear markdown directories for both languages
    for (const lang of ["en", "zh"] as Language[]) {
      const contentDir = getContentDir(lang);
      for (const dir of ["projects", "publications", "articles"]) {
        const dirPath = path.join(contentDir, dir);
        if (fs.existsSync(dirPath)) {
          for (const file of fs.readdirSync(dirPath)) {
            if (file.endsWith(".md")) {
              fs.unlinkSync(path.join(dirPath, file));
            }
          }
        }
      }

      // Reset JSON files to empty defaults
      if (lang === "en" || fs.existsSync(contentDir)) {
        writeJson(path.join(contentDir, "news.json"), []);
        writeJson(path.join(contentDir, "awards.json"), []);
        writeJson(path.join(contentDir, "talks.json"), []);
        writeJson(path.join(contentDir, "teaching.json"), []);
        writeJson(path.join(contentDir, "experience.json"), {
          education: { courses: [] },
          reviewing: [],
          timeline: [],
        });

        if (lang === "en") {
          writeJson(path.join(contentDir, "research.json"), { currentResearch: [] });
          writeJson(path.join(contentDir, "logos.json"), {});
        }

        // Reset about.md
        writeMarkdownFile(
          path.join(contentDir, "about.md"),
          {
            journeyPhases: [],
            version: { current: "v1.0.0", history: [] },
          },
          ""
        );
      }
    }

    // Reset site.json to minimal (English)
    const siteJsonPath = path.join(CONTENT_DIR, "site.json");
    const existing = fs.existsSync(siteJsonPath)
      ? (readJson(siteJsonPath) as Record<string, unknown>)
      : {};
    writeJson(siteJsonPath, {
      _comment: "Your basic info. Edit the values below, then run: npm run dev",
      template: (existing.template as string) || "terminal",
      components: (existing.components as Record<string, string>) || {},
      sections: existing.sections || [
        "hero", "bio", "skills", "newsDisplay", "selectedPublications",
        "journey", "mentorship", "talks", "teaching",
        "accomplishments", "contact", "footer"
      ],
      name: { full: "", first: "", nickname: "", last: "", display: "", authorVariants: [] },
      title: "",
      avatar: "avatar.jpg",
      terminal: { username: "user", rotatingSubtitles: [], skills: [], timezone: "America/New_York" },
      contact: { email: "", academicEmail: "", location: "" },
      social: { github: "", linkedin: "", googleScholar: "" },
      pets: [],
      features: existing.features || {
        publications: true,
        projects: true,
        articles: true,
        experience: true,
        news: true,
        pets: false,
        guide: true,
      },
      heroSocialIcons: [],
      selectedPublicationIds: [],
    });

    // Reset zh site.json if exists
    const zhSiteJsonPath = path.join(CONTENT_DIR, "zh", "site.json");
    if (fs.existsSync(zhSiteJsonPath)) {
      fs.unlinkSync(zhSiteJsonPath);
    }

    return {
      content: [
        {
          type: "text" as const,
          text: "All content has been reset to defaults (both en and zh). Ready for fresh content generation.",
        },
      ],
    };
  }
);

// ── Resources ───────────────────────────────────────────────────────

server.resource(
  "site-config",
  "termhub://config/site",
  async () => {
    const siteJsonPath = path.join(CONTENT_DIR, "site.json");
    if (!fs.existsSync(siteJsonPath)) {
      return { contents: [{ uri: "termhub://config/site", text: "{}", mimeType: "application/json" }] };
    }
    return {
      contents: [
        {
          uri: "termhub://config/site",
          text: fs.readFileSync(siteJsonPath, "utf-8"),
          mimeType: "application/json",
        },
      ],
    };
  }
);

server.resource(
  "schema",
  "termhub://schema/types",
  async () => {
    const content = fs.existsSync(TYPES_FILE) ? fs.readFileSync(TYPES_FILE, "utf-8") : "";
    return {
      contents: [
        {
          uri: "termhub://schema/types",
          text: content,
          mimeType: "text/typescript",
        },
      ],
    };
  }
);

// ── Start Server ────────────────────────────────────────────────────

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("TermHub MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
