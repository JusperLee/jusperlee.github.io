// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Component slot definitions.
 *
 * Each slot has a well-defined props interface.
 * Templates provide default implementations; users can
 * override individual slots via `components` in site.json.
 */

import type { NewsItem } from '../types'

/* ── Slot prop interfaces ──────────────────────────────────── */

export interface NavbarSlotProps {
  children?: React.ReactNode
}

export interface HeroSlotProps {
  title: string
  avatar: string
  research?: { lab: string; emoji: string; advisor?: string; focus: string; link: string }[]
  researchLogos?: Record<string, string>
  education?: { course: string; institution: string; year: string }[]
  educationLogos?: Record<string, string>
}

export interface FooterSlotProps {}

export interface NewsDisplaySlotProps {
  news: NewsItem[]
  showHeader?: boolean
}

export interface AccomplishmentsSlotProps {}
export interface BioSlotProps {}
export interface SkillsSlotProps {}
export interface JourneySlotProps {}
export interface MentorshipSlotProps {}
export interface SelectedPublicationsSlotProps {}
export interface TalksSlotProps {}
export interface TeachingSlotProps {}
export interface ContactSlotProps {}

/* ── Slot map type ─────────────────────────────────────────── */

export interface ComponentSlots {
  navbar: React.ComponentType<NavbarSlotProps>
  hero: React.ComponentType<HeroSlotProps>
  footer: React.ComponentType<FooterSlotProps>
  newsDisplay: React.ComponentType<NewsDisplaySlotProps>
  accomplishments: React.ComponentType<AccomplishmentsSlotProps>
  bio: React.ComponentType<BioSlotProps>
  skills: React.ComponentType<SkillsSlotProps>
  journey: React.ComponentType<JourneySlotProps>
  mentorship: React.ComponentType<MentorshipSlotProps>
  selectedPublications: React.ComponentType<SelectedPublicationsSlotProps>
  talks: React.ComponentType<TalksSlotProps>
  teaching: React.ComponentType<TeachingSlotProps>
  contact: React.ComponentType<ContactSlotProps>
}

export type SlotName = keyof ComponentSlots

/**
 * Default section order for the home page.
 * Users can override via `"sections"` in site.json.
 */
export const DEFAULT_SECTIONS: SlotName[] = [
  'hero',
  'bio',
  'newsDisplay',
  'selectedPublications',
  'journey',
  'skills',
  'mentorship',
  'talks',
  'teaching',
  'accomplishments',
  'contact',
  'footer',
]

/** Sections that are rendered as home page sections (not layout-level) */
export const SECTION_SLOTS: SlotName[] = [
  'hero', 'bio', 'skills', 'newsDisplay', 'selectedPublications',
  'journey', 'mentorship', 'talks', 'teaching', 'accomplishments',
  'contact', 'footer',
]
