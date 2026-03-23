import { Box, useColorMode } from '@chakra-ui/react'
import { useSlot } from '@/templates/context'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { colorMode } = useColorMode()
  const Navbar = useSlot('navbar')

  return (
    <Box minH="100vh" w="100vw" className={colorMode === 'dark' ? 'dark-theme' : ''}>
      <Navbar />
      <Box w="full" px={4}>
        {children}
      </Box>
    </Box>
  )
}

export default Layout
