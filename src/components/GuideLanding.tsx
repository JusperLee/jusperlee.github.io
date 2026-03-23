import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Container, Flex, Grid, GridItem, HStack, Heading, Icon, Image,
  SimpleGrid, Text, VStack, useColorMode, useColorModeValue,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import {
  FaRocket, FaFolderOpen, FaPaintBrush, FaGlobe, FaToggleOn,
  FaBook, FaGraduationCap, FaBriefcase, FaNewspaper, FaTrophy,
  FaImage, FaArrowRight, FaGithub, FaFileAlt, FaCode, FaPen,
  FaTerminal, FaCog, FaChevronRight, FaStar, FaCodeBranch,
  FaBalanceScale, FaHeart, FaDiscord, FaRobot,
} from 'react-icons/fa'
import { terminalPalette } from '@/config/theme'

const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`

/* ── Shared Colors Hook ───────────────────────────────────────── */

const useTC = () => {
  const isDark = useColorMode().colorMode === 'dark'
  return { isDark, tc: terminalPalette.colors(isDark) }
}

/* ── Step Card ────────────────────────────────────────────────── */

const StepCard: React.FC<{
  step: number; icon: React.ElementType; title: string; desc: string; command?: string; color: string
}> = ({ step, icon, title, desc, command, color }) => {
  const { isDark, tc } = useTC()
  return (
    <VStack
      bg={useColorModeValue('white', 'gray.800')}
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      borderRadius="lg"
      p={[5, 6]}
      spacing={4}
      align="start"
      _hover={{ borderColor: color, transform: 'translateY(-2px)', shadow: isDark ? 'dark-lg' : 'lg' }}
      transition="all 0.25s ease"
    >
      <HStack spacing={3}>
        <Flex
          w="32px" h="32px" borderRadius="md" bg={color} color="white"
          align="center" justify="center" fontWeight="bold" fontSize="xs"
        >
          {step}
        </Flex>
        <Icon as={icon} color={color} boxSize={4} />
      </HStack>
      <Box>
        <Text fontWeight="bold" fontSize="sm" color={useColorModeValue('gray.800', 'gray.100')} mb={1}>
          {title}
        </Text>
        <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} lineHeight="1.7">
          {desc}
        </Text>
      </Box>
      {command && (
        <Box
          w="full"
          bg={tc.bg}
          borderRadius="md"
          px={3} py={2}
          fontFamily="mono"
          fontSize="xs"
          border={`1px solid ${tc.border}`}
        >
          <Text as="span" color={tc.prompt}>$ </Text>
          <Text as="span" color={tc.command}>{command}</Text>
        </Box>
      )}
    </VStack>
  )
}

/* ── Feature Card ─────────────────────────────────────────────── */

const FeatureCard: React.FC<{
  icon: React.ElementType; title: string; desc: string; accent: string
}> = ({ icon, title, desc, accent }) => {
  const { isDark } = useTC()
  return (
    <HStack
      bg={useColorModeValue('white', 'gray.800')}
      border="1px solid"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      borderRadius="lg"
      p={4}
      spacing={4}
      align="start"
      _hover={{ borderColor: accent, shadow: isDark ? 'dark-lg' : 'md' }}
      transition="all 0.2s ease"
    >
      <Flex
        w="36px" h="36px" borderRadius="md" flexShrink={0}
        bg={`${accent}18`}
        align="center" justify="center"
      >
        <Icon as={icon} color={accent} boxSize={4} />
      </Flex>
      <Box>
        <Text fontWeight="semibold" fontSize="sm" color={useColorModeValue('gray.800', 'gray.100')} mb={0.5}>
          {title}
        </Text>
        <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} lineHeight="1.6">
          {desc}
        </Text>
      </Box>
    </HStack>
  )
}

/* ── Mini terminal code block ─────────────────────────────────── */

const CodePreview: React.FC<{ lines: { key: string; value: string }[] }> = ({ lines }) => {
  const { tc } = useTC()
  return (
    <Box
      bg={tc.bg}
      border={`1px solid ${tc.border}`}
      borderRadius="md"
      px={3} py={2}
      fontFamily="mono"
      fontSize="xs"
      lineHeight="1.9"
    >
      {lines.map((l, i) => (
        <Text key={i}>
          <Text as="span" color={tc.prompt}>{l.key}</Text>
          <Text as="span" color={tc.secondary}>: </Text>
          <Text as="span" color={tc.success}>{l.value}</Text>
        </Text>
      ))}
    </Box>
  )
}

/* ── Section heading ──────────────────────────────────────────── */

const SectionHead: React.FC<{ label: string; title: string; desc?: string; color: string }> = ({
  label, title, desc, color,
}) => (
  <VStack spacing={2} mb={8} textAlign="center">
    <Flex align="center" gap={2}>
      <Box h="2px" w="16px" bg={color} borderRadius="full" />
      <Text fontSize="xs" fontWeight="bold" color={color} textTransform="uppercase" letterSpacing="wider" fontFamily="mono">
        {label}
      </Text>
      <Box h="2px" w="16px" bg={color} borderRadius="full" />
    </Flex>
    <Heading as="h2" fontSize={['lg', 'xl']} fontWeight="semibold" color={useColorModeValue('gray.800', 'gray.100')}>
      {title}
    </Heading>
    {desc && (
      <Text fontSize="sm" color={useColorModeValue('gray.500', 'gray.400')} maxW="500px">
        {desc}
      </Text>
    )}
  </VStack>
)

/* ── Main Landing ─────────────────────────────────────────────── */

const GuideLanding: React.FC = () => {
  const navigate = useNavigate()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const tc = terminalPalette.colors(isDark)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const pageBg = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const subtitleColor = useColorModeValue('gray.500', 'gray.400')

  return (
    <Box w="full" minH="100vh" bg={pageBg}>

      {/* ═══════════ HERO ═══════════ */}
      <Box
        bg={isDark
          ? 'linear-gradient(180deg, rgba(46,52,64,1) 0%, rgba(46,52,64,0) 100%)'
          : 'linear-gradient(180deg, rgba(248,249,252,1) 0%, rgba(248,249,252,0) 100%)'
        }
        pt={[10, 14, 18]}
        pb={[8, 12, 14]}
      >
        <Container maxW="4xl" textAlign="center">
          {/* Logo */}
          <Flex justify="center" mb={6}>
            <Image
              src={`${import.meta.env.BASE_URL}logo.svg`}
              alt="TermHub"
              h={['64px', '80px', '100px']}
              objectFit="contain"
            />
          </Flex>

          <Heading
            as="h1"
            fontSize={['xl', '2xl', '3xl']}
            fontWeight="bold"
            color={useColorModeValue('gray.800', 'gray.50')}
            mb={3}
            lineHeight="1.3"
          >
            Build Your Portfolio
          </Heading>
          <Text
            fontSize={['sm', 'md']}
            color={tc.command}
            fontWeight="semibold"
            mb={4}
          >
            No Coding Required
          </Text>
          <Text
            fontSize={['xs', 'sm']}
            color={subtitleColor}
            maxW="520px"
            mx="auto"
            mb={6}
            lineHeight="1.8"
          >
            Open-source portfolio for developers, researchers, and creatives.
            Terminal aesthetic. Designed around one simple idea:
          </Text>

          {/* CV → AI → Markdown → Homepage pipeline */}
          <Flex
            justify="center" align="center" gap={[2, 3]}
            mb={8} flexWrap="wrap"
          >
            {[
              { label: 'CV', icon: FaFileAlt, color: '#d08770' },
              { label: 'AI', icon: FaRobot, color: '#88c0d0' },
              { label: 'Markdown', icon: FaCode, color: '#a3be8c' },
              { label: 'Homepage', icon: FaGlobe, color: '#b48ead' },
            ].map((step, i, arr) => (
              <React.Fragment key={step.label}>
                <VStack spacing={1}>
                  <Flex
                    w={['40px', '48px']} h={['40px', '48px']}
                    borderRadius="lg"
                    bg={`${step.color}18`}
                    border={`1.5px solid ${step.color}40`}
                    align="center" justify="center"
                  >
                    <Icon as={step.icon} color={step.color} boxSize={[4, 5]} />
                  </Flex>
                  <Text fontSize="2xs" fontWeight="bold" color={step.color} fontFamily="mono">
                    {step.label}
                  </Text>
                </VStack>
                {i < arr.length - 1 && (
                  <Icon as={FaArrowRight} color={tc.muted} boxSize={[2.5, 3]} mt="-12px" />
                )}
              </React.Fragment>
            ))}
          </Flex>

          <Text
            fontSize={['xs', 'sm']}
            color={subtitleColor}
            maxW="500px"
            mx="auto"
            mb={8}
            lineHeight="1.8"
          >
            Give your CV to any AI (ChatGPT, Claude, Gemini...),
            generate Markdown, and plug it in. Or use our built-in MCP server
            to let Claude do it all automatically.
          </Text>

          {/* CTA buttons */}
          <Flex justify="center" gap={3} flexWrap="wrap">
            <Flex
              as="button"
              onClick={() => document.getElementById('quickstart')?.scrollIntoView({ behavior: 'smooth' })}
              bg={tc.command}
              color="white"
              px={5} py={2.5}
              borderRadius="md"
              fontWeight="semibold"
              fontSize="sm"
              align="center"
              gap={2}
              _hover={{ opacity: 0.85, transform: 'translateY(-1px)' }}
              transition="all 0.2s"
              shadow="md"
            >
              <Icon as={FaRocket} boxSize={3.5} />
              Get Started
            </Flex>

            <Flex
              as="button"
              onClick={() => navigate('/docs')}
              bg="transparent"
              border="1px solid"
              borderColor={tc.command}
              color={tc.command}
              px={5} py={2.5}
              borderRadius="md"
              fontWeight="semibold"
              fontSize="sm"
              align="center"
              gap={2}
              _hover={{ bg: `${tc.command}12` }}
              transition="all 0.2s"
            >
              <Icon as={FaBook} boxSize={3.5} />
              Full Documentation
            </Flex>

            <Flex
              as="a"
              href="https://github.com/H-Freax/TermHub"
              target="_blank"
              rel="noopener noreferrer"
              bg="transparent"
              border="1px solid"
              borderColor={borderColor}
              color={subtitleColor}
              px={5} py={2.5}
              borderRadius="md"
              fontWeight="semibold"
              fontSize="sm"
              align="center"
              gap={2}
              _hover={{ borderColor: tc.secondary, color: useColorModeValue('gray.700', 'gray.200') }}
              transition="all 0.2s"
            >
              <Icon as={FaGithub} boxSize={3.5} />
              GitHub
            </Flex>

            <Flex
              as="a"
              href="https://termhubai.com"
              target="_blank"
              rel="noopener noreferrer"
              bg={isDark ? 'rgba(136,192,208,0.08)' : 'rgba(136,192,208,0.1)'}
              border={`1px solid ${isDark ? 'rgba(136,192,208,0.2)' : 'rgba(136,192,208,0.25)'}`}
              color={tc.command}
              px={5} py={2.5}
              borderRadius="md"
              fontWeight="semibold"
              fontSize="sm"
              align="center"
              gap={2}
              _hover={{ bg: isDark ? 'rgba(136,192,208,0.15)' : 'rgba(136,192,208,0.18)' }}
              transition="all 0.2s"
            >
              <Icon as={FaGlobe} boxSize={3.5} />
              No Code? Try Our Hosted Builder
            </Flex>
          </Flex>

          {/* GitHub badges */}
          <Flex justify="center" gap={4} mt={6} flexWrap="wrap">
            <Flex
              as="a"
              href="https://github.com/H-Freax/TermHub/stargazers"
              target="_blank"
              rel="noopener noreferrer"
              align="center" gap={1.5}
              px={3} py={1}
              bg={isDark ? 'rgba(235,203,139,0.08)' : 'rgba(235,203,139,0.12)'}
              border={`1px solid ${isDark ? 'rgba(235,203,139,0.2)' : 'rgba(235,203,139,0.3)'}`}
              borderRadius="full"
              fontSize="xs"
              color={tc.highlight}
              _hover={{ bg: isDark ? 'rgba(235,203,139,0.15)' : 'rgba(235,203,139,0.2)' }}
              transition="all 0.2s"
            >
              <Icon as={FaStar} boxSize={3} />
              <Text fontWeight="semibold">Star on GitHub</Text>
            </Flex>
            <Flex
              as="a"
              href="https://github.com/H-Freax/TermHub/fork"
              target="_blank"
              rel="noopener noreferrer"
              align="center" gap={1.5}
              px={3} py={1}
              bg={isDark ? 'rgba(163,190,140,0.08)' : 'rgba(163,190,140,0.1)'}
              border={`1px solid ${isDark ? 'rgba(163,190,140,0.2)' : 'rgba(163,190,140,0.25)'}`}
              borderRadius="full"
              fontSize="xs"
              color={tc.success}
              _hover={{ bg: isDark ? 'rgba(163,190,140,0.15)' : 'rgba(163,190,140,0.18)' }}
              transition="all 0.2s"
            >
              <Icon as={FaCodeBranch} boxSize={3} />
              <Text fontWeight="semibold">Fork</Text>
            </Flex>
            <Flex
              as="a"
              href="https://discord.gg/QV2kyXzaTa"
              target="_blank"
              rel="noopener noreferrer"
              align="center" gap={1.5}
              px={3} py={1}
              bg={isDark ? 'rgba(114,137,218,0.08)' : 'rgba(114,137,218,0.1)'}
              border={`1px solid ${isDark ? 'rgba(114,137,218,0.2)' : 'rgba(114,137,218,0.25)'}`}
              borderRadius="full"
              fontSize="xs"
              color="#7289da"
              _hover={{ bg: isDark ? 'rgba(114,137,218,0.15)' : 'rgba(114,137,218,0.18)' }}
              transition="all 0.2s"
            >
              <Icon as={FaDiscord} boxSize={3} />
              <Text fontWeight="semibold">Discord</Text>
            </Flex>
            <Flex
              align="center" gap={1.5}
              px={3} py={1}
              borderRadius="full"
              fontSize="xs"
              color={subtitleColor}
            >
              <Icon as={FaBalanceScale} boxSize={3} />
              <Text>GPL-3.0</Text>
            </Flex>
          </Flex>

          {/* Terminal preview - gives a taste of the aesthetic */}
          <Box
            mt={10}
            mx="auto"
            maxW="460px"
            borderRadius="md"
            overflow="hidden"
            border={`1px solid ${tc.border}`}
            boxShadow={isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)'}
          >
            {/* RGB bar */}
            <Flex h="3px" w="full">
              {terminalPalette.rainbow.map((c, i) =>
                Array.from({ length: 4 }, (_, j) => (
                  <Box key={`${i}-${j}`} flex={1} h="full" bg={c} opacity={0.5 + 0.5 * Math.sin((i * 4 + j) * 0.3)} />
                ))
              )}
            </Flex>
            <Flex bg={tc.header} px={3} py={1.5} align="center" gap={2} borderBottom={`1px solid ${tc.border}`}>
              <HStack spacing={1}>
                <Box w="8px" h="8px" borderRadius="full" bg="#bf616a" />
                <Box w="8px" h="8px" borderRadius="full" bg="#ebcb8b" />
                <Box w="8px" h="8px" borderRadius="full" bg="#a3be8c" />
              </HStack>
              <Text fontSize="2xs" color={tc.secondary} fontFamily="mono" ml={1}>cookie@termhub ~</Text>
              <Box flex={1} />
              <Text fontSize="2xs" color={tc.muted} fontFamily="mono">{formattedTime}</Text>
            </Flex>
            <Box bg={tc.bg} px={3} py={2.5} fontFamily="mono" fontSize="xs" lineHeight="1.9">
              <Text><Text as="span" color={tc.prompt}>$</Text> <Text as="span" color={tc.command}>npm run dev</Text></Text>
              <Text color={tc.info}>Server running at http://localhost:5173</Text>
              <Text color={tc.secondary}># Edit content/ files — browser auto-refreshes</Text>
              <Text>
                <Text as="span" color={tc.prompt}>$</Text>{' '}
                <Text as="span" color={tc.secondary} animation={`${blink} 1s step-end infinite`}>▌</Text>
              </Text>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ═══════════ MCP SHOWCASE (NEW) ═══════════ */}
      <Box
        bg={isDark
          ? 'linear-gradient(135deg, rgba(136,192,208,0.06) 0%, rgba(94,129,172,0.06) 100%)'
          : 'linear-gradient(135deg, rgba(136,192,208,0.08) 0%, rgba(94,129,172,0.04) 100%)'
        }
        borderY="1px solid"
        borderColor={isDark ? 'rgba(136,192,208,0.15)' : 'rgba(136,192,208,0.2)'}
      >
        <Container maxW="5xl" py={[10, 14]}>
          <VStack spacing={2} mb={8} textAlign="center">
            <Flex align="center" gap={2}>
              <Flex
                px={2} py={0.5} borderRadius="full"
                bg="#bf616a" color="white"
                fontSize="2xs" fontWeight="bold" letterSpacing="wider"
              >
                NEW
              </Flex>
              <Text fontSize="xs" fontWeight="bold" color="#88c0d0" textTransform="uppercase" letterSpacing="wider" fontFamily="mono">
                AI-Powered
              </Text>
            </Flex>
            <Heading as="h2" fontSize={['lg', 'xl']} fontWeight="semibold" color={useColorModeValue('gray.800', 'gray.100')}>
              Supports MCP — CV to Homepage, Fully Automated
            </Heading>
            <Text fontSize="sm" color={subtitleColor} maxW="600px">
              TermHub is designed around <Text as="span" fontWeight="semibold" color={tc.command}>CV → AI → Markdown → Homepage</Text>.
              With our built-in MCP server, Claude reads your resume and generates
              every content file automatically — no copy-paste, no manual editing.
            </Text>
          </VStack>

          <Grid templateColumns={['1fr', '1fr', '1fr 1fr']} gap={6}>
            {/* Left: terminal demo */}
            <GridItem>
              <Box
                border={`1px solid ${tc.border}`}
                borderRadius="md"
                overflow="hidden"
                boxShadow={isDark ? '0 8px 32px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.08)'}
              >
                <Flex h="3px" w="full">
                  {terminalPalette.rainbow.map((c, i) =>
                    Array.from({ length: 4 }, (_, j) => (
                      <Box key={`mcp-${i}-${j}`} flex={1} h="full" bg={c} opacity={0.5 + 0.5 * Math.sin((i * 4 + j) * 0.3)} />
                    ))
                  )}
                </Flex>
                <Flex bg={tc.header} px={3} py={1.5} align="center" gap={2} borderBottom={`1px solid ${tc.border}`}>
                  <HStack spacing={1}>
                    <Box w="8px" h="8px" borderRadius="full" bg="#bf616a" />
                    <Box w="8px" h="8px" borderRadius="full" bg="#ebcb8b" />
                    <Box w="8px" h="8px" borderRadius="full" bg="#a3be8c" />
                  </HStack>
                  <Text fontSize="2xs" color={tc.secondary} fontFamily="mono" ml={1}>claude — MCP workflow</Text>
                </Flex>
                <Box bg={tc.bg} px={3} py={3} fontFamily="mono" fontSize="xs" lineHeight="2.2">
                  <Text color={tc.secondary}># You say to Claude:</Text>
                  <Text><Text as="span" color={tc.prompt}>{'>'}</Text> <Text as="span" color={tc.text}>"Parse my resume and build my portfolio"</Text></Text>
                  <Text color={tc.secondary} mt={1}># Claude automatically runs:</Text>
                  <Text><Text as="span" color={tc.info}>{'[1/7]'}</Text> <Text as="span" color={tc.command}>parse_pdf</Text> <Text as="span" color={tc.secondary}>~/resume.pdf</Text></Text>
                  <Text><Text as="span" color={tc.info}>{'[2/7]'}</Text> <Text as="span" color={tc.command}>reset_content</Text></Text>
                  <Text><Text as="span" color={tc.info}>{'[3/7]'}</Text> <Text as="span" color={tc.command}>update_site_config</Text> <Text as="span" color={tc.secondary}>name, email, links</Text></Text>
                  <Text><Text as="span" color={tc.info}>{'[4/7]'}</Text> <Text as="span" color={tc.command}>add_publication</Text> <Text as="span" color={tc.param}>x4</Text></Text>
                  <Text><Text as="span" color={tc.info}>{'[5/7]'}</Text> <Text as="span" color={tc.command}>add_project</Text> <Text as="span" color={tc.param}>x3</Text></Text>
                  <Text><Text as="span" color={tc.info}>{'[6/7]'}</Text> <Text as="span" color={tc.command}>add_experience</Text> <Text as="span" color={tc.param}>x5</Text></Text>
                  <Text><Text as="span" color={tc.info}>{'[7/7]'}</Text> <Text as="span" color={tc.command}>preview_site</Text></Text>
                  <Text mt={1} color={tc.success}>Done! Portfolio live at http://localhost:5173</Text>
                </Box>
              </Box>
            </GridItem>

            {/* Right: feature highlights */}
            <GridItem>
              <VStack spacing={3} align="stretch">
                {[
                  { icon: FaFileAlt, title: 'Resume to Portfolio', desc: 'Give Claude your PDF or text resume — it extracts education, experience, publications, projects, awards, and generates all content files.', color: '#88c0d0' },
                  { icon: FaRobot, title: '19 MCP Tools', desc: 'Purpose-built tools for every content type: add_publication, add_project, add_experience, update_site_config, manage_assets, and more.', color: '#a3be8c' },
                  { icon: FaTerminal, title: 'Works with Claude Desktop & Code', desc: 'Built on the Model Context Protocol standard. Configure once, then use natural language to manage your entire portfolio.', color: '#5e81ac' },
                  { icon: FaRocket, title: 'Incremental Updates', desc: '"Add my latest project" or "Update my experience" — Claude calls the right tool. No need to regenerate everything.', color: '#b48ead' },
                ].map(item => (
                  <HStack
                    key={item.title}
                    bg={cardBg}
                    border="1px solid" borderColor={borderColor}
                    borderRadius="lg"
                    p={4} spacing={4} align="start"
                    _hover={{ borderColor: item.color, shadow: isDark ? 'dark-lg' : 'md' }}
                    transition="all 0.2s"
                  >
                    <Flex w="36px" h="36px" borderRadius="md" flexShrink={0} bg={`${item.color}18`} align="center" justify="center">
                      <Icon as={item.icon} color={item.color} boxSize={4} />
                    </Flex>
                    <Box>
                      <Text fontWeight="semibold" fontSize="sm" color={useColorModeValue('gray.800', 'gray.100')} mb={0.5}>{item.title}</Text>
                      <Text fontSize="xs" color={subtitleColor} lineHeight="1.6">{item.desc}</Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </GridItem>
          </Grid>

          {/* Setup hint */}
          <Flex
            mt={6}
            bg={isDark ? 'rgba(136,192,208,0.06)' : 'rgba(136,192,208,0.08)'}
            border={`1px solid ${isDark ? 'rgba(136,192,208,0.2)' : 'rgba(136,192,208,0.25)'}`}
            borderRadius="md"
            px={4} py={3}
            align="center"
            justify="space-between"
            flexWrap="wrap"
            gap={3}
          >
            <HStack spacing={2}>
              <Text fontSize="xs" color="#88c0d0" fontWeight="bold" fontFamily="mono" flexShrink={0}>MCP</Text>
              <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.7">
                Setup: <Text as="span" fontFamily="mono" color={tc.command}>cd mcp-server && npm install</Text> — then configure Claude Desktop or Code.
              </Text>
            </HStack>
            <Flex
              as="button"
              onClick={() => navigate('/docs#mcp-server')}
              fontSize="xs"
              fontWeight="semibold"
              color="#88c0d0"
              align="center"
              gap={1}
              _hover={{ opacity: 0.8 }}
              transition="opacity 0.15s"
              flexShrink={0}
            >
              Full Setup Guide
              <Icon as={FaArrowRight} boxSize={2.5} />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* ═══════════ FEATURES ═══════════ */}
      <Container maxW="5xl" py={[10, 14]}>
        <SectionHead
          label="Features"
          title="Everything You Need in a Portfolio"
          desc="Toggle features on or off in one config file. Only show what matters to you."
          color={tc.command}
        />

        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          <FeatureCard icon={FaCode} title="Projects" desc="Showcase your work with tags, categories, links, and highlights." accent="#a3be8c" />
          <FeatureCard icon={FaBriefcase} title="Experience" desc="Timeline of jobs, internships, education — with logos and details." accent="#d08770" />
          <FeatureCard icon={FaPen} title="Articles" desc="Blog posts and write-ups with categories and multi-platform links." accent="#b48ead" />
          <FeatureCard icon={FaFileAlt} title="Publications" desc="Research papers with venues, authors, links, and badges." accent="#5e81ac" />
          <FeatureCard icon={FaTrophy} title="Awards" desc="Hackathon wins, fellowships, honors — with auto-categorized icons." accent="#bf616a" />
          <FeatureCard icon={FaNewspaper} title="News" desc="Announcements, talks, releases, and updates on your home page." accent="#ebcb8b" />
        </SimpleGrid>
      </Container>

      {/* ═══════════ QUICK START ═══════════ */}
      <Box
        id="quickstart"
        bg={isDark ? 'rgba(0,0,0,0.15)' : 'white'}
        borderY="1px solid"
        borderColor={borderColor}
      >
        <Container maxW="5xl" py={[10, 14]}>
          <SectionHead
            label="Quick Start"
            title="Up and Running in 3 Steps"
            desc="You only need Node.js installed. No React knowledge, no coding experience required."
            color={tc.success}
          />

          <SimpleGrid columns={[1, 1, 3]} spacing={5}>
            <StepCard
              step={1} icon={FaTerminal} title="Install" color="#a3be8c"
              desc="Clone the repo and install dependencies. The setup wizard asks your name, email, and links — then generates your config."
              command="npm install && npm run setup"
            />
            <StepCard
              step={2} icon={FaPaintBrush} title="Customize" color="#5e81ac"
              desc="Edit plain text files in the content/ folder. Add your projects, experience, and more. Save the file — browser auto-refreshes."
              command="npm run dev"
            />
            <StepCard
              step={3} icon={FaGlobe} title="Deploy" color="#b48ead"
              desc="Push to GitHub and your site goes live automatically via GitHub Pages. Or deploy to Vercel / Netlify with one click."
              command="git push"
            />
          </SimpleGrid>

          {/* Prerequisites */}
          <Flex
            mt={6}
            bg={isDark ? 'rgba(163,190,140,0.06)' : 'rgba(163,190,140,0.08)'}
            border={`1px solid ${isDark ? 'rgba(163,190,140,0.2)' : 'rgba(163,190,140,0.25)'}`}
            borderRadius="md"
            px={4} py={3}
            align="center"
            gap={3}
          >
            <Text fontSize="xs" color={tc.success} fontWeight="bold" fontFamily="mono" flexShrink={0}>REQ</Text>
            <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.7">
              <Text as="span" fontWeight="bold">Node.js v18+</Text>
              {' '}— download from nodejs.org (choose LTS). That's it!
            </Text>
          </Flex>

          {/* No-code alternative */}
          <Flex
            mt={4}
            bg={isDark ? 'rgba(136,192,208,0.06)' : 'rgba(136,192,208,0.08)'}
            border={`1px solid ${isDark ? 'rgba(136,192,208,0.15)' : 'rgba(136,192,208,0.2)'}`}
            borderRadius="md"
            px={4} py={3}
            align="center"
            justify="space-between"
            flexWrap="wrap"
            gap={3}
          >
            <HStack spacing={2} flex={1}>
              <Text fontSize="xs" color={tc.command} fontWeight="bold" fontFamily="mono" flexShrink={0}>TIP</Text>
              <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.300')} lineHeight="1.7">
                <Text as="span" fontWeight="bold">Don&apos;t want to set up a dev environment?</Text>
                {' '}We also offer a hosted solution — just upload your resume and get a live portfolio. No Git, no terminal, no coding required.
              </Text>
            </HStack>
            <Flex
              as="a"
              href="https://termhubai.com"
              target="_blank"
              rel="noopener noreferrer"
              bg={tc.command}
              color="white"
              px={4} py={1.5}
              borderRadius="md"
              fontWeight="semibold"
              fontSize="xs"
              align="center"
              gap={1.5}
              _hover={{ opacity: 0.85 }}
              transition="all 0.2s"
              flexShrink={0}
            >
              <Icon as={FaGlobe} boxSize={3} />
              termhubai.com
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* ═══════════ CONTENT STRUCTURE ═══════════ */}
      <Container maxW="5xl" py={[10, 14]}>
        <SectionHead
          label="How It Works"
          title="One Folder, All Your Content"
          desc="Everything you edit lives in the content/ folder. You never need to touch code files."
          color="#d08770"
        />

        <Grid templateColumns={['1fr', '1fr', '1fr 1fr']} gap={6}>
          {/* File tree in a terminal frame */}
          <GridItem>
            <Box
              border={`1px solid ${tc.border}`}
              borderRadius="md"
              overflow="hidden"
              boxShadow={isDark ? '0 4px 16px rgba(0,0,0,0.25)' : '0 4px 16px rgba(0,0,0,0.06)'}
            >
              {/* RGB bar */}
              <Flex h="3px" w="full">
                {terminalPalette.rainbow.map((c, i) =>
                  Array.from({ length: 4 }, (_, j) => (
                    <Box key={`${i}-${j}`} flex={1} h="full" bg={c} opacity={0.5 + 0.5 * Math.sin((i * 4 + j) * 0.3)} />
                  ))
                )}
              </Flex>
              <Flex bg={tc.header} px={3} py={1.5} align="center" gap={2} borderBottom={`1px solid ${tc.border}`}>
                <HStack spacing={1}>
                  <Box w="8px" h="8px" borderRadius="full" bg="#bf616a" />
                  <Box w="8px" h="8px" borderRadius="full" bg="#ebcb8b" />
                  <Box w="8px" h="8px" borderRadius="full" bg="#a3be8c" />
                </HStack>
                <Text fontSize="2xs" color={tc.secondary} fontFamily="mono" ml={1}>tree content/</Text>
              </Flex>
              <Box bg={tc.bg} px={4} py={3} fontFamily="mono" fontSize="xs" lineHeight="2">
                {[
                  { indent: 0, name: 'site.json', desc: 'name, links, template, sections', color: tc.command },
                  { indent: 0, name: 'about.md', desc: 'bio & journey', color: tc.text },
                  { indent: 0, name: 'publications/', desc: 'one file per paper', color: tc.highlight, isDir: true },
                  { indent: 0, name: 'projects/', desc: 'one file per project', color: tc.highlight, isDir: true },
                  { indent: 0, name: 'articles/', desc: 'blog posts', color: tc.highlight, isDir: true },
                  { indent: 0, name: 'experience.json', desc: 'work & education', color: tc.command },
                  { indent: 0, name: 'news.json', desc: 'announcements', color: tc.command },
                  { indent: 0, name: 'awards.json', desc: 'honors & prizes', color: tc.command },
                  { indent: 0, name: 'talks.json', desc: 'presentations', color: tc.command },
                  { indent: 0, name: 'teaching.json', desc: 'courses taught', color: tc.command },
                  { indent: 0, name: 'research.json', desc: 'lab affiliations', color: tc.command },
                  { indent: 0, name: 'images/', desc: 'all your images', color: tc.highlight, isDir: true },
                ].map((item, i) => (
                  <Flex key={i} pl={`${item.indent * 16}px`} align="center" gap={1}>
                    <Text color={tc.muted}>{item.indent > 0 ? '├── ' : ''}</Text>
                    <Text color={item.color} fontWeight={item.isDir ? 'bold' : 'normal'}>{item.name}</Text>
                    {item.desc && <Text color={tc.secondary} ml={1}>{item.desc}</Text>}
                  </Flex>
                ))}
              </Box>
            </Box>
          </GridItem>

          {/* Format explanation cards */}
          <GridItem>
            <VStack spacing={4} align="stretch">
              <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="lg" p={5}>
                <HStack mb={3} spacing={2}>
                  <Box h="2px" w="12px" bg="#5e81ac" borderRadius="full" />
                  <Text fontWeight="bold" fontSize="sm" color={useColorModeValue('gray.700', 'gray.200')}>
                    Markdown (.md)
                  </Text>
                  <Text fontSize="2xs" color={subtitleColor}>projects, papers, articles</Text>
                </HStack>
                <Text fontSize="xs" color={subtitleColor} lineHeight="1.7" mb={3}>
                  Each item is its own file. Simple formatting — add bold, links, lists.
                </Text>
                <CodePreview lines={[
                  { key: 'title', value: 'My Cool Project' },
                  { key: 'tags', value: '[React, Python]' },
                ]} />
              </Box>

              <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="lg" p={5}>
                <HStack mb={3} spacing={2}>
                  <Box h="2px" w="12px" bg="#a3be8c" borderRadius="full" />
                  <Text fontWeight="bold" fontSize="sm" color={useColorModeValue('gray.700', 'gray.200')}>
                    JSON (.json)
                  </Text>
                  <Text fontSize="2xs" color={subtitleColor}>config, experience, news</Text>
                </HStack>
                <Text fontSize="xs" color={subtitleColor} lineHeight="1.7" mb={3}>
                  Structured data for settings, lists, and timelines.
                </Text>
                <CodePreview lines={[
                  { key: '"name"', value: '"Your Name"' },
                  { key: '"email"', value: '"you@email.com"' },
                ]} />
              </Box>

              <Flex
                bg={isDark ? 'rgba(136,192,208,0.05)' : 'rgba(94,129,172,0.04)'}
                border="1px solid" borderColor={borderColor}
                borderRadius="lg" px={4} py={3}
                align="center" gap={2}
              >
                <Text fontSize="xs" color={tc.success} fontWeight="bold" fontFamily="mono">TIP</Text>
                <Text fontSize="xs" color={subtitleColor} lineHeight="1.6">
                  Both are plain text — editable in any editor, even Notepad.
                </Text>
              </Flex>
            </VStack>
          </GridItem>
        </Grid>
      </Container>

      {/* ═══════════ FEATURE TOGGLES ═══════════ */}
      <Box bg={isDark ? 'rgba(0,0,0,0.15)' : 'white'} borderY="1px solid" borderColor={borderColor}>
        <Container maxW="5xl" py={[10, 14]}>
          <SectionHead
            label="Customizable"
            title="Toggle Features On & Off"
            desc="One setting controls each page. Set to true or false — that's it."
            color="#b48ead"
          />

          <Grid templateColumns={['1fr', '1fr', '5fr 3fr']} gap={6} maxW="700px" mx="auto">
            {/* Toggle list */}
            <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="lg" overflow="hidden">
              <Flex bg={tc.header} px={4} py={2} borderBottom={`1px solid ${tc.border}`}>
                <Text fontSize="2xs" color={tc.secondary} fontFamily="mono">site.json &rarr; features</Text>
              </Flex>
              <Box px={4} py={2} fontFamily="mono" fontSize="sm">
                {[
                  { name: 'publications', on: true, label: 'Papers & publications' },
                  { name: 'projects', on: true, label: 'Portfolio' },
                  { name: 'articles', on: true, label: 'Blog posts' },
                  { name: 'experience', on: true, label: 'Work timeline' },
                  { name: 'news', on: true, label: 'Announcements' },
                  { name: 'pets', on: false, label: 'Companions' },
                ].map(f => (
                  <Flex key={f.name} py={1.5} align="center" justify="space-between">
                    <HStack spacing={2}>
                      <Icon
                        as={FaToggleOn}
                        color={f.on ? tc.success : tc.muted}
                        boxSize={4}
                        transform={f.on ? 'none' : 'scaleX(-1)'}
                      />
                      <Text fontSize="xs" color={tc.command}>{f.name}</Text>
                    </HStack>
                    <Text fontSize="2xs" color={subtitleColor} fontFamily="body">{f.label}</Text>
                  </Flex>
                ))}
              </Box>
            </Box>

            {/* Persona presets */}
            <VStack spacing={3} align="stretch">
              <Text fontSize="2xs" fontWeight="bold" color={subtitleColor} textTransform="uppercase" letterSpacing="wider">
                Recommended presets
              </Text>
              {[
                { icon: FaCode, label: 'Developer', features: 'projects + experience + articles', color: '#a3be8c' },
                { icon: FaGraduationCap, label: 'Researcher', features: 'publications + experience + news', color: '#5e81ac' },
                { icon: FaBook, label: 'Student', features: 'projects + experience + awards', color: '#d08770' },
                { icon: FaCog, label: 'Minimal', features: 'projects only', color: '#b48ead' },
              ].map(p => (
                <HStack
                  key={p.label}
                  bg={cardBg}
                  border="1px solid" borderColor={borderColor}
                  borderRadius="md" px={3} py={2.5}
                  spacing={3}
                >
                  <Icon as={p.icon} color={p.color} boxSize={3.5} />
                  <Box>
                    <Text fontSize="xs" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')}>{p.label}</Text>
                    <Text fontSize="2xs" color={subtitleColor}>{p.features}</Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Grid>
        </Container>
      </Box>

      {/* ═══════════ DOCS INDEX ═══════════ */}
      <Container maxW="5xl" py={[10, 14]}>
        <SectionHead
          label="Documentation"
          title="Detailed Guides for Every Section"
          desc="Click any topic to jump to the full docs with examples and field references."
          color={tc.command}
        />

        <SimpleGrid columns={[1, 2, 3]} spacing={3}>
          {([
            { id: 'quickstart', icon: FaRocket, title: 'Quick Start', desc: 'Install, setup wizard, first run', color: '#a3be8c' },
            { id: 'structure', icon: FaFolderOpen, title: 'Project Structure', desc: 'Content folder layout explained', color: '#ebcb8b' },
            { id: 'site-config', icon: FaCog, title: 'Site Config', desc: 'Name, social links, avatar, skills', color: '#88c0d0' },
            { id: 'add-project', icon: FaCode, title: 'Add a Project', desc: 'All fields, tags, extra links', color: '#a3be8c' },
            { id: 'add-publication', icon: FaFileAlt, title: 'Add a Publication', desc: 'Venues, authors, 12 link types', color: '#5e81ac' },
            { id: 'edit-experience', icon: FaBriefcase, title: 'Edit Experience', desc: 'Education, timeline, reviewing', color: '#d08770' },
            { id: 'edit-news', icon: FaNewspaper, title: 'News & Awards', desc: 'Announcements, honors, icons', color: '#ebcb8b' },
            { id: 'images', icon: FaImage, title: 'Images & Logos', desc: 'Avatar, logos, references', color: '#b48ead' },
            { id: 'mcp-server', icon: FaRobot, title: 'AI Integration (MCP)', desc: 'Resume to portfolio via AI', color: '#88c0d0', isNew: true },
            { id: 'deploy', icon: FaGlobe, title: 'Deploy', desc: 'GitHub Pages, Vercel, Netlify', color: '#bf616a' },
          ] as const).map(item => (
            <Flex
              key={item.id}
              as="button"
              onClick={() => navigate(`/docs#${item.id}`)}
              bg={'isNew' in item && item.isNew ? (isDark ? 'rgba(136,192,208,0.06)' : 'rgba(136,192,208,0.05)') : cardBg}
              border="1px solid"
              borderColor={'isNew' in item && item.isNew ? (isDark ? 'rgba(136,192,208,0.25)' : 'rgba(136,192,208,0.3)') : borderColor}
              borderRadius="lg"
              px={4} py={3.5}
              align="center"
              justify="space-between"
              _hover={{ borderColor: item.color, shadow: isDark ? 'dark-lg' : 'sm' }}
              transition="all 0.2s ease"
              textAlign="left"
              position="relative"
            >
              {'isNew' in item && item.isNew && (
                <Flex
                  position="absolute" top="-8px" right="8px"
                  px={1.5} py={0.5} borderRadius="full"
                  bg="#bf616a" color="white"
                  fontSize="2xs" fontWeight="bold" letterSpacing="wide"
                >
                  NEW
                </Flex>
              )}
              <HStack spacing={3}>
                <Icon as={item.icon} color={item.color} boxSize={4} />
                <Box>
                  <Text fontWeight="semibold" fontSize="sm" color={useColorModeValue('gray.700', 'gray.200')}>
                    {item.title}
                  </Text>
                  <Text fontSize="xs" color={subtitleColor}>{item.desc}</Text>
                </Box>
              </HStack>
              <Icon as={FaChevronRight} color={subtitleColor} boxSize={3} />
            </Flex>
          ))}
        </SimpleGrid>
      </Container>

      {/* ═══════════ OPEN SOURCE ═══════════ */}
      <Box bg={isDark ? 'rgba(0,0,0,0.15)' : 'white'} borderY="1px solid" borderColor={borderColor}>
        <Container maxW="5xl" py={[10, 14]}>
          <SectionHead
            label="Open Source"
            title="Free Forever, Community Driven"
            desc="TermHub is open-source under GPL-3.0. Contributions, issues, and stars are welcome."
            color={tc.highlight}
          />

          <SimpleGrid columns={[2, 3, 5]} spacing={4} maxW="900px" mx="auto">
            <Flex
              as="a"
              href="https://github.com/H-Freax/TermHub/stargazers"
              target="_blank"
              rel="noopener noreferrer"
              direction="column"
              bg={cardBg}
              border="1px solid" borderColor={borderColor}
              borderRadius="lg"
              p={4}
              align="center"
              gap={2}
              _hover={{ borderColor: tc.highlight, shadow: isDark ? 'dark-lg' : 'md' }}
              transition="all 0.2s"
            >
              <Icon as={FaStar} color={tc.highlight} boxSize={5} />
              <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')}>Star</Text>
              <Text fontSize="2xs" color={subtitleColor}>Show your support</Text>
            </Flex>

            <Flex
              as="a"
              href="https://github.com/H-Freax/TermHub/fork"
              target="_blank"
              rel="noopener noreferrer"
              direction="column"
              bg={cardBg}
              border="1px solid" borderColor={borderColor}
              borderRadius="lg"
              p={4}
              align="center"
              gap={2}
              _hover={{ borderColor: tc.success, shadow: isDark ? 'dark-lg' : 'md' }}
              transition="all 0.2s"
            >
              <Icon as={FaCodeBranch} color={tc.success} boxSize={5} />
              <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')}>Fork</Text>
              <Text fontSize="2xs" color={subtitleColor}>Create your own</Text>
            </Flex>

            <Flex
              as="a"
              href="https://github.com/H-Freax/TermHub/issues"
              target="_blank"
              rel="noopener noreferrer"
              direction="column"
              bg={cardBg}
              border="1px solid" borderColor={borderColor}
              borderRadius="lg"
              p={4}
              align="center"
              gap={2}
              _hover={{ borderColor: tc.command, shadow: isDark ? 'dark-lg' : 'md' }}
              transition="all 0.2s"
            >
              <Icon as={FaGithub} color={tc.command} boxSize={5} />
              <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')}>Issues</Text>
              <Text fontSize="2xs" color={subtitleColor}>Report bugs & ideas</Text>
            </Flex>

            <Flex
              as="a"
              href="https://github.com/H-Freax/TermHub/pulls"
              target="_blank"
              rel="noopener noreferrer"
              direction="column"
              bg={cardBg}
              border="1px solid" borderColor={borderColor}
              borderRadius="lg"
              p={4}
              align="center"
              gap={2}
              _hover={{ borderColor: tc.param, shadow: isDark ? 'dark-lg' : 'md' }}
              transition="all 0.2s"
            >
              <Icon as={FaHeart} color={tc.param} boxSize={5} />
              <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')}>Contribute</Text>
              <Text fontSize="2xs" color={subtitleColor}>Pull requests welcome</Text>
            </Flex>

            <Flex
              as="a"
              href="https://discord.gg/QV2kyXzaTa"
              target="_blank"
              rel="noopener noreferrer"
              direction="column"
              bg={cardBg}
              border="1px solid" borderColor={borderColor}
              borderRadius="lg"
              p={4}
              align="center"
              gap={2}
              _hover={{ borderColor: '#7289da', shadow: isDark ? 'dark-lg' : 'md' }}
              transition="all 0.2s"
            >
              <Icon as={FaDiscord} color="#7289da" boxSize={5} />
              <Text fontSize="sm" fontWeight="bold" color={useColorModeValue('gray.700', 'gray.200')}>Discord</Text>
              <Text fontSize="2xs" color={subtitleColor}>Join the community</Text>
            </Flex>
          </SimpleGrid>

          {/* Tech stack & license */}
          <Flex justify="center" mt={8} gap={3} flexWrap="wrap">
            {['React', 'TypeScript', 'Vite', 'Chakra UI', 'Framer Motion'].map(tech => (
              <Text
                key={tech}
                fontSize="2xs"
                fontFamily="mono"
                px={2} py={1}
                bg={isDark ? 'rgba(136,192,208,0.08)' : 'rgba(94,129,172,0.06)'}
                border={`1px solid ${isDark ? 'rgba(136,192,208,0.15)' : 'rgba(94,129,172,0.12)'}`}
                borderRadius="md"
                color={tc.command}
              >
                {tech}
              </Text>
            ))}
          </Flex>
        </Container>
      </Box>

      {/* ═══════════ CTA ═══════════ */}
      <Container maxW="4xl" py={[10, 14]} textAlign="center">
        <Heading as="h2" fontSize={['lg', 'xl']} fontWeight="semibold" color={useColorModeValue('gray.800', 'gray.100')} mb={3}>
          Ready to Build Your Portfolio?
        </Heading>
        <Text fontSize="sm" color={subtitleColor} maxW="420px" mx="auto" mb={6}>
          Full documentation with step-by-step instructions and copy-paste examples.
        </Text>
        <Flex justify="center" gap={3} flexWrap="wrap">
          <Flex
            as="button"
            onClick={() => navigate('/docs')}
            bg={tc.command}
            color="white"
            px={6} py={2.5}
            borderRadius="md"
            fontWeight="semibold"
            fontSize="sm"
            align="center"
            gap={2}
            _hover={{ opacity: 0.85, transform: 'translateY(-1px)' }}
            transition="all 0.2s"
            shadow="md"
          >
            Read Full Documentation
            <Icon as={FaArrowRight} boxSize={3} />
          </Flex>
          <Flex
            as="a"
            href="https://github.com/H-Freax/TermHub"
            target="_blank"
            rel="noopener noreferrer"
            bg={isDark ? 'rgba(235,203,139,0.1)' : 'rgba(235,203,139,0.12)'}
            border={`1px solid ${isDark ? 'rgba(235,203,139,0.25)' : 'rgba(235,203,139,0.3)'}`}
            color={tc.highlight}
            px={6} py={2.5}
            borderRadius="md"
            fontWeight="semibold"
            fontSize="sm"
            align="center"
            gap={2}
            _hover={{ bg: isDark ? 'rgba(235,203,139,0.18)' : 'rgba(235,203,139,0.2)' }}
            transition="all 0.2s"
          >
            <Icon as={FaStar} boxSize={3.5} />
            Star on GitHub
          </Flex>
        </Flex>

        {/* No-code callout */}
        <Flex
          mt={8}
          mx="auto"
          maxW="520px"
          bg={isDark ? 'rgba(136,192,208,0.06)' : 'rgba(136,192,208,0.08)'}
          border={`1px solid ${isDark ? 'rgba(136,192,208,0.15)' : 'rgba(136,192,208,0.2)'}`}
          borderRadius="lg"
          px={5} py={4}
          direction="column"
          align="center"
          gap={3}
        >
          <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.300')} textAlign="center" lineHeight="1.7">
            <Text as="span" fontWeight="bold" color={tc.command}>Don&apos;t want to touch code?</Text>
            {' '}We also offer a hosted solution — upload your resume, and we build your portfolio for you. No Git, no terminal, no setup.
          </Text>
          <Flex
            as="a"
            href="https://termhubai.com"
            target="_blank"
            rel="noopener noreferrer"
            bg={tc.command}
            color="white"
            px={5} py={2}
            borderRadius="md"
            fontWeight="semibold"
            fontSize="sm"
            align="center"
            gap={2}
            _hover={{ opacity: 0.85, transform: 'translateY(-1px)' }}
            transition="all 0.2s"
            shadow="md"
          >
            <Icon as={FaGlobe} boxSize={3.5} />
            Try termhubai.com
          </Flex>
        </Flex>

        {/* Hide guide hint */}
        <HideGuideHint />
      </Container>
    </Box>
  )
}

