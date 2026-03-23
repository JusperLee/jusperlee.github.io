/**
 * Vite plugin: transforms .md files with YAML frontmatter into JS modules.
 *
 * Input:  content/projects/my-project.md
 * Output: { ...frontmatter, body: '<p>rendered HTML</p>' }
 *
 * Usage in code:
 *   import project from '@content/projects/my-project.md'
 *   // project.title, project.tags, project.body (HTML string)
 */

import matter from 'gray-matter'
import { marked } from 'marked'
import type { Plugin } from 'vite'

export default function markdownPlugin(): Plugin {
  return {
    name: 'vite-plugin-markdown',
    transform(code: string, id: string) {
      if (!id.endsWith('.md')) return null

      const { data, content } = matter(code)
      const body = marked.parse(content.trim()) as string

      const result = { ...data, body }
      return {
        code: `export default ${JSON.stringify(result)}`,
        map: null,
      }
    },
  }
}
