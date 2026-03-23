import { Box, Container, Heading, Flex, HStack, Text, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import DynamicIcon from '../DynamicIcon'

type SkillItem = string | { name: string; icon?: string; category?: string }

const SkillsSection: React.FC = () => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const skills = (siteOwner.skills ?? []) as SkillItem[]
  const tagBg = useColorModeValue('gray.100', 'gray.800')
  const tagColor = useColorModeValue('gray.700', 'gray.300')
  const iconColor = useColorModeValue('gray.500', 'gray.400')

  if (skills.length === 0) return null

  const getName = (s: SkillItem) => typeof s === 'string' ? s : s.name
  const getIcon = (s: SkillItem) => typeof s === 'string' ? undefined : s.icon

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size="md" fontWeight="semibold">{t('about.skills', 'Skills')}</Heading>
          <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} />
        </Flex>
        <HStack spacing={2} flexWrap="wrap">
          {skills.map((skill) => (
            <HStack
              key={getName(skill)}
              spacing={1.5}
              fontSize="xs"
              fontFamily="mono"
              px={2.5}
              py={1}
              bg={tagBg}
              color={tagColor}
              borderRadius="sm"
            >
              {getIcon(skill) && (
                <DynamicIcon name={getIcon(skill)!} boxSize={3} color={iconColor} />
              )}
              <Text>{getName(skill)}</Text>
            </HStack>
          ))}
        </HStack>
      </Container>
    </Box>
  )
}

export default SkillsSection
