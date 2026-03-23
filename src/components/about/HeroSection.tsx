import { Box, VStack, Text, useColorModeValue, Image, HStack, Container, Stack, Link, Flex, SimpleGrid, Heading, Tooltip } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import { withBase } from '@/utils/asset'
import DynamicIcon from '../DynamicIcon'
import { useTranslation } from 'react-i18next'
import { heroSocialIcons } from '@/site.config'
import { useLocalizedData } from '@/hooks/useLocalizedData'

const MotionBox = motion(Box)
const MotionText = motion(Text)

interface ResearchItem {
  lab: string
  emoji: string
  advisor?: string
  focus: string
  link: string
}

interface EducationItem {
  course: string
  institution: string
  year: string
}

// Hero Section Component
interface HeroSectionProps {
  title: string
  avatar: string
  research?: ResearchItem[]
  researchLogos?: Record<string, string>
  education?: EducationItem[]
  educationLogos?: Record<string, string>
}

const HeroSection = ({ title, avatar, research = [], researchLogos = {}, education = [], educationLogos = {} }: HeroSectionProps) => {
  const { t } = useTranslation()
  const { siteOwner, siteConfig } = useLocalizedData()
  const headingColor = useColorModeValue('gray.800', 'white')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bg = useColorModeValue('gray.50', 'gray.900')
  const accentBg = useColorModeValue('blue.50', 'blue.900')

  return (
    <Box
      w="full"
      bg={bg}
      py={[3, 4, 6]}
      mt={[2, 3, 4]}
    >
      <Container maxW={["full", "full", "7xl"]} px={[2, 4, 8]}>
        <Stack
          direction={['column', 'column', 'row']}
          spacing={[3, 4, 6]}
          align="center"
          justify="space-between"
        >
          <VStack spacing={[2, 3]} align={['center', 'center', 'flex-start']} flex="1">
            <MotionText
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              as="h1"
              fontSize={["lg", "xl", "3xl"]}
              fontWeight="bold"
              color={headingColor}
              lineHeight="shorter"
              mb={[1, 2, 3]}
              display="flex"
              alignItems="center"
              gap={[1, 2]}
              flexWrap={["wrap", "wrap", "nowrap"]}
              textAlign={["center", "center", "left"]}
              w="full"
              sx={{
                justifyContent: ["center", "center", "flex-start"]
              }}
            >
              <MotionText
                as="span"
                color="yellow.400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                $
              </MotionText>
              <MotionText
                as="span"
                initial={{ width: 0 }}
                animate={{ width: "auto" }}
                transition={{ duration: 0.5, delay: 0.1 }}
                overflow="hidden"
                whiteSpace="nowrap"
                display="inline-block"
              >
                {t('hero.greeting')}{' '}
              </MotionText>
              <MotionText
                as="span"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: 0.6 }}
                color="cyan.400"
                fontFamily="mono"
                display="flex"
                alignItems="center"
                gap={1}
              >
                <MotionText
                  as="span"
                  initial={{ width: 0 }}
                  animate={{ width: "auto" }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {siteOwner.name.display}
                </MotionText>
              </MotionText>
            </MotionText>

            <HStack
              spacing={[1, 2]}
              mb={[2, 3, 4]}
              justify={['center', 'center', 'flex-start']}
              flexWrap="wrap"
              w="full"
            >
              <Text color="yellow.400" fontSize={["xs", "sm"]}>$</Text>
              <Text fontSize={["xs", "sm"]} color={useColorModeValue('gray.600', 'gray.400')}>{t('hero.sometimesI')}</Text>
              <Box h={["18px", "20px", "24px"]} overflow="hidden">
                <MotionBox
                  animate={{ y: [0, -18, -36, -54, -72, -90, 0] }}
                  transition={{
                    duration: 8,
                    times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9],
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  {siteOwner.rotatingSubtitles.map((text, index) => (
                    <Text
                      key={index}
                      h={["18px", "20px", "24px"]}
                      color="cyan.400"
                      fontWeight="bold"
                      fontSize={["xs", "sm"]}
                      fontFamily="mono"
                    >
                      {text}
                    </Text>
                  ))}
                </MotionBox>
              </Box>
            </HStack>


            <Box w="full" borderTop="1px dashed" borderColor={useColorModeValue('gray.200', 'gray.700')} />

            {/* Research & Education compact section */}
            {(research.length > 0 || education.length > 0) && (
              <SimpleGrid columns={[1, 1, 2]} spacing={[3, 3, 4]} w="full">
                {research.length > 0 && (
                  <VStack align="start" spacing={2}>
                    <Heading size="xs" color={textColor} textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                      Current Research
                    </Heading>
                    {research.map((item, index) => {
                      const logo = researchLogos[item.lab]
                      return (
                        <Link key={index} href={item.link} isExternal _hover={{ textDecoration: 'none' }} w="full">
                          <HStack spacing={2.5} p={2} borderRadius="md" transition="all 0.2s" _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}>
                            {logo ? (
                              <Image src={logo} alt={item.lab} w="28px" h="28px" borderRadius="sm" objectFit="contain" flexShrink={0} />
                            ) : (
                              <Flex w="28px" h="28px" borderRadius="sm" bg={accentBg} align="center" justify="center" flexShrink={0}>
                                <Text fontSize="sm">{item.emoji}</Text>
                              </Flex>
                            )}
                            <VStack align="start" spacing={0} flex={1}>
                              <Text fontSize={["xs", "sm"]} fontWeight="medium" lineHeight="short" color={headingColor}>{item.lab}</Text>
                              <Text fontSize="2xs" color={textColor} lineHeight="short" noOfLines={1}>
                                {item.advisor ? `w/ ${item.advisor}` : item.focus}
                              </Text>
                            </VStack>
                          </HStack>
                        </Link>
                      )
                    })}
                  </VStack>
                )}
                {education.length > 0 && (
                  <VStack align="start" spacing={2}>
                    <Heading size="xs" color={textColor} textTransform="uppercase" letterSpacing="wider" fontSize="2xs">
                      Education
                    </Heading>
                    {education.map((item, index) => {
                      const logo = educationLogos[item.institution]
                      return (
                        <HStack key={index} spacing={2.5} p={2} borderRadius="md" w="full">
                          {logo ? (
                            <Image src={logo} alt={item.institution} w="28px" h="28px" borderRadius="sm" objectFit="contain" flexShrink={0} />
                          ) : (
                            <Flex w="28px" h="28px" borderRadius="sm" bg={accentBg} align="center" justify="center" flexShrink={0}>
                              <Text fontSize="sm" fontWeight="bold" color="blue.500">{item.institution.charAt(0)}</Text>
                            </Flex>
                          )}
                          <VStack align="start" spacing={0} flex={1}>
                            <Text fontSize={["xs", "sm"]} fontWeight="medium" lineHeight="short" color={headingColor}>{item.course}</Text>
                            <Text fontSize="2xs" color={textColor} lineHeight="short">{item.institution} · {item.year}</Text>
                          </VStack>
                        </HStack>
                      )
                    })}
                  </VStack>
                )}
              </SimpleGrid>
            )}

            <Box w="full" borderTop="1px dashed" borderColor={useColorModeValue('gray.200', 'gray.700')} />

            {/* Welcome + contact */}
            <Flex w="full" direction={['column', 'column', 'row']} align={['center', 'center', 'center']} gap={[2, 2, 4]}>
              <Text fontSize="xs" color={textColor} lineHeight="tall" textAlign={['center', 'center', 'left']} flex={1} fontStyle="italic">
                {siteConfig.tagline ?? ''}
              </Text>
              <HStack spacing={2} flexShrink={0}>
                <Link href={`mailto:${siteOwner.contact.academicEmail}`} isExternal _hover={{ textDecoration: 'none' }}>
                  <HStack spacing={1.5} color={textColor} transition="all 0.15s" _hover={{ color: 'cyan.400' }}>
                    <DynamicIcon name="FaEnvelope" boxSize={3.5} />
                    <Text fontSize="xs" fontFamily="mono">email</Text>
                  </HStack>
                </Link>
                <Text color={textColor} opacity={0.2}>/</Text>
                <Link href={siteOwner.social.linkedin} isExternal _hover={{ textDecoration: 'none' }}>
                  <HStack spacing={1.5} color={textColor} transition="all 0.15s" _hover={{ color: 'cyan.400' }}>
                    <DynamicIcon name="FaLinkedin" boxSize={3.5} />
                    <Text fontSize="xs" fontFamily="mono">linkedin</Text>
                  </HStack>
                </Link>
              </HStack>
            </Flex>
          </VStack>
          <MotionBox
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <VStack spacing={[2, 3]}>
              <Image
                src={withBase(`images/${avatar}`)}
                alt={title}
                borderRadius="xl"
                boxSize={["150px", "180px", "220px"]}
                objectFit="cover"
              />
              {/* Social icons row below avatar */}
              <HStack spacing={[1, 1.5]} justify="center">
                {heroSocialIcons.map((item) => (
                  <Tooltip key={item.label} label={item.label} fontSize="xs" hasArrow placement="bottom" openDelay={200} fontFamily="mono">
                    <Link href={item.href} isExternal _hover={{ textDecoration: 'none' }}>
                      <Box
                        p={1.5}
                        cursor="pointer"
                        color={useColorModeValue('gray.400', 'gray.500')}
                        transition="all 0.2s"
                        _hover={{ color: item.color, transform: 'scale(1.2)' }}
                      >
                        <DynamicIcon name={item.icon} boxSize={[3, 3.5]} />
                      </Box>
                    </Link>
                  </Tooltip>
                ))}
              </HStack>
              {((siteConfig.pets ?? []) as { name: string; emoji: string; image: string }[]).length > 0 && (
                <HStack spacing={[4, 5]} justify="center">
                  {((siteConfig.pets ?? []) as { name: string; emoji: string; image: string }[]).map((pet) => (
                    <VStack key={pet.name} spacing={2}>
                      {pet.image && (
                        <Image
                          src={pet.image}
                          alt={pet.name}
                          borderRadius="full"
                          boxSize={["40px", "50px"]}
                          objectFit="cover"
                        />
                      )}
                      <Text fontSize="sm" fontWeight="medium">{pet.name} {pet.emoji}</Text>
                    </VStack>
                  ))}
                </HStack>
              )}
            </VStack>
          </MotionBox>
        </Stack>
      </Container>
    </Box>
  )
}

export default HeroSection
