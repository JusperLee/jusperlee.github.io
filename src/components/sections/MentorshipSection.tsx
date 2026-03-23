import { Box, Container, VStack, Text, Heading, Flex, Link, useColorModeValue } from '@chakra-ui/react'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const MentorshipSection: React.FC = () => {
  const { about } = useLocalizedData()
  const textColor = useColorModeValue('gray.500', 'gray.400')
  const nameColor = useColorModeValue('gray.700', 'gray.200')
  const lineColor = useColorModeValue('gray.200', 'gray.700')
  const borderColor = useColorModeValue('gray.100', 'gray.800')

  if (!about.mentorship) return null

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={3}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size={["sm", "md"]} fontWeight="semibold">{about.mentorship.heading}</Heading>
          <Box flex="1" h="1px" bg={lineColor} />
        </Flex>
        {about.mentorship.description && (
          <Text fontSize="xs" lineHeight="tall" color={textColor} mb={4}>
            {about.mentorship.description}
          </Text>
        )}
        <VStack spacing={0} align="stretch">
          {about.mentorship.mentees.map((mentee, index) => (
            <Flex key={index} align="center" gap={3} py={2.5} borderBottom="1px solid" borderColor={borderColor}>
              <Box w="6px" h="6px" borderRadius="full" bg="cyan.400" flexShrink={0} />
              <Link href={mentee.url} isExternal _hover={{ textDecoration: 'none' }}>
                <Text fontSize="sm" fontWeight="medium" color={nameColor} transition="color 0.15s" _hover={{ color: 'cyan.400' }}>
                  {mentee.name}
                </Text>
              </Link>
              {mentee.note && (
                <Text fontSize="2xs" fontFamily="mono" color={textColor}>{mentee.note}</Text>
              )}
            </Flex>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

export default MentorshipSection
