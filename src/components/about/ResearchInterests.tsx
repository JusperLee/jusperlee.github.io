import React from 'react'
import { Box, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react'
import { motion } from 'framer-motion'

const MotionBox = motion(Box)

interface ResearchInterestsProps {
  interests: string[]
}

const ResearchInterests: React.FC<ResearchInterestsProps> = ({ interests }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const bg = useColorModeValue('white', 'gray.800')

  return (
    <SimpleGrid 
      columns={[2, 2, 3, 4]} 
      spacing={[2, 3]}
      w="full"
    >
      {interests.map((interest, index) => (
        <MotionBox
          key={index}
          whileHover={{ y: -2 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Box
            p={[2, 3]}
            bg={bg}
            borderRadius="md"
            shadow="sm"
            fontSize={["xs", "sm"]}
            textAlign="center"
          >
            <Text 
              color={textColor}
              fontWeight="medium"
            >
              {interest}
            </Text>
          </Box>
        </MotionBox>
      ))}
    </SimpleGrid>
  )
}

export default ResearchInterests 