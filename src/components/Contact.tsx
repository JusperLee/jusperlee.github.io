import { VStack, Heading, Text, Box, Container } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { githubUsername } from '@/site.config'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const MotionBox = motion(Box)

const Contact = () => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()

  return (
    <Container maxW="7xl" px={4}>
      <VStack spacing={8} align="stretch">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading as="h1" size="xl" mb={6}>{t('contact.title')}</Heading>
          <Box className="meta">
            <Box className="meta-item">
              <i className="fa-solid fa-clock"></i>
              {t('contact.responseTime')}
            </Box>
          </Box>

          <Box as="pre" p={4} bg="var(--header-bg)" borderRadius="md" fontFamily="mono" mb={6}>
{`# ${t('contact.contactInfo')}
EMAIL    = "${siteOwner.contact.email}"
LINKEDIN = "${siteOwner.social.linkedin}"
GITHUB   = "${siteOwner.social.github}"
LOCATION = "${siteOwner.contact.location}"`}
          </Box>

          <Box mt={8} p={6} borderRadius="md" bg="var(--card-bg)" borderWidth="1px" borderColor="var(--border-color)">
            <Heading as="h2" size="md" mb={4}>{t('contact.quickLinks')}</Heading>
            <VStack align="stretch" spacing={3}>
              <Box>
                <Text as="span" fontWeight="bold">{t('contact.email')}</Text>{" "}
                <a href={`mailto:${siteOwner.contact.email}`} style={{ color: 'var(--accent-color)' }}>
                  {siteOwner.contact.email}
                </a>
              </Box>
              <Box>
                <Text as="span" fontWeight="bold">{t('contact.linkedin')}</Text>{" "}
                <a href={siteOwner.social.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>
                  @{siteOwner.social.linkedin.split('/').filter(Boolean).pop()}
                </a>
              </Box>
              <Box>
                <Text as="span" fontWeight="bold">{t('contact.github')}</Text>{" "}
                <a href={siteOwner.social.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>
                  @{githubUsername}
                </a>
              </Box>
              <Box>
                <Text as="span" fontWeight="bold">{t('contact.medium')}</Text>{" "}
                <a href={siteOwner.social.medium} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>
                  @{siteOwner.social.medium.split('@').pop()}
                </a>
              </Box>
              <Box>
                <Text as="span" fontWeight="bold">{t('contact.googleScholar')}</Text>{" "}
                <a href={siteOwner.social.googleScholar} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)' }}>
                  {t('contact.viewProfile')}
                </a>
              </Box>
            </VStack>
          </Box>
        </MotionBox>
      </VStack>
    </Container>
  )
}

export default Contact
