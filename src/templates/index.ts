// SPDX-FileCopyrightText: 2026 Yaoyao(Freax) Qian <limyoonaxi@gmail.com>
// SPDX-License-Identifier: GPL-3.0-only

/**
 * Template registry — single entry point for all templates.
 *
 * To register a new template:
 * 1. Create `src/templates/<name>/index.ts` exporting a TemplateConfig
 * 2. Import it here and add to `templates`
 * 3. Users set `"template": "<name>"` in content/site.json
 *
 * To register a component variant:
 * 1. Create a component implementing the slot's props interface
 * 2. Add it to `variantRegistry` below
 * 3. Users set `"components": { "slotName": "variantId" }` in site.json
 */

import type { TemplateConfig } from './types'
import type { ComponentSlots } from './slots'
import { resolveSlots } from './context'
import terminalTemplate from './terminal'

/** All registered templates keyed by id */
const templates: Record<string, TemplateConfig> = {
  terminal: terminalTemplate,
}

/**
 * Variant registry — all known variants for each slot.
 *
 * Structure: { slotName: { variantId: Component } }
 *
 * Each template's default components are automatically registered
 * under the template id. Additional variants can be added here.
 *
 * @example
 * variantRegistry.hero.minimal = MinimalHero
 * // then in site.json: { "components": { "hero": "minimal" } }
 */
export const variantRegistry: Record<string, Record<string, React.ComponentType<any>>> = Object.fromEntries(
  Object.entries(terminalTemplate.slots).map(([slotName, component]) => [
    slotName,
    { terminal: component },
  ])
)


/** Default template id when none is specified in site.json */
const DEFAULT_TEMPLATE = 'terminal'

/**
 * Resolve a template by id.
 * Falls back to the default template if the id is unknown.
 */
export function getTemplate(id?: string): TemplateConfig {
  if (id && templates[id]) {
    return templates[id]
  }
  return templates[DEFAULT_TEMPLATE]
}

/**
 * Resolve final slot map: template defaults merged with user overrides.
 */
export function getResolvedSlots(
  template: TemplateConfig,
  userOverrides?: Record<string, string>,
): ComponentSlots {
  return resolveSlots(template.slots, variantRegistry, userOverrides)
}

/** List all available template ids */
export function getTemplateIds(): string[] {
  return Object.keys(templates)
}

/** List all available templates */
export function getTemplates(): TemplateConfig[] {
  return Object.values(templates)
}

/** List all variant ids available for a given slot */
export function getSlotVariants(slotName: string): string[] {
  return Object.keys(variantRegistry[slotName] ?? {})
}

export type { TemplateConfig, TemplatePages, LayoutProps } from './types'
export type { ComponentSlots, SlotName } from './slots'
export { DEFAULT_SECTIONS, SECTION_SLOTS } from './slots'
export { SlotProvider, useSlot } from './context'
export default templates
