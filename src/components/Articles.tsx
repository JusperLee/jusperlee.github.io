import React, { useMemo, useState, useEffect } from 'react'
import {
  Box, Collapse, Flex, HStack, Icon, Input, Link, Select, Text, VStack,
  useColorMode, useColorModeValue,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { IconType } from 'react-icons'
import {
  FaGithub, FaMedium, FaYoutube, FaExternalLinkAlt,
} from 'react-icons/fa'
import { SiZhihu, SiCsdn } from 'react-icons/si'
import { useTranslation } from 'react-i18next'
import type { ProjectItem } from '../types'
import { highlightData } from '../utils/highlightData'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { articleCategoryColors, terminalPalette } from '@/config/theme'

/* ── Keyframes ─────────────────────────────────────────────────── */
const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`

/* ── Types ─────────────────────────────────────────────────────── */
type CategoryFilter = ProjectItem['category'] | 'all'

/* ── Category config (from config/theme.ts) ──────────────────── */
const categoryColors = articleCategoryColors

/* ── Helpers ───────────────────────────────────────────────────── */
const linkIcon = (url: string): IconType => {
  if (!url) return FaExternalLinkAlt
  if (url.includes('github.com')) return FaGithub
  if (url.includes('medium.com')) return FaMedium
  if (url.includes('youtu.be') || url.includes('youtube.com')) return FaYoutube
  if (url.includes('zhihu.com')) return SiZhihu
  if (url.includes('csdn.net')) return SiCsdn
  return FaExternalLinkAlt
}

const fmtDate = (v?: string) => {
  if (!v) return ''
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

const getYear = (v?: string) => {
  if (!v) return ''
  return new Date(v).getFullYear().toString()
}

/** Known article-type tags — first match becomes the type label */
const typeTags = new Set([
  'tutorial', 'notes', 'case study', 'setup notes', 'troubleshooting',
  'guide', 'review', 'overview', 'deep dive', 'walkthrough',
])

const getArticleType = (tags?: string[]): string | null => {
  if (!tags) return null
  const found = tags.find(t => typeTags.has(t.toLowerCase()))
  return found ?? null
}

/* ── Component ─────────────────────────────────────────────────── */
const Articles: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { t } = useTranslation()
  const { articles: articleData, siteOwner } = useLocalizedData()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all')

  /* Terminal palette (centralized) */
  const tc = terminalPalette.colors(isDark)
  const termBg       = tc.bg
  const termText     = tc.text
  const termHeader   = tc.header
  const termBorder   = tc.border
  const termPrompt   = tc.prompt
  const termCommand  = tc.command
  const termParam    = tc.param
  const termInfo     = tc.info
  const termHighlight = tc.highlight
  const termSuccess  = tc.success
  const termSecondary = tc.secondary
  const termMuted    = tc.muted

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
  })

  const articles = useMemo(() =>
    articleData.map((a, i) => ({ ...a, id: `article-${i}` })),
  [articleData])

  const availableCategories = useMemo(() => {
    const set = new Set<ProjectItem['category']>()
    articles.forEach(e => set.add(e.category))
    return Array.from(set).sort((a, b) => a.localeCompare(b))
  }, [articles])

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    return articles
      .filter(e => {
        if (selectedCategory !== 'all' && e.category !== selectedCategory) return false
        if (!q) return true
        return [e.title, e.summary, e.tags?.join(' ')].filter(Boolean).some(t => t!.toLowerCase().includes(q))
      })
      .sort((a, b) => {
        const da = a.date ? Date.parse(a.date) : 0
        const db = b.date ? Date.parse(b.date) : 0
        return db - da
      })
  }, [articles, searchQuery, selectedCategory])

  const yearGroups = useMemo(() => {
    const map = new Map<string, typeof filteredArticles>()
    filteredArticles.forEach(a => {
      const y = getYear(a.date) || 'Unknown'
      if (!map.has(y)) map.set(y, [])
      map.get(y)!.push(a)
    })
    return Array.from(map.entries())
      .sort(([a], [b]) => a === 'Unknown' ? 1 : b === 'Unknown' ? -1 : Number(b) - Number(a))
  }, [filteredArticles])

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const promptPath = selectedCategory === 'all' ? '~' : `~/${selectedCategory}`

  return (
    <Box w="full" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={8}>
      <VStack spacing={6} maxW="1400px" mx="auto" px={[2, 4, 6]}>
        <Box
          w="full"
          borderRadius="md"
          fontFamily="mono"
          boxShadow={`0 0 0 1px ${termBorder}, 0 4px 16px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`}
          overflow="hidden"
        >
          {/* ═══ Pixel RGB light bar ═══ */}
          <Flex h="3px" w="full" overflow="hidden" borderTopRadius="md">
            {(() => {
              const palette = ['#bf616a','#d08770','#ebcb8b','#a3be8c','#88c0d0','#5e81ac','#b48ead']
              const total = 28
              const tick = Math.floor(currentTime.getTime() / 200)
              return Array.from({ length: total }, (_, i) => {
                const colorIdx = (i + tick) % palette.length
                const brightness = 0.6 + 0.4 * Math.abs(Math.sin((i + tick * 0.5) * 0.3))
                return <Box key={i} flex={1} h="full" bg={palette[colorIdx]} opacity={brightness} />
              })
            })()}
          </Flex>

          {/* ═══ Title bar ═══ */}
          <Flex
            bg={termHeader}
            px={4}
            py={2}
            color={termText}
            borderBottom={`1px solid ${termBorder}`}
            justify="space-between"
            align="center"
            fontSize="xs"
            fontWeight="medium"
          >
            <HStack spacing={3}>
              <HStack spacing={1.5}>
                <Box w="10px" h="10px" borderRadius="full" bg="#bf616a" />
                <Box w="10px" h="10px" borderRadius="full" bg="#ebcb8b" />
                <Box w="10px" h="10px" borderRadius="full" bg="#a3be8c" />
              </HStack>
              <Text>
                <Box as="span" color={termParam}>const </Box>
                <Box as="span" color={termPrompt} fontWeight="bold">articles</Box>
                <Box as="span" color={termSecondary}> = </Box>
                <Box as="span" color={termParam}>new </Box>
                <Box as="span" color={termCommand} fontWeight="bold">Reader</Box>
                <Box as="span" color={termSecondary}>(</Box>
                <Box as="span" color={termHighlight}>'blog'</Box>
                <Box as="span" color={termSecondary}>)</Box>
              </Text>
            </HStack>
            <Text color={termHighlight}>{formattedTime}</Text>
          </Flex>

          {/* ═══ Touch bar ═══ */}
          <Flex
            bg={tc.touchBar}
            px={4}
            py={1}
            borderBottom={`1px solid ${termBorder}`}
            fontSize="2xs"
            align="center"
            justify="space-between"
            overflow="hidden"
          >
            <Text color={termSecondary} isTruncated>
              <Text as="span" color={termPrompt} fontWeight="bold">{siteOwner.terminalUsername}</Text>
              <Text as="span" color={tc.border}> · </Text>
              <Text as="span" color={termHighlight}>{articles.length}</Text>
              <Text as="span"> {t('articles.technicalArticles')} </Text>
              <Text as="span" color={termCommand}>{availableCategories.length} {t('articles.domains')}</Text>
            </Text>
            <Text color={termInfo} flexShrink={0}>~/blog</Text>
          </Flex>

          {/* ═══ Toolbar ═══ */}
          <Flex
            px={4} py={2} bg={termBg} borderBottom={`1px solid ${termBorder}`}
            align="center" gap={2} fontSize="xs"
          >
            <Text color={termPrompt} flexShrink={0}>{siteOwner.terminalUsername}@blog:{promptPath}$</Text>
            <Input
              placeholder="grep -i '...'"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              size="xs" variant="unstyled" color={termText} fontFamily="mono"
              flex="1" minW="120px" _placeholder={{ color: termSecondary }}
            />
            <Select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value as CategoryFilter)}
              size="xs"
              w="130px"
              bg={isDark ? 'rgba(0,0,0,0.2)' : 'white'}
              border={`1px solid ${termBorder}`}
              color={termText}
              fontFamily="mono"
              borderRadius="sm"
            >
              <option value="all">{t('articles.allTopics')}</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{t(`categoryLabel.${c}`)}</option>
              ))}
            </Select>
          </Flex>

          {/* ═══ Content ═══ */}
          <Box
            bg={termBg}
            color={termText}
            maxH="70vh"
            overflowY="auto"
            sx={{
              '&::-webkit-scrollbar': { width: '6px', background: 'transparent' },
              '&::-webkit-scrollbar-thumb': { background: tc.border, borderRadius: '3px' },
            }}
          >
            <Box px={[3, 4, 5]} py={4}>
              {yearGroups.map(([year, items], gi) => (
                <Box key={year} mb={gi < yearGroups.length - 1 ? 6 : 0}>
                  {/* Year heading */}
                  <HStack spacing={2} mb={2} pl="2px">
                    <Text fontSize="2xs" fontFamily="mono" color={termHighlight}
                      fontWeight="semibold" letterSpacing="wide">
                      {year}
                    </Text>
                    <Box flex="1" h="1px" bg={termBorder} opacity={0.3} />
                    <Text fontSize="2xs" fontFamily="mono" color={termMuted}>
                      {items.length} {items.length === 1 ? t('articles.article') : t('articles.articles')}
                    </Text>
                  </HStack>

                  {/* Articles in year */}
                  <VStack spacing={0} align="stretch">
                    {items.map((item) => {
                      const ct = categoryColors[item.category]
                      const articleType = getArticleType(item.tags)
                      const resources: { label: string; url: string }[] = []
                      if (item.link) resources.push({ label: 'Source', url: item.link })
                      if (item.extraLinks) {
                        item.extraLinks.forEach(l => {
                          if (!resources.some(r => r.url === l.url))
                            resources.push({ label: l.label, url: l.url })
                        })
                      }
                      const isExpanded = expandedItems[item.id]

                      return (
                        <Box
                          key={item.id}
                          borderBottom={`1px dotted ${termBorder}`}
                          _hover={{ bg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
                        >
                          <Flex
                            py={3}
                            px={[0, 0.5]}
                            fontSize="sm"
                            align="center"
                            cursor="pointer"
                            onClick={() => toggleExpanded(item.id)}
                          >
                            {/* Date */}
                            <Text w={["70px", "90px"]} fontSize="xs" color={termHighlight} flexShrink={0}>
                              {fmtDate(item.date)}
                            </Text>

                            {/* Category badge */}
                            <Flex
                              align="center"
                              gap={1}
                              px={1.5}
                              py={0.5}
                              bg={ct.bg(isDark)}
                              color={ct.fg(isDark)}
                              borderRadius="sm"
                              fontSize="2xs"
                              fontWeight="bold"
                              textTransform="uppercase"
                              w={["60px", "80px"]}
                              flexShrink={0}
                              justifyContent="center"
                            >
                              {t(`categoryLabel.${item.category}`).split(' ')[0]}
                            </Flex>

                            {/* Title + type */}
                            <Box flex="1" px={[2, 3]} minW={0}>
                              <Text fontWeight="medium" color={termText} isTruncated>
                                {item.title}
                              </Text>
                              {articleType && (
                                <Text fontSize="2xs" color={termSecondary} mt={0.5}>
                                  {articleType}
                                </Text>
                              )}
                            </Box>

                            {/* Links (desktop) */}
                            <HStack spacing={1.5} display={["none", "flex"]} flexShrink={0}>
                              {resources.slice(0, 3).map(r => (
                                <Link key={r.url} href={r.url} isExternal
                                  onClick={e => e.stopPropagation()} _hover={{ textDecoration: 'none' }}>
                                  <Flex
                                    align="center" gap={1} px={2} py={0.5}
                                    borderRadius="sm" border="1px solid" borderColor={termBorder}
                                    color={termCommand} fontSize="2xs" fontFamily="mono"
                                    whiteSpace="nowrap"
                                    transition="all 0.15s"
                                    _hover={{ borderColor: ct.fg(isDark), color: ct.fg(isDark) }}
                                  >
                                    <Icon as={linkIcon(r.url)} boxSize="10px" />
                                    <Text>{r.label}</Text>
                                  </Flex>
                                </Link>
                              ))}
                            </HStack>

                            {/* Expand */}
                            <Flex w="40px" justify="center" flexShrink={0}>
                              <Box
                                color={isExpanded ? termInfo : termCommand}
                                fontWeight="bold"
                                fontSize="xs"
                              >
                                {isExpanded ? '[-]' : '[+]'}
                              </Box>
                            </Flex>
                          </Flex>

                          {/* Expanded details */}
                          <Collapse in={isExpanded} animateOpacity>
                            <Box
                              px={[3, 4, 8]}
                              py={3}
                              bg={isDark ? 'rgba(76,86,106,0.1)' : 'rgba(203,213,225,0.15)'}
                              borderLeft={`2px solid ${ct.fg(isDark)}`}
                            >
                              {/* Summary */}
                              <Text fontSize="xs" color={termText} lineHeight="1.7" mb={2}>
                                {highlightData(item.summary, { num: termHighlight, kw: termCommand, str: termSuccess })}
                              </Text>

                              {/* Tags */}
                              {item.tags.length > 0 && (
                                <HStack spacing={1.5} flexWrap="wrap" mb={2}>
                                  {item.tags.map(t => (
                                    <Text key={t} fontSize="2xs" fontFamily="mono"
                                      color={termMuted} px={1.5} py={0.5}
                                      bg={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}
                                      borderRadius="sm">
                                      {t}
                                    </Text>
                                  ))}
                                </HStack>
                              )}

                              {/* All links (visible on all screens when expanded) */}
                              {resources.length > 0 && (
                                <Flex wrap="wrap" gap={2}>
                                  {resources.map(r => (
                                    <Link key={r.url} href={r.url} isExternal
                                      onClick={e => e.stopPropagation()} _hover={{ textDecoration: 'none' }}>
                                      <HStack
                                        spacing={1.5} px={2.5} py={1} borderRadius="sm"
                                        border="1px solid" borderColor={termBorder}
                                        color={termCommand} fontSize="xs" fontFamily="mono"
                                        transition="all 0.15s"
                                        _hover={{ borderColor: ct.fg(isDark), color: ct.fg(isDark) }}
                                      >
                                        <Icon as={linkIcon(r.url)} boxSize="11px" />
                                        <Text>{r.label}</Text>
                                      </HStack>
                                    </Link>
                                  ))}
                                </Flex>
                              )}
                            </Box>
                          </Collapse>
                        </Box>
                      )
                    })}
                  </VStack>
                </Box>
              ))}
            </Box>

            {/* Empty state */}
            {filteredArticles.length === 0 && (
              <Box px={4} py={8} textAlign="center">
                <Text color={termHighlight} fontSize="sm">{t('articles.noMatches')}</Text>
                <Text color={termSecondary} fontSize="xs" mt={1}>{t('articles.tryAdjustingFilter')}</Text>
              </Box>
            )}
          </Box>

          {/* ═══ Status bar ═══ */}
          <Flex
            px={4} py={1.5} bg={termHeader} borderTop={`1px solid ${termBorder}`}
            align="center" justify="space-between" fontSize="2xs" color={termMuted}
          >
            <Text>
              {filteredArticles.length}/{articles.length} {t('articles.shown')}
            </Text>
            <HStack spacing={1}>
              <Text color={termPrompt}>{siteOwner.terminalUsername}@blog:{promptPath}$</Text>
              <Box w="6px" h="11px" bg={termPrompt} sx={{ animation: `${blink} 1s step-end infinite` }} />
            </HStack>
          </Flex>
        </Box>
      </VStack>
    </Box>
  )
}

export default Articles
