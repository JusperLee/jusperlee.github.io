// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Component slot context.
 *
 * Provides a React context so any component in the tree can
 * resolve the active variant for a given slot via `useSlot()`.
 *
 * Resolution order:
 * 1. User overrides from site.json `components` field
 * 2. Template default slots
 */

import { createContext, useContext } from 'react'
import type { ComponentSlots, SlotName } from './slots'

const SlotContext = createContext<ComponentSlots | null>(null)

interface SlotProviderProps {
  /** Resolved slot map (template defaults merged with user overrides) */
  slots: ComponentSlots
  children: React.ReactNode
}

export const SlotProvider: React.FC<SlotProviderProps> = ({ slots, children }) => {
  return <SlotContext.Provider value={slots}>{children}</SlotContext.Provider>
}

/**
 * Get the active component for a slot.
 *
 * @example
 * const Hero = useSlot('hero')
 * return <Hero title="Hi" avatar="me.jpg" />
 */
export function useSlot<K extends SlotName>(name: K): ComponentSlots[K] {
  const slots = useContext(SlotContext)
  if (!slots) {
    throw new Error(`useSlot("${name}") must be used within a <SlotProvider>`)
  }
  return slots[name]
}

/**
 * Merge template default slots with user-selected variant overrides.
 *
 * @param templateSlots - Default slot implementations from the template
 * @param variantRegistry - All registered variants keyed by `slotName.variantId`
 * @param userOverrides - User selections from site.json `components` field
 */
export function resolveSlots(
  templateSlots: ComponentSlots,
  variantRegistry: Record<string, Record<string, React.ComponentType<any>>>,
  userOverrides?: Record<string, string>,
): ComponentSlots {
  if (!userOverrides) return templateSlots

  const resolved = { ...templateSlots }

  for (const [slotName, variantId] of Object.entries(userOverrides)) {
    if (slotName in resolved && variantRegistry[slotName]?.[variantId]) {
      ;(resolved as any)[slotName] = variantRegistry[slotName][variantId]
    }
  }

  return resolved
}
