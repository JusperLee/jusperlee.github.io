import React from 'react'
import { Box, Container, VStack, HStack, Text, Link, Image, useColorModeValue } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const Footer: React.FC = () => {
  const { t } = useTranslation()
  const { siteOwner } = useLocalizedData()
  const footerBg = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box
      as="footer"
      w="full"
      bg={footerBg}
      py={[6, 8]}
      mt={[6, 8]}
      borderTop="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
    >
      <Container maxW="7xl" px={[4, 6, 8]}>
        <VStack spacing={[3, 4]} textAlign="center">
          {/* Logo */}
          <Link
            href="https://github.com/H-Freax/TermHub"
            isExternal
            _hover={{ opacity: 0.85, transform: 'translateY(-1px)' }}
            transition="all 0.2s"
          >
            <Image
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="TermHub"
              h={["40px", "48px"]}
              objectFit="contain"
            />
          </Link>

          <HStack
            spacing={1}
            color={textColor}
            fontSize={["xs", "sm"]}
          >
            <Text>{t('footer.poweredBy')}</Text>
            <Link
              href="https://github.com/H-Freax/TermHub"
              isExternal
              color="cyan.500"
              fontWeight="medium"
              _hover={{ textDecoration: 'underline' }}
            >
              TermHub
            </Link>
          </HStack>

          <Text
            fontSize={["2xs", "xs"]}
            color={textColor}
          >
            © {new Date().getFullYear()} {siteOwner.name.display}
          </Text>
        </VStack>
      </Container>
    </Box>
  )
}

export default Footer
