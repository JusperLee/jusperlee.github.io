// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Site configuration — imports from content/site.json
 *
 * Users edit content/site.json (pure JSON, no code needed).
 * This file computes derived values used by components.
 */

import siteJson from '@content/site.json'
import siteJsonZh from '@content/zh/site.json'

// ═══════════════════════════════════════════════════════════════
// The config object — mirrors content/site.json
// ═══════════════════════════════════════════════════════════════

export const siteConfig = siteJson
export const siteConfigZh = siteJsonZh

/** Get site config for a given language */
export function getLocalizedSiteConfig(lang: string) {
  return lang === 'zh' ? siteConfigZh : siteJson
}

// ═══════════════════════════════════════════════════════════════
// Derived values — computed automatically, do NOT edit
// ═══════════════════════════════════════════════════════════════

/** GitHub username extracted from URL */
export const githubUsername = siteConfig.social.github.split('/').pop() ?? ''

/** Selected publication IDs as a Set for fast lookup */
export const selectedPublicationIds = new Set<string>(siteConfig.selectedPublicationIds)

/** Auto-generated navigation from enabled features */
export const navItems = [
  { path: '/', labelKey: 'nav.home' },
  ...(siteConfig.features.publications ? [{ path: '/publications', labelKey: 'nav.publications' }] : []),
  ...(siteConfig.features.experience ? [{ path: '/experience', labelKey: 'nav.experience' }] : []),
  ...(siteConfig.features.projects ? [{ path: '/projects', labelKey: 'nav.projects' }] : []),
  ...(siteConfig.features.articles ? [{ path: '/articles', labelKey: 'nav.articles' }] : []),
  ...(siteConfig.features.guide !== false ? [{ path: '/guide', labelKey: 'nav.guide' }] : []),
] as const

/** Hero social icons with resolved URLs from social config */
export const heroSocialIcons = (siteConfig.heroSocialIcons ?? []).map(item => ({
  icon: item.icon,
  label: item.label,
  color: item.color,
  href: (siteConfig.social as Record<string, string>)[item.platform] ?? '',
}))

/**
 * Backward-compatible `siteOwner` — components import this shape.
 */
export const siteOwner = {
  name: siteConfig.name,
  terminalUsername: siteConfig.terminal.username,
  rotatingSubtitles: siteConfig.terminal.rotatingSubtitles,
  contact: {
    email: siteConfig.contact.email,
    academicEmail: siteConfig.contact.academicEmail,
    hiringEmail: siteConfig.contact.hiringEmail,
    location: siteConfig.contact.location,
    linkedin: siteConfig.social.linkedin,
  },
  social: siteConfig.social,
  timezone: siteConfig.terminal.timezone,
  skills: siteConfig.terminal.skills,
  pets: (siteConfig.pets ?? []) as { name: string; emoji: string; image: string; title: string; description: string }[],
} as const

/** Build a siteOwner-like object for a given language */
export function getLocalizedSiteOwner(lang: string) {
  const cfg = getLocalizedSiteConfig(lang)
  return {
    name: cfg.name,
    terminalUsername: cfg.terminal.username,
    rotatingSubtitles: cfg.terminal.rotatingSubtitles,
    contact: {
      email: cfg.contact.email,
      academicEmail: cfg.contact.academicEmail,
      hiringEmail: cfg.contact.hiringEmail,
      location: cfg.contact.location,
      linkedin: cfg.social.linkedin,
    },
    social: cfg.social,
    timezone: cfg.terminal.timezone,
    skills: cfg.terminal.skills,
    pets: (cfg.pets ?? []) as { name: string; emoji: string; image: string; title: string; description: string }[],
  }
}
