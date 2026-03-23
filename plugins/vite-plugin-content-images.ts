/**
 * Vite plugin: serves images from content/images/ as if they were in public/
 *
 * In dev mode:  middleware rewrites /images/* → content/images/*
 * In build mode: copies content/images/ → dist/images/
 *
 * This lets users keep ALL their content (text + images) in one folder.
 *
 * Usage:
 *   content/images/avatar.jpg       → accessible at /images/avatar.jpg
 *   content/images/logos/mit.png     → accessible at /images/logos/mit.png
 *   content/images/projects/demo.png → accessible at /images/projects/demo.png
 */

import { resolve, relative, dirname } from 'path'
import { existsSync, readdirSync, statSync, copyFileSync, mkdirSync } from 'fs'
import type { Plugin } from 'vite'

const CONTENT_IMAGES = 'content/images'
const URL_PREFIX = '/images'

function copyDirRecursive(src: string, dest: string) {
  if (!existsSync(src)) return
  mkdirSync(dest, { recursive: true })
  for (const entry of readdirSync(src)) {
    const srcPath = resolve(src, entry)
    const destPath = resolve(dest, entry)
    if (statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      mkdirSync(dirname(destPath), { recursive: true })
      copyFileSync(srcPath, destPath)
    }
  }
}

export default function contentImagesPlugin(): Plugin {
  let root = ''

  return {
    name: 'vite-plugin-content-images',

    configResolved(config) {
      root = config.root
    },

    // Dev: serve content/images/* at /images/*
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url && req.url.startsWith(URL_PREFIX + '/')) {
          const filePath = resolve(root, CONTENT_IMAGES, req.url.slice(URL_PREFIX.length + 1))
          if (existsSync(filePath) && statSync(filePath).isFile()) {
            req.url = '/@fs/' + filePath
          }
        }
        next()
      })
    },

    // Build: copy content/images/ → dist/images/
    closeBundle() {
      const src = resolve(root, CONTENT_IMAGES)
      const dest = resolve(root, 'dist', 'images')
      copyDirRecursive(src, dest)
    },
  }
}
