#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Terminal Portfolio Template — Interactive Setup Wizard
 *
 * Generates content/site.json from user input.
 * Uses only built-in Node.js modules. Safe to run multiple times.
 *
 * Usage:  npm run setup
 */

import readline from 'node:readline'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ── Helpers ──────────────────────────────────────────────────────

function rl() {
  return readline.createInterface({ input: process.stdin, output: process.stdout })
}

function ask(iface, question, defaultValue) {
  const suffix = defaultValue ? ` [${defaultValue}]` : ''
  return new Promise((resolve) => {
    iface.question(`  ${question}${suffix}: `, (answer) => {
      resolve(answer.trim() || defaultValue || '')
    })
  })
}

function banner() {
  console.log()
  console.log('  ╔═══════════════════════════════════════════════════════╗')
  console.log('  ║        Terminal Portfolio Template — Setup Wizard     ║')
  console.log('  ╠═══════════════════════════════════════════════════════╣')
  console.log('  ║  This wizard generates content/site.json with your   ║')
  console.log('  ║  personal info. Press Enter to accept defaults.      ║')
  console.log('  ╚═══════════════════════════════════════════════════════╝')
  console.log()
}

function sectionHeader(title) {
  console.log()
  console.log(`  ── ${title} ${'─'.repeat(Math.max(0, 48 - title.length))}`)
  console.log()
}

// ── Build site.json ──────────────────────────────────────────────

function buildSiteJson(a) {
  return {
    _comment: 'Your basic info. Edit the values below, then run: npm run dev',

    name: {
      full: a.fullName,
      first: a.firstName,
      nickname: a.nickname,
      last: a.lastName,
      display: a.fullName,
      authorVariants: [a.fullName],
    },

    title: `Hi there, I'm ${a.fullName}`,
    avatar: a.avatar,

    terminal: {
      username: a.terminalUser,
      rotatingSubtitles: [
        'build cool projects',
        'write some code',
        'explore AI research',
        'share knowledge',
        'learn new things',
      ],
      skills: [
        'Python', 'TypeScript', 'Go', 'PyTorch',
        'React', 'ROS2', 'Docker', 'Kubernetes',
      ],
      timezone: 'America/Los_Angeles',
    },

    contact: {
      email: a.email,
      academicEmail: a.email,
      hiringEmail: a.email,
      location: a.location,
    },

    social: {
      github: a.github,
      linkedin: a.linkedin,
      medium: '',
      googleScholar: '',
      twitter: '',
      youtube: '',
      bilibili: '',
      zhihu: '',
      csdn: '',
      blog: '',
    },

    pets: [],

    features: {
      publications: true,
      projects: true,
      articles: true,
      experience: true,
      news: true,
      pets: false,
      guide: false,
    },

    heroSocialIcons: [
      { platform: 'github', icon: 'FaGithub', label: 'GitHub', color: '#333' },
      { platform: 'linkedin', icon: 'FaLinkedin', label: 'LinkedIn', color: '#0A66C2' },
    ],

    selectedPublicationIds: [],
  }
}

// ── Main ─────────────────────────────────────────────────────────

async function main() {
  banner()

  const iface = rl()

  // ── Identity ──────────────────────────────────────────────────
  sectionHeader('Identity')

  const fullName = await ask(iface, 'Full name', 'Alex Chen')
  const nameParts = fullName.split(/\s+/)
  const defaultFirst = nameParts[0]
  const defaultLast = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0]

  const firstName = await ask(iface, 'First name', defaultFirst)
  const lastName = await ask(iface, 'Last name', defaultLast)
  const nickname = await ask(iface, 'Nickname', firstName)

  // ── Contact ───────────────────────────────────────────────────
  sectionHeader('Contact')

  const email = await ask(iface, 'Email', '')
  const location = await ask(iface, 'Location (e.g. "Portland, OR, USA")', 'Portland, OR, USA')

  // ── Social Links ──────────────────────────────────────────────
  sectionHeader('Social Links')

  const github = await ask(iface, 'GitHub URL', 'https://github.com/username')
  const linkedin = await ask(iface, 'LinkedIn URL', '')

  // ── Terminal ──────────────────────────────────────────────────
  sectionHeader('Terminal Settings')

  const terminalUser = await ask(iface, 'Terminal username', firstName.toLowerCase())
  const avatar = await ask(iface, 'Avatar filename (in content/images/)', 'avatar.jpg')

  iface.close()

  const answers = {
    fullName, firstName, lastName, nickname,
    email, location, github, linkedin,
    terminalUser, avatar,
  }

  // ── Write content/site.json ─────────────────────────────────
  const contentDir = path.join(ROOT, 'content')
  fs.mkdirSync(contentDir, { recursive: true })

  const configPath = path.join(contentDir, 'site.json')
  const configContent = JSON.stringify(buildSiteJson(answers), null, 2) + '\n'
  fs.writeFileSync(configPath, configContent, 'utf-8')

  console.log()
  console.log(`  [ok] Generated ${path.relative(ROOT, configPath)}`)

  // ── Create .env from .env.example if needed ───────────────────
  const envPath = path.join(ROOT, '.env')
  const envExamplePath = path.join(ROOT, '.env.example')

  if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath)
    console.log(`  [ok] Created .env from .env.example`)
  } else if (fs.existsSync(envPath)) {
    console.log(`  [--] .env already exists — skipped`)
  }

  // ── What's next ───────────────────────────────────────────────
  console.log()
  console.log('  ╔═══════════════════════════════════════════════════════╗')
  console.log('  ║                     What\'s Next?                      ║')
  console.log('  ╠═══════════════════════════════════════════════════════╣')
  console.log('  ║                                                       ║')
  console.log('  ║  1. Edit your content in the content/ folder:         ║')
  console.log('  ║     - site.json          (your info — just done!)     ║')
  console.log('  ║     - projects/*.md      (portfolio projects)         ║')
  console.log('  ║     - publications/*.md  (papers & research)          ║')
  console.log('  ║     - articles/*.md      (blog posts)                 ║')
  console.log('  ║     - about.md           (about page bio)             ║')
  console.log('  ║     - experience.json    (work & education)           ║')
  console.log('  ║     - news.json          (announcements)              ║')
  console.log('  ║     - awards.json        (awards & honors)            ║')
  console.log('  ║                                                       ║')
  console.log('  ║  2. Place your avatar in content/images/avatar.jpg    ║')
  console.log('  ║                                                       ║')
  console.log('  ║  3. Run:  npm run dev                                 ║')
  console.log('  ║                                                       ║')
  console.log('  ╚═══════════════════════════════════════════════════════╝')
  console.log()
}

main().catch((err) => {
  console.error('Setup failed:', err.message)
  process.exit(1)
})
