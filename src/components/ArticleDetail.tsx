import React from 'react'
import {
  Box, Flex, HStack, Icon, Link as ChakraLink, Text, VStack,
  useColorMode, useColorModeValue,
} from '@chakra-ui/react'
import { FaArrowLeft, FaCalendarAlt, FaTag } from 'react-icons/fa'
import { useParams, Link as RouterLink } from 'react-router-dom'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import { articleCategoryColors, terminalPalette } from '@/config/theme'

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const { articles } = useLocalizedData()

  const tc = terminalPalette.colors(isDark)
  const article = articles.find(a => a.slug === slug)

  if (!article) {
    return (
      <Box w="full" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={8}>
        <VStack spacing={6} maxW="1400px" mx="auto" px={[2, 4, 6]}>
          <Box
            w="full" borderRadius="md" fontFamily="mono" overflow="hidden"
            boxShadow={`0 0 0 1px ${tc.border}, 0 4px 16px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`}
          >
            <Flex bg={tc.header} px={4} py={2} align="center" borderBottom={`1px solid ${tc.border}`}>
              <Text color={tc.text} fontSize="sm" fontWeight="bold">article_not_found</Text>
            </Flex>
            <Box bg={tc.bg} p={6}>
              <Text color={tc.error} fontSize="sm">
                Error: Article "{slug}" not found.
              </Text>
              <ChakraLink as={RouterLink} to="/articles" color={tc.command} fontSize="sm" mt={4} display="block">
                <Icon as={FaArrowLeft} mr={2} />cd ../articles
              </ChakraLink>
            </Box>
          </Box>
        </VStack>
      </Box>
    )
  }

  const fmtDate = (v?: string) => {
    if (!v) return ''
    const d = new Date(v)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const catColors = articleCategoryColors[article.category]

  return (
    <Box w="full" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')} py={8}>
      <VStack spacing={6} maxW="1400px" mx="auto" px={[2, 4, 6]}>
        {/* Terminal window */}
        <Box
          w="full" borderRadius="md" fontFamily="mono" overflow="hidden"
          boxShadow={`0 0 0 1px ${tc.border}, 0 4px 16px ${isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`}
        >
          {/* Title bar */}
          <Flex bg={tc.header} px={4} py={2} align="center" justify="space-between" borderBottom={`1px solid ${tc.border}`}>
            <HStack spacing={2}>
              <Box w="12px" h="12px" borderRadius="full" bg="#bf616a" />
              <Box w="12px" h="12px" borderRadius="full" bg="#ebcb8b" />
              <Box w="12px" h="12px" borderRadius="full" bg="#a3be8c" />
            </HStack>
            <Text color={tc.secondary} fontSize="xs">cat {slug}.md</Text>
            <Box w="40px" />
          </Flex>

          <Box bg={tc.bg} p={[4, 6, 8]}>
            {/* Back link */}
            <ChakraLink
              as={RouterLink} to="/articles"
              color={tc.command} fontSize="sm" display="inline-flex" alignItems="center"
              _hover={{ color: tc.highlight, textDecoration: 'none' }}
              mb={6}
            >
              <Icon as={FaArrowLeft} mr={2} fontSize="xs" />
              cd ../blogs
            </ChakraLink>

            {/* Category badge */}
            {catColors && (
              <Text
                display="inline-block"
                fontSize="xs" fontWeight="bold" letterSpacing="wider"
                color={catColors.fg(isDark)}
                bg={catColors.bg(isDark)}
                px={2} py={0.5} borderRadius="sm" mb={3}
              >
                {article.category.toUpperCase()}
              </Text>
            )}

            {/* Title */}
            <Text color={tc.text} fontSize={['xl', '2xl']} fontWeight="bold" lineHeight="1.3" mb={3}>
              {article.title}
            </Text>

            {/* Meta: date & tags */}
            <HStack spacing={4} mb={6} flexWrap="wrap">
              {article.date && (
                <HStack spacing={1} color={tc.secondary} fontSize="sm">
                  <Icon as={FaCalendarAlt} fontSize="xs" />
                  <Text>{fmtDate(article.date)}</Text>
                </HStack>
              )}
              {article.tags && article.tags.length > 0 && (
                <HStack spacing={1} color={tc.muted} fontSize="sm" flexWrap="wrap">
                  <Icon as={FaTag} fontSize="xs" />
                  {article.tags.map((tag, i) => (
                    <Text key={i} as="span">
                      {tag}{i < article.tags.length - 1 ? ',' : ''}
                    </Text>
                  ))}
                </HStack>
              )}
            </HStack>

            {/* Extra links (e.g., PDF) */}
            {article.extraLinks && article.extraLinks.length > 0 && (
              <HStack spacing={3} mb={6}>
                {article.extraLinks.map((link, i) => (
                  <ChakraLink
                    key={i} href={link.url} isExternal
                    color={tc.command} fontSize="sm"
                    _hover={{ color: tc.highlight }}
                    px={2} py={1}
                    border={`1px solid ${tc.border}`} borderRadius="sm"
                  >
                    {link.label}
                  </ChakraLink>
                ))}
              </HStack>
            )}

            {/* Divider */}
            <Box borderBottom={`1px solid ${tc.border}`} mb={6} />

            {/* Article body */}
            <Box
              className="article-body"
              color={tc.text}
              fontSize="sm"
              lineHeight="1.8"
              sx={{
                'h1': {
                  fontSize: 'xl', fontWeight: 'bold', color: tc.highlight,
                  mt: 8, mb: 4, borderBottom: `1px solid ${tc.border}`, pb: 2,
                },
                'h2': {
                  fontSize: 'lg', fontWeight: 'bold', color: tc.command,
                  mt: 6, mb: 3, borderBottom: `1px solid ${tc.border}`, pb: 1,
                },
                'h3': {
                  fontSize: 'md', fontWeight: 'bold', color: tc.info,
                  mt: 5, mb: 2,
                },
                'h4': {
                  fontSize: 'sm', fontWeight: 'bold', color: tc.param,
                  mt: 4, mb: 2,
                },
                'p': { mb: 4 },
                'ul': { pl: 6, mb: 4 },
                'ol': { pl: 6, mb: 4 },
                'li': { mb: 1 },
                'a': {
                  color: tc.command, textDecoration: 'underline',
                  _hover: { color: tc.highlight },
                },
                'code': {
                  bg: isDark ? 'rgba(136,192,208,0.1)' : 'rgba(42,118,156,0.08)',
                  color: tc.param, px: 1.5, py: 0.5, borderRadius: 'sm', fontSize: 'xs',
                },
                'pre': {
                  bg: isDark ? '#252b35' : '#e2e6ee',
                  p: 4, borderRadius: 'md', overflowX: 'auto', mb: 4,
                  border: `1px solid ${tc.border}`,
                  '& code': { bg: 'transparent', p: 0 },
                },
                'blockquote': {
                  borderLeft: `3px solid ${tc.command}`,
                  pl: 4, ml: 0, mb: 4, color: tc.secondary, fontStyle: 'italic',
                },
                'table': {
                  width: '100%', mb: 4, borderCollapse: 'collapse',
                },
                'th': {
                  bg: tc.header, border: `1px solid ${tc.border}`,
                  px: 3, py: 2, fontSize: 'xs', fontWeight: 'bold',
                  textAlign: 'left', color: tc.highlight,
                },
                'td': {
                  border: `1px solid ${tc.border}`,
                  px: 3, py: 2, fontSize: 'xs',
                },
                'tr:nth-of-type(even)': {
                  bg: isDark ? 'rgba(59,66,82,0.3)' : 'rgba(234,238,246,0.5)',
                },
                'strong': { color: tc.highlight, fontWeight: 'bold' },
                'em': { color: tc.secondary },
                'hr': { borderColor: tc.border, my: 6 },
                'img': { maxWidth: '100%', borderRadius: 'md', my: 4 },
              }}
              dangerouslySetInnerHTML={{ __html: article._body || '' }}
            />

            {/* Bottom divider */}
            <Box borderBottom={`1px solid ${tc.border}`} mt={8} mb={4} />

            {/* Footer nav */}
            <ChakraLink
              as={RouterLink} to="/articles"
              color={tc.command} fontSize="sm" display="inline-flex" alignItems="center"
              _hover={{ color: tc.highlight, textDecoration: 'none' }}
            >
              <Icon as={FaArrowLeft} mr={2} fontSize="xs" />
              cd ../blogs
            </ChakraLink>
          </Box>
        </Box>
      </VStack>
    </Box>
  )
}

export default ArticleDetail
