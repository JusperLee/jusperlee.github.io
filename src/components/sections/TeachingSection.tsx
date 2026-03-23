import { Box, Container, VStack, HStack, Text, Heading, Flex, Link, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import DynamicIcon from '../DynamicIcon'

const roleIcons: Record<string, string> = {
  instructor: 'FaChalkboardTeacher',
  ta: 'FaUserGraduate',
  'guest-lecturer': 'FaMicrophone',
  'co-instructor': 'FaUsers',
  other: 'FaBook',
}

const TeachingSection: React.FC = () => {
  const { t } = useTranslation()
  const { teaching } = useLocalizedData()
  const borderColor = useColorModeValue('gray.100', 'gray.800')
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const titleColor = useColorModeValue('gray.800', 'gray.100')
  const mutedColor = useColorModeValue('gray.400', 'gray.500')

  if (!teaching || teaching.length === 0) return null

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size="md" fontWeight="semibold">{t('about.teaching', 'Teaching')}</Heading>
          <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} />
        </Flex>
        <VStack spacing={0} align="stretch">
          {teaching.map((entry, i) => (
            <Flex key={i} align="start" gap={3} py={2.5} borderBottom="1px solid" borderColor={borderColor}>
              <Box mt="2px" flexShrink={0}>
                <DynamicIcon name={roleIcons[entry.role] || roleIcons.other} boxSize={3.5} color="cyan.400" />
              </Box>
              <Box flex={1} minW={0}>
                <Text fontSize="xs" fontWeight="medium" color={titleColor} lineHeight="short">
                  {entry.link ? (
                    <Link href={entry.link} isExternal _hover={{ color: 'cyan.400' }}>{entry.course}</Link>
                  ) : entry.course}
                </Text>
                <HStack spacing={2} mt={0.5} flexWrap="wrap">
                  <Text fontSize="2xs" color={textColor}>{entry.institution}</Text>
                  <Text fontSize="2xs" color={mutedColor}>· {entry.role}</Text>
                </HStack>
                {entry.description && <Text fontSize="2xs" color={textColor} mt={1}>{entry.description}</Text>}
              </Box>
              <Text fontSize="2xs" fontFamily="mono" color={mutedColor} whiteSpace="nowrap" flexShrink={0}>{entry.semester}</Text>
            </Flex>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

export default TeachingSection
