/// <reference types="vite/client" />

declare module '*.md' {
  const content: Record<string, unknown> & { body: string }
  export default content
}
