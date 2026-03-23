import React from 'react'
import { Box, VStack, HStack, Text, Link, Button, useColorModeValue, Flex, Heading, Badge } from '@chakra-ui/react'
import DynamicIcon from '../DynamicIcon'
import { NewsItem } from '../../types'

interface NewsCardProps {
  news: NewsItem
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  // Get appropriate icon based on news type
  const getIconName = () => {
    switch (news.type) {
      case 'publication': return 'FaCode';
      case 'talk': return 'SiBilibili';
      case 'course': return 'FaYoutube';
      default: return news.icon || 'FaCode';
    }
  };
  
  return (
    <Box 
      p={0}
      bg={useColorModeValue('white', 'gray.800')} 
      borderRadius="lg" 
      shadow="sm"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', shadow: 'md' }}
      position="relative"
      overflow="hidden"
      role="article"
      aria-labelledby={`news-title-${news.title.replace(/\s+/g, '-').toLowerCase()}`}
      borderWidth="1px"
      borderColor={useColorModeValue('gray.100', 'gray.700')}
    >
      {/* Top color bar */}
      <Box 
        h="4px" 
        bg={news.iconColor} 
        w="full" 
      />
      
      {/* Date Badge - Top Right Absolute Position */}
      {news.date && (
        <Badge 
          position="absolute"
          top={2}
          right={2}
          colorScheme={news.iconColor.split('.')[0]}
          bg={useColorModeValue(`${news.iconColor.split('.')[0]}.500`, `${news.iconColor.split('.')[0]}.600`)}
          color={useColorModeValue('white', 'white')}
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          display="flex"
          alignItems="center"
          fontWeight="medium"
          boxShadow={useColorModeValue('0 2px 5px rgba(0,0,0,0.1)', '0 2px 5px rgba(0,0,0,0.3)')}
          zIndex={1}
        >
          <DynamicIcon name="FaClock" boxSize={3} mr={1} />
          {news.date}
        </Badge>
      )}
      
      {/* Content area */}
      <Box p={4}>
        {/* Title area and badges */}
        <Flex mb={3} align="flex-start">
          <Box
            mr={3}
            fontSize="xl"
            bg={useColorModeValue(`${news.iconColor.split('.')[0]}.50`, `${news.iconColor.split('.')[0]}.900`)}
            color={useColorModeValue(`${news.iconColor.split('.')[0]}.500`, `${news.iconColor.split('.')[0]}.200`)}
            p={2}
            borderRadius="md"
            lineHeight="1"
            aria-hidden="true"
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="32px"
            height="32px"
          >
            <DynamicIcon name={getIconName()} boxSize={4} />
          </Box>
          <VStack align="start" spacing={1} width="100%" pr={12}>
            <Heading 
              size="xs" 
              id={`news-title-${news.title.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {news.title}
            </Heading>
            
            {news.badge && (
              <Badge 
                colorScheme={news.iconColor.split('.')[0]} 
                fontSize="2xs"
                borderRadius="full"
                px={2}
                py={0.5}
              >
                {news.badge}
              </Badge>
            )}
          </VStack>
        </Flex>
        
        {/* Description text */}
        <Text 
          fontSize="sm" 
          color={useColorModeValue('gray.600', 'gray.400')}
          mb={3}
          lineHeight="taller"
        >
          {news.description}
        </Text>
        
        {/* Button link area */}
        <HStack spacing={2} flexWrap="wrap" gap={2} mt={2}>
          {news.links.map((link, index) => {
            const LinkIcon = link.icon ? <DynamicIcon name={link.icon} fontSize="xs" /> : undefined
            return (
              <Link 
                key={index} 
                href={link.url} 
                isExternal 
                aria-label={`${link.text} for ${news.title}`}
              >
                <Button 
                  size="xs" 
                  variant="outline"
                  colorScheme={news.iconColor.split('.')[0]}
                  leftIcon={LinkIcon && <Box aria-hidden="true">{LinkIcon}</Box>}
                >
                  {link.text}
                </Button>
              </Link>
            )
          })}
        </HStack>
      </Box>
    </Box>
  )
}

export default NewsCard 