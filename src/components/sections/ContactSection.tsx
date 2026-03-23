import { Box, Container, VStack, HStack, Text, Heading, Flex, Link, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'
import DynamicIcon from '../DynamicIcon'

const ContactSection: React.FC = () => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const linkColor = useColorModeValue('gray.700', 'gray.200')

  const items = [
    siteOwner.contact.email && { icon: 'FaEnvelope', label: t('contact.email', 'Email'), value: siteOwner.contact.email, href: `mailto:${siteOwner.contact.email}` },
    siteOwner.contact.academicEmail && { icon: 'FaGraduationCap', label: t('contact.academicEmail', 'Academic'), value: siteOwner.contact.academicEmail, href: `mailto:${siteOwner.contact.academicEmail}` },
    siteOwner.contact.location && { icon: 'FaMapMarkerAlt', label: t('contact.location', 'Location'), value: siteOwner.contact.location },
    siteOwner.social.github && { icon: 'FaGithub', label: 'GitHub', value: siteOwner.social.github, href: siteOwner.social.github },
    siteOwner.social.linkedin && { icon: 'FaLinkedin', label: 'LinkedIn', value: 'LinkedIn', href: siteOwner.social.linkedin },
    siteOwner.social.googleScholar && { icon: 'SiGooglescholar', label: 'Scholar', value: 'Google Scholar', href: siteOwner.social.googleScholar },
  ].filter(Boolean) as { icon: string; label: string; value: string; href?: string }[]

  if (items.length === 0) return null

  return (
    <Box w="full">
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Flex align="center" gap={3} mb={4}>
          <Box h="2px" w="20px" bg="cyan.400" borderRadius="full" flexShrink={0} />
          <Heading size="md" fontWeight="semibold">{t('about.contact', 'Contact')}</Heading>
          <Box flex="1" h="1px" bg={useColorModeValue('gray.200', 'gray.700')} />
        </Flex>
        <VStack spacing={2} align="stretch">
          {items.map((item) => (
            <HStack key={item.label} spacing={3}>
              <DynamicIcon name={item.icon} boxSize={3.5} color="cyan.400" />
              <Text fontSize="xs" color={textColor} minW="60px">{item.label}</Text>
              {item.href ? (
                <Link href={item.href} isExternal fontSize="xs" color={linkColor} fontFamily="mono" _hover={{ color: 'cyan.400' }}>
                  {item.value}
                </Link>
              ) : (
                <Text fontSize="xs" color={linkColor} fontFamily="mono">{item.value}</Text>
              )}
            </HStack>
          ))}
        </VStack>
      </Container>
    </Box>
  )
}

export default ContactSection
