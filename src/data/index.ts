// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

// ============================================================
// Data loader (bilingual)
//
// Loads content from two sources per language:
//   - Markdown files (content/**/*.md, content/zh/**/*.md)
//   - JSON files (content/*.json, content/zh/*.json)
//
// At build time, both languages are loaded eagerly.
// At runtime, getLocalizedData(lang) selects the right set.
// ============================================================

import type {
  Research, Experience, NewsItem, About, Publication,
  ProjectItem, Award, ExperienceEntry, Talk, TeachingEntry,
} from '../types'

// ── Markdown glob imports (each .md → { frontmatter..., body: html }) ──

// English (default)
const projectMdsEn = import.meta.glob('/content/projects/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const articleMdsEn = import.meta.glob('/content/articles/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const publicationMdsEn = import.meta.glob('/content/publications/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const aboutMdEn = import.meta.glob('/content/about.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>

// Chinese
const projectMdsZh = import.meta.glob('/content/zh/projects/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const articleMdsZh = import.meta.glob('/content/zh/articles/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const publicationMdsZh = import.meta.glob('/content/zh/publications/*.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>
const aboutMdZh = import.meta.glob('/content/zh/about.md', { eager: true }) as Record<string, { default: Record<string, unknown> }>

function collectMd(modules: Record<string, { default: Record<string, unknown> }>): Record<string, unknown>[] {
  return Object.values(modules).map(m => {
    const { body, ...frontmatter } = m.default
    return { ...frontmatter, _body: body }
  })
}

// Convert Markdown body into the fields components expect
function mdToProject(raw: Record<string, unknown>): ProjectItem {
  const { _body, ...rest } = raw
  const bodyStr = (_body as string) || ''

  const highlights: string[] = []
  const lines = bodyStr.replace(/<[^>]+>/g, '').split('\n')
  for (const line of lines) {
    const m = line.match(/^[-*]\s+(.+)/)
    if (m) highlights.push(m[1].trim())
  }

  const summary = lines
    .filter(l => l.trim() && !l.match(/^[-*#]/) && !l.match(/^</))
    .map(l => l.trim())
    .join(' ')

  return {
    summary,
    highlights: highlights.length > 0 ? highlights : undefined,
    ...rest,
  } as unknown as ProjectItem
}

function mdToPublication(raw: Record<string, unknown>): Publication {
  const { _body, ...rest } = raw
  const bodyStr = (_body as string) || ''
  const abstract = bodyStr.replace(/<[^>]+>/g, '').trim()
  return { abstract, ...rest } as unknown as Publication
}

function mdToAbout(raw: Record<string, unknown>): About {
  const { _body, ...rest } = raw
  const bodyStr = (_body as string) || ''
  const journey = bodyStr.replace(/<[^>]+>/g, '').trim()
  return { journey, ...rest } as unknown as About
}

// ── JSON imports (both languages) ──

import experienceJsonEn from '@content/experience.json'
import newsJsonEn from '@content/news.json'
import awardsJsonEn from '@content/awards.json'
import researchJsonEn from '@content/research.json'
import logosJsonEn from '@content/logos.json'
import siteJsonEn from '@content/site.json'
import talksJsonEn from '@content/talks.json'
import teachingJsonEn from '@content/teaching.json'

import experienceJsonZh from '@content/zh/experience.json'
import newsJsonZh from '@content/zh/news.json'
import awardsJsonZh from '@content/zh/awards.json'
import researchJsonZh from '@content/zh/research.json'
import logosJsonZh from '@content/zh/logos.json'
import siteJsonZh from '@content/zh/site.json'
import talksJsonZh from '@content/zh/talks.json'
import teachingJsonZh from '@content/zh/teaching.json'

// ── Build both language datasets ──

const enData = {
  projects: collectMd(projectMdsEn).map(mdToProject),
  articles: collectMd(articleMdsEn).map(mdToProject),
  publications: collectMd(publicationMdsEn).map(mdToPublication),
  about: mdToAbout(Object.values(aboutMdEn)[0]?.default ?? {}),
  research: researchJsonEn as Research,
  experience: { ...experienceJsonEn, professional: [], academic: [] } as Experience,
  experienceTimeline: experienceJsonEn.timeline as ExperienceEntry[],
  news: newsJsonEn as NewsItem[],
  awards: awardsJsonEn as Award[],
  talks: talksJsonEn as Talk[],
  teaching: teachingJsonEn as TeachingEntry[],
  institutionLogos: logosJsonEn as Record<string, string>,
  siteConfig: siteJsonEn,
}

const zhData = {
  projects: collectMd(projectMdsZh).map(mdToProject),
  articles: collectMd(articleMdsZh).map(mdToProject),
  publications: collectMd(publicationMdsZh).map(mdToPublication),
  about: mdToAbout(Object.values(aboutMdZh)[0]?.default ?? {}),
  research: researchJsonZh as Research,
  experience: { ...experienceJsonZh, professional: [], academic: [] } as Experience,
  experienceTimeline: experienceJsonZh.timeline as ExperienceEntry[],
  news: newsJsonZh as NewsItem[],
  awards: awardsJsonZh as Award[],
  talks: talksJsonZh as Talk[],
  teaching: teachingJsonZh as TeachingEntry[],
  institutionLogos: logosJsonZh as Record<string, string>,
  siteConfig: siteJsonZh,
}

const dataByLang: Record<string, typeof enData> = { en: enData, zh: zhData }

/** Get content data for a specific language (falls back to English) */
export function getLocalizedData(lang: string) {
  return dataByLang[lang] ?? enData
}

// ── Default exports (English, for backward compatibility) ──

export const projects = enData.projects
export const articles = enData.articles
export const publications = enData.publications
export const about = enData.about
export const research = enData.research
export const experience = enData.experience
export const experienceTimeline = enData.experienceTimeline
export const news = enData.news
export const awards = enData.awards
export const talks = enData.talks
export const teaching = enData.teaching
export const institutionLogos = enData.institutionLogos

// ── Helper functions ──

export const getPublicationsByYear = (year: number) =>
  publications.filter(pub => pub.year === year)

export const getPublicationsByVenue = (venueType: string) =>
  publications.filter(pub => pub.venueType === venueType)

export const getFirstAuthorPublications = () =>
  publications.filter(pub => pub.isFirstAuthor)

export const getPublicationStats = () => {
  const stats = {
    total: publications.length,
    byYear: {} as Record<number, number>,
    byVenue: {} as Record<string, number>,
    firstAuthor: 0,
    correspondingAuthor: 0,
    withCode: 0,
    withDataset: 0,
  }
  publications.forEach(pub => {
    stats.byYear[pub.year] = (stats.byYear[pub.year] || 0) + 1
    stats.byVenue[pub.venueType] = (stats.byVenue[pub.venueType] || 0) + 1
    if (pub.isFirstAuthor) stats.firstAuthor++
    if (pub.isCorrespondingAuthor) stats.correspondingAuthor++
    if (pub.links.code) stats.withCode++
    if (pub.links.dataset) stats.withDataset++
  })
  return stats
}
