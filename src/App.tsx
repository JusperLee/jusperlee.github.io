import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { siteConfig } from './site.config'
import { getTemplate, getResolvedSlots, SlotProvider } from './templates'
import './styles/globals.css'
import './i18n'

function App() {
  const features = siteConfig.features as Record<string, boolean>
  const cfg = siteConfig as Record<string, unknown>
  const template = getTemplate(cfg.template as string | undefined)
  const slots = getResolvedSlots(template, cfg.components as Record<string, string> | undefined)

  const { layout: TemplateLayout, pages, theme } = template

  return (
    <ChakraProvider theme={theme}>
      <SlotProvider slots={slots}>
        <Router basename={import.meta.env.BASE_URL}>
          <TemplateLayout>
            <Routes>
              <Route path="/" element={<pages.home />} />
              {features.publications && pages.publications && (
                <Route path="/publications" element={<pages.publications />} />
              )}
              {features.projects && pages.projects && (
                <Route path="/projects" element={<pages.projects />} />
              )}
              {features.articles && pages.articles && (
                <Route path="/articles" element={<pages.articles />} />
              )}
              {features.experience && pages.experience && (
                <Route path="/experience" element={<pages.experience />} />
              )}
              {features.guide !== false && pages.guide && (
                <Route path="/guide" element={<pages.guide />} />
              )}
              {features.guide !== false && pages.guideDocs && (
                <Route path="/docs" element={<pages.guideDocs />} />
              )}
            </Routes>
          </TemplateLayout>
        </Router>
      </SlotProvider>
    </ChakraProvider>
  )
}

export default App
