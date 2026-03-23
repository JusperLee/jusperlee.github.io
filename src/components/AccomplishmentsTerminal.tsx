import React from 'react'
import { Box, VStack, HStack, Text, useColorModeValue, Flex, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Container, Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import DynamicIcon from './DynamicIcon'
import type { Award } from '../types'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const iconFor = (a: Award): string => {
  if (a.kind === 'grant') return 'FaCoins'
  if (a.kind === 'hackathon') return 'FaTrophy'
  if (a.kind === 'travel') return 'FaPlane'
  if (a.kind === 'scholarship') return 'FaGraduationCap'
  if (a.kind === 'honor') return 'FaMedal'
  if (a.kind === 'employment') return 'FaBriefcase'
  if (a.kind === 'innovation') return 'FaLightbulb'
  if (a.kind === 'competition') {
    const t = (a.title + ' ' + (a.org || '')).toLowerCase()
    if (t.includes('first')) return 'FaTrophy'
    if (t.includes('second')) return 'FaMedal'
    if (t.includes('third')) return 'FaAward'
    if (t.includes('meritorious')) return 'FaStar'
    if (t.includes('honorable')) return 'FaAward'
    return 'FaChartBar'
  }
  return 'FaCoins'
}

const kindMeta: Record<string, { labelKey: string; color: [string, string] }> = {
  grant: { labelKey: 'awards.grant', color: ['yellow.500', 'yellow.300'] },
  hackathon: { labelKey: 'awards.hackathon', color: ['purple.500', 'purple.300'] },
  travel: { labelKey: 'awards.travel', color: ['blue.400', 'blue.300'] },
  scholarship: { labelKey: 'awards.scholarship', color: ['purple.500', 'purple.300'] },
  honor: { labelKey: 'awards.honor', color: ['green.500', 'green.300'] },
  employment: { labelKey: 'awards.employment', color: ['blue.500', 'blue.300'] },
  competition: { labelKey: 'awards.competition', color: ['orange.400', 'orange.300'] },
  innovation: { labelKey: 'awards.innovation', color: ['cyan.500', 'cyan.300'] },
  other: { labelKey: 'awards.other', color: ['gray.400', 'gray.500'] },
}

const AwardRow = ({ award }: { award: Award }) => {
  const { t } = useTranslation()
  const borderColor = useColorModeValue('gray.100', 'gray.800')
  const titleColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.400', 'gray.500')
  const meta = kindMeta[award.kind || 'other']
  const kindColor = useColorModeValue(meta.color[0], meta.color[1])

  const content = (
    <Flex
      align="start"
      gap={3}
      py={2.5}
      borderBottom="1px solid"
      borderColor={borderColor}
      cursor={award.egg ? 'pointer' : 'default'}
      transition="all 0.15s"
      _hover={award.egg ? { pl: 1 } : undefined}
    >
      <Box mt="2px" flexShrink={0}>
        <DynamicIcon name={iconFor(award)} boxSize={3.5} color={kindColor} />
      </Box>
      <Box flex={1} minW={0}>
        <Text fontSize="xs" fontWeight="medium" color={titleColor} lineHeight="short">
          {award.title}
        </Text>
        <HStack spacing={2} mt={0.5} flexWrap="wrap">
          {award.org && (
            <Text fontSize="2xs" color={mutedColor}>{award.org}</Text>
          )}
        </HStack>
      </Box>
      <VStack spacing={0.5} align="end" flexShrink={0}>
        <Text fontSize="2xs" fontFamily="mono" color={mutedColor} whiteSpace="nowrap">
          {award.date}
        </Text>
        <Text fontSize="2xs" fontFamily="mono" color={kindColor} textTransform="uppercase" letterSpacing="wide">
          {t(meta.labelKey)}
        </Text>
      </VStack>
    </Flex>
  )

  if (award.egg) {
    return (
      <Popover trigger="hover" placement="top-start">
        <PopoverTrigger>
          {content}
        </PopoverTrigger>
        <PopoverContent
          bg={useColorModeValue('white', 'gray.800')}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          maxW="360px"
          boxShadow="lg"
        >
          <PopoverArrow />
          <PopoverBody py={3} px={4}>
            <HStack spacing={2} mb={2}>
              <DynamicIcon name={iconFor(award)} boxSize={3} color="cyan.400" />
              <Text fontSize="xs" fontFamily="mono" color="cyan.400" fontWeight="semibold">
                Easter Egg
              </Text>
            </HStack>
            <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="tall">
              {award.egg}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    )
  }

  return content
}

const AccomplishmentsTerminal: React.FC = () => {
  const { t } = useTranslation()
  const { awards } = useLocalizedData()
  return (
    <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
      <Heading size={["sm", "md"]} mb={3}>{t('about.awardsAndHonors')}</Heading>
      <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} mb={4}>
        {awards.length} {t('about.awardsSpanning')} {new Set(awards.map(a => a.kind)).size} {t('about.categories')}
      </Text>
      <VStack spacing={0} align="stretch">
        {awards.map((a, i) => (
          <AwardRow key={i} award={a} />
        ))}
      </VStack>
    </Container>
  )
}

export default AccomplishmentsTerminal
