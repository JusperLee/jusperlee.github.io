import React, { useState, useMemo } from 'react'
import {
  Box, Collapse, Flex, HStack, Icon, Input, Text, VStack,
  Image, Link, useColorMode, useBreakpointValue,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { FaChevronDown } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import type { RoleType } from '../types'
import { highlightData } from '../utils/highlightData'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { terminalPalette } from '@/config/theme'

/* ── Keyframes ─────────────────────────────────────────────────── */
const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`

/* ── Types & config ────────────────────────────────────────────── */
type FilterType = 'all' | 'academic' | 'industry'

const categoryFilter: Record<string, FilterType> = {
  academic: 'academic', research: 'academic',
  industry: 'industry', leadership: 'academic',
}

const roleTypeConfig: Record<RoleType, { labelKey: string; color: (dk: boolean) => string }> = {
  research:   { labelKey: 'experience.roleResearch',   color: dk => dk ? '#b48ead' : '#9a56a2' },
  mle:        { labelKey: 'experience.roleMLE',        color: dk => dk ? '#88c0d0' : '#2a769c' },
  sde:        { labelKey: 'experience.roleSDE',        color: dk => dk ? '#d08770' : '#b35a2e' },
  teaching:   { labelKey: 'experience.roleTeaching',   color: dk => dk ? '#a3be8c' : '#34744e' },
  leadership: { labelKey: 'experience.roleLeadership', color: dk => dk ? '#ebcb8b' : '#c47d46' },
}

/* ── Logos helper ────────────────────────────────────────────── */
const getIconUrl = (url?: string, company?: string, logos?: Record<string, string>) => {
  if (company && logos?.[company]) return logos[company]
  if (url) {
    try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=64` }
    catch { /* fall through */ }
  }
  return null
}

/* ── Helpers ────────────────────────────────────────────────────── */
// fmtDate is called inside the component where t() is available
const fmtDateFn = (v: string | undefined, presentLabel: string, lang: string) => {
  if (!v) return presentLabel
  if (v.toLowerCase() === 'present') return presentLabel
  const d = new Date(v)
  if (Number.isNaN(d.getTime())) return v
  return d.toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', year: 'numeric' })
}

