// ============================================================
// Type definitions — developers only
//
// If you're just editing your portfolio content, you can
// IGNORE this file entirely. It's used internally by the
// template components for type safety.
// ============================================================

export interface NewsLink {
  text: string
  url: string
  icon?: string
}

export interface NewsItem {
  type: string
  badge: string
  icon: string
  iconColor: string
  title: string
  description: string
  date?: string
  emoji?: string
  sortDate?: string
  links: NewsLink[]
}

export interface Research {
  currentResearch: {
    lab: string
    emoji: string
    advisor?: string
    focus: string
    link: string
    institution?: string
  }[]
}

export interface Experience {
  education: {
    courses: {
      course: string
      institution: string
      year: string
    }[]
  }
  professional: {
    title: string
    company: string
    period: string
    description?: string
    isCurrent?: boolean
  }[]
  academic: {
    title: string
    organization: string
    period?: string
    description?: string
    isCurrent?: boolean
  }[]
  reviewing?: {
    venue: string
    role: string
  }[]
}

export type ExperienceCategory = 'research' | 'industry' | 'academic' | 'leadership'
export type RoleType = 'research' | 'mle' | 'sde' | 'teaching' | 'leadership'

export interface ExperienceEntry {
  title: string
  company: string
  companyUrl?: string
  location?: string
  start: string
  end?: string
  category: ExperienceCategory
  roleType?: RoleType
  summary?: string
  highlights: string[]
  isCurrent?: boolean
}

export interface JourneyPhase {
  period: string
  title: string
  org: string
  description: string
  tags?: string[]
}

export interface About {
  journey: string
  journeyPhases?: JourneyPhase[]
  mentorship?: {
    heading: string
    description?: string
    mentees: {
      name: string
      url: string
      note?: string
    }[]
  }
  version: {
    current: string
    history: {
      version: string
      title: string
      features: string[]
    }[]
  }
}

export interface ProjectLink {
  label: string
  url: string
}

export interface ProjectItem {
  title: string
  summary: string
  link?: string
  extraLinks?: ProjectLink[]
  tags: string[]
  date?: string
  category: 'robotics' | 'nlp' | 'web-app' | 'data' | 'tooling' | 'healthcare'
  highlights?: string[]
  featuredImage?: string
  isOpenSource?: boolean
  role?: 'independent' | 'lead' | 'tech-lead' | 'maintainer'
  story?: string
  badge?: string
  featured?: boolean
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  venue: string
  venueType: 'conference' | 'workshop' | 'demo' | 'preprint'
  year: number
  month?: string
  status: 'accepted' | 'published' | 'preprint'
  abstract?: string
  keywords?: string[]
  links: {
    paper?: string
    arxiv?: string
    projectPage?: string
    code?: string
    dataset?: string
    demo?: string
  }
  specialBadges?: string[]
  citations?: number
  isFirstAuthor?: boolean
  isCorrespondingAuthor?: boolean
  isCoFirst?: boolean
  coFirstAuthors?: string[]
  emoji?: string
  featuredImage?: string
}

export interface Award {
  title: string
  org?: string
  date: string
  kind?: 'grant' | 'hackathon' | 'travel' | 'scholarship' | 'honor' | 'employment' | 'competition' | 'innovation' | 'other'
  link?: string
  egg?: string
}

export interface Talk {
  title: string
  event: string
  date: string
  location?: string
  type?: 'keynote' | 'invited' | 'oral' | 'poster' | 'tutorial' | 'workshop' | 'panel' | 'other'
  description?: string
  slidesUrl?: string
  videoUrl?: string
  links?: { label: string; url: string }[]
}

export interface TeachingEntry {
  course: string
  institution: string
  semester: string
  role: 'instructor' | 'ta' | 'guest-lecturer' | 'co-instructor' | 'other'
  description?: string
  link?: string
}

export interface Skill {
  name: string
  category?: string
  level?: number
}
