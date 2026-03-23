import { VStack, Heading, Text, Box, Code, Container, HStack, Link as ChakraLink, Badge } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import type { NewsItem } from '../types'

const MotionBox = motion(Box)

const sortNews = (arr: NewsItem[]) => {
  return [...arr].sort((a, b) => {
    if (!a.sortDate && !b.sortDate) return 0
    if (!a.sortDate) return 1
    if (!b.sortDate) return -1
    return b.sortDate.localeCompare(a.sortDate)
  })
}

const News = () => {
  const { t } = useTranslation()
  const { news: dataNews } = useLocalizedData()
  const news = sortNews(dataNews)
  const lastUpdated = news.length > 0 ? (news[0].date || 'N/A') : 'N/A'

  return (
    <Container maxW="7xl" px={4}>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading as="h1" size="xl" mb={6}>{t('news.title')}</Heading>
          <Box className="meta">
            <Box className="meta-item">
              <i className="fa-solid fa-clock-rotate-left"></i>
              {t('news.lastUpdated')} {lastUpdated}
            </Box>
            <Box className="meta-item">
              <i className="fa-solid fa-sort"></i>
              {t('news.sortedByDate')}
            </Box>
          </Box>

          <VStack spacing={6} align="stretch">
            {news.map((item, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                p={5}
                borderWidth="1px"
                borderRadius="md"
                className="card"
              >
                <Box mb={2}>
                  <Code>{item.date}</Code>{' '}
                  {item.badge && (
                    <Badge ml={2} colorScheme={item.iconColor?.split('.')[0] || 'gray'}>{item.badge}</Badge>
                  )}{' '}
                  <Text as="span" fontWeight="bold">{item.title}</Text>
                </Box>
                <Text>{item.description}</Text>
                {item.links && item.links.length > 0 && (
                  <HStack spacing={3} mt={3} wrap="wrap">
                    {item.links.map((l, i) => (
                      <ChakraLink key={i} href={l.url} isExternal color="var(--accent-color)">
                        {l.text} →
                      </ChakraLink>
                    ))}
                  </HStack>
                )}
              </MotionBox>
            ))}
          </VStack>
        </MotionBox>

        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Heading as="h2" size="lg" mb={4}>{t('news.currentFocus')}</Heading>
          <Box as="pre" p={4} bg="var(--header-bg)" borderRadius="md" fontFamily="mono">
{`# Active Projects (2024-Q4)
- ThinkGrasp extensions    // Working on improved vision-language integration
- Equivariant Models       // Refining SE(2) models for grasping
- Technical blog series    // Writing about LLMs and robotics
- PyTorch upgrades         // Maintaining open source contributions`}
          </Box>
        </MotionBox>
      </VStack>
    </Container>
  )
}

export default News
