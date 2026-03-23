// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Validation script for the Terminal Portfolio Template.
 * Checks for common configuration issues before building.
 *
 * Usage: node scripts/validate.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

let errors = 0
let warnings = 0

function pass(msg) {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`)
}

function fail(msg) {
  errors++
  console.log(`\x1b[31m✗\x1b[0m ${msg}`)
}

function warn(msg) {
  warnings++
  console.log(`\x1b[33m⚠\x1b[0m ${msg}`)
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJson(relPath) {
  const abs = resolve(ROOT, relPath)
  if (!existsSync(abs)) return null
  try {
    return JSON.parse(readFileSync(abs, 'utf-8'))
  } catch (e) {
    fail(`${relPath} is not valid JSON: ${e.message}`)
    return null
  }
}

// ---------------------------------------------------------------------------
// 1. content/site.json exists and is valid JSON
// ---------------------------------------------------------------------------

const site = readJson('content/site.json')
if (!site) {
  fail('content/site.json not found — run: npm run setup')
} else {
  pass('content/site.json found and valid')
}

// ---------------------------------------------------------------------------
// 2. Avatar file check
// ---------------------------------------------------------------------------

if (site?.avatar) {
  const avatarPath = `content/images/${site.avatar}`
  if (existsSync(resolve(ROOT, avatarPath))) {
    pass(`Avatar file found: ${avatarPath}`)
  } else {
    const baseName = site.avatar.replace(/\.[^.]+$/, '')
    const altExts = ['jpg', 'jpeg', 'png', 'svg', 'webp']
    const found = altExts.find((ext) =>
      existsSync(resolve(ROOT, `content/images/${baseName}.${ext}`))
    )
    if (found) {
      warn(
        `Avatar configured as "${site.avatar}" but found "${baseName}.${found}" — update content/site.json or rename the file`
      )
    } else {
      fail(`Avatar file missing: ${avatarPath} — place your avatar image in content/images/`)
    }
  }
}

// ---------------------------------------------------------------------------
// 3. .env file check
// ---------------------------------------------------------------------------

if (existsSync(resolve(ROOT, '.env'))) {
  pass('.env file found')
} else {
  warn('.env file missing — run: cp .env.example .env')
}

// ---------------------------------------------------------------------------
// 4. Example data check
// ---------------------------------------------------------------------------

if (site) {
  const siteStr = JSON.stringify(site)
  const examplePatterns = ['Alex Chen', 'example.com', 'example.edu']
  const found = examplePatterns.filter((p) => siteStr.includes(p))
  if (found.length > 0) {
    warn(`content/site.json still contains example data (${found.join(', ')})`)
  } else {
    pass('content/site.json has been personalized')
  }
}

// ---------------------------------------------------------------------------
// 5. All content JSON files are valid
// ---------------------------------------------------------------------------

const jsonFiles = [
  'experience.json', 'news.json',
  'awards.json', 'research.json', 'logos.json',
]

let validCount = 0
for (const file of jsonFiles) {
  const data = readJson(`content/${file}`)
  if (data !== null) validCount++
}

// Check that Markdown directories have content
const mdDirs = ['publications', 'projects', 'articles']
let mdCount = 0
for (const dir of mdDirs) {
  const dirPath = resolve(ROOT, 'content', dir)
  if (existsSync(dirPath)) mdCount++
}

const aboutMd = existsSync(resolve(ROOT, 'content', 'about.md'))
if (aboutMd) mdCount++

const totalExpected = jsonFiles.length + mdDirs.length + 1
const totalFound = validCount + mdCount

if (totalFound === totalExpected) {
  pass(`All ${totalExpected} content files/directories found`)
} else {
  // Individual errors already reported
}

// ---------------------------------------------------------------------------
// 6. Institution logo files check
// ---------------------------------------------------------------------------

const logos = readJson('content/logos.json')
if (logos) {
  const entries = Object.entries(logos)
  const missing = []

  for (const [name, logoPath] of entries) {
    if (logoPath === '/images/logos/placeholder.png' || logoPath === '/images/logos/placeholder.svg') {
      missing.push(name)
      continue
    }
    const absPath = resolve(ROOT, 'content', logoPath.replace(/^\//, ''))
    if (!existsSync(absPath)) {
      missing.push(name)
    }
  }

  if (missing.length === 0) {
    pass('All institution logos have matching files')
  } else if (missing.length === entries.length) {
    warn(`All ${missing.length} institutions use placeholder logos`)
  } else {
    warn(`${missing.length} institution(s) missing logo files (using placeholder)`)
  }
}

// ---------------------------------------------------------------------------
// 7. Selected publication IDs check
// ---------------------------------------------------------------------------

if (site?.selectedPublicationIds?.length > 0) {
  // Read publication IDs from Markdown frontmatter
  const pubDir = resolve(ROOT, 'content', 'publications')
  if (!existsSync(pubDir)) {
    warn('content/publications/ not found — skipping publication ID check')
  } else {
    const allIds = new Set()
    const pubFiles = readdirSync(pubDir).filter(f => f.endsWith('.md'))
    for (const file of pubFiles) {
      const content = readFileSync(resolve(pubDir, file), 'utf-8')
      const idMatch = content.match(/^id:\s*(.+)$/m)
      if (idMatch) allIds.add(idMatch[1].trim())
    }

    const invalid = site.selectedPublicationIds.filter((id) => !allIds.has(id))

    if (invalid.length === 0) {
      pass(`All ${site.selectedPublicationIds.length} selected publication ID(s) valid`)
    } else {
      fail(
        `Invalid selectedPublicationIds: ${invalid.join(', ')}\n  Available IDs: ${[...allIds].join(', ')}`
      )
    }
  }
} else {
  pass('No selectedPublicationIds configured (none to validate)')
}

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------

console.log('')
if (errors > 0) {
  console.log(`\x1b[31mValidation failed with ${errors} error(s) and ${warnings} warning(s)\x1b[0m`)
  process.exit(1)
} else if (warnings > 0) {
  console.log(`\x1b[33mValidation passed with ${warnings} warning(s)\x1b[0m`)
  process.exit(0)
} else {
  console.log(`\x1b[32mAll checks passed!\x1b[0m`)
  process.exit(0)
}
