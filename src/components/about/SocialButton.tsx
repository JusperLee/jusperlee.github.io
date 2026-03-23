import { IconButton, Link, Tooltip, useColorModeValue } from '@chakra-ui/react'
import DynamicIcon from '../DynamicIcon'
import React from 'react'

interface SocialButtonProps {
  icon?: string
  label: string
  href: string
  colorScheme?: string
  hoverBg?: string
  shadowColor?: string
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  href,
  hoverBg = 'gray.100',
  shadowColor = 'gray.500'
}) => {
  const borderColor = useColorModeValue('gray.300', 'gray.600')
  const hoverBorderColor = useColorModeValue('cyan.400', 'cyan.300')

  return (
    <Tooltip label={label} fontSize="xs" hasArrow placement="bottom" openDelay={200} fontFamily="mono">
      <Link href={href} isExternal _hover={{ textDecoration: 'none' }}>
        <IconButton
          aria-label={label}
          icon={<DynamicIcon name={icon} boxSize={[3, 3.5]} />}
          size={["xs", "sm"]}
          variant="ghost"
          borderRadius="sm"
          border="1px solid"
          borderColor={borderColor}
          fontFamily="mono"
          sx={{
            transition: 'all 0.2s ease',
            '&:hover': {
              bg: hoverBg,
              color: 'white',
              borderColor: hoverBorderColor,
              transform: 'translateY(-2px)',
              boxShadow: `0 2px 8px ${shadowColor}`,
            },
            '&:active': {
              transform: 'scale(0.95)',
              boxShadow: 'none',
            }
          }}
        />
      </Link>
    </Tooltip>
  )
}

export default SocialButton
