import React from 'react'
import { Box, HStack, VStack, SimpleGrid, Heading, Text, Image, useColorModeValue } from '@chakra-ui/react'

interface Course {
  course: string
  institution: string
  year: string
}

interface EducationSectionProps {
  courses: Course[]
  logos?: Record<string, string>
}

const EducationSection: React.FC<EducationSectionProps> = ({ courses, logos = {} }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bg = useColorModeValue('white', 'gray.800')
  const accentBg = useColorModeValue('blue.50', 'blue.900')

  return (
    <SimpleGrid columns={[1, 1, 2]} spacing={[3, 3, 4]} w="full">
      {courses.map((course, index) => {
        const logo = logos[course.institution]
        return (
          <Box
            key={index}
            p={[3, 4]}
            bg={bg}
            borderRadius="lg"
            shadow="sm"
            transition="all 0.2s"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
          >
            <HStack align="start" spacing={3}>
              {logo ? (
                <Image
                  src={logo}
                  alt={course.institution}
                  w={["36px", "44px"]}
                  h={["36px", "44px"]}
                  borderRadius="md"
                  objectFit="contain"
                  flexShrink={0}
                  mt={0.5}
                />
              ) : (
                <Box
                  w={["36px", "44px"]}
                  h={["36px", "44px"]}
                  borderRadius="md"
                  bg={accentBg}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                  mt={0.5}
                >
                  <Text fontSize={["md", "lg"]} fontWeight="bold" color="blue.500">
                    {course.institution.charAt(0)}
                  </Text>
                </Box>
              )}
              <VStack align="start" spacing={1} flex={1}>
                <Text
                  color="blue.500"
                  fontSize={["2xs", "xs", "sm"]}
                  fontWeight="medium"
                >
                  {course.year}
                </Text>
                <Heading size={["xs", "sm"]} lineHeight="short">
                  {course.course}
                </Heading>
                <Text
                  fontSize={["2xs", "xs", "sm"]}
                  color={textColor}
                >
                  {course.institution}
                </Text>
              </VStack>
            </HStack>
          </Box>
        )
      })}
    </SimpleGrid>
  )
}

export default EducationSection
