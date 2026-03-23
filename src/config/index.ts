// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

// Re-export site config (primary config lives in src/site.config.ts)
export { siteOwner, siteConfig, githubUsername, heroSocialIcons, navItems } from '../site.config'

// Theme config
export {
  terminalPalette,
  buildCategoryThemes,
  articleCategoryLabels,
  articleCategoryColors,
  publicationVenueColors,
} from './theme'
export type { CatTheme } from './theme'