/* ── Component ─────────────────────────────────────────────────── */
const Experience: React.FC = () => {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const isMobile = useBreakpointValue({ base: true, md: false })
  const { t, i18n } = useTranslation()
  const { experienceTimeline, experience: experienceData, institutionLogos, siteOwner } = useLocalizedData()
  const fmtDate = (v?: string) => fmtDateFn(v, t('experience.present'), i18n.language)

  const [filter, setFilter] = useState<FilterType>('all')
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})
  const [command, setCommand] = useState('')
  const [cmdOutput, setCmdOutput] = useState<string[]>([])

  /* Palette (centralized) */
  const tc = terminalPalette.colors(isDark)
  const bg = isDark ? 'gray.900' : 'gray.50'
  const termBg = tc.bg
  const termText = tc.text
  const termHeader = tc.header
  const termBorder = tc.border
  const termPrompt = tc.prompt
  const termCommand = tc.command
  const termInfo = tc.info
  const termHighlight = tc.highlight
  const termSuccess = tc.success
  const termSecondary = tc.secondary
  const hoverBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'
  const hlc = { num: termHighlight, kw: termCommand, str: termSuccess }

  /* ── Data ──────────────────────────────────────────────────── */
  const sorted = useMemo(() => {
    return experienceTimeline
      .map(e => ({ ...e, isCurrent: !e.end || e.end.toLowerCase() === 'present' }))
      .sort((a, b) => {
        if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1
        return new Date(b.start).getTime() - new Date(a.start).getTime()
      })
  }, [experienceTimeline])

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted
    return sorted.filter(e => categoryFilter[e.category] === filter)
  }, [sorted, filter])

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>()
    for (const e of filtered) {
      const key = e.isCurrent ? 'Present' : new Date(e.end!).getFullYear().toString()
      const list = map.get(key) ?? []
      list.push(e)
      map.set(key, list)
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => {
        if (a === 'Present') return -1
        if (b === 'Present') return 1
        return Number(b) - Number(a)
      })
      .map(([year, items]) => ({
        year,
        items: items.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime()),
      }))
  }, [filtered])

  const stats = useMemo(() => {
    const current = sorted.filter(e => e.isCurrent).length
    const academic = sorted.filter(e => categoryFilter[e.category] === 'academic').length
    const industry = sorted.filter(e => categoryFilter[e.category] === 'industry').length
    return { total: sorted.length, current, academic, industry }
  }, [sorted])

  const education = experienceData.education.courses
  const reviewingItems = experienceData.reviewing ?? []
  const reviewingByYear = useMemo(() => {
    const groups: Record<string, typeof reviewingItems> = {}
    for (const item of reviewingItems) {
      const m = item.venue.match(/\b(20\d{2})\b/)
      const y = m ? m[1] : 'Other'
      if (!groups[y]) groups[y] = []
      groups[y].push(item)
    }
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
  }, [reviewingItems])

  const toggleExpanded = (id: string) =>
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }))

  /* ── Command handler ───────────────────────────────────────── */
  const handleCommand = (cmd: string) => {
    const raw = cmd.trim()
    if (!raw) return
    const parts = raw.toLowerCase().split(' ')
    const out = (lines: string[]) => setCmdOutput(lines)
    switch (parts[0]) {
      case 'filter':
        if (parts[1] === 'academic' || parts[1] === 'industry') {
          setFilter(parts[1]); out([`filter: ${parts[1]}`])
        } else { setFilter('all'); out(['filter: all']) }
        break
      case 'clear': setFilter('all'); setCmdOutput([]); break
      case 'whoami': out([siteOwner.name.full, 'researcher · ml engineer · builder']); break
      case 'help': out([
        'filter [all|academic|industry]  clear  whoami',
        'sudo hire-me  cat skills',
      ]); break
      case 'sudo':
        if (parts.slice(1).join(' ') === 'hire-me')
          out(['initiating hire sequence...', `Email: ${siteOwner.contact.hiringEmail}`, 'Status: Open to opportunities!'])
        else out([`sudo: ${parts.slice(1).join(' ')}: permission denied`])
        break
      case 'cat':
        if (parts[1] === 'skills') out([
          siteOwner.skills.join(' · '),
        ])
        else out([`cat: ${parts[1] || ''}: not found`])
        break
      default: out([`bash: ${parts[0]}: command not found`])
    }
    setCommand('')
  }

  const termParam = tc.param
  const termWarning = tc.warning

  return (
    <Box w="full" minH="100vh" bg={bg} py={8}>
      <VStack spacing={6} maxW="1400px" mx="auto" px={[2, 4, 6]}>

        {/* ── Terminal container ────────────────────────────── */}
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
              const total = 28
              const tick = Math.floor(Date.now() / 200)
              return Array.from({ length: total }, (_, i) => {
                const colorIdx = (i + tick) % terminalPalette.rainbow.length
                const brightness = 0.6 + 0.4 * Math.abs(Math.sin((i + tick * 0.5) * 0.3))
                return <Box key={i} flex={1} h="full" bg={terminalPalette.rainbow[colorIdx]} opacity={brightness} />
              })
            })()}
          </Flex>

          {/* ═══ Title bar ═══ */}
          <Flex
            bg={termHeader} px={4} py={2}
            borderBottom={`1px solid ${termBorder}`}
            justify="space-between" align="center"
            fontSize="xs" fontWeight="medium"
          >
            <HStack spacing={3}>
              <HStack spacing={1.5}>
                <Box w="10px" h="10px" borderRadius="full" bg="#bf616a" />
                <Box w="10px" h="10px" borderRadius="full" bg="#ebcb8b" />
                <Box w="10px" h="10px" borderRadius="full" bg="#a3be8c" />
              </HStack>
              <Text>
                <Box as="span" color={termParam}>const </Box>
                <Box as="span" color={termPrompt} fontWeight="bold">career</Box>
                <Box as="span" color={termSecondary}> = </Box>
                <Box as="span" color={termParam}>new </Box>
                <Box as="span" color={termCommand} fontWeight="bold">Explorer</Box>
                <Box as="span" color={termSecondary}>(</Box>
                <Box as="span" color={termHighlight}>'experience'</Box>
                <Box as="span" color={termSecondary}>)</Box>
              </Text>
            </HStack>
            <Text color={termHighlight}>
              {new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </Text>
          </Flex>

          {/* ═══ Touch bar ═══ */}
          <Flex
            bg={tc.touchBar}
            px={4} py={1}
            borderBottom={`1px solid ${termBorder}`}
            fontSize="2xs" align="center"
            justify="space-between" overflow="hidden"
          >
            <Text color={termSecondary} isTruncated>
              <Text as="span" color={termPrompt} fontWeight="bold">{siteOwner.terminalUsername}</Text>
              <Text as="span" color={tc.border}> · </Text>
              <Text as="span" color={termHighlight}>{stats.total}</Text>
              <Text as="span"> {t('experience.rolesAcross')} </Text>
              <Text as="span" color={termSuccess}>{stats.current} {t('experience.currentlyActive')}</Text>
              <Text as="span" color={tc.border}> · </Text>
              <Text as="span" color={termParam}>{stats.academic} {t('experience.research')}</Text>
              <Text as="span">, </Text>
              <Text as="span" color={termWarning}>{stats.industry} {t('experience.industry')}</Text>
            </Text>
            <Text color={termCommand} flexShrink={0}>~/career</Text>
          </Flex>

          {/* Education */}
          <Box px={[3, 5]} py={3} bg={termBg} borderBottom={`1px solid ${termBorder}`}>
            <Flex align="center" gap={2} mb={2.5}>
              <Box w="14px" h="3px" borderRadius="full" bg={termCommand} />
              <Text fontSize="xs" fontWeight="bold" color={termInfo} letterSpacing="0.06em">{t('experience.education')}</Text>
              <Box flex="1" h="1px" bg={termBorder} />
            </Flex>
            <VStack align="stretch" spacing={1.5} pl={1}>
              {education.map(edu => {
                const logo = institutionLogos[edu.institution]
                return (
                  <HStack key={edu.course} fontSize="xs" spacing={2}>
                    {logo ? (
                      <Image src={logo} alt="" w="16px" h="16px" borderRadius="sm" objectFit="contain" flexShrink={0} />
                    ) : (
                      <Box w="16px" h="16px" borderRadius="sm" bg={`${termCommand}20`} flexShrink={0} />
                    )}
                    <Text color={termText} fontWeight="medium">{edu.course}</Text>
                    <Text color={termSecondary}>·</Text>
                    <Text color={termCommand}>{edu.institution}</Text>
                    <Text color={termSecondary} ml="auto" flexShrink={0}>{edu.year}</Text>
                  </HStack>
                )
              })}
            </VStack>
          </Box>

          {/* Filter bar */}
          <Flex
            px={[3, 5]} py={2}
            bg={termBg}
            borderBottom={`1px solid ${termBorder}`}
            gap={1.5}
            align="center"
          >
            {(['all', 'academic', 'industry'] as FilterType[]).map(f => {
              const active = filter === f
              const count = f === 'all' ? stats.total : f === 'academic' ? stats.academic : stats.industry
              return (
                <Text
                  key={f}
                  as="button"
                  px={3} py={1}
                  fontSize="xs"
                  fontWeight={active ? 'bold' : 'medium'}
                  borderRadius="full"
                  bg={active ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)') : 'transparent'}
                  color={active ? termText : termSecondary}
                  onClick={() => setFilter(f)}
                  cursor="pointer"
                  transition="all 0.15s"
                  _hover={{ bg: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }}
                >
                  {f === 'all' ? t('experience.filterAll') : f === 'academic' ? t('experience.filterAcademic') : t('experience.filterIndustry')} ({count})
                </Text>
              )
            })}
          </Flex>

          {/* ── Experience list ───────────────────────────── */}
          <Box bg={termBg} color={termText}>
            {grouped.map(group => (
              <Box key={group.year}>
                {/* Year heading */}
                <Flex
                  px={[3, 5]} py={2}
                  align="center" gap={2}
                  bg={isDark ? 'rgba(0,0,0,0.12)' : 'rgba(0,0,0,0.03)'}
                  borderBottom={`1px solid ${termBorder}`}
                >
                  <Box
                    w="8px" h="8px"
                    borderRadius="full"
                    border="2px solid"
                    borderColor={group.year === 'Present' ? termSuccess : termHighlight}
                    bg={group.year === 'Present' ? termSuccess : 'transparent'}
                  />
                  <Text
                    fontSize="xs" fontWeight="bold"
                    color={group.year === 'Present' ? termSuccess : termHighlight}
                    letterSpacing="0.04em"
                  >
                    {group.year === 'Present' ? t('experience.present').toUpperCase() : group.year}
                  </Text>
                  <Text fontSize="2xs" color={termSecondary}>
                    {group.year === 'Present'
                      ? `${group.items.length} ${t('experience.active')}`
                      : `${group.items.length}`}
                  </Text>
                  <Box flex="1" h="1px" bg={termBorder} />
                </Flex>

                {/* Entries */}
                {group.items.map(exp => {
                  const id = `${exp.title}-${exp.company}-${exp.start}`
                  const isExpanded = !!expandedItems[id]
                  const rt: RoleType = exp.roleType ?? (categoryFilter[exp.category] === 'industry' ? 'sde' : 'research')
                  const rtCfg = roleTypeConfig[rt]
                  const rtColor = rtCfg.color(isDark)
                  const icon = getIconUrl(exp.companyUrl, exp.company, institutionLogos)

                  return (
                    <Box
                      key={id}
                      borderBottom={`1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`}
                      _hover={{ bg: hoverBg }}
                      transition="background 0.15s"
                    >
                      <Flex
                        px={[3, 5]} py={3}
                        gap={3}
                        align="start"
                        cursor="pointer"
                        onClick={() => toggleExpanded(id)}
                      >
                        {/* Logo */}
                        <Box flexShrink={0} mt="2px">
                          {icon ? (
                            <Image
                              src={icon}
                              alt=""
                              w="32px" h="32px"
                              borderRadius="md"
                              objectFit="contain"
                              fallback={
                                <Flex
                                  w="32px" h="32px" borderRadius="md"
                                  bg={`${rtColor}18`} color={rtColor}
                                  align="center" justify="center"
                                  fontSize="sm" fontWeight="bold"
                                >
                                  {exp.company.charAt(0)}
                                </Flex>
                              }
                            />
                          ) : (
                            <Flex
                              w="32px" h="32px" borderRadius="md"
                              bg={`${rtColor}18`} color={rtColor}
                              align="center" justify="center"
                              fontSize="sm" fontWeight="bold"
                            >
                              {exp.company.charAt(0)}
                            </Flex>
                          )}
                        </Box>

                        {/* Content */}
                        <Box flex="1" minW={0}>
                          {/* Title + role badge */}
                          <Flex align="center" gap={2} flexWrap="wrap" mb={0.5}>
                            <Text fontSize="sm" fontWeight="semibold" color={termText}>
                              {exp.title}
                            </Text>
                            <Text
                              fontSize="2xs"
                              fontWeight="bold"
                              color={rtColor}
                              letterSpacing="0.04em"
                              textTransform="uppercase"
                              px={1.5} py={0}
                              borderRadius="sm"
                              bg={`${rtColor}15`}
                            >
                              {t(rtCfg.labelKey)}
                            </Text>
                            {exp.isCurrent && (
                              <Box w="6px" h="6px" borderRadius="full" bg={termSuccess} flexShrink={0} />
                            )}
                          </Flex>

                          {/* Company + location */}
                          <Flex align="center" gap={1} flexWrap="wrap" fontSize="xs">
                            {exp.companyUrl ? (
                              <Link
                                href={exp.companyUrl} isExternal
                                color={termCommand} fontSize="xs"
                                onClick={e => e.stopPropagation()}
                                _hover={{ textDecoration: 'underline' }}
                              >
                                {exp.company}
                              </Link>
                            ) : (
                              <Text color={termCommand}>{exp.company}</Text>
                            )}
                            {exp.location && (
                              <Text color={termSecondary}>· {exp.location}</Text>
                            )}
                          </Flex>

                          {/* Date on mobile */}
                          {isMobile && (
                            <Text fontSize="2xs" color={termSecondary} mt={0.5}>
                              {fmtDate(exp.start)} – {fmtDate(exp.end)}
                            </Text>
                          )}
                        </Box>

                        {/* Period (desktop) */}
                        {!isMobile && (
                          <Text fontSize="xs" color={termSecondary} flexShrink={0} pt="2px" w="160px" textAlign="right">
                            {fmtDate(exp.start)} – {fmtDate(exp.end)}
                          </Text>
                        )}

                        {/* Chevron */}
                        <Icon
                          as={FaChevronDown}
                          boxSize="10px"
                          color={termSecondary}
                          mt="6px"
                          flexShrink={0}
                          transition="transform 0.2s"
                          transform={isExpanded ? 'rotate(180deg)' : 'rotate(0)'}
                        />
                      </Flex>

                      {/* Expanded */}
                      <Collapse in={isExpanded}>
                        <Box
                          mx={[3, 5]} mb={3}
                          ml={[3, '69px']}
                          pl={3}
                          borderLeft={`2px solid ${rtColor}`}
                        >
                          {exp.summary && (
                            <Text fontSize="xs" color={termHighlight} mb={2} lineHeight="1.6">
                              {highlightData(exp.summary, hlc)}
                            </Text>
                          )}
                          <VStack align="stretch" spacing={1}>
                            {exp.highlights.map((line: string, i: number) => (
                              <HStack key={i} fontSize="xs" align="start" spacing={2}>
                                <Text color={rtColor} flexShrink={0} mt="1px">·</Text>
                                <Text color={termText} lineHeight="1.5">{highlightData(line, hlc)}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>
                      </Collapse>
                    </Box>
                  )
                })}
              </Box>
            ))}

            {filtered.length === 0 && (
              <Box px={5} py={8} textAlign="center">
                <Text color={termSecondary} fontSize="sm">{t('experience.noPositions')}</Text>
              </Box>
            )}
          </Box>

          {/* Academic Reviewing */}
          {reviewingItems.length > 0 && (
            <Box px={[3, 5]} py={4} bg={termBg} borderTop={`1px solid ${termBorder}`}>
              <Flex align="center" gap={2} mb={3}>
                <Box w="14px" h="3px" borderRadius="full" bg={tc.param} />
                <Text fontSize="xs" fontWeight="bold" color={termInfo} letterSpacing="0.06em">{t('experience.academicReviewing')}</Text>
                <Text fontSize="2xs" color={termSecondary}>{reviewingItems.length}</Text>
                <Box flex="1" h="1px" bg={termBorder} />
              </Flex>
              <VStack align="stretch" spacing={2}>
                {reviewingByYear.map(([year, items]) => (
                  <HStack key={year} spacing={3} align="start" flexWrap="wrap">
                    <Text fontSize="xs" fontWeight="bold" color={termHighlight} w="35px" flexShrink={0}>
                      {year}
                    </Text>
                    <HStack spacing={1.5} flexWrap="wrap">
                      {items.map((item, idx) => (
                        <Text
                          key={`${item.venue}-${idx}`}
                          px={2} py={0.5}
                          fontSize="xs"
                          borderRadius="full"
                          border="1px solid"
                          borderColor={isDark ? 'whiteAlpha.150' : 'blackAlpha.100'}
                          color={termCommand}
                        >
                          {item.venue.replace(/\s*\d{4}\s*/, ' ').trim()}
                        </Text>
                      ))}
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </Box>
          )}

          {/* Command output */}
          {cmdOutput.length > 0 && (
            <Box px={[3, 5]} py={2} bg={isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)'} borderTop={`1px solid ${termBorder}`}>
              {cmdOutput.map((line, i) => (
                <Text key={i} fontSize="xs" fontFamily="mono" color={termText} whiteSpace="pre-wrap">{line}</Text>
              ))}
            </Box>
          )}

          {/* Command line */}
          <Flex
            px={[3, 5]} py={2}
            bg={termHeader}
            borderTop={`1px solid ${termBorder}`}
            align="center" fontSize="xs"
          >
            <Text color={termPrompt} mr={2} fontFamily="mono" flexShrink={0}>$</Text>
            <Input
              value={command}
              onChange={e => setCommand(e.target.value)}
              onKeyPress={e => { if (e.key === 'Enter') handleCommand(command) }}
              placeholder={t('experience.typeHelp')}
              size="xs"
              variant="unstyled"
              color={termText}
              fontFamily="mono"
              flex="1"
            />
            <Box
              h="12px" w="6px" bg={termPrompt} ml={1}
              sx={{ animation: `${blink} 1s step-end infinite` }}
            />
          </Flex>
        </Box>

      </VStack>
    </Box>
  )
}

export default Experience
