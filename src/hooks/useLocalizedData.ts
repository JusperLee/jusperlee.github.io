// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getLocalizedData } from '../data'
import { getLocalizedSiteConfig, getLocalizedSiteOwner } from '../site.config'

/**
 * Returns content data + site config for the current language.
 * Re-renders automatically when the user switches language.
 */
export function useLocalizedData() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  return useMemo(() => {
    const data = getLocalizedData(lang)
    const siteConfig = getLocalizedSiteConfig(lang)
    const siteOwner = getLocalizedSiteOwner(lang)
    return { ...data, siteConfig, siteOwner }
  }, [lang])
}
