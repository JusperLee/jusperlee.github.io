import {
  Box, Flex, IconButton, useColorMode, HStack, Link as ChakraLink, Image,
  useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  VStack, Divider, Button
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { Link, useLocation } from 'react-router-dom'
import { FaGithub, FaLinkedin, FaMedium, FaEnvelope } from 'react-icons/fa'
import { SiGooglescholar } from 'react-icons/si'
import { useTranslation } from 'react-i18next'
import { navItems, siteOwner } from '@/site.config'

const Navbar: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const location = useLocation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { t, i18n } = useTranslation()

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh' ? 'en' : 'zh')
  }

  const socialLinks = [
    { icon: FaEnvelope, href: `mailto:${siteOwner.contact.email}`, label: 'Email' },
    { icon: FaGithub, href: siteOwner.social.github, label: 'GitHub' },
    { icon: FaLinkedin, href: siteOwner.social.linkedin, label: 'LinkedIn' },
    { icon: FaMedium, href: siteOwner.social.medium, label: 'Medium' },
    { icon: SiGooglescholar, href: siteOwner.social.googleScholar, label: 'Google Scholar' },
  ].filter(link => link.href)

  return (
    <Box
      as="nav"
      py={4}
      borderBottom="1px solid"
      borderColor="var(--border-color)"
      position="sticky"
      top={0}
      bg="var(--bg-color)"
      zIndex={1000}
      w="full"
    >
      <Flex
        justify="space-between"
        align="center"
        w="full"
        px={4}
        position="relative"
      >
        {/* Mobile: hamburger */}
        <Box display={{ base: 'block', md: 'none' }}>
          <IconButton
            aria-label={t('aria.openNav')}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            onClick={isOpen ? onClose : onOpen}
            variant="ghost"
            color="var(--text-color)"
          />
        </Box>

        {/* Desktop: logo left */}
        <ChakraLink
          as={Link}
          to="/"
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.15s"
        >
          <Image
            src={`${import.meta.env.BASE_URL}logo-icon.svg`}
            alt="TermHub"
            h="28px"
            w="28px"
          />
        </ChakraLink>

        {/* Desktop nav (right aligned) */}
        <HStack
          spacing={8}
          display={{ base: 'none', md: 'flex' }}
          ml="auto"
          mr={{ base: 0, md: 6 }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: 'var(--text-color)',
                  textDecoration: 'none',
                  borderBottom: isActive ? '2px solid var(--accent-color)' : 'none',
                  paddingBottom: '2px',
                  fontSize: '1rem',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all 0.2s'
                }}
              >
                {t(item.labelKey)}
              </Link>
            )
          })}
        </HStack>
        <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
          {socialLinks.map((link) => (
            <ChakraLink
              key={link.label}
              href={link.href}
              isExternal
              color="var(--secondary-text)"
              p={1.5}
              borderRadius="md"
              _hover={{
                color: 'var(--accent-color)',
                transform: 'translateY(-2px)',
                ...(link.label === 'LinkedIn' || link.label === 'Email'
                  ? { bg: 'var(--hover-color)' }
                  : {})
              }}
              transition="all 0.2s"
            >
              <Box
                as={link.icon}
                fontSize="1.2rem"
              />
            </ChakraLink>
          ))}
          {/* Language switcher */}
          <Button
            size="xs"
            variant="ghost"
            color="var(--text-color)"
            fontWeight="medium"
            fontSize="xs"
            px={2}
            minW="auto"
            onClick={toggleLanguage}
            aria-label={t('aria.toggleLanguage')}
            _hover={{
              bg: 'var(--hover-color)',
              transform: 'translateY(-2px)'
            }}
            transition="all 0.2s"
          >
            {i18n.language === 'zh' ? 'EN' : '中'}
          </Button>
          <IconButton
            aria-label={t('aria.toggleColorMode')}
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            color="var(--text-color)"
            _hover={{
              bg: 'var(--hover-color)',
              transform: 'translateY(-2px)'
            }}
            transition="all 0.2s"
          />
        </HStack>
      </Flex>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="var(--bg-color)">
          <DrawerHeader color="var(--text-color)">{t('nav.navigation')}</DrawerHeader>
          <DrawerBody>
            <VStack align="stretch" spacing={3}>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <ChakraLink
                    key={item.path}
                    as={Link}
                    to={item.path}
                    onClick={onClose}
                    color={isActive ? 'var(--accent-color)' : 'var(--text-color)'}
                    _hover={{ color: 'var(--accent-color)' }}
                    fontWeight={isActive ? 600 : 400}
                  >
                    {t(item.labelKey)}
                  </ChakraLink>
                )
              })}

              <Divider borderColor="var(--border-color)" my={2} />

              <VStack align="stretch" spacing={2}>
                {socialLinks.map((link) => (
                  <ChakraLink
                    key={link.label}
                    href={link.href}
                    isExternal
                    color="var(--secondary-text)"
                    _hover={{ color: 'var(--accent-color)' }}
                  >
                    <Box as={link.icon} mr={2} display="inline-block" /> {link.label}
                  </ChakraLink>
                ))}
              </VStack>

              <Divider borderColor="var(--border-color)" my={2} />

              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="outline"
                  color="var(--text-color)"
                  onClick={toggleLanguage}
                  flex={1}
                >
                  {i18n.language === 'zh' ? 'English' : '中文'}
                </Button>
                <IconButton
                  aria-label={t('aria.toggleColorMode')}
                  icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
                  onClick={toggleColorMode}
                  variant="outline"
                  color="var(--text-color)"
                />
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Navbar
