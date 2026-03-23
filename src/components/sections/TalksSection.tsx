import { Box, Container, VStack, HStack, Text, Heading, Flex, Link, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import DynamicIcon from '../DynamicIcon'

const typeLabels: Record<string, { icon: string; color: string }> = {
  keynote: { icon: 'FaStar', color: 'yellow.400' },
  invited: { icon: 'FaUserTie', color: 'purple.400' },
  oral: { icon: 'FaMicrophone', color: 'cyan.400' },
  poster: { icon: 'FaImage', color: 'green.400' },
  tutorial: { icon: 'FaChalkboardTeacher', color: 'orange.400' },
  workshop: { icon: 'FaTools', color: 'blue.400' },
  panel: { icon: 'FaUsers', color: 'pink.400' },
  other: { icon: 'FaComments', color: 'gray.400' },
}

const TalksSection: React.FC = () => {
  const { t } = useTranslation()
  const { talks } = useLocalizedData()
  const borderColor = useColorModeValue('gray.100', 'gray.800')
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const titleColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.400', 'gray.500')

  if (!talks || talks.length === 0) return null

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size="md" fontWeight="semibold">{t('about.talks', 'Talks')}</Heading>
          <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} />
        </Flex>
        <VStack spacing={0} align="stretch">
          {talks.map((talk, i) => {
            const meta = typeLabels[talk.type || 'other'] || typeLabels.other
            return (
              <Flex key={i} align="start" gap={3} py={2.5} borderBottom="1px solid" borderColor={borderColor}>
                <Box mt="2px" flexShrink={0}>
                  <DynamicIcon name={meta.icon} boxSize={3.5} color={meta.color} />
                </Box>
                <Box flex={1} minW={0}>
                  <Text fontSize="xs" fontWeight="medium" color={titleColor} lineHeight="short">{talk.title}</Text>
                  <HStack spacing={2} mt={0.5} flexWrap="wrap">
                    <Text fontSize="2xs" color={textColor}>{talk.event}</Text>
                    {talk.location && <Text fontSize="2xs" color={mutedColor}>· {talk.location}</Text>}
                  </HStack>
                  {(talk.slidesUrl || talk.videoUrl) && (
                    <HStack spacing={2} mt={1}>
                      {talk.slidesUrl && (
                        <Link href={talk.slidesUrl} isExternal fontSize="2xs" fontFamily="mono" color="cyan.400" _hover={{ textDecoration: 'underline' }}>
                          slides
                        </Link>
                      )}
                      {talk.videoUrl && (
                        <Link href={talk.videoUrl} isExternal fontSize="2xs" fontFamily="mono" color="cyan.400" _hover={{ textDecoration: 'underline' }}>
                          video
                        </Link>
                      )}
                    </HStack>
                  )}
                </Box>
                <Text fontSize="2xs" fontFamily="mono" color={mutedColor} whiteSpace="nowrap" flexShrink={0}>{talk.date}</Text>
              </Flex>
            )
          })}
        </VStack>
      </Container>
    </Box>
  )
}

export default TalksSection