/* ── "Hide this page" collapsible hint ────────────────────────── */

const HideGuideHint: React.FC = () => {
  const [open, setOpen] = React.useState(false)
  const { isDark, tc } = useTC()
  const subtitleColor = useColorModeValue('gray.500', 'gray.400')

  return (
    <VStack spacing={0} mt={8}>
      <Flex
        as="button"
        onClick={() => setOpen(v => !v)}
        align="center"
        gap={2}
        fontSize="xs"
        color={subtitleColor}
        _hover={{ color: tc.command }}
        transition="color 0.15s"
      >
        <Text>Deploying your own site? Hide this Guide page</Text>
        <Icon
          as={FaChevronRight}
          boxSize={2.5}
          transform={open ? 'rotate(90deg)' : 'none'}
          transition="transform 0.15s"
        />
      </Flex>

      {open && (
        <Box
          mt={3}
          bg={tc.bg}
          border={`1px solid ${tc.border}`}
          borderRadius="md"
          px={4} py={3}
          fontFamily="mono"
          fontSize="xs"
          maxW="440px"
          w="full"
        >
          <Text color={tc.secondary} mb={2}>
            In <Text as="span" color={tc.command}>content/site.json</Text>, set:
          </Text>
          <Box
            bg={isDark ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.04)'}
            border={`1px solid ${tc.border}`}
            borderRadius="sm"
            px={3} py={2}
            lineHeight="1.8"
          >
            <Text>
              <Text as="span" color={tc.prompt}>"guide"</Text>
              <Text as="span" color={tc.secondary}>: </Text>
              <Text as="span" color={tc.error}>false</Text>
            </Text>
          </Box>
          <Text color={tc.secondary} mt={2}>
            The Guide page and nav link will disappear. You can re-enable it anytime by setting it back to <Text as="span" color={tc.success}>true</Text>.
          </Text>
        </Box>
      )}
    </VStack>
  )
}

export default GuideLanding
